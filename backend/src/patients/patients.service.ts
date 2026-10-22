import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { HospitalContextService } from '../common/hospital-context.service';
import { HOSPITAL } from '../config/hospital.config';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

export interface PatientRow {
  id: string;
  regNo: string;
  name: string;
  phone: string;
  age: number | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  idNumber: string | null;
  scheme: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Actor {
  id?: string;
  name?: string;
  role?: string;
}

const clean = (v: unknown, max: number): string | null => {
  if (typeof v !== 'string') return null;
  const t = v.trim().replace(/\s+/g, ' ').slice(0, max);
  return t || null;
};

/** Age in whole years on `today` for a YYYY-MM-DD birth date */
export const ageFromDob = (dob: string, today = new Date()): number => {
  const [y, m, d] = dob.split('-').map(Number);
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age -= 1;
  return Math.max(0, age);
};

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);
  // Only used while the database is unreachable (local development)
  private memory: PatientRow[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly ctx: HospitalContextService,
    private readonly audit: AuditService,
  ) {}

  private toRow(r: any): PatientRow {
    return {
      id: r.id,
      regNo: r.regNo,
      name: r.name,
      phone: r.phone,
      age: r.age ?? null,
      dateOfBirth: r.dateOfBirth ?? null,
      gender: r.gender ?? null,
      address: r.address ?? null,
      idNumber: r.idNumber ?? null,
      scheme: r.scheme ?? null,
      emergencyContactName: r.emergencyContactName ?? null,
      emergencyContactPhone: r.emergencyContactPhone ?? null,
      notes: r.notes ?? null,
      createdBy: r.createdBy ?? null,
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    };
  }

  private async nextRegNo(): Promise<string> {
    const n = await this.ctx.nextNumber('patient');
    return `${HOSPITAL.codePrefix}-P-${String(n).padStart(6, '0')}`;
  }

  async search(q?: string, limit = 50): Promise<PatientRow[]> {
    const term = (q || '').trim();
    const take = Math.min(Math.max(limit, 1), 200);
    const hid = await this.ctx.hospitalId();
    if (hid) {
      const rows = await this.prisma.patient.findMany({
        where: {
          hospitalId: hid,
          ...(term
            ? {
                OR: [
                  { name: { contains: term, mode: 'insensitive' as const } },
                  { phone: { contains: term.replace(/\D/g, '') || '__none__' } },
                  { regNo: { contains: term, mode: 'insensitive' as const } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: 'desc' },
        take,
      });
      return rows.map((r) => this.toRow(r));
    }
    const t = term.toLowerCase();
    return this.memory
      .filter(
        (p) =>
          !t ||
          p.name.toLowerCase().includes(t) ||
          p.phone.includes(t.replace(/\D/g, '') || '__none__') ||
          p.regNo.toLowerCase().includes(t),
      )
      .slice(0, take);
  }

  async byPhone(phone: string): Promise<PatientRow[]> {
    const ten = phone.replace(/\D/g, '').slice(-10);
    const hid = await this.ctx.hospitalId();
    if (hid) {
      const rows = await this.prisma.patient.findMany({
        where: { hospitalId: hid, phone: ten },
        orderBy: { createdAt: 'asc' },
      });
      return rows.map((r) => this.toRow(r));
    }
    return this.memory.filter((p) => p.phone === ten);
  }

  async get(id: string): Promise<PatientRow> {
    const hid = await this.ctx.hospitalId();
    const found = hid
      ? await this.prisma.patient.findFirst({ where: { id, hospitalId: hid } }).then((r) => (r ? this.toRow(r) : null))
      : this.memory.find((p) => p.id === id) || null;
    if (!found) throw new NotFoundException('Patient not found.');
    return found;
  }

  async create(dto: CreatePatientDto, actor: Actor): Promise<PatientRow> {
    const name = clean(dto.name, 120)!;
    // The same person is not registered twice; family members with other names can share a mobile number
    const family = await this.byPhone(dto.phone);
    const twin = family.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (twin) {
      throw new ConflictException(`${twin.name} is already registered with this mobile number (${twin.regNo}).`);
    }

    const age = dto.dateOfBirth ? ageFromDob(dto.dateOfBirth) : dto.age ?? null;
    const regNo = await this.nextRegNo();
    const data = {
      regNo,
      name,
      phone: dto.phone,
      age,
      dateOfBirth: dto.dateOfBirth || null,
      gender: dto.gender || null,
      address: clean(dto.address, 300),
      idNumber: clean(dto.idNumber, 40),
      scheme: clean(dto.scheme, 80),
      emergencyContactName: clean(dto.emergencyContactName, 120),
      emergencyContactPhone: dto.emergencyContactPhone || null,
      notes: clean(dto.notes, 500),
      createdBy: actor.name || actor.id || null,
    };

    const hid = await this.ctx.hospitalId();
    let row: PatientRow;
    if (hid) {
      row = this.toRow(await this.prisma.patient.create({ data: { hospitalId: hid, ...data } }));
    } else {
      const now = new Date().toISOString();
      row = { id: uuidv4(), ...data, createdAt: now, updatedAt: now };
      this.memory.unshift(row);
    }
    await this.audit.logAction({
      hospitalId: HOSPITAL.id,
      userId: actor.id,
      action: 'PATIENT_REGISTERED',
      entity: 'PATIENT',
      entityId: row.id,
      metadata: { regNo: row.regNo, name: row.name, by: actor.name },
    });
    return row;
  }

  async update(id: string, dto: UpdatePatientDto, actor: Actor): Promise<PatientRow> {
    const current = await this.get(id);
    const name = dto.name !== undefined ? clean(dto.name, 120)! : current.name;
    const phone = dto.phone ?? current.phone;
    if (name !== current.name || phone !== current.phone) {
      const twin = (await this.byPhone(phone)).find((p) => p.id !== id && p.name.toLowerCase() === name.toLowerCase());
      if (twin) throw new ConflictException(`${twin.name} is already registered with this mobile number (${twin.regNo}).`);
    }
    const data: Record<string, unknown> = { name, phone };
    if (dto.dateOfBirth !== undefined) {
      data.dateOfBirth = dto.dateOfBirth || null;
      if (dto.dateOfBirth) data.age = ageFromDob(dto.dateOfBirth);
    }
    if (dto.age !== undefined && !dto.dateOfBirth) data.age = dto.age;
    if (dto.gender !== undefined) data.gender = dto.gender || null;
    if (dto.address !== undefined) data.address = clean(dto.address, 300);
    if (dto.idNumber !== undefined) data.idNumber = clean(dto.idNumber, 40);
    if (dto.scheme !== undefined) data.scheme = clean(dto.scheme, 80);
    if (dto.emergencyContactName !== undefined) data.emergencyContactName = clean(dto.emergencyContactName, 120);
    if (dto.emergencyContactPhone !== undefined) data.emergencyContactPhone = dto.emergencyContactPhone || null;
    if (dto.notes !== undefined) data.notes = clean(dto.notes, 500);

    let row: PatientRow;
    const hid = await this.ctx.hospitalId();
    if (hid) {
      row = this.toRow(await this.prisma.patient.update({ where: { id }, data }));
    } else {
      const m = this.memory.find((p) => p.id === id)!;
      Object.assign(m, data, { updatedAt: new Date().toISOString() });
      row = m;
    }
    await this.audit.logAction({
      hospitalId: HOSPITAL.id,
      userId: actor.id,
      action: 'PATIENT_UPDATED',
      entity: 'PATIENT',
      entityId: id,
      metadata: { regNo: row.regNo, fields: Object.keys(data), by: actor.name },
    });
    return row;
  }
}
