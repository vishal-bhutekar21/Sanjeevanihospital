import { IsString, Matches, Length } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9',
  })
  phone: string;
}
