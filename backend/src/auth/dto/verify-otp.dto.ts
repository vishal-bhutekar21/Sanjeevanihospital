import { IsString, Length, IsUUID } from 'class-validator';

export class VerifyOtpDto {
  @IsUUID('4', { message: 'Invalid session ID format' })
  sessionId: string;

  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 numeric digits' })
  otp: string;
}
