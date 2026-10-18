import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Patch,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PatientSessionGuard } from '../common/guards/patient-session.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AppointmentsService } from './appointments.service';
import { InitBookingSessionDto } from './dto/init-session.dto';
import { ReserveSlotDto } from './dto/reserve-slot.dto';
import { ConfirmSlotDto } from './dto/confirm-slot.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // Needs the short-lived token issued after the patient's phone passes OTP
  @UseGuards(JwtAuthGuard, PatientSessionGuard)
  @Post('session/init')
  @HttpCode(HttpStatus.CREATED)
  initSession(
    @Body(new ValidationPipe({ transform: true })) dto: InitBookingSessionDto,
    @CurrentUser('phone') verifiedPhone: string,
    @CurrentUser('phoneVerified') phoneVerified: boolean,
  ) {
    return this.appointmentsService.initSession(dto, verifiedPhone, phoneVerified !== false);
  }

  @Public()
  @Get('availability')
  getAvailability(@Query('doctorId') doctorId: string, @Query('date') date?: string) {
    if (!doctorId) {
      throw new BadRequestException('doctorId is required');
    }
    return this.appointmentsService.getDoctorAvailability(doctorId, date);
  }

  @Public()
  @Post('reserve-slot')
  @HttpCode(HttpStatus.OK)
  reserveSlot(@Body(new ValidationPipe({ transform: true })) dto: ReserveSlotDto) {
    return this.appointmentsService.reserveSlot(dto);
  }

  @Public()
  @Post('confirm-slot')
  @HttpCode(HttpStatus.OK)
  confirmSlot(@Body(new ValidationPipe({ transform: true })) dto: ConfirmSlotDto) {
    return this.appointmentsService.confirmSlot(dto);
  }

  // OPD timings are public (patients see them); only staff can change them
  @Public()
  @Get('schedules')
  getSchedules() {
    return this.appointmentsService.getSchedules();
  }

  @Public()
  @Get('schedules/:doctorId')
  getSchedule(@Param('doctorId') doctorId: string) {
    return this.appointmentsService.getSchedule(doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST)
  @Put('schedules/:doctorId')
  saveSchedule(@Param('doctorId') doctorId: string, @Body() body: any) {
    return this.appointmentsService.saveSchedule(doctorId, body);
  }

  // Patient names and phone numbers: staff only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Get()
  getAllAppointments() {
    return this.appointmentsService.getAllAppointments();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const allowed = ['CONFIRMED', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!allowed.includes(status)) {
      throw new BadRequestException(`status must be one of ${allowed.join(', ')}`);
    }
    return this.appointmentsService.updateAppointmentStatus(id, status as any);
  }

  // Returns the patient's name and phone, so staff only (token numbers are guessable)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST, AdminRole.DOCTOR)
  @Get(':code')
  getAppointmentByCode(@Param('code') code: string) {
    return this.appointmentsService.getAppointmentByCode(code);
  }
}
