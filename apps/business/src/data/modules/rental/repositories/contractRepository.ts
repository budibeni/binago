import type { RentalContract, ContractFilters } from '@/features/modules/rental/contracts/types/contract';
import { mockContracts } from '../mock/contracts';

let contracts = [...mockContracts];

export const contractRepository = {
  getContracts: async (filters?: ContractFilters): Promise<RentalContract[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let result = [...contracts];
    
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (c) =>
            c.contractNumber.toLowerCase().includes(searchLower) ||
            c.reservationId.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        result = result.filter((c) => c.status === filters.status);
      }
    }
    
    return result;
  },

  getContractById: async (id: string): Promise<RentalContract | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return contracts.find((c) => c.id === id);
  },
  
  getContractByReservationId: async (reservationId: string): Promise<RentalContract | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return contracts.find((c) => c.reservationId === reservationId);
  },

  createContract: async (contract: Omit<RentalContract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt' | 'customer' | 'vehicle' | 'reservation'>): Promise<RentalContract> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Check for duplicate contract by reservation ID
    const existing = contracts.find((c) => c.reservationId === contract.reservationId);
    if (existing) {
      throw new Error('Reservation already has a contract');
    }

    const newId = `ctr-${Date.now()}`;
    const now = new Date();
    
    // Generate contract number KTR-YYMMDD-XXX
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const count = contracts.length + 1;
    const contractNumber = `KTR-${yy}${mm}${dd}-${String(count).padStart(3, '0')}`;

    const newContract: RentalContract = {
      ...contract,
      id: newId,
      contractNumber,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    contracts = [newContract, ...contracts];
    return newContract;
  },

  updateContract: async (id: string, data: Partial<RentalContract>): Promise<RentalContract> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = contracts.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Contract not found');
    
    const updated = {
      ...contracts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    contracts[index] = updated;
    return updated;
  },
};
