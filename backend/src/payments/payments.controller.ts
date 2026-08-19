import { Controller, Post, Get, Body, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
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

  @Public()
  @Get()
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }
}
