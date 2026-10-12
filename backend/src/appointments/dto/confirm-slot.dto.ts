import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class ConfirmSlotDto {
  @IsString()
  @IsNotEmpty()
  bookingSessionId: string;

  @IsString()
  @IsNotEmpty()
  slotId: string;

  // Patient chose to pay the consultation fee at the OPD counter
  @IsBoolean()
  @IsOptional()
  payAtHospital?: boolean;
}
