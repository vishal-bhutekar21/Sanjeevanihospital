import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ConfirmSlotDto {
  @IsString()
  @IsNotEmpty()
  bookingSessionId: string;

  @IsString()
  @IsNotEmpty()
  slotId: string;

  @IsString()
  @IsOptional()
  paymentId?: string;
}
