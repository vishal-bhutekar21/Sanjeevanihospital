import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  bookingSessionId: string;

  // Optional and ignored: the fee is looked up on the server
  @IsString()
  @IsOptional()
  doctorId?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;
}
