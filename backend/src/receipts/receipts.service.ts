import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Prisma, ReceiptStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { HospitalContextService, financialYear } from '../common/hospital-context.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { PatientsService } from '../patients/patients.service';
import { HOSPITAL } from '../config/hospital.config';
import { CollectPaymentDto, CreateReceiptDto } from './dto/receipt.dto';
import { calculateReceipt, toPaise, toRupees, MathItemOut } from './receipt-math';

export interface Actor {
  id?: string;
  name?: string;
  role?: string;
}

interface PaymentEntry {
  amountPaise: number;
  mode: string;
  ref: string | null;
  at: string;
  by: string | null;
}

interface ReceiptRow {
  id: string;
  receiptNo: string;
  status: ReceiptStatus;
  kind: string;
  patientId: string | null;
  patientRegNo: string | null;
  patientName: string;
  patientPhone: string;
  patientAddress: string | null;
  appointmentCode: string | null;
  doctorName: string | null;
  items: MathItemOut[];
  subtotalPaise: number;
  discountPaise: number;
  taxPaise: number;
  totalPaise: number;
  paidPaise: number;
  paymentMode: string;
  paymentRef: string | null;
  payments: PaymentEntry[];
  note: string | null;
  issuedBy: string | null;
  issuedByName: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  cancelledBy: string | null;
  createdAt: string;
}

export interface ListFilter {
  from?: string; // YYYY-MM-DD (hospital time)
  to?: string;
  q?: string;
  status?: string;
  mode?: string;
  due?: boolean;
  limit?: number;
}

const IST_MS = 330 * 60 * 1000;
/** Start of a hospital-time (IST) day as a UTC Date */
const istDayStart = (key: string) => new Date(new Date(`${key}T00:00:00Z`).getTime() - IST_MS);
const istDayKey = (d: Date) => new Date(d.getTime() + IST_MS).toISOString().slice(0, 10);

@Injectable()
export class ReceiptsService {
  private readonly logger = new Logger(ReceiptsService.name);
  // Only used while the database is unreachable (local development)
  private memory: ReceiptRow[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly ctx: HospitalContextService,
    private readonly audit: AuditService,
    private readonly appointments: AppointmentsService,
    private readonly patients: PatientsService,
  ) {}

  // ─── mapping ─────────────────────────────────────────────────────────────

  private toRow(r: any): ReceiptRow {
    return {
      id: r.id,
      receiptNo: r.receiptNo,
      status: r.status,
      kind: r.kind,
      patientId: r.patientId ?? null,
      patientRegNo: r.patientRegNo ?? null,
      patientName: r.patientName,
      patientPhone: r.patientPhone,
      patientAddress: r.patientAddress ?? null,
      appointmentCode: r.appointmentCode ?? null,
      doctorName: r.doctorName ?? null,
      items: (r.items as MathItemOut[]) || [],
      subtotalPaise: r.subtotalPaise,
      discountPaise: r.discountPaise,
      taxPaise: r.taxPaise,
      totalPaise: r.totalPaise,
      paidPaise: r.paidPaise,
      paymentMode: r.paymentMode,
      paymentRef: r.paymentRef ?? null,
      payments: (r.payments as PaymentEntry[]) || [],
      note: r.note ?? null,
      issuedBy: r.issuedBy ?? null,
      issuedByName: r.issuedByName ?? null,
      cancelledAt: r.cancelledAt ? new Date(r.cancelledAt).toISOString() : null,
      cancelReason: r.cancelReason ?? null,
      cancelledBy: r.cancelledBy ?? null,
      createdAt: new Date(r.createdAt).toISOString(),
    };
  }

  /** What the screens and PDF use: rupees, plus the balance still to collect */
  private toApi(r: ReceiptRow) {
    const balance = r.status === 'CANCELLED' ? 0 : Math.max(0, r.totalPaise - r.paidPaise);
    return {
      id: r.id,
      receiptNo: r.receiptNo,
      status: r.status,
      kind: r.kind,
      patientId: r.patientId,
      patientRegNo: r.patientRegNo,
      patientName: r.patientName,
      patientPhone: r.patientPhone,
      patientAddress: r.patientAddress,
      appointmentCode: r.appointmentCode,
      doctorName: r.doctorName,
      items: r.items.map((i) => ({
        name: i.name,
        qty: i.qty,
        rate: toRupees(i.ratePaise),
        gstPercent: i.gstPercent,
        amount: toRupees(i.amountPaise),
        discount: toRupees(i.discountPaise),
        tax: toRupees(i.taxPaise),
      })),
      subtotal: toRupees(r.subtotalPaise),
      discount: toRupees(r.discountPaise),
      tax: toRupees(r.taxPaise),
      total: toRupees(r.totalPaise),
      paid: toRupees(r.paidPaise),
      balance: toRupees(balance),
      paymentMode: r.paymentMode,
      paymentRef: r.paymentRef,
      payments: r.payments.map((p) => ({ amount: toRupees(p.amountPaise), mode: p.mode, ref: p.ref, at: p.at, by: p.by })),
      note: r.note,
      issuedByName: r.issuedByName,
      cancelledAt: r.cancelledAt,
      cancelReason: r.cancelReason,
      createdAt: r.createdAt,
      hospital: { gstin: HOSPITAL.gstin || null },
    };
  }

