import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HospitalContextService } from '../common/hospital-context.service';

@Global()
@Module({
  providers: [PrismaService, HospitalContextService],
  exports: [PrismaService, HospitalContextService],
})
export class PrismaModule {}
