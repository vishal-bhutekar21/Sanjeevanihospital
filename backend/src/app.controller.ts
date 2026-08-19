import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'UP',
      service: 'Sanjeevani Multispeciality Hospital Backend API',
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
