import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { PatientPortalController, PatientRecordsController } from './patient-records.controller';
import { PatientRecordsService } from './patient-records.service';

@Module({
  imports: [AuthModule, AppointmentsModule],
  controllers: [PatientRecordsController, PatientPortalController],
  providers: [PatientRecordsService],
})
export class PatientRecordsModule {}
