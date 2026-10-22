import { IsIn, IsInt, IsOptional, IsString, Matches, Max, Min, MaxLength } from 'class-validator';

/** Reception books a walk-in or phone patient directly (no OTP, no online payment). */
export class StaffBookDto {
  @IsString()
  doctorId: string;

  /** YYYY-MM-DD */
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date: string;

  /** Slot start exactly as the availability list returns it, e.g. "09:30 AM" */
  @IsString()
  startTime: string;

  @IsString()
  @MaxLength(120)
  patientName: string;

  @Matches(/^\d{10}$/, { message: 'phone must be 10 digits' })
  patientPhone: string;

  @IsInt()
  @Min(0)
  @Max(120)
  patientAge: number;

  @IsOptional()
  @IsString()
  patientGender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  patientAddress?: string;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  patientRegNo?: string;

  @IsIn(['WALK_IN', 'PHONE'])
  source: 'WALK_IN' | 'PHONE';

  /** Fee in rupees. Needed when the doctor's fee is not published (0). */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000000)
  fee?: number;

  @IsIn(['PAID', 'PENDING'])
  paymentStatus: 'PAID' | 'PENDING';
}
