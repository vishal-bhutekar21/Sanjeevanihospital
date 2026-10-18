import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { HOSPITAL } from '../config/hospital.config';

export interface BillItem {
  name: string;
  qty: number;
  amount: number; // line total, rupees
}

export interface PatientBill {
  id: string;
  billNo: string;
  date: string; // YYYY-MM-DD
  title: string; // e.g. "OPD consultation", "Pharmacy"
  items: BillItem[];
  total: number;
  paid: number;
  note: string;
  createdAt: string;
}

export interface PatientMedicine {
  id: string;
  name: string; // "Paracetamol"
  strength: string; // "500 mg"
  dosage: string; // "1-0-1"
  instructions: string; // "After food"
  startDate: string; // YYYY-MM-DD
  endDate: string; // last day of the course, '' = ongoing
  expiryDate: string; // pack expiry, '' = not recorded
  quantity: number;
  doctorName: string;
  note: string;
  createdAt: string;
}

export interface PatientRecord {
  phone: string; // 10 digits
  name: string;
  bills: PatientBill[];
  medicines: PatientMedicine[];
  updatedAt: string;
}

const KEY_PREFIX = 'patient_record:';
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v: unknown) => (typeof v === 'number' ? v : Number(v));

/** Accepts "+91 98765 43210", "919876543210" or "9876543210"; returns 10 digits. */
export function normalisePhone(raw: string): string {
  const digits = String(raw || '').replace(/\D/g, '');
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  if (!/^[6-9]\d{9}$/.test(ten)) throw new BadRequestException('Enter a valid 10-digit mobile number.');
  return ten;
}

/**
 * Bills and medicines the hospital shares with a patient, keyed by mobile number.
 *
 * Stored as one JSON row per patient in the existing hospital_settings table
 * (key "patient_record:<mobile>"), so no database change is needed. Proper
 * tables are planned; see documentation/08-notifications-and-staff-plan.md.
 * If the database can't be reached, records are kept in memory until restart
 * and the admin screen says so.
 */
@Injectable()
export class PatientRecordsService {
  private readonly logger = new Logger(PatientRecordsService.name);
  private records = new Map<string, PatientRecord>();
  private loaded = false;
  private hospitalRowId: string | null = null;

  constructor(private readonly prisma: PrismaService) {}

  private async hospitalId(): Promise<string | null> {
    if (this.hospitalRowId) return this.hospitalRowId;
    const row =
      (await this.prisma.hospital.findFirst({ where: { OR: [{ id: HOSPITAL.id }, { slug: HOSPITAL.slug }] } })) ||
      (await this.prisma.hospital.findFirst());
    this.hospitalRowId = row?.id ?? null;
    return this.hospitalRowId;
  }

  private async loadAll() {
    if (this.loaded) return;
    this.loaded = true;
    try {
      const hid = await this.hospitalId();
      if (!hid) return;
      const rows = await this.prisma.hospitalSetting.findMany({
        where: { hospitalId: hid, key: { startsWith: KEY_PREFIX } },
      });
      for (const r of rows) {
        try {
          const rec = JSON.parse(r.value) as PatientRecord;
          if (rec?.phone) this.records.set(rec.phone, rec);
        } catch {
          this.logger.warn(`Skipping unreadable patient record ${r.key}`);
        }
      }
      this.logger.log(`Loaded ${this.records.size} patient record(s) from the database`);
    } catch (err) {
      this.logger.warn(`Patient records kept in memory (database not reachable): ${(err as Error).message}`);
    }
  }

  /** Returns true when the record was written to the database. */
  private async persist(rec: PatientRecord): Promise<boolean> {
    rec.updatedAt = new Date().toISOString();
    this.records.set(rec.phone, rec);
    try {
      const hid = await this.hospitalId();
      if (!hid) return false;
      const key = KEY_PREFIX + rec.phone;
      await this.prisma.hospitalSetting.upsert({
        where: { hospitalId_key: { hospitalId: hid, key } },
        create: { hospitalId: hid, key, value: JSON.stringify(rec) },
        update: { value: JSON.stringify(rec) },
      });
      return true;
    } catch (err) {
      this.logger.error(`Could not save patient record ${rec.phone}: ${(err as Error).message}`);
      return false;
    }
  }

  private async getOrCreate(phone: string, name?: string): Promise<PatientRecord> {
    await this.loadAll();
    let rec = this.records.get(phone);
    if (!rec) {
      rec = { phone, name: '', bills: [], medicines: [], updatedAt: new Date().toISOString() };
    }
    if (name && name.trim()) rec.name = str(name, 100);
    return rec;
  }

