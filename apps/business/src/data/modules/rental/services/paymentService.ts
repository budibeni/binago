import type { RentalPayment, PaymentFilters, PaymentStatus } from '@/features/modules/rental/payments/types/payment';
import { paymentRepository } from '../repositories/paymentRepository';
import { bookingService } from './bookingService';
import { customerRepository } from '../repositories/customerRepository';

const populateRelations = async (payment: RentalPayment): Promise<RentalPayment> => {
  const result = { ...payment };
  try {
    const booking = await bookingService.getBookingById(payment.bookingId);
    if (booking) result.booking = booking;
    const customer = customerRepository.getById(payment.customerId);
    if (customer) result.customer = customer;
  } catch (err) {
    console.error('Error populating payment relations', err);
  }
  return result;
};

export const paymentService = {
  getPayments: async (filters?: PaymentFilters): Promise<RentalPayment[]> => {
    const payments = await paymentRepository.getPayments(filters);
    return Promise.all(payments.map(populateRelations));
  },

  getPaymentsByBookingId: async (bookingId: string): Promise<RentalPayment[]> => {
    const payments = await paymentRepository.getPayments({ bookingId });
    return Promise.all(payments.map(populateRelations));
  },

  getPaymentById: async (id: string): Promise<RentalPayment | undefined> => {
    const payment = await paymentRepository.getPaymentById(id);
    if (!payment) return undefined;
    return populateRelations(payment);
  },

  createPayment: async (
    data: Omit<RentalPayment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RentalPayment> => {
    // Validate booking exists
    const booking = await bookingService.getBookingById(data.bookingId);
    if (!booking) throw new Error('Booking tidak ditemukan');
    if (booking.status === 'CANCELLED') throw new Error('Tidak dapat menambah pembayaran pada booking yang dibatalkan');
    if (booking.status === 'COMPLETED' && data.type !== 'REFUND') throw new Error('Reservasi sudah selesai. Hanya refund yang diizinkan');

    const payment = await paymentRepository.createPayment(data);
    return populateRelations(payment);
  },

  verifyPayment: async (id: string, verifiedBy: string = 'Budi Beni'): Promise<RentalPayment> => {
    const payment = await paymentRepository.getPaymentById(id);
    if (!payment) throw new Error('Pembayaran tidak ditemukan');
    if (payment.status === 'VERIFIED') throw new Error('Pembayaran sudah terverifikasi');
    if (payment.status === 'CANCELLED') throw new Error('Pembayaran sudah dibatalkan');

    const updated = await paymentRepository.updatePaymentStatus(id, 'VERIFIED', verifiedBy);
    return populateRelations(updated);
  },

  cancelPayment: async (id: string): Promise<RentalPayment> => {
    const payment = await paymentRepository.getPaymentById(id);
    if (!payment) throw new Error('Pembayaran tidak ditemukan');
    if (payment.status === 'VERIFIED') throw new Error('Pembayaran terverifikasi tidak dapat dibatalkan');

    const updated = await paymentRepository.updatePaymentStatus(id, 'CANCELLED');
    return populateRelations(updated);
  },

  deletePayment: async (id: string): Promise<void> => {
    return paymentRepository.deletePayment(id);
  },

  getBookingPaymentSummary: async (bookingId: string) => {
    return paymentRepository.getTotalByBookingId(bookingId);
  },

  isDepositVerified: async (bookingId: string): Promise<boolean> => {
    const summary = await paymentRepository.getTotalByBookingId(bookingId);
    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) return false;
    // Deposit is verified if depositPaid >= booking.deposit
    return summary.depositPaid >= booking.deposit;
  },
};
