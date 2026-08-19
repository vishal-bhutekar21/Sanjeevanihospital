import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class PatientSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.type !== 'BOOKING_SESSION') {
      throw new UnauthorizedException(
        'Invalid or expired patient booking session. Please verify your phone number with OTP first.',
      );
    }

    return true;
  }
}
