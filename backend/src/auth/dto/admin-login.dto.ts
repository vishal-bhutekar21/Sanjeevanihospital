import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsEmail({}, { message: 'Please provide a valid official email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  password: string;
}
