import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export interface AuditLogEntry {
  id?: string;
  hospitalId: string;
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: any;
  createdAt?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  private inMemoryLogs: AuditLogEntry[] = [
    {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      userId: 'admin-sanjeevani-01',
      action: 'SYSTEM_BOOTSTRAP',
      entity: 'HOSPITAL',
      entityId: 'hosp-sanjeevani-jalna',
      metadata: { note: 'Initial system initialization' },
      createdAt: new Date().toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async logAction(entry: {
    hospitalId: string;
    userId?: string;
    action: string;
    entity: string;
    entityId: string;
    metadata?: any;
  }) {
    const record: AuditLogEntry = {
      id: uuidv4(),
      ...entry,
      createdAt: new Date().toISOString(),
    };

    this.inMemoryLogs.unshift(record);
    this.logger.log(
      `[AUDIT] Action: ${entry.action} on ${entry.entity}:${entry.entityId} by User:${entry.userId || 'SYSTEM'}`,
    );

    try {
      if (this.prisma && typeof this.prisma.auditLog?.create === 'function') {
        await this.prisma.auditLog.create({
          data: {
            hospitalId: entry.hospitalId,
            userId: entry.userId,
            action: entry.action,
            entity: entry.entity,
            entityId: entry.entityId,
            metadata: entry.metadata,
          },
        });
      }
    } catch (err) {
      // Non-blocking in dev mode
    }

    return record;
  }

  async getLogs(hospitalId?: string, limit = 50) {
    if (hospitalId) {
      return this.inMemoryLogs.filter((l) => l.hospitalId === hospitalId).slice(0, limit);
    }
    return this.inMemoryLogs.slice(0, limit);
  }
}
