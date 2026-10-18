import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class PatientSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // BOOKING_SESSION: phone just checked by SMS code (or the no-SMS fallback).
    // PATIENT_PORTAL: patient signed in to Patient login, also SMS-verified.
    if (!user || !['BOOKING_SESSION', 'PATIENT_PORTAL'].includes(user.type)) {
      throw new UnauthorizedException(
        'Invalid or expired patient booking session. Please verify your phone number with OTP first.',
      );
    }

    return true;
  }
}
