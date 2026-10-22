import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ServiceUnavailableException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AdminRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { HospitalContextService } from '../common/hospital-context.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { HOSPITAL } from '../config/hospital.config';

interface EphemeralSession {
  sessionId: string;
  phone: string;
  otpCode: string;
  otpVerified: boolean;
  attempts: number;
  createdAt: number;
  expiresAt: number;
}

interface AdminUserRecord {
  id: string;
  hospitalId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // In-memory Ephemeral Booking Session & Rate Limiting Cache
  private sessions = new Map<string, EphemeralSession>();
  private phoneRateLimits = new Map<string, { count: number; resetAt: number }>();

  // In-memory admin accounts for development & fallback
  private inMemoryAdmins: AdminUserRecord[] = [
    {
      id: 'admin-sanjeevani-01',
      hospitalId: HOSPITAL.id,
      name: 'Dr. Bagal / Hospital Administrator',
      email: 'admin@sanjeevanihosp.in',
      passwordHash: bcrypt.hashSync('Admin@123', 10),
      role: AdminRole.HOSPITAL_ADMIN,
      isActive: true,
    },
    {
      id: 'super-admin-01',
      hospitalId: HOSPITAL.id,
      name: 'Platform Super Admin',
      email: 'superadmin@sanjeevanihosp.in',
      passwordHash: bcrypt.hashSync('SuperAdmin@123', 10),
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  ];

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly configService: ConfigService,
    private readonly hospitalCtx: HospitalContextService,
  ) {}