  // ─── create ──────────────────────────────────────────────────────────────

  async create(dto: CreateReceiptDto, actor: Actor) {
    let patientName = (dto.patientName || '').trim();
    let patientPhone = dto.patientPhone || '';
    let patientAddress = dto.patientAddress?.trim() || null;
    let patientRegNo: string | null = null;
    let patientId: string | null = null;
    if (dto.patientId) {
      const p = await this.patients.get(dto.patientId);
      patientId = p.id;
      patientRegNo = p.regNo;
      patientName = p.name;
      patientPhone = p.phone;
      patientAddress = p.address;
    }
    if (patientName.length < 2 || !/^\d{10}$/.test(patientPhone)) {
      throw new BadRequestException('Choose a registered patient, or enter the patient name and 10-digit mobile number.');
    }

    const calc = calculateReceipt(dto.items, dto.discount ?? 0);
    if (toPaise(dto.discount ?? 0) > calc.subtotalPaise) {
      throw new BadRequestException('The discount cannot be more than the bill amount.');
    }
    if (calc.totalPaise <= 0 && dto.kind !== 'OTHER') {
      throw new BadRequestException('The receipt total must be more than zero.');
    }
    const paidPaise = toPaise(dto.paid);
    if (paidPaise > calc.totalPaise) {
      throw new BadRequestException('The amount received cannot be more than the receipt total.');
    }

    const fy = financialYear();
    const seq = await this.ctx.nextNumber(`receipt:${fy}`);
    const receiptNo = `${HOSPITAL.codePrefix}-R-${fy}-${String(seq).padStart(6, '0')}`;
    const at = new Date().toISOString();
    const payments: PaymentEntry[] =
      paidPaise > 0
        ? [{ amountPaise: paidPaise, mode: dto.paymentMode, ref: dto.paymentRef?.trim() || null, at, by: actor.name || null }]
        : [];

    const data = {
      receiptNo,
      status: 'ISSUED' as ReceiptStatus,
      kind: dto.kind,
      patientId,
      patientRegNo,
      patientName,
      patientPhone,
      patientAddress,
      appointmentCode: dto.appointmentCode?.trim() || null,
      doctorName: dto.doctorName?.trim() || null,
      items: calc.items,
      subtotalPaise: calc.subtotalPaise,
      discountPaise: calc.discountPaise,
      taxPaise: calc.taxPaise,
      totalPaise: calc.totalPaise,
      paidPaise,
      paymentMode: dto.paymentMode,
      paymentRef: dto.paymentRef?.trim() || null,
      payments,
      note: dto.note?.trim() || null,
      issuedBy: actor.id || null,
      issuedByName: actor.name || null,
    };

    const hid = await this.ctx.hospitalId();
    let row: ReceiptRow;
    if (hid) {
      row = this.toRow(
        await this.prisma.receipt.create({
          data: { hospitalId: hid, ...data, items: data.items as any, payments: data.payments as any },
        }),
      );
    } else {
      row = { id: uuidv4(), ...data, cancelledAt: null, cancelReason: null, cancelledBy: null, createdAt: at };
      this.memory.unshift(row);
    }

    if (row.appointmentCode && row.paidPaise >= row.totalPaise) {
      await this.appointments.markAppointmentPaid(row.appointmentCode).catch(() => undefined);
    }
    await this.audit.logAction({
      hospitalId: HOSPITAL.id,
      userId: actor.id,
      action: 'RECEIPT_ISSUED',
      entity: 'RECEIPT',
      entityId: row.id,
      metadata: { receiptNo, total: toRupees(row.totalPaise), paid: toRupees(row.paidPaise), by: actor.name },
    });
    return this.toApi(row);
  }

  // ─── read ────────────────────────────────────────────────────────────────

