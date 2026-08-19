import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';
import { HospitalIsolationGuard } from '../common/guards/hospital-isolation.guard';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard, HospitalIsolationGuard)
@Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  getLogs(@Query('hospitalId') hospitalId?: string, @Query('limit') limit?: number) {
    return this.auditService.getLogs(hospitalId, limit ? Number(limit) : 50);
  }
}