  private get isProduction() {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  // MSG91 is "configured" only when a real auth key and OTP template are set
  private get msg91() {
    const authKey = this.configService.get<string>('MSG91_AUTH_KEY', '');
    const templateId = this.configService.get<string>('MSG91_TEMPLATE_ID', '');
    const configured = !!authKey && !authKey.startsWith('your_') && !!templateId;
    return { configured, authKey, templateId };
  }

  private async sendOtpSms(phone: string, otp: string) {
    const { authKey, templateId } = this.msg91;
    const url =
      `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}` +
      `&mobile=91${phone}&otp=${otp}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { authkey: authKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const body: any = await res.json().catch(() => ({}));
    if (!res.ok || body?.type === 'error') {
      this.logger.error(`MSG91 OTP send failed for +91-${phone}: ${JSON.stringify(body)}`);
      throw new ServiceUnavailableException(
        'We could not send the SMS right now. Please try again in a minute or call reception.',
      );
    }
  }

  /**
   * 1. Send OTP to Patient Mobile Number
   */
  // Bookings made without an SMS check, per IP per day (spam guard for the no-SMS fallback)
  private unverifiedByIp = new Map<string, { count: number; resetAt: number }>();

  /**
   * With no SMS gateway in production, booking can still go ahead without a code:
   * the mobile number is recorded as "not verified" and reception confirms by phone.
   * Set REQUIRE_OTP=true to turn this off and insist on SMS codes.
   */
  private get allowBookingWithoutOtp() {
    return this.configService.get<string>('REQUIRE_OTP', 'false') !== 'true';
  }

  async sendOtp(dto: SendOtpDto, ip = 'unknown') {
    const { phone } = dto;
    const now = Date.now();

    // Check rate limit: max 3 OTP requests per 10 minutes per phone
    const rate = this.phoneRateLimits.get(phone);
    if (rate) {
      if (now < rate.resetAt) {
        if (rate.count >= 3) {
          throw new BadRequestException(
            'Too many OTP requests for this mobile number. Please wait 10 minutes before retrying.',
          );
        }
        rate.count += 1;
      } else {
        this.phoneRateLimits.set(phone, { count: 1, resetAt: now + 10 * 60 * 1000 });
      }
    } else {
      this.phoneRateLimits.set(phone, { count: 1, resetAt: now + 10 * 60 * 1000 });
    }

    const sessionId = uuidv4();
    const smsReady = this.msg91.configured;

    if (!smsReady && this.isProduction) {
      if (!this.allowBookingWithoutOtp) {
        this.logger.error('MSG91_AUTH_KEY / MSG91_TEMPLATE_ID are not set; cannot send booking OTPs.');
        throw new ServiceUnavailableException(
          `Online booking is temporarily unavailable. Please call reception on ${HOSPITAL.helpline}.`,
        );
      }

      const day = this.unverifiedByIp.get(ip);
      if (day && now < day.resetAt && day.count >= 5) {
        throw new BadRequestException(
          `Too many bookings from this connection today. Please call reception on ${HOSPITAL.helpline}.`,
        );
      }
      if (!day || now >= day.resetAt) {
        this.unverifiedByIp.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
      } else {
        day.count += 1;
      }

      this.logger.warn(`SMS not configured: booking for +91-${phone} continues without OTP (mobile not verified).`);
      const token = this.jwtService.sign(
        {
          sub: sessionId,
          phone,
          type: 'BOOKING_SESSION',
          role: 'PATIENT_EPHEMERAL',
          phoneVerified: false,
        },
        { expiresIn: '30m' },
      );
      return {
        sessionId,
        phone: `+91-${phone}`,
        otpRequired: false,
        token,
        message: 'SMS codes are not set up yet. Reception will call this number to confirm the booking.',
      };
    }

    // Real random code when SMS is set up; fixed code only for local development
    const generatedOtp = smsReady ? String(randomInt(0, 1_000_000)).padStart(6, '0') : '123456';

    const session: EphemeralSession = {
      sessionId,
      phone,
      otpCode: generatedOtp,
      otpVerified: false,
      attempts: 0,
      createdAt: now,
      expiresAt: now + 10 * 60 * 1000, // 10-minute session TTL
    };

    if (smsReady) {
      await this.sendOtpSms(phone, generatedOtp);
    } else {
      this.logger.warn(`[dev] SMS not configured. OTP for +91-${phone} is ${generatedOtp}`);
    }

    this.sessions.set(sessionId, session);

    return {
      sessionId,
      phone: `+91-${phone}`,
      otpRequired: true,
      expiresInSeconds: 600,
      message: 'OTP sent by SMS',
    };
  }

  /**
   * 2. Verify Patient OTP and Issue Ephemeral JWT
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const { sessionId, otp } = dto;
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new UnauthorizedException('Session expired or not found. Please request a new OTP.');
    }

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      throw new UnauthorizedException('OTP has expired. Please request a new OTP.');
    }

    session.attempts += 1;
    if (session.attempts > 5) {
      this.sessions.delete(sessionId);
      throw new BadRequestException('Too many invalid attempts. Session terminated for security.');
    }

    const isValid = otp === session.otpCode;
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP. Please check the code and retry.');
    }

    session.otpVerified = true;

    // Issue Ephemeral Patient Session JWT (Valid for 30 minutes to complete booking)
    const token = this.jwtService.sign(
      {
        sub: session.sessionId,
        phone: session.phone,
        type: 'BOOKING_SESSION',
        role: 'PATIENT_EPHEMERAL',
      },
      { expiresIn: '30m' },
    );

    return {
      token,
      sessionId: session.sessionId,
      phone: `+91-${session.phone}`,
      status: 'OTP_VERIFIED',
      sessionExpiresIn: 1800,
      message: 'Mobile number verified successfully. You may now proceed with patient details.',
    };
  }

  /**
   * 3. Hospital Admin Login with Password Verification & JWT Issue
   */
  async adminLogin(dto: AdminLoginDto) {
    const { email, password } = dto;

    let admin: AdminUserRecord | undefined;

    if (this.prisma && typeof this.prisma.hospitalAdmin?.findUnique === 'function') {
      try {
        const dbAdmin = await this.prisma.hospitalAdmin.findUnique({
          where: { email: email.toLowerCase() },
          include: { hospital: true },
        });
        if (dbAdmin) {
          admin = {
            id: dbAdmin.id,
            hospitalId: dbAdmin.hospitalId,
            name: dbAdmin.name,
            email: dbAdmin.email,
            passwordHash: dbAdmin.passwordHash || '',
            role: dbAdmin.role,
            isActive: dbAdmin.isActive,
          };
        }
      } catch (err) {
        this.logger.error(`Admin lookup failed: ${(err as Error).message}`);
      }
    }

    // Built-in accounts are for local development only, never in production
    if (!admin && !this.isProduction) {
      admin = this.inMemoryAdmins.find((a) => a.email.toLowerCase() === email.toLowerCase());
    }

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid email address or deactivated admin account.');
    }

    const passwordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password. Please check your credentials.');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      hospitalId: admin.hospitalId,
      type: 'ADMIN_SESSION',
    };

    const token = this.jwtService.sign(payload);

    await this.auditService.logAction({
      hospitalId: admin.hospitalId,
      userId: admin.id,
      action: 'ADMIN_LOGIN_SUCCESS',
      entity: 'HOSPITAL_ADMIN',
      entityId: admin.id,
      metadata: { email: admin.email, role: admin.role },
    });

    return {
      token,
      admin: {
        id: admin.id,
        hospitalId: admin.hospitalId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        hospitalName: HOSPITAL.name,
      },
      message: 'Admin authenticated successfully',
    };
  }

  /**
   * 4. Register New Hospital Admin (Protected)
   */
  async adminRegister(dto: AdminRegisterDto, creatorRole: string) {
    if (creatorRole !== AdminRole.SUPER_ADMIN && creatorRole !== AdminRole.HOSPITAL_ADMIN) {
      throw new UnauthorizedException('Only administrators can register new staff.');
    }
    const role = dto.role || AdminRole.HOSPITAL_ADMIN;
    if (role === AdminRole.SUPER_ADMIN && creatorRole !== AdminRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only a super admin can create another super admin.');
    }
    this.checkPasswordStrength(dto.password);
    const email = dto.email.toLowerCase();

    if (this.inMemoryAdmins.some((a) => a.email.toLowerCase() === email)) {
      throw new ConflictException('An account with this email already exists.');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Real accounts live in the hospital_admins table so they survive restarts
    // and can sign in in production. Memory is only the fallback when the
    // database is unreachable (local development).
    let created: AdminUserRecord | undefined;
    const hid = await this.hospitalCtx.hospitalId();
    if (hid) {
      try {
        if (await this.prisma.hospitalAdmin.findUnique({ where: { email } })) {
          throw new ConflictException('An account with this email already exists.');
        }
        const row = await this.prisma.hospitalAdmin.create({
          data: { hospitalId: hid, name: dto.name.trim(), email, passwordHash, role },
        });
        created = {
          id: row.id,
          hospitalId: row.hospitalId,
          name: row.name,
          email: row.email,
          passwordHash,
          role: row.role,
          isActive: row.isActive,
        };
      } catch (err) {
        if (err instanceof ConflictException) throw err;
        this.logger.error(`Could not save admin account: ${(err as Error).message}`);
        if (this.isProduction) {
          throw new ServiceUnavailableException('Could not save the account right now. Please try again.');
        }
      }
    }
    if (!created) {
      if (this.isProduction) {
        throw new ServiceUnavailableException('The database is not available. Please try again.');
      }
      created = {
        id: uuidv4(),
        hospitalId: dto.hospitalId,
        name: dto.name.trim(),
        email,
        passwordHash,
        role,
        isActive: true,
      };
      this.inMemoryAdmins.push(created);
    }

    await this.auditService.logAction({
      hospitalId: created.hospitalId,
      action: 'ADMIN_CREATED',
      entity: 'HOSPITAL_ADMIN',
      entityId: created.id,
      metadata: { name: created.name, email: created.email, role: created.role },
    });

    return {
      id: created.id,
      hospitalId: created.hospitalId,
      name: created.name,
      email: created.email,
      role: created.role,
      message: 'New administrator registered successfully',
    };
  }

  private checkPasswordStrength(password: string) {
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new BadRequestException('Password must be at least 8 characters and include a letter and a number.');
    }
  }

  /** Staff logins for the admin screen (never includes password hashes). */
  async listAdmins() {
    const out: { id: string; name: string; email: string; role: AdminRole; isActive: boolean; createdAt?: string }[] = [];
    const hid = await this.hospitalCtx.hospitalId();
    if (hid) {
      try {
        const rows = await this.prisma.hospitalAdmin.findMany({
          where: { hospitalId: hid },
          orderBy: { createdAt: 'asc' },
        });
        rows.forEach((r) =>
          out.push({ id: r.id, name: r.name, email: r.email, role: r.role, isActive: r.isActive, createdAt: r.createdAt.toISOString() }),
        );
      } catch (err) {
        this.logger.warn(`Admin list failed: ${(err as Error).message}`);
      }
    }
    if (!this.isProduction) {
      this.inMemoryAdmins
        .filter((a) => !out.some((o) => o.email === a.email))
        .forEach((a) => out.push({ id: a.id, name: a.name, email: a.email, role: a.role, isActive: a.isActive }));
    }
    return out;
  }

  private async findAdminForChange(id: string, actorRole: string, actorId?: string) {
    const hid = await this.hospitalCtx.hospitalId();
    let target: { id: string; name: string; email: string; role: AdminRole; hospitalId: string; fromDb: boolean } | undefined;
    if (hid) {
      try {
        const row = await this.prisma.hospitalAdmin.findFirst({ where: { id, hospitalId: hid } });
        if (row) target = { id: row.id, name: row.name, email: row.email, role: row.role, hospitalId: row.hospitalId, fromDb: true };
      } catch {
        /* fall through to memory */
      }
    }
    if (!target && !this.isProduction) {
      const m = this.inMemoryAdmins.find((a) => a.id === id);
      if (m) target = { id: m.id, name: m.name, email: m.email, role: m.role, hospitalId: m.hospitalId, fromDb: false };
    }
    if (!target) throw new NotFoundException('Staff account not found.');
    if (target.role === AdminRole.SUPER_ADMIN && actorRole !== AdminRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only a super admin can change a super admin account.');
    }
    return { target, isSelf: actorId === id };
  }

  async setAdminActive(id: string, isActive: boolean, actor: { id?: string; role: string; name?: string }) {
    const { target, isSelf } = await this.findAdminForChange(id, actor.role, actor.id);
    if (isSelf && !isActive) throw new BadRequestException('You cannot deactivate your own account.');
    if (target.fromDb) {
      await this.prisma.hospitalAdmin.update({ where: { id }, data: { isActive } });
    } else {
      const m = this.inMemoryAdmins.find((a) => a.id === id);
      if (m) m.isActive = isActive;
    }
    await this.auditService.logAction({
      hospitalId: target.hospitalId,
      userId: actor.id,
      action: isActive ? 'ADMIN_ACTIVATED' : 'ADMIN_DEACTIVATED',
      entity: 'HOSPITAL_ADMIN',
      entityId: id,
      metadata: { email: target.email, by: actor.name },
    });
    return { id, isActive };
  }

  async resetAdminPassword(id: string, newPassword: string, actor: { id?: string; role: string; name?: string }) {
    const { target } = await this.findAdminForChange(id, actor.role, actor.id);
    this.checkPasswordStrength(newPassword || '');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    if (target.fromDb) {
      await this.prisma.hospitalAdmin.update({ where: { id }, data: { passwordHash } });
    } else {
      const m = this.inMemoryAdmins.find((a) => a.id === id);
      if (m) m.passwordHash = passwordHash;
    }
    await this.auditService.logAction({
      hospitalId: target.hospitalId,
      userId: actor.id,
      action: 'ADMIN_PASSWORD_RESET',
      entity: 'HOSPITAL_ADMIN',
      entityId: id,
      metadata: { email: target.email, by: actor.name },
    });
    return { id, message: 'Password changed.' };
  }

  /**
   * 5. Get Authenticated User Details from JWT Claims
   */
  async getProfile(user: any) {
    if (!user) {
      throw new UnauthorizedException('User authentication context not found');
    }
    return {
      user,
      authenticatedAt: new Date().toISOString(),
    };
  }
}
