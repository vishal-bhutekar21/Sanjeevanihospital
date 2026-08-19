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
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { InitBookingSessionDto } from './dto/init-session.dto';
import { ReserveSlotDto } from './dto/reserve-slot.dto';
import { ConfirmSlotDto } from './dto/confirm-slot.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Public()
  @Post('session/init')
  @HttpCode(HttpStatus.CREATED)
  initSession(@Body(new ValidationPipe({ transform: true })) dto: InitBookingSessionDto) {
    return this.appointmentsService.initSession(dto);
  }

  @Public()
  @Get('availability')
  getAvailability(@Query('doctorId') doctorId: string, @Query('date') date?: string) {
    return this.appointmentsService.getDoctorAvailability(doctorId || 'doc-goyal', date);
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

  @Public()
  @Get()
  getAllAppointments() {
    return this.appointmentsService.getAllAppointments();
  }

  @Public()
  @Get(':code')
  getAppointmentByCode(@Param('code') code: string) {
    return this.appointmentsService.getAppointmentByCode(code);
  }
}
