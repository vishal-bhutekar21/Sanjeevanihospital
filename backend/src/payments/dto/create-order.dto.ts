import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  bookingSessionId: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsNumber()
  @Min(100)
  amount: number;
}
