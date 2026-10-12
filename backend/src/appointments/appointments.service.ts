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
import {
  ROSTER,
  DEFAULT_SCHEDULES,
  WeeklySchedule,
  cleanSchedule,
  validateSchedule,
  toMinutes,
} from './schedules';
import { HOSPITAL } from '../config/hospital.config';

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
  phoneVerified?: boolean;
  paymentId?: string;
  paidAmount?: number;
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
  // false = booked while SMS codes were not set up; reception should call to confirm
  phoneVerified?: boolean;
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
      hospitalId: HOSPITAL.id,
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

  // Doctors who can be booked online (same ids as the website)
  private doctors = ROSTER;

  // Weekly OPD timings. Starts from DEFAULT_SCHEDULES, then whatever admins
  // have saved in the doctor_schedules table overrides it.
  private schedules = new Map<string, WeeklySchedule>(
    Object.entries(DEFAULT_SCHEDULES).map(([id, sch]) => [id, cleanSchedule(sch)]),
  );
  private schedulesLoadedFromDb = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * 1. Initialize Booking Session with Patient Demographics
   */
  async initSession(dto: InitBookingSessionDto, verifiedPhone?: string, phoneVerified = true) {
    if (!this.doctors.some((d) => d.id === dto.doctorId)) {
      throw new BadRequestException(
        'Online booking is not available for this doctor yet. Please call reception to book.',
      );
    }

    const sessionId = uuidv4();
    const session: BookingSessionRecord = {
      id: sessionId,
      // Always use the phone number that passed OTP, not what the form sent
      phone: (verifiedPhone || dto.phone).replace(/^\+?91-?/, ''),
      phoneVerified,
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

    const doctor = this.doctors.find((d) => d.id === dto.doctorId)!;

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
    const doctor = this.doctors.find((d) => d.id === doctorId);
    if (!doctor) {
      return { doctorId, date: targetDate, bookable: false, totalSlots: 0, availableSlots: 0, slots: [] };
    }
    await this.loadSchedulesFromDb();
    const schedule = this.schedules.get(doctor.id);
    const offersOnline = !!schedule && schedule.days.some((d) => d.length > 0);
    if (!offersOnline) {
      return { doctorId, date: targetDate, bookable: false, totalSlots: 0, availableSlots: 0, slots: [] };
    }

    // Clean up expired held slots
    const now = Date.now();
    this.slots.forEach((s) => {
      if (s.status === 'HELD' && s.heldUntil && now > s.heldUntil) {
        s.status = 'AVAILABLE';
        s.heldBySessionId = undefined;
        s.heldUntil = undefined;
      }
    });

    const formatMins = (m: number) => {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${String(displayH).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
    };

    // Don't offer times that have already passed today (hospital time, IST)
    const nowIst = new Date(Date.now() + 330 * 60 * 1000);
    const todayIst = nowIst.toISOString().split('T')[0];
    const weekday = new Date(`${targetDate}T00:00:00Z`).getUTCDay();
    const sessions = schedule!.days[weekday] || [];
    if (targetDate < todayIst || sessions.length === 0) {
      return {
        doctorId,
        date: targetDate,
        bookable: true,
        dayOff: sessions.length === 0,
        totalSlots: 0,
        availableSlots: 0,
        slots: [],
      };
    }
    const minStartMins =
      targetDate === todayIst ? nowIst.getUTCHours() * 60 + nowIst.getUTCMinutes() + 30 : -1;
    const interval = schedule!.slotMinutes;

    const generatedSlots: SlotRecord[] = [];
    for (const session of sessions) {
      const startMins = toMinutes(session.start);
      const endMins = toMinutes(session.end);
      for (let cur = startMins; cur + interval <= endMins; cur += interval) {
        if (cur < minStartMins) continue;

        const slotStartTime = formatMins(cur);
        const slotEndTime = formatMins(cur + interval);

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
    }

    return {
      bookable: true,
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
    if (!session || Date.now() > session.expiresAt) {
      throw new NotFoundException('Your booking session has expired. Please start again.');
    }
    if (session.doctorId !== doctorId) {
      throw new BadRequestException('Doctor does not match this booking.');
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
    const { bookingSessionId, slotId, payAtHospital } = dto;

    const session = this.sessions.get(bookingSessionId);
    if (!session) {
      throw new NotFoundException('Booking session expired or not found.');
    }

    // Repeat calls (e.g. double-tap) return the same booking
    const already = this.appointments.find((a) => a.bookingSessionId === bookingSessionId);
    if (already) {
      return this.confirmationResponse(already);
    }

    const slot = this.slots.find((s) => s.id === slotId);
    if (!slot) {
      throw new NotFoundException('Selected appointment slot not found.');
    }
    if (slot.status !== 'HELD' || slot.heldBySessionId !== bookingSessionId) {
      throw new ConflictException(
        'Your hold on this time has expired. Please pick the time again.',
      );
    }

    const isPaid = !!session.paymentId;
    if (!isPaid && !payAtHospital) {
      throw new BadRequestException('Payment has not been completed for this booking.');
    }

    const doctor = this.doctors.find((d) => d.id === session.doctorId)!;
    const year = slot.slotDate.slice(0, 4);
    let appointmentCode: string;
    do {
      appointmentCode = `SMH-${year}-${Math.floor(100000 + Math.random() * 900000)}`;
    } while (this.appointments.some((a) => a.appointmentCode === appointmentCode));

    slot.status = 'CONFIRMED';
    slot.heldBySessionId = undefined;
    slot.heldUntil = undefined;

    session.status = 'CONFIRMED';

    const confirmedRecord: ConfirmedAppointmentRecord = {
      id: uuidv4(),
      appointmentCode,
      bookingSessionId,
      slotId: slot.id,
      hospitalId: HOSPITAL.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      patientName: session.patientName,
      patientPhone: session.phone,
      phoneVerified: session.phoneVerified !== false,
      patientAge: session.patientAge,
      patientGender: session.patientGender,
      patientAddress: session.patientAddress,
      appointmentDate: slot.slotDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'CONFIRMED',
      paymentStatus: isPaid ? 'PAID' : 'PENDING',
      fee: doctor.fee,
      paymentId: session.paymentId,
      createdAt: new Date().toISOString(),
    };

    this.appointments.unshift(confirmedRecord);

    await this.auditService.logAction({
      hospitalId: HOSPITAL.id,
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

    return this.confirmationResponse(confirmedRecord);
  }

  private confirmationResponse(apt: ConfirmedAppointmentRecord) {
    return {
      appointmentCode: apt.appointmentCode,
      appointment: apt,
      reportingInstructions:
        apt.paymentStatus === 'PAID'
          ? 'Please come to the OPD reception 15 minutes before your time and show this token number.'
          : `Please come to the OPD reception 15 minutes before your time, show this token number and pay the ₹${apt.fee} consultation fee at the counter.`,
      hospitalAddress: HOSPITAL.fullAddress,
      emergencyHelpline: HOSPITAL.helpline,
      message: 'Appointment confirmed',
    };
  }

  /** Used by payments: the fee always comes from the server, never the browser */
  getSessionForPayment(bookingSessionId: string) {
    const session = this.sessions.get(bookingSessionId);
    if (!session || Date.now() > session.expiresAt) {
      throw new NotFoundException('Your booking session has expired. Please start again.');
    }
    if (!session.heldSlotId) {
      throw new BadRequestException('Please choose an appointment time first.');
    }
    const doctor = this.doctors.find((d) => d.id === session.doctorId)!;
    return { session, fee: doctor.fee, doctorName: doctor.name };
  }

  markSessionPaid(bookingSessionId: string, paymentId: string, amount: number) {
    const session = this.sessions.get(bookingSessionId);
    if (!session) {
      throw new NotFoundException('Booking session expired or not found.');
    }
    session.paymentId = paymentId;
    session.paidAmount = amount;
    session.status = 'PAYMENT_COMPLETED';
  }

  async updateAppointmentStatus(id: string, status: ConfirmedAppointmentRecord['status']) {
    const apt = this.appointments.find((a) => a.id === id);
    if (!apt) {
      throw new NotFoundException('Appointment not found.');
    }
    apt.status = status;
    if (status === 'COMPLETED' && apt.paymentStatus === 'PENDING') {
      // Fee is collected at the counter before the consultation ends
      apt.paymentStatus = 'PAID';
    }
    return apt;
  }

  // ─── OPD timings ──────────────────────────────────────────────────────────

  private normaliseName(name: string) {
    return name.toLowerCase().replace(/^dr\.?\s*/, '').replace(/\([^)]*\)/g, '').replace(/[^a-z]/g, '');
  }

  /** Map our doctor ids to the matching rows in the doctors table (matched by name). */
  private async dbDoctorIds(): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    const rows = await this.prisma.doctor.findMany({ select: { id: true, name: true } });
    for (const d of this.doctors) {
      const want = this.normaliseName(d.name);
      const hit = rows.find((r) => {
        const got = this.normaliseName(r.name);
        return got === want || want.startsWith(got) || got.startsWith(want);
      });
      if (hit) map.set(d.id, hit.id);
    }
    return map;
  }

  private dbDoctorIdCache: Map<string, string> | null = null;

  /** Load saved timings from doctor_schedules once; keep defaults if the database is unreachable. */
  private async loadSchedulesFromDb() {
    if (this.schedulesLoadedFromDb) return;
    this.schedulesLoadedFromDb = true;
    try {
      const ids = await this.dbDoctorIds();
      this.dbDoctorIdCache = ids;
      for (const [ourId, dbId] of ids) {
        const rows = await this.prisma.doctorSchedule.findMany({
          where: { doctorId: dbId, isActive: true },
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
        if (rows.length === 0) continue;
        const days: { start: string; end: string }[][] = [[], [], [], [], [], [], []];
        rows.forEach((r) => days[r.dayOfWeek]?.push({ start: r.startTime, end: r.endTime }));
        this.schedules.set(ourId, cleanSchedule({ slotMinutes: rows[0].slotDurationMins, days }));
      }
      this.logger.log(`Loaded OPD timings from database for ${ids.size} doctor(s)`);
    } catch (err) {
      this.logger.warn(`Using default OPD timings (database not reachable): ${(err as Error).message}`);
    }
  }

  async getSchedules() {
    await this.loadSchedulesFromDb();
    return this.doctors.map((d) => ({
      doctorId: d.id,
      name: d.name,
      department: d.department,
      savedInDatabase: !!this.dbDoctorIdCache?.has(d.id),
      schedule: this.schedules.get(d.id) || { slotMinutes: 15, days: [[], [], [], [], [], [], []] },
    }));
  }

  async getSchedule(doctorId: string) {
    const all = await this.getSchedules();
    const one = all.find((s) => s.doctorId === doctorId);
    if (!one) throw new NotFoundException('Doctor not found.');
    return one;
  }

  async saveSchedule(doctorId: string, input: WeeklySchedule) {
    await this.loadSchedulesFromDb();
    if (!this.doctors.some((d) => d.id === doctorId)) {
      throw new NotFoundException('Doctor not found.');
    }
    const problem = validateSchedule(input);
    if (problem) throw new BadRequestException(problem);
    const schedule = cleanSchedule(input);

    // Save to the database when this doctor exists there
    let savedInDatabase = false;
    const dbId = this.dbDoctorIdCache?.get(doctorId);
    if (dbId) {
      const rows = schedule.days.flatMap((sessions, dayOfWeek) =>
        sessions.map((sess) => ({
          doctorId: dbId,
          dayOfWeek,
          startTime: sess.start,
          endTime: sess.end,
          slotDurationMins: schedule.slotMinutes,
          isActive: true,
        })),
      );
      try {
        await this.prisma.$transaction([
          this.prisma.doctorSchedule.deleteMany({ where: { doctorId: dbId } }),
          this.prisma.doctorSchedule.createMany({ data: rows }),
        ]);
        savedInDatabase = true;
      } catch (err) {
        this.logger.error(`Could not save OPD timings for ${doctorId}: ${(err as Error).message}`);
        throw new BadRequestException('Could not save to the database. Please try again.');
      }
    }

    this.schedules.set(doctorId, schedule);
    return { doctorId, savedInDatabase, schedule };
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
