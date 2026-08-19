import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsOptional } from 'class-validator';

export class InitBookingSessionDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsNumber()
  @Min(0)
  @Max(120)
  patientAge: number;

  @IsString()
  @IsNotEmpty()
  patientGender: string;

  @IsString()
  @IsNotEmpty()
  patientAddress: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsOptional()
  departmentId?: string;
}
