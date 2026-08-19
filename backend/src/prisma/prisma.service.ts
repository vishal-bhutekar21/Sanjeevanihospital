import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Non-blocking connection attempt with timeout so dev server boots immediately
    const connectPromise = this.$connect()
      .then(() => {
        this.logger.log('Connected to PostgreSQL Database via Prisma');
      })
      .catch((err) => {
        this.logger.warn('Database offline / sandbox mode active: ' + err.message);
      });

    // Don't block bootstrap if database is not reachable yet in dev phase
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1000));
    await Promise.race([connectPromise, timeoutPromise]);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