  private whereFor(hid: string, f: ListFilter): Prisma.ReceiptWhereInput {
    const where: Prisma.ReceiptWhereInput = { hospitalId: hid };
    const range: { gte?: Date; lt?: Date } = {};
    if (f.from) range.gte = istDayStart(f.from);
    if (f.to) range.lt = new Date(istDayStart(f.to).getTime() + 24 * 3600 * 1000);
    if (range.gte || range.lt) where.createdAt = range;
    if (f.status === 'ISSUED' || f.status === 'CANCELLED') where.status = f.status;
    if (f.mode) where.paymentMode = f.mode;
    if (f.q?.trim()) {
      const t = f.q.trim();
      where.OR = [
        { receiptNo: { contains: t, mode: 'insensitive' } },
        { patientName: { contains: t, mode: 'insensitive' } },
        { patientPhone: { contains: t.replace(/\D/g, '') || '__none__' } },
        { patientRegNo: { contains: t, mode: 'insensitive' } },
        { appointmentCode: { contains: t, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private async rows(f: ListFilter, take?: number): Promise<ReceiptRow[]> {
    const hid = await this.ctx.hospitalId();
    let list: ReceiptRow[];
    if (hid) {
      const found = await this.prisma.receipt.findMany({
        where: this.whereFor(hid, f),
        orderBy: { createdAt: 'desc' },
        take: take ?? 5000,
      });
      list = found.map((r) => this.toRow(r));
    } else {
      const from = f.from ? istDayStart(f.from).getTime() : -Infinity;
      const to = f.to ? istDayStart(f.to).getTime() + 24 * 3600 * 1000 : Infinity;
      const t = (f.q || '').trim().toLowerCase();
      list = this.memory.filter((r) => {
        const ts = new Date(r.createdAt).getTime();
        return (
          ts >= from &&
          ts < to &&
          (!f.status || r.status === f.status) &&
          (!f.mode || r.paymentMode === f.mode) &&
          (!t ||
            r.receiptNo.toLowerCase().includes(t) ||
            r.patientName.toLowerCase().includes(t) ||
            r.patientPhone.includes(t.replace(/\D/g, '') || '__none__') ||
            (r.patientRegNo || '').toLowerCase().includes(t) ||
            (r.appointmentCode || '').toLowerCase().includes(t))
        );
      });
    }
    if (f.due) list = list.filter((r) => r.status === 'ISSUED' && r.totalPaise > r.paidPaise);
    return list;
  }

  async list(f: ListFilter) {
    const limit = Math.min(Math.max(f.limit || 100, 1), 1000);
    const list = await this.rows(f);
    return list.slice(0, limit).map((r) => this.toApi(r));
  }

  async get(id: string) {
    const hid = await this.ctx.hospitalId();
    const row = hid
      ? await this.prisma.receipt.findFirst({ where: { id, hospitalId: hid } }).then((r) => (r ? this.toRow(r) : null))
      : this.memory.find((r) => r.id === id) || null;
    if (!row) throw new NotFoundException('Receipt not found.');
    return this.toApi(row);
  }

  // ─── change ──────────────────────────────────────────────────────────────

  /** Receipts are never edited or deleted; a mistake is cancelled with a reason and re-issued. */
  async cancel(id: string, reason: string, actor: Actor) {
    const text = (reason || '').trim();
    if (text.length < 3) throw new BadRequestException('Please give a reason for cancelling.');
    const current = await this.get(id);
    if (current.status === 'CANCELLED') return current;
    // Reception can undo a mistake from today; older receipts need an administrator
    const isAdmin = actor.role === 'SUPER_ADMIN' || actor.role === 'HOSPITAL_ADMIN';
    if (!isAdmin && istDayKey(new Date(current.createdAt)) !== istDayKey(new Date())) {
      throw new ForbiddenException('Only an administrator can cancel a receipt from an earlier day.');
    }
    const cancelledAt = new Date();
    const hid = await this.ctx.hospitalId();
    let row: ReceiptRow;
    if (hid) {
      row = this.toRow(
        await this.prisma.receipt.update({
          where: { id },
          data: { status: 'CANCELLED', cancelledAt, cancelReason: text.slice(0, 300), cancelledBy: actor.name || actor.id || null },
        }),
      );
    } else {
      row = this.memory.find((r) => r.id === id)!;
      row.status = 'CANCELLED';
      row.cancelledAt = cancelledAt.toISOString();
      row.cancelReason = text.slice(0, 300);
      row.cancelledBy = actor.name || actor.id || null;
    }
    await this.audit.logAction({
      hospitalId: HOSPITAL.id,
      userId: actor.id,
      action: 'RECEIPT_CANCELLED',
      entity: 'RECEIPT',
      entityId: id,
      metadata: { receiptNo: row.receiptNo, reason: row.cancelReason, by: actor.name },
    });
    return this.toApi(row);
  }

  /** Take a later payment against the balance of a receipt */
  async collect(id: string, dto: CollectPaymentDto, actor: Actor) {
    const hid = await this.ctx.hospitalId();
    const amountPaise = toPaise(dto.amount);
    const entry: PaymentEntry = {
      amountPaise,
      mode: dto.mode,
      ref: dto.ref?.trim() || null,
      at: new Date().toISOString(),
      by: actor.name || null,
    };

    let row: ReceiptRow;
    if (hid) {
      // The balance check and the update run in one transaction on the locked row,
      // so two simultaneous payments can't together overpay the receipt.
      row = await this.prisma.$transaction(async (tx) => {
        const locked = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM receipts WHERE id = ${id} AND hospital_id = ${hid} FOR UPDATE`;
        if (!locked.length) throw new NotFoundException('Receipt not found.');
        const cur = this.toRow(await tx.receipt.findUniqueOrThrow({ where: { id } }));
        this.assertCollectable(cur, amountPaise);
        return this.toRow(
          await tx.receipt.update({
            where: { id },
            data: { paidPaise: cur.paidPaise + amountPaise, payments: [...cur.payments, entry] as any },
          }),
        );
      });
    } else {
      row = this.memory.find((r) => r.id === id)!;
      if (!row) throw new NotFoundException('Receipt not found.');
      this.assertCollectable(row, amountPaise);
      row.paidPaise += amountPaise;
      row.payments.push(entry);
    }

    if (row.appointmentCode && row.paidPaise >= row.totalPaise) {
      await this.appointments.markAppointmentPaid(row.appointmentCode).catch(() => undefined);
    }
    await this.audit.logAction({
      hospitalId: HOSPITAL.id,
      userId: actor.id,
      action: 'RECEIPT_PAYMENT_COLLECTED',
      entity: 'RECEIPT',
      entityId: id,
      metadata: { receiptNo: row.receiptNo, amount: dto.amount, mode: dto.mode, by: actor.name },
    });
    return this.toApi(row);
  }

  private assertCollectable(r: ReceiptRow, amountPaise: number) {
    if (r.status === 'CANCELLED') throw new BadRequestException('This receipt is cancelled.');
    if (amountPaise > r.totalPaise - r.paidPaise) {
      throw new BadRequestException(`Only Rs. ${toRupees(r.totalPaise - r.paidPaise)} is still due on this receipt.`);
    }
  }

  // ─── reports ─────────────────────────────────────────────────────────────

  /** Totals for a date range (hospital time). Cancelled receipts are counted separately and never in the money. */
  async summary(from: string, to: string) {
    const list = await this.rows({ from, to });
    const issued = list.filter((r) => r.status === 'ISSUED');
    const cancelled = list.filter((r) => r.status === 'CANCELLED');
    const byMode: Record<string, number> = {};
    // Collections are counted on the day the money came in, so a later payment shows on its own day
    const fromMs = istDayStart(from).getTime();
    const toMs = istDayStart(to).getTime() + 24 * 3600 * 1000;
    let collected = 0;
    const hid = await this.ctx.hospitalId();
    const source = hid
      ? (await this.prisma.receipt.findMany({ where: { hospitalId: hid, status: 'ISSUED' } })).map((r) => this.toRow(r))
      : this.memory.filter((r) => r.status === 'ISSUED');
    source.forEach((r) =>
      r.payments.forEach((p) => {
        const ts = new Date(p.at).getTime();
        if (ts >= fromMs && ts < toMs) {
          byMode[p.mode] = (byMode[p.mode] || 0) + p.amountPaise;
          collected += p.amountPaise;
        }
      }),
    );
    const billed = issued.reduce((a, r) => a + r.totalPaise, 0);
    const outstanding = source.reduce((a, r) => a + Math.max(0, r.totalPaise - r.paidPaise), 0);
    return {
      from,
      to,
      receiptsIssued: issued.length,
      receiptsCancelled: cancelled.length,
      billed: toRupees(billed),
      tax: toRupees(issued.reduce((a, r) => a + r.taxPaise, 0)),
      discount: toRupees(issued.reduce((a, r) => a + r.discountPaise, 0)),
      collected: toRupees(collected),
      byMode: Object.fromEntries(Object.entries(byMode).map(([k, v]) => [k, toRupees(v)])),
      // Balance still to collect across all issued receipts, not only those in range
      outstanding: toRupees(outstanding),
    };
  }
}
