import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  Ip,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AdminRole } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  sendOtp(@Body(new ValidationPipe({ transform: true })) dto: SendOtpDto, @Ip() ip: string) {
    return this.authService.sendOtp(dto, ip);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body(new ValidationPipe({ transform: true })) dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body(new ValidationPipe({ transform: true })) dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Post('admin/register')
  @HttpCode(HttpStatus.CREATED)
  adminRegister(
    @Body(new ValidationPipe({ transform: true })) dto: AdminRegisterDto,
    @CurrentUser('role') role: string,
  ) {
    return this.authService.adminRegister(dto, role);
  }

  // Staff logins (reception accounts etc.), admins only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Get('admin/users')
  listAdmins() {
    return this.authService.listAdmins();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Patch('admin/users/:id/active')
  setAdminActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
    @CurrentUser() user: any,
  ) {
    return this.authService.setAdminActive(id, isActive === true, {
      id: user?.userId,
      role: user?.role,
      name: user?.name || user?.email,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN)
  @Post('admin/users/:id/reset-password')
  @HttpCode(HttpStatus.OK)
  resetAdminPassword(
    @Param('id') id: string,
    @Body('password') password: string,
    @CurrentUser() user: any,
  ) {
    return this.authService.resetAdminPassword(id, password, {
      id: user?.userId,
      role: user?.role,
      name: user?.name || user?.email,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user);
  }
}
