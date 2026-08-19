import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AdminRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';

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
      hospitalId: 'hosp-sanjeevani-jalna',
      name: 'Dr. Bagal / Hospital Administrator',
      email: 'admin@sanjeevanihosp.in',
      passwordHash: bcrypt.hashSync('Admin@123', 10),
      role: AdminRole.HOSPITAL_ADMIN,
      isActive: true,
    },
    {
      id: 'super-admin-01',
      hospitalId: 'hosp-sanjeevani-jalna',
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
  ) {}

  /**
   * 1. Send OTP to Patient Mobile Number
   */
  async sendOtp(dto: SendOtpDto) {
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
    const generatedOtp = '123456'; // Standard sandbox OTP code for demo/dev

    const session: EphemeralSession = {
      sessionId,
      phone,
      otpCode: generatedOtp,
      otpVerified: false,
      attempts: 0,
      createdAt: now,
      expiresAt: now + 10 * 60 * 1000, // 10-minute session TTL
    };

    this.sessions.set(sessionId, session);
    this.logger.log(`[MSG91 Sandbox] Sent OTP to +91-${phone} for Session ID: ${sessionId}`);

    return {
      sessionId,
      phone: `+91-${phone}`,
      expiresInSeconds: 600,
      sandboxHint: 'In Sandbox / Dev mode, use OTP code: 123456',
      message: 'OTP sent successfully via SMS gateway',
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

    // In sandbox, accept '123456' or any valid 6-digit match
    const isValid = otp === session.otpCode || otp === '123456';
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

    // Search in-memory admin first, or database if connected
    let admin: AdminUserRecord | undefined = this.inMemoryAdmins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    );

    if (!admin && this.prisma && typeof this.prisma.hospitalAdmin?.findUnique === 'function') {
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
        // Fall back to in-memory
      }
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
        hospitalName: 'Sanjeevani Multispeciality Hospital',
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

    const existing = this.inMemoryAdmins.find(
      (a) => a.email.toLowerCase() === dto.email.toLowerCase(),
    );
    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newAdmin: AdminUserRecord = {
      id: uuidv4(),
      hospitalId: dto.hospitalId,
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: dto.role || AdminRole.HOSPITAL_ADMIN,
      isActive: true,
    };

    this.inMemoryAdmins.push(newAdmin);

    await this.auditService.logAction({
      hospitalId: dto.hospitalId,
      action: 'ADMIN_CREATED',
      entity: 'HOSPITAL_ADMIN',
      entityId: newAdmin.id,
      metadata: { name: newAdmin.name, email: newAdmin.email, role: newAdmin.role },
    });

    return {
      id: newAdmin.id,
      hospitalId: newAdmin.hospitalId,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      message: 'New administrator registered successfully',
    };
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
