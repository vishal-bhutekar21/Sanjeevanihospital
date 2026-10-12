import { Controller, Get } from '@nestjs/common';
import { HOSPITAL } from './config/hospital.config';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'UP',
      service: `${HOSPITAL.name} Backend API`,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mode: process.env.NODE_ENV || 'development',
      features: {
        prisma: 'Active',
        auth: 'Active (OTP + JWT)',
        payments: 'Active (Razorpay Sandbox)',
        concurrencyEngine: 'Active (PostgreSQL Locks)',
      },
    };
  }
}
