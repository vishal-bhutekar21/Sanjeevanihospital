import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminRole } from '@prisma/client';

@Injectable()
export class HospitalIsolationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // If endpoint is not authenticated, let AuthGuard reject it
    }

    // Super Admin has multi-hospital platform access
    if (user.role === AdminRole.SUPER_ADMIN) {
      return true;
    }

    // Target hospitalId from request params, query, or body
    const targetHospitalId =
      request.params?.hospitalId ||
      request.query?.hospitalId ||
      request.body?.hospitalId ||
      request.headers['x-hospital-id'];

    if (targetHospitalId && user.hospitalId && targetHospitalId !== user.hospitalId) {
      throw new ForbiddenException(
        'Cross-Tenant Isolation Violation: Admin is not authorized to access or mutate records for this hospital.',
      );
    }

    return true;
  }
}
