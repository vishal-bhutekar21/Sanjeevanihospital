import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { AdminRole } from '@prisma/client';

export class AdminRegisterDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters with strong complexity' })
  password: string;

  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;

  @IsString()
  hospitalId: string;
}
