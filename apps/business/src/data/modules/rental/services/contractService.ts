import type { RentalContract, ContractFilters, ContractStatus } from '@/features/modules/rental/contracts/types/contract';
import type { Reservation } from '@/features/modules/rental/reservations/types/reservation';
import { contractRepository } from '../repositories/contractRepository';
import { reservationService } from './reservationService';
import { customerRepository } from '../repositories/customerRepository';
import { rentalVehicleService } from './vehicleService';

const populateRelations = async (contract: RentalContract): Promise<RentalContract> => {
  const result = { ...contract };
  
  try {
    const reservation = await reservationService.getReservationById(contract.reservationId);
    if (reservation) {
      result.reservation = reservation;
    }
    
    const customer = customerRepository.getById(contract.customerId);
    if (customer) {
      result.customer = customer;
    }

    const enrichedVehicle = rentalVehicleService.getRentalVehicleByVehicleId(contract.vehicleId);
    if (enrichedVehicle) {
      result.vehicle = enrichedVehicle;
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
        c.reservationId.toLowerCase().includes(s) ||
        c.customer?.name.toLowerCase().includes(s) ||
        c.vehicle?.coreVehicle?.plateNumber.toLowerCase().includes(s)
      );
    }
    
    return populated;
  },

  getContractById: async (id: string): Promise<RentalContract | undefined> => {
    const contract = await contractRepository.getContractById(id);
    if (!contract) return undefined;
    return populateRelations(contract);
  },

  getAvailableReservationsForContract: async (): Promise<Reservation[]> => {
    // Get all CONFIRMED reservations
    const allReservations = await reservationService.getReservations();
    const reservations = allReservations.filter(r => r.status === 'CONFIRMED');
    
    // Get all contracts to find which reservations already have a contract
    const allContracts = await contractRepository.getContracts();
    const usedReservationIds = new Set(allContracts.map(c => c.reservationId));
    
    // Filter out those that already have a contract
    return reservations.filter(r => !usedReservationIds.has(r.id));
  },

  createContract: async (data: Omit<RentalContract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt' | 'customer' | 'vehicle' | 'reservation'>): Promise<RentalContract> => {
    // 1. Validation - check if reservation is CONFIRMED
    const reservation = await reservationService.getReservationById(data.reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    if (reservation.status !== 'CONFIRMED') {
      throw new Error('Hanya reservasi berstatus CONFIRMED yang dapat dibuatkan kontrak');
    }

    // 2. Duplicate prevention - checked inside repository, but double check here
    const existing = await contractRepository.getContractByReservationId(data.reservationId);
    if (existing) {
      throw new Error('Reservasi ini sudah memiliki kontrak.');
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
      'customerId', 'vehicleId', 'reservationId', 'startDate', 'endDate', 
      'duration', 'rentalType', 'rateType', 'rate', 'subtotal', 
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
