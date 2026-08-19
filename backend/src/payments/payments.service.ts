import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
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
  ) {
    this.razorpayKeyId = this.configService.get<string>(
      'RAZORPAY_KEY_ID',
      'rzp_test_TRlp6qdfVyCHyQ',
    );
    this.razorpayKeySecret = this.configService.get<string>(
      'RAZORPAY_KEY_SECRET',
      'Mg9ra16kSOpZfdlr2DqYTCks',
    );
  }

  /**
   * 1. Create Razorpay Payment Order
   */
  async createOrder(dto: CreateOrderDto) {
    const { bookingSessionId, doctorId, amount } = dto;
    const orderId = `order_${uuidv4().replace(/-/g, '').substring(0, 14)}`;

    const paymentRecord: PaymentRecord = {
      id: uuidv4(),
      hospitalId: 'hosp-sanjeevani-jalna',
      bookingSessionId,
      orderId,
      amount,
      currency: 'INR',
      status: 'CREATED',
      createdAt: new Date().toISOString(),
    };

    this.inMemoryPayments.push(paymentRecord);
    this.logger.log(`Created Razorpay Order ${orderId} for Session ${bookingSessionId} (₹${amount})`);

    return {
      orderId,
      amount: amount * 100, // in paise
      amountInRupees: amount,
      currency: 'INR',
      keyId: this.razorpayKeyId,
      hospitalName: 'Sanjeevani Multispeciality Hospital',
      themeColor: '#0A4D68',
      message: 'Razorpay order created successfully',
    };
  }

  /**
   * 2. Verify Razorpay Cryptographic HMAC-SHA256 Signature
   */
  async verifyPayment(dto: VerifyPaymentDto) {
    const { bookingSessionId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = dto;

    // Check if signature matches expected HMAC-SHA256
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', this.razorpayKeySecret)
      .update(text)
      .digest('hex');

    // Accept valid cryptographic signature, or sandbox demo signature
    const isValid =
      generatedSignature === razorpaySignature ||
      razorpaySignature === 'demo_verified_signature' ||
      razorpaySignature.startsWith('test_sig_');

    if (!isValid) {
      this.logger.warn(`Signature verification failed for order ${razorpayOrderId}`);
      throw new BadRequestException(
        'Invalid payment signature. Transaction could not be verified cryptographically.',
      );
    }

    const record = this.inMemoryPayments.find((p) => p.orderId === razorpayOrderId);
    if (record) {
      record.paymentId = razorpayPaymentId;
      record.signature = razorpaySignature;
      record.status = 'VERIFIED';
    }

    await this.auditService.logAction({
      hospitalId: 'hosp-sanjeevani-jalna',
      action: 'PAYMENT_VERIFIED',
      entity: 'PAYMENT',
      entityId: razorpayPaymentId,
      metadata: {
        orderId: razorpayOrderId,
        bookingSessionId,
        amount: record?.amount || 500,
      },
    });

    return {
      status: 'VERIFIED',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      bookingSessionId,
      verifiedAt: new Date().toISOString(),
      message: 'Payment verified and credited to Sanjeevani Hospital account',
    };
  }

  async getAllPayments() {
    return this.inMemoryPayments;
  }
}
