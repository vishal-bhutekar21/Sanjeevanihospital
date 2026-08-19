import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ReserveSlotDto {
  @IsString()
  @IsNotEmpty()
  bookingSessionId: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be formatted as YYYY-MM-DD' })
  slotDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}
