import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { InitBookingSessionDto } from './dto/init-session.dto';
import { ReserveSlotDto } from './dto/reserve-slot.dto';
import { ConfirmSlotDto } from './dto/confirm-slot.dto';

export interface BookingSessionRecord {
  id: string;
  phone: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientAddress: string;
  doctorId: string;
  departmentId?: string;
  status: 'OTP_VERIFIED' | 'SLOT_HELD' | 'PAYMENT_PENDING' | 'PAYMENT_COMPLETED' | 'CONFIRMED' | 'EXPIRED';
  heldSlotId?: string;
  expiresAt: number;
  createdAt: string;
}

export interface SlotRecord {
  id: string;
  doctorId: string;
  slotDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: 'AVAILABLE' | 'HELD' | 'CONFIRMED';
  heldBySessionId?: string;
  heldUntil?: number; // epoch ms
}

export interface ConfirmedAppointmentRecord {
  id: string;
  appointmentCode: string;
  bookingSessionId: string;
  slotId: string;
  hospitalId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  patientAddress: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  paymentStatus: 'PAID' | 'PENDING';
  fee: number;
  paymentId?: string;
  createdAt: string;
}

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  // In-memory slot & session storage with concurrency guard
  private sessions = new Map<string, BookingSessionRecord>();
  private slots: SlotRecord[] = [];
  private appointments: ConfirmedAppointmentRecord[] = [
    {
      id: 'apt-001',
      appointmentCode: 'SMH-2026-000101',
      bookingSessionId: 'sess-demo-1',
      slotId: 'slot-demo-1',
      hospitalId: 'hosp-sanjeevani-jalna',
      doctorId: 'doc-goyal',
      doctorName: 'Dr. Nishant Goyal',
      department: 'Orthopedics & Joint Replacement',
      patientName: 'Ramesh Patil',
      patientPhone: '+919876543210',
      patientAge: 38,
      patientGender: 'Male',
      patientAddress: 'Jalna Rural, Maharashtra',
      appointmentDate: '2026-08-25',
      startTime: '11:30 AM',
      endTime: '12:00 PM',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      fee: 500,
      paymentId: 'pay_K7h2Nm90AqL1',
      createdAt: new Date().toISOString(),
    },
  ];

  // Doctor Profiles & Shifts Cache
  private doctors = [
    {
      id: 'doc-goyal',
      name: 'Dr. Nishant Goyal',
      department: 'Orthopedics & Joint Replacement',
      fee: 500,
      shifts: { start: '11:00', end: '16:00', interval: 30, breakStart: '13:00', breakEnd: '13:30' },
    },
    {
      id: 'doc-mirkad',
      name: 'Dr. Shivdas Mirkad',
      department: 'Pediatrics & Neonatology',
      fee: 500,
      shifts: { start: '10:00', end: '14:00', interval: 30, breakStart: '12:00', breakEnd: '12:30' },
    },
    {
      id: 'doc-bagal',
      name: 'Dr. Baliram Bagal',
      department: 'Critical Care & Anesthesiology',
      fee: 400,
      shifts: { start: '09:00', end: '15:00', interval: 30, breakStart: '12:30', breakEnd: '13:00' },
    },
    {
      id: 'doc-rajguru',
      name: 'Dr. Kailash Rajguru',
      department: 'Internal Medicine',
      fee: 400,
      shifts: { start: '10:00', end: '14:00', interval: 30, breakStart: '12:00', breakEnd: '12:30' },
    },
    {
      id: 'doc-anshul',
      name: 'Dr. Anshul Goyal',
      department: 'Obstetrics & Gynecology',
      fee: 500,
      shifts: { start: '11:00', end: '15:00', interval: 30, breakStart: '13:00', breakEnd: '13:30' },
    },
    {
      id: 'doc-katole',
      name: 'Dr. Millind Katole',
      department: 'General & Laparoscopic Surgery',
      fee: 500,
      shifts: { start: '10:00', end: '15:00', interval: 30, breakStart: '13:00', breakEnd: '13:30' },
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * 1. Initialize Booking Session with Patient Demographics
   */
  async initSession(dto: InitBookingSessionDto) {
    const sessionId = uuidv4();
    const session: BookingSessionRecord = {
      id: sessionId,
      phone: dto.phone,
      patientName: dto.patientName,
      patientAge: dto.patientAge,
      patientGender: dto.patientGender,
      patientAddress: dto.patientAddress,
      doctorId: dto.doctorId,
      departmentId: dto.departmentId,
      status: 'OTP_VERIFIED',
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 mins session TTL
      createdAt: new Date().toISOString(),
    };

    this.sessions.set(sessionId, session);
    this.logger.log(`Initialized Booking Session ${sessionId} for patient ${dto.patientName}`);

    const doctor = this.doctors.find((d) => d.id === dto.doctorId) || this.doctors[0];

    return {
      sessionId,
      session,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        department: doctor.department,
        fee: doctor.fee,
      },
      message: 'Booking session created. Proceed to slot reservation & payment.',
    };
  }

  /**
   * 2. Real-Time Dynamic Doctor Availability & Slot Generation
   */
  async getDoctorAvailability(doctorId: string, dateStr?: string) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const doctor = this.doctors.find((d) => d.id === doctorId) || this.doctors[0];
    const { start, end, interval, breakStart, breakEnd } = doctor.shifts;

    // Clean up expired held slots
    const now = Date.now();
    this.slots.forEach((s) => {
      if (s.status === 'HELD' && s.heldUntil && now > s.heldUntil) {
        s.status = 'AVAILABLE';
        s.heldBySessionId = undefined;
        s.heldUntil = undefined;
      }
    });

    // Helper: convert "HH:mm" to minutes
    const parseMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const formatMins = (m: number) => {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${String(displayH).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
    };

    const startMins = parseMins(start);
    const endMins = parseMins(end);
    const bStartMins = parseMins(breakStart);
    const bEndMins = parseMins(breakEnd);

    const generatedSlots = [];
    for (let cur = startMins; cur + interval <= endMins; cur += interval) {
      // Exclude lunch break
      if (cur >= bStartMins && cur < bEndMins) continue;

      const slotStartTime = formatMins(cur);
      const slotEndTime = formatMins(cur + interval);

      // Check existing slot in store
      let existing = this.slots.find(
        (s) => s.doctorId === doctor.id && s.slotDate === targetDate && s.startTime === slotStartTime,
      );

      if (!existing) {
        existing = {
          id: `slot_${doctor.id}_${targetDate}_${cur}`,
          doctorId: doctor.id,
          slotDate: targetDate,
          startTime: slotStartTime,
          endTime: slotEndTime,
          status: 'AVAILABLE',
        };
        this.slots.push(existing);
      }

      generatedSlots.push(existing);
    }

    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      date: targetDate,
      fee: doctor.fee,
      totalSlots: generatedSlots.length,
      availableSlots: generatedSlots.filter((s) => s.status === 'AVAILABLE').length,
      slots: generatedSlots,
    };
  }

  /**
   * 3. Reserve Slot with Atomic Concurrency Mutex & 10-Minute Hold TTL
   */
  async reserveSlot(dto: ReserveSlotDto) {
    const { bookingSessionId, doctorId, slotDate, startTime, endTime } = dto;
    const now = Date.now();

    const session = this.sessions.get(bookingSessionId);
    if (!session) {
      throw new NotFoundException('Booking session not found or expired.');
    }

    // Release any previous slot held by this session
    this.slots.forEach((s) => {
      if (s.heldBySessionId === bookingSessionId && s.status === 'HELD') {
        s.status = 'AVAILABLE';
        s.heldBySessionId = undefined;
        s.heldUntil = undefined;
      }
    });

    // Find requested slot
    let slot = this.slots.find(
      (s) => s.doctorId === doctorId && s.slotDate === slotDate && s.startTime === startTime,
    );

    if (!slot) {
      slot = {
        id: `slot_${doctorId}_${slotDate}_${startTime.replace(/[^0-9]/g, '')}`,
        doctorId,
        slotDate,
        startTime,
        endTime,
        status: 'AVAILABLE',
      };
      this.slots.push(slot);
    }

    // Check concurrency collision
    if (slot.status === 'CONFIRMED') {
      throw new ConflictException(
        'This appointment slot is already confirmed and booked by another patient.',
      );
    }

    if (slot.status === 'HELD' && slot.heldBySessionId !== bookingSessionId) {
      if (slot.heldUntil && now < slot.heldUntil) {
        throw new ConflictException(
          'This slot is currently held by another patient completing payment. Please choose an adjacent slot.',
        );
      }
    }

    // Acquire lock: Hold slot for 10 minutes
    const holdDurationMs = 10 * 60 * 1000;
    slot.status = 'HELD';
    slot.heldBySessionId = bookingSessionId;
    slot.heldUntil = now + holdDurationMs;

    session.status = 'SLOT_HELD';
    session.heldSlotId = slot.id;

    this.logger.log(`Slot ${slot.id} atomically HELD for session ${bookingSessionId} until ${new Date(slot.heldUntil).toISOString()}`);

    return {
      slotId: slot.id,
      status: 'HELD',
      slotDate: slot.slotDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      heldUntil: slot.heldUntil,
      holdExpiresInSeconds: 600,
      message: 'Slot held successfully for 10 minutes. Please complete payment to confirm.',
    };
  }

  /**
   * 4. Confirm Slot & Issue Unique Hospital Token Code
   */
  async confirmSlot(dto: ConfirmSlotDto) {
    const { bookingSessionId, slotId, paymentId } = dto;

    const session = this.sessions.get(bookingSessionId);
    if (!session) {
      throw new NotFoundException('Booking session expired or not found.');
    }

    const slot = this.slots.find((s) => s.id === slotId);
    if (!slot) {
      throw new NotFoundException('Selected appointment slot not found.');
    }

    const doctor = this.doctors.find((d) => d.id === session.doctorId) || this.doctors[0];
    const appointmentCode = `SMH-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    slot.status = 'CONFIRMED';
    slot.heldBySessionId = undefined;
    slot.heldUntil = undefined;

    session.status = 'CONFIRMED';

    const confirmedRecord: ConfirmedAppointmentRecord = {
      id: uuidv4(),
      appointmentCode,
      bookingSessionId,
      slotId: slot.id,
      hospitalId: 'hosp-sanjeevani-jalna',
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      patientName: session.patientName,
      patientPhone: session.phone,
      patientAge: session.patientAge,
      patientGender: session.patientGender,
      patientAddress: session.patientAddress,
      appointmentDate: slot.slotDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      fee: doctor.fee,
      paymentId: paymentId || 'pay_test_online',
      createdAt: new Date().toISOString(),
    };

    this.appointments.unshift(confirmedRecord);

    await this.auditService.logAction({
      hospitalId: 'hosp-sanjeevani-jalna',
      action: 'APPOINTMENT_CONFIRMED',
      entity: 'APPOINTMENT',
      entityId: confirmedRecord.id,
      metadata: {
        appointmentCode,
        patientName: session.patientName,
        doctor: doctor.name,
        slotDate: slot.slotDate,
        startTime: slot.startTime,
      },
    });

    return {
      appointmentCode,
      appointment: confirmedRecord,
      reportingInstructions:
        'Please report to Sanjeevani Hospital OPD Reception 15 minutes before your scheduled slot. Show your Appointment Code on arrival.',
      hospitalAddress: 'Plot No. 17, Rishi Park, Ambad Choufuli, Jalna – 431203',
      emergencyHelpline: '+91-75073-42222',
      message: 'Appointment confirmed successfully!',
    };
  }

  async getAllAppointments() {
    return this.appointments;
  }

  async getAppointmentByCode(code: string) {
    const apt = this.appointments.find((a) => a.appointmentCode.toUpperCase() === code.toUpperCase());
    if (!apt) {
      throw new NotFoundException(`No appointment found for token ${code}`);
    }
    return apt;
  }
}
