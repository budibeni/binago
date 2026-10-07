import type { RentalContract, ContractFilters, ContractStatus } from '@/features/modules/rental/contracts/types/contract';
import type { Booking } from '@/features/modules/rental/bookings/types/booking';
import { bookingService } from './bookingService';

export const contractService = {
  getContracts: async (filters?: ContractFilters): Promise<RentalContract[]> => {
    const allBookings = await bookingService.getBookings();
    
    // Contracts are Bookings with status >= CONTRACTED
    // To simplify, we include 'CONTRACTED', 'ACTIVE', 'COMPLETED', 'CANCELLED' (if cancelled after contracted, though usually void)
    const validStatuses = ['CONTRACTED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
    let contracts = allBookings.filter(b => validStatuses.includes(b.status) && !!b.contractNumber);
    
    if (filters) {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        contracts = contracts.filter(c => 
          c.contractNumber?.toLowerCase().includes(s) ||
          c.bookingNumber.toLowerCase().includes(s) ||
          c.customerSnapshot?.name.toLowerCase().includes(s)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        contracts = contracts.filter((c) => c.status === filters.status);
      }
    }
    
    return contracts;
  },

  getContractById: async (id: string): Promise<RentalContract | undefined> => {
    return await bookingService.getBookingById(id);
  },

  getAvailableBookingsForContract: async (): Promise<Booking[]> => {
    const allBookings = await bookingService.getBookings();
    // Only BOOKED status can become CONTRACTED
    return allBookings.filter(r => r.status === 'BOOKED');
  },

  createContract: async (data: { bookingId: string; contractDate: string; notes?: string; terms?: string }): Promise<RentalContract> => {
    const booking = await bookingService.getBookingById(data.bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    if (booking.status !== 'BOOKED') {
      throw new Error('Hanya reservasi berstatus BOOKED yang dapat dibuatkan kontrak');
    }

    // Generate contract number (simplified)
    const count = (await bookingService.getBookings()).filter(b => !!b.contractNumber).length + 1;
    const contractNumber = `KTR-2410-${String(count).padStart(3, '0')}`;

    const updated = await bookingService.updateBookingStatus(booking.id, 'CONTRACTED');
    
    return updated as RentalContract;
  },

  updateContractStatus: async (id: string, status: ContractStatus): Promise<RentalContract> => {
    const contract = await bookingService.getBookingById(id);
    if (!contract) throw new Error('Contract not found');
    
    if (status === 'ACTIVE' && contract.status !== 'CONTRACTED') {
      throw new Error('Hanya kontrak DITERBITKAN yang dapat diaktifkan (via Serah Terima)');
    }
    
    if (status === 'COMPLETED' && contract.status !== 'ACTIVE') {
      throw new Error('Hanya kontrak ACTIVE yang dapat diselesaikan (via Pengembalian)');
    }
    
    const updated = await bookingService.updateBookingStatus(id, status);
    return updated as RentalContract;
  },
  
  updateContract: async (id: string, data: Partial<RentalContract>): Promise<RentalContract> => {
    const contract = await bookingService.getBookingById(id);
    if (!contract) throw new Error('Contract not found');
    if (contract.status !== 'CONTRACTED') {
      throw new Error('Hanya kontrak berstatus DITERBITKAN yang dapat diedit');
    }

    const updated = await bookingService.updateBookingStatus(id, data.status as any);
    return updated as RentalContract;
  },
};
