import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PatientSessionGuard } from '../common/guards/patient-session.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AppointmentsService } from '../appointments/appointments.service';
import { PatientRecordsService, normalisePhone } from './patient-records.service';

/** Staff: share bills and medicines with a patient (by mobile number). */
@Controller('patient-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientRecordsController {
  constructor(private readonly records: PatientRecordsService) {}

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Get()
  list() {
    return this.records.list();
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Get(':phone')
  get(@Param('phone') phone: string) {
    return this.records.get(phone);
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST)
  @Post(':phone/bills')
  addBill(@Param('phone') phone: string, @Body() body: any) {
    return this.records.addBill(phone, body);
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST)
  @Patch(':phone/bills/:id')
  updateBill(@Param('phone') phone: string, @Param('id') id: string, @Body('paid') paid: unknown) {
    return this.records.updateBillPaid(phone, id, paid);
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST)
  @Delete(':phone/bills/:id')
  removeBill(@Param('phone') phone: string, @Param('id') id: string) {
    return this.records.remove(phone, 'bills', id);
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Post(':phone/medicines')
  addMedicine(@Param('phone') phone: string, @Body() body: any) {
    return this.records.addMedicine(phone, body);
  }

  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Delete(':phone/medicines/:id')
  removeMedicine(@Param('phone') phone: string, @Param('id') id: string) {
    return this.records.remove(phone, 'medicines', id);
  }
}

/** Patients: sign in with an SMS code, then see their own bills, medicines and appointments. */
@Controller('patient-portal')
export class PatientPortalController {
  constructor(
    private readonly records: PatientRecordsService,
    private readonly appointments: AppointmentsService,
    private readonly jwt: JwtService,
  ) {}

  /** Swap the short-lived token from /auth/verify-otp for a 30-day portal sign-in. */
  @UseGuards(JwtAuthGuard, PatientSessionGuard)
  @Post('session')
  session(@CurrentUser() user: any) {
    // The no-SMS booking fallback issues unverified tokens; never open records with those
    if (user?.phoneVerified === false) {
      throw new ForbiddenException(
        'Patient login needs an SMS code, which is not switched on yet. Please ask reception for your bills.',
      );
    }
    const phone = normalisePhone(user.phone);
    const token = this.jwt.sign({ sub: `patient:${phone}`, phone, type: 'PATIENT_PORTAL', role: 'PATIENT' }, { expiresIn: '30d' });
    return { token, phone };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: any) {
    if (user?.type !== 'PATIENT_PORTAL' || !user.phone) {
      throw new UnauthorizedException('Please sign in again.');
    }
    const phone = normalisePhone(user.phone);
    const record = await this.records.get(phone);
    const appointments = (await this.appointments.getAllAppointments())
      .filter((a) => a.patientPhone.replace(/\D/g, '').slice(-10) === phone)
      .map((a) => ({
        appointmentCode: a.appointmentCode,
        doctorName: a.doctorName,
        department: a.department,
        appointmentDate: a.appointmentDate,
        startTime: a.startTime,
        status: a.status,
        paymentStatus: a.paymentStatus,
        fee: a.fee,
      }));
    return { ...record, appointments };
  }
}
