import type { Booking } from '../../bookings/types/booking';
import type { Customer } from '../../customers/types/customer';

export type PaymentType =
  | 'BOOKING_FEE'
  | 'DOWN_PAYMENT'
  | 'DEPOSIT'
  | 'RENTAL_PAYMENT'
  | 'ADDITIONAL_FEE'
  | 'REFUND';

export type PaymentMethod =
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'DEBIT_CARD'
  | 'CREDIT_CARD'
  | 'QRIS'
  | 'OTHER';

export type PaymentStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'CANCELLED';

export type PaymentStage =
  | 'BOOKING'
  | 'CONTRACT'
  | 'HANDOVER'
  | 'RETURN'
  | 'MANUAL';

export interface RentalPayment {
  id: string;
  bookingId: string;
  customerId: string;

  type: PaymentType;
  method: PaymentMethod;
  status: PaymentStatus;
  stage: PaymentStage;

  amount: number;
  referenceNumber?: string;

  paidAt: string;
  verifiedAt?: string;
  verifiedBy?: string;

  notes?: string;
  staffId: string;
  staffName: string;

  createdAt: string;
  updatedAt: string;

  // Populated relations
  booking?: Booking;
  customer?: Customer;
}

export type PaymentStatusFilter = 'all' | PaymentStatus;
export type PaymentTypeFilter = 'all' | PaymentType;

export interface PaymentFilters {
  bookingId?: string;
  customerId?: string;
  status?: PaymentStatusFilter;
  type?: PaymentTypeFilter;
  search?: string;
}

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  BOOKING_FEE: 'Biaya Booking',
  DOWN_PAYMENT: 'Uang Muka (DP)',
  DEPOSIT: 'Deposit / Jaminan',
  RENTAL_PAYMENT: 'Pembayaran Sewa',
  ADDITIONAL_FEE: 'Biaya Tambahan',
  REFUND: 'Refund / Pengembalian',
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Tunai',
  BANK_TRANSFER: 'Transfer Bank',
  DEBIT_CARD: 'Kartu Debit',
  CREDIT_CARD: 'Kartu Kredit',
  QRIS: 'QRIS',
  OTHER: 'Lainnya',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: 'Menunggu Verifikasi',
  VERIFIED: 'Terverifikasi',
  CANCELLED: 'Dibatalkan',
};

export const PAYMENT_STAGE_LABEL: Record<PaymentStage, string> = {
  BOOKING: 'Booking',
  CONTRACT: 'Kontrak',
  HANDOVER: 'Serah Terima',
  RETURN: 'Pengembalian',
  MANUAL: 'Manual',
};
