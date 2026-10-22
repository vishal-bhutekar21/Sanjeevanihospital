import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export const RECEIPT_KINDS = ['CONSULTATION', 'REGISTRATION', 'PROCEDURE', 'LAB', 'PHARMACY', 'ADVANCE', 'OTHER'] as const;
export const PAYMENT_MODES = ['CASH', 'UPI', 'CARD', 'ONLINE', 'CHEQUE', 'INSURANCE', 'SCHEME'] as const;
export const GST_RATES = [0, 5, 12, 18, 28] as const;

export class ReceiptItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(1000)
  qty: number;

  /** Rate per unit in rupees */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10000000)
  rate: number;

  /** GST percent for this line. Most hospital services are exempt, so the default is 0. */
  @IsOptional()
  @IsIn(GST_RATES as unknown as number[])
  gstPercent?: number;
}

export class CreateReceiptDto {
  @IsIn(RECEIPT_KINDS as unknown as string[])
  kind: (typeof RECEIPT_KINDS)[number];

  /** A registered patient, or give patientName + patientPhone */
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  patientName?: string;

  @IsOptional()
  @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
  patientPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  patientAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  appointmentCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  doctorName?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ReceiptItemDto)
  items: ReceiptItemDto[];

  /** Discount in rupees on the whole receipt */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discount?: number;

  /** Amount received now, in rupees (can be less than the total) */
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  paid: number;

  @IsIn(PAYMENT_MODES as unknown as string[])
  paymentMode: (typeof PAYMENT_MODES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(80)
  paymentRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class CollectPaymentDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsIn(PAYMENT_MODES as unknown as string[])
  mode: (typeof PAYMENT_MODES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(80)
  ref?: string;
}
