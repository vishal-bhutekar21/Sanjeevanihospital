import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

const actorOf = (user: any) => ({ id: user?.userId, name: user?.name || user?.email, role: user?.role });

// Registered patients: staff only (names, mobile numbers, addresses)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Get()
  search(@Query('q') q?: string, @Query('limit') limit?: string) {
    return this.patients.search(q, limit ? Number(limit) : 50);
  }

  // Declared before ':id' so "by-phone" is not read as an id
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Get('by-phone/:phone')
  byPhone(@Param('phone') phone: string) {
    return this.patients.byPhone(phone);
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.patients.get(id);
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(new ValidationPipe({ transform: true, whitelist: true })) dto: CreatePatientDto, @CurrentUser() user: any) {
    return this.patients.create(dto, actorOf(user));
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true })) dto: UpdatePatientDto,
    @CurrentUser() user: any,
  ) {
    return this.patients.update(id, dto, actorOf(user));
  }
}
