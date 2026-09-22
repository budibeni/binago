import type { RentalContract, ContractFilters, ContractStatus } from '@/features/modules/rental/contracts/types/contract';
import type { Booking } from '@/features/modules/rental/bookings/types/booking';
import { contractRepository } from '../repositories/contractRepository';
import { bookingService } from './bookingService';
import { customerRepository } from '../repositories/customerRepository';
import { rentalVehicleService } from './vehicleService';

const populateRelations = async (contract: RentalContract): Promise<RentalContract> => {
  const result = { ...contract };
  
  try {
    const booking = await bookingService.getBookingById(contract.bookingId);
    if (booking) {
      result.booking = booking;
    }
    
    const customer = customerRepository.getById(contract.customerId);
    if (customer) {
      result.customer = customer;
    }
  } catch (error) {
    console.error('Error populating relations for contract', error);
  }
  
  return result;
};

export const contractService = {
  getContracts: async (filters?: ContractFilters): Promise<RentalContract[]> => {
    const contracts = await contractRepository.getContracts(filters);
    
    // In a real app, populate on DB query. Here we do it sequentially or Promise.all
    const populated = await Promise.all(contracts.map(c => populateRelations(c)));
    
    // If there's a search text, we can also filter by populated customer/vehicle name
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      return populated.filter(c => 
        c.contractNumber.toLowerCase().includes(s) ||
        c.bookingId.toLowerCase().includes(s) ||
        c.customer?.name.toLowerCase().includes(s)
      );
    }
    
    return populated;
  },

  getContractById: async (id: string): Promise<RentalContract | undefined> => {
    const contract = await contractRepository.getContractById(id);
    if (!contract) return undefined;
    return populateRelations(contract);
  },

  getAvailableBookingsForContract: async (): Promise<Booking[]> => {
    // Get all CONFIRMED bookings
    const allBookings = await bookingService.getBookings();
    const bookings = allBookings.filter(r => r.status === 'CONFIRMED');
    
    // Get all contracts to find which bookings already have a contract
    const allContracts = await contractRepository.getContracts();
    const usedBookingIds = new Set(allContracts.map(c => c.bookingId));
    
    // Filter out those that already have a contract
    return bookings.filter(r => !usedBookingIds.has(r.id));
  },

  createContract: async (data: Omit<RentalContract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt' | 'customer' | 'booking'>): Promise<RentalContract> => {
    // 1. Validation - check if booking is CONFIRMED
    const booking = await bookingService.getBookingById(data.bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    if (booking.status !== 'CONFIRMED') {
      throw new Error('Hanya reservasi berstatus CONFIRMED yang dapat dibuatkan kontrak');
    }

    // 2. Duplicate prevention - checked inside repository, but double check here
    const existing = await contractRepository.getContractByBookingId(data.bookingId);
    if (existing) {
      throw new Error('Booking ini sudah memiliki kontrak.');
    }

    // 3. Create the contract
    const newContract = await contractRepository.createContract({
      ...data,
      status: 'DRAFT', // Always start as DRAFT
    });
    
    return populateRelations(newContract);
  },

  updateContractStatus: async (id: string, status: ContractStatus): Promise<RentalContract> => {
    const contract = await contractRepository.getContractById(id);
    if (!contract) throw new Error('Contract not found');
    
    // Business rule validations
    if (status === 'CONFIRMED' && contract.status !== 'DRAFT') {
      throw new Error('Hanya kontrak DRAFT yang dapat dikonfirmasi');
    }
    
    if (status === 'ACTIVE' && contract.status !== 'CONFIRMED') {
      throw new Error('Hanya kontrak CONFIRMED yang dapat diaktifkan (via Serah Terima)');
    }
    
    if (status === 'COMPLETED' && contract.status !== 'ACTIVE') {
      throw new Error('Hanya kontrak ACTIVE yang dapat diselesaikan (via Pengembalian)');
    }
    
    // Transition
    const updated = await contractRepository.updateContract(id, { status });
    return populateRelations(updated);
  },
  
  updateContract: async (id: string, data: Partial<RentalContract>): Promise<RentalContract> => {
    const contract = await contractRepository.getContractById(id);
    if (!contract) throw new Error('Contract not found');

    if (contract.status !== 'DRAFT') {
      throw new Error('Hanya kontrak berstatus DRAFT yang dapat diedit');
    }

    // Protect certain fields from being overridden directly from UI
    const protectedFields = [
      'customerId', 'bookingId', 
      'rentalType', 'rateType', 
      'totalAmount', 'deposit', 'remainingAmount', 'status'
    ];

    const safeData = { ...data };
    for (const field of protectedFields) {
      delete (safeData as any)[field];
    }

    const updated = await contractRepository.updateContract(id, safeData);
    return populateRelations(updated);
  },
};
