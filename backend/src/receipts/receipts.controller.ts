import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReceiptsService } from './receipts.service';
import { CollectPaymentDto, CreateReceiptDto } from './dto/receipt.dto';

const actorOf = (user: any) => ({ id: user?.userId, name: user?.name || user?.email, role: user?.role });
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const STAFF = [AdminRole.SUPER_ADMIN, AdminRole.HOSPITAL_ADMIN, AdminRole.RECEPTIONIST];

// Money and patient details: reception and administrators only
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...STAFF)
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receipts: ReceiptsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(new ValidationPipe({ transform: true, whitelist: true })) dto: CreateReceiptDto, @CurrentUser() user: any) {
    return this.receipts.create(dto, actorOf(user));
  }

  @Get()
  list(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('q') q?: string,
    @Query('status') status?: string,
    @Query('mode') mode?: string,
    @Query('due') due?: string,
    @Query('limit') limit?: string,
  ) {
    if ((from && !DAY.test(from)) || (to && !DAY.test(to))) throw new BadRequestException('Dates must be YYYY-MM-DD.');
    return this.receipts.list({ from, to, q, status, mode, due: due === 'true', limit: limit ? Number(limit) : undefined });
  }

  // Before ':id' so "summary" is not read as an id
  @Get('summary')
  summary(@Query('from') from: string, @Query('to') to: string) {
    if (!DAY.test(from || '') || !DAY.test(to || '')) throw new BadRequestException('from and to must be YYYY-MM-DD.');
    return this.receipts.summary(from, to);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.receipts.get(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body('reason') reason: string, @CurrentUser() user: any) {
    return this.receipts.cancel(id, reason, actorOf(user));
  }

  @Post(':id/collect')
  @HttpCode(HttpStatus.OK)
  collect(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true })) dto: CollectPaymentDto,
    @CurrentUser() user: any,
  ) {
    return this.receipts.collect(id, dto, actorOf(user));
  }
}
