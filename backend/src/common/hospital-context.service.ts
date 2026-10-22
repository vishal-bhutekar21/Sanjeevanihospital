import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HOSPITAL } from '../config/hospital.config';

/**
 * Shared helpers for services that store their own tables:
 * the hospital row id, and running numbers (registration / receipt numbers).
 *
 * The database may be unreachable in development ("sandbox mode"), so every
 * helper falls back to memory instead of throwing. Numbers from the fallback
 * only live until the server restarts.
 */
@Injectable()
export class HospitalContextService {
  private readonly logger = new Logger(HospitalContextService.name);
  private hospitalRowId: string | null = null;
  private memoryCounters = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {}

  /** The hospitals row for this server, or null when the database is not available. */
  async hospitalId(): Promise<string | null> {
    if (this.hospitalRowId) return this.hospitalRowId;
    try {
      const row =
        (await this.prisma.hospital.findFirst({ where: { OR: [{ id: HOSPITAL.id }, { slug: HOSPITAL.slug }] } })) ||
        (await this.prisma.hospital.findFirst());
      this.hospitalRowId = row?.id ?? null;
    } catch (err) {
      this.logger.warn(`Hospital lookup failed: ${(err as Error).message}`);
    }
    return this.hospitalRowId;
  }

  /**
   * Next number for a counter key. The upsert + increment is a single atomic
   * statement in PostgreSQL, so two receptionists never get the same number.
   */
  async nextNumber(key: string): Promise<number> {
    const hid = await this.hospitalId();
    if (hid) {
      try {
        const row = await this.prisma.docCounter.upsert({
          where: { hospitalId_key: { hospitalId: hid, key } },
          create: { hospitalId: hid, key, value: 1 },
          update: { value: { increment: 1 } },
        });
        return row.value;
      } catch (err) {
        this.logger.warn(`Counter ${key} fell back to memory: ${(err as Error).message}`);
      }
    }
    const next = (this.memoryCounters.get(key) ?? 0) + 1;
    this.memoryCounters.set(key, next);
    return next;
  }
}

/** Indian financial year label for a date, e.g. 2026-10-22 -> "2627" (April to March). */
export const financialYear = (d = new Date()): string => {
  const ist = new Date(d.getTime() + 330 * 60 * 1000);
  const y = ist.getUTCFullYear();
  const start = ist.getUTCMonth() >= 3 ? y : y - 1;
  return `${String(start).slice(-2)}${String(start + 1).slice(-2)}`;
};
