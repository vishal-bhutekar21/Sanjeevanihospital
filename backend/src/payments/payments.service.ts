import { Injectable, BadRequestException, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

export interface PaymentRecord {
  id: string;
  hospitalId: string;
  bookingSessionId: string;
  orderId: string;
  paymentId?: string;
  signature?: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'VERIFIED' | 'FAILED';
  createdAt: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly razorpayKeyId: string;
  private readonly razorpayKeySecret: string;

  // In-memory payment ledger
  private inMemoryPayments: PaymentRecord[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly appointmentsService: AppointmentsService,
  ) {
    // Keys come only from the environment. Never commit them.
    this.razorpayKeyId = this.configService.get<string>('RAZORPAY_KEY_ID', '');
    this.razorpayKeySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET', '');
    if (!this.onlinePaymentsEnabled) {
      this.logger.warn('Razorpay keys not set: online payment is off, patients pay at the counter.');
    }
  }

  get onlinePaymentsEnabled() {
    return !!this.razorpayKeyId && !!this.razorpayKeySecret;
  }

  /**
   * 1. Create a real Razorpay order for the held booking.
   * The amount is the doctor's fee from the server, not from the request.
   */
  async createOrder(dto: CreateOrderDto) {
    const { bookingSessionId } = dto;
    const { fee, doctorName } = this.appointmentsService.getSessionForPayment(bookingSessionId);

    if (!this.onlinePaymentsEnabled) {
      return { paymentsEnabled: false, amountInRupees: fee };
    }

    const auth = Buffer.from(`${this.razorpayKeyId}:${this.razorpayKeySecret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: fee * 100, // paise
        currency: 'INR',
        receipt: bookingSessionId.slice(0, 40),
        notes: { bookingSessionId, doctor: doctorName },
      }),
    });
    const order: any = await res.json().catch(() => ({}));
    if (!res.ok || !order?.id) {
      this.logger.error(`Razorpay order creation failed: ${JSON.stringify(order)}`);
      throw new ServiceUnavailableException(
        'Online payment is not available right now. You can choose to pay at the hospital.',
      );
    }

    this.inMemoryPayments.push({
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      bookingSessionId,
      orderId: order.id,
      amount: fee,
      currency: 'INR',
      status: 'CREATED',
      createdAt: new Date().toISOString(),
    });
    this.logger.log(`Created Razorpay order ${order.id} for session ${bookingSessionId} (₹${fee})`);

    return {
      paymentsEnabled: true,
      orderId: order.id,
      amount: order.amount,
      amountInRupees: fee,
      currency: 'INR',
      keyId: this.razorpayKeyId,
      hospitalName: 'Sanjeevani Multispeciality Hospital',
      themeColor: '#0F766E',
    };
  }

  /**
   * 2. Verify the Razorpay HMAC-SHA256 signature. Only a genuine signature passes.
   */
  async verifyPayment(dto: VerifyPaymentDto) {
    const { bookingSessionId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = dto;

    const record = this.inMemoryPayments.find(
      (p) => p.orderId === razorpayOrderId && p.bookingSessionId === bookingSessionId,
    );
    if (!record || !this.onlinePaymentsEnabled) {
      throw new BadRequestException('Payment order not found for this booking.');
    }

    const expected = crypto
      .createHmac('sha256', this.razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const a = Buffer.from(expected);
    const b = Buffer.from(razorpaySignature || '');
    const isValid = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!isValid) {
      record.status = 'FAILED';
      this.logger.warn(`Signature verification failed for order ${razorpayOrderId}`);
      throw new BadRequestException('We could not verify this payment. If money was deducted, please call reception.');
    }

    record.paymentId = razorpayPaymentId;
    record.signature = razorpaySignature;
    record.status = 'VERIFIED';
    this.appointmentsService.markSessionPaid(bookingSessionId, razorpayPaymentId, record.amount);

    await this.auditService.logAction({
      hospitalId: 'hosp-sanjeevani-jalna',
      action: 'PAYMENT_VERIFIED',
      entity: 'PAYMENT',
      entityId: razorpayPaymentId,
      metadata: { orderId: razorpayOrderId, bookingSessionId, amount: record.amount },
    });

    return {
      status: 'VERIFIED',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      bookingSessionId,
      verifiedAt: new Date().toISOString(),
      message: 'Payment received',
    };
  }

  async getAllPayments() {
    return this.inMemoryPayments;
  }
}
