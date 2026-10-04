import type { RentalPayment, PaymentFilters, PaymentStatus } from '@/features/modules/rental/payments/types/payment';
import { mockPayments } from '../mock/payments';

let payments = [...mockPayments];

export const paymentRepository = {
  getPayments: async (filters?: PaymentFilters): Promise<RentalPayment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let result = [...payments];

    if (filters?.bookingId) {
      result = result.filter((p) => p.bookingId === filters.bookingId);
    }
    if (filters?.customerId) {
      result = result.filter((p) => p.customerId === filters.customerId);
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters?.type && filters.type !== 'all') {
      result = result.filter((p) => p.type === filters.type);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.id.toLowerCase().includes(s) ||
          p.referenceNumber?.toLowerCase().includes(s) ||
          p.notes?.toLowerCase().includes(s)
      );
    }

    // Sort by paidAt descending
    return result.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
  },

  getPaymentById: async (id: string): Promise<RentalPayment | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return payments.find((p) => p.id === id);
  },

  createPayment: async (
    data: Omit<RentalPayment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RentalPayment> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newPayment: RentalPayment = {
      ...data,
      id: `pay-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    payments = [newPayment, ...payments];
    return newPayment;
  },

  updatePayment: async (id: string, data: Partial<RentalPayment>): Promise<RentalPayment> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const index = payments.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Payment not found');

    const updated = {
      ...payments[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    payments[index] = updated;
    return updated;
  },

  updatePaymentStatus: async (id: string, status: PaymentStatus, verifiedBy?: string): Promise<RentalPayment> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const index = payments.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Payment not found');

    const updated = {
      ...payments[index],
      status,
      verifiedAt: status === 'VERIFIED' ? new Date().toISOString() : payments[index].verifiedAt,
      verifiedBy: status === 'VERIFIED' ? verifiedBy : payments[index].verifiedBy,
      updatedAt: new Date().toISOString(),
    };
    payments[index] = updated;
    return updated;
  },

  deletePayment: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = payments.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Payment not found');
    const payment = payments[index];
    if (payment.status === 'VERIFIED') throw new Error('Pembayaran terverifikasi tidak dapat dihapus');
    payments = payments.filter((p) => p.id !== id);
  },

  getTotalByBookingId: async (bookingId: string): Promise<{
    totalPaid: number;
    totalPending: number;
    totalRefund: number;
    depositPaid: number;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const bookingPayments = payments.filter((p) => p.bookingId === bookingId);

    const totalPaid = bookingPayments
      .filter((p) => p.status === 'VERIFIED' && p.type !== 'REFUND')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = bookingPayments
      .filter((p) => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalRefund = bookingPayments
      .filter((p) => p.type === 'REFUND' && p.status === 'VERIFIED')
      .reduce((sum, p) => sum + p.amount, 0);

    const depositPaid = bookingPayments
      .filter((p) => p.type === 'DEPOSIT' && p.status === 'VERIFIED')
      .reduce((sum, p) => sum + p.amount, 0);

    return { totalPaid, totalPending, totalRefund, depositPaid };
  },
};
