import { Controller, Post, Get, Body, HttpCode, HttpStatus, ValidationPipe, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('create-order')
  @HttpCode(HttpStatus.OK)
  createOrder(@Body(new ValidationPipe({ transform: true })) dto: CreateOrderDto) {
    return this.paymentsService.createOrder(dto);
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyPayment(@Body(new ValidationPipe({ transform: true })) dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST)
  @Get()
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }
}
