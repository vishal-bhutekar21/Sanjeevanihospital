import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  role: string;
  hospitalId?: string;
  type?: string;
  phone?: string;
  phoneVerified?: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'sanjeevani-secret-2026'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Malformed authentication token');
    }
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      hospitalId: payload.hospitalId,
      type: payload.type,
      phone: payload.phone,
      // OTP-verified tokens don't carry the flag; only the no-SMS fallback sets it to false
      phoneVerified: payload.phoneVerified !== false,
    };
  }
}