  async list() {
    await this.loadAll();
    return [...this.records.values()]
      .map((r) => ({
        phone: r.phone,
        name: r.name,
        bills: r.bills.length,
        amountDue: r.bills.reduce((s, b) => s + Math.max(0, b.total - b.paid), 0),
        medicines: r.medicines.length,
        updatedAt: r.updatedAt,
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(phoneRaw: string): Promise<PatientRecord> {
    const phone = normalisePhone(phoneRaw);
    await this.loadAll();
    return this.records.get(phone) || { phone, name: '', bills: [], medicines: [], updatedAt: '' };
  }

  async addBill(phoneRaw: string, body: any) {
    const phone = normalisePhone(phoneRaw);
    const items: BillItem[] = (Array.isArray(body?.items) ? body.items : [])
      .map((i: any) => ({ name: str(i?.name, 120), qty: Math.max(1, Math.round(num(i?.qty) || 1)), amount: num(i?.amount) }))
      .filter((i: BillItem) => i.name);
    if (items.length === 0) throw new BadRequestException('Add at least one line to the bill.');
    if (items.length > 50) throw new BadRequestException('A bill can have up to 50 lines.');
    if (items.some((i) => !Number.isFinite(i.amount) || i.amount < 0 || i.amount > 10_000_000)) {
      throw new BadRequestException('Each line needs an amount in rupees.');
    }
    const date = str(body?.date, 10);
    if (!ISO.test(date)) throw new BadRequestException('Bill date is missing.');
    const total = Math.round(items.reduce((s, i) => s + i.amount, 0) * 100) / 100;
    const paid = Math.min(total, Math.max(0, num(body?.paid) || 0));

    const rec = await this.getOrCreate(phone, body?.patientName);
    const bill: PatientBill = {
      id: uuidv4(),
      billNo: `B-${date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      date,
      title: str(body?.title, 80) || 'Hospital bill',
      items,
      total,
      paid,
      note: str(body?.note, 500),
      createdAt: new Date().toISOString(),
    };
    rec.bills.unshift(bill);
    const savedInDatabase = await this.persist(rec);
    return { record: rec, savedInDatabase };
  }

  async updateBillPaid(phoneRaw: string, billId: string, paidRaw: unknown) {
    const rec = await this.get(phoneRaw);
    const bill = rec.bills.find((b) => b.id === billId);
    if (!bill) throw new NotFoundException('Bill not found.');
    const paid = num(paidRaw);
    if (!Number.isFinite(paid) || paid < 0) throw new BadRequestException('Enter the amount paid.');
    bill.paid = Math.min(bill.total, paid);
    return { record: rec, savedInDatabase: await this.persist(rec) };
  }

  async addMedicine(phoneRaw: string, body: any) {
    const phone = normalisePhone(phoneRaw);
    const name = str(body?.name, 120);
    if (!name) throw new BadRequestException('Medicine name is missing.');
    const startDate = str(body?.startDate, 10);
    const endDate = str(body?.endDate, 10);
    const expiryDate = str(body?.expiryDate, 10);
    if (!ISO.test(startDate)) throw new BadRequestException('Start date is missing.');
    if (endDate && (!ISO.test(endDate) || endDate < startDate)) throw new BadRequestException('Course end date must be after the start date.');
    if (expiryDate && !ISO.test(expiryDate)) throw new BadRequestException('Expiry date is not valid.');

    const rec = await this.getOrCreate(phone, body?.patientName);
    const med: PatientMedicine = {
      id: uuidv4(),
      name,
      strength: str(body?.strength, 40),
      dosage: str(body?.dosage, 40),
      instructions: str(body?.instructions, 120),
      startDate,
      endDate,
      expiryDate,
      quantity: Math.max(0, Math.round(num(body?.quantity) || 0)),
      doctorName: str(body?.doctorName, 100),
      note: str(body?.note, 500),
      createdAt: new Date().toISOString(),
    };
    rec.medicines.unshift(med);
    return { record: rec, savedInDatabase: await this.persist(rec) };
  }

  async remove(phoneRaw: string, kind: 'bills' | 'medicines', id: string) {
    const rec = await this.get(phoneRaw);
    const before = rec[kind].length;
    (rec as any)[kind] = (rec[kind] as { id: string }[]).filter((x) => x.id !== id);
    if (rec[kind].length === before) throw new NotFoundException('Not found.');
    return { record: rec, savedInDatabase: await this.persist(rec) };
  }
}
