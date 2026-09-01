import { returnRepository } from '../repositories/returnRepository';
import { contractService } from './contractService';
import { handoverRepository } from '../repositories/handoverRepository';
import { rentalVehicleService } from './vehicleService';
import { rentalVehicleRepository } from '../repositories/vehicleRepository';
import { customerRepository } from '../repositories/customerRepository';
import type { RentalReturn } from '@/features/modules/rental/returns/types/return';
import type { RentalContract } from '@/features/modules/rental/contracts/types/contract';

const populateRelations = async (ret: RentalReturn): Promise<RentalReturn> => {
  const result = { ...ret };

  try {
    const contract = await contractService.getContractById(ret.contractId);
    if (contract) result.contract = contract;

    const customer = customerRepository.getById(ret.customerId);
    if (customer) result.customer = customer;

    const enrichedVehicle = rentalVehicleService.getRentalVehicleByVehicleId(ret.vehicleId);
    if (enrichedVehicle) {
      result.vehicle = enrichedVehicle;
    }

    const handover = await handoverRepository.getHandoverByContractId(ret.contractId);
    if (handover) result.handover = handover;
  } catch (error) {
    console.error('Error populating relations for return', error);
  }

  return result;
};

export const returnService = {
  getReturns: async (): Promise<RentalReturn[]> => {
    const returns = await returnRepository.getReturns();
    return Promise.all(returns.map(r => populateRelations(r)));
  },

  getReturnById: async (id: string): Promise<RentalReturn | undefined> => {
    const ret = await returnRepository.getReturnById(id);
    if (!ret) return undefined;
    return populateRelations(ret);
  },

  getReturnByContractId: async (contractId: string): Promise<RentalReturn | undefined> => {
    const ret = await returnRepository.getReturnByContractId(contractId);
    if (!ret) return undefined;
    return populateRelations(ret);
  },

  /** Returns Contract ACTIVE that have a Handover but no Return yet */
  getEligibleContracts: async (): Promise<RentalContract[]> => {
    const allContracts = await contractService.getContracts();
    const activeContracts = allContracts.filter(c => c.status === 'ACTIVE');

    const eligible: RentalContract[] = [];
    for (const contract of activeContracts) {
      const handover = await handoverRepository.getHandoverByContractId(contract.id);
      if (!handover) continue; // Must have handover
      const existing = await returnRepository.getReturnByContractId(contract.id);
      if (!existing) eligible.push(contract);
    }
    return eligible;
  },

  createReturn: async (
    data: Omit<RentalReturn, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RentalReturn> => {
    // 1. Contract exists
    const contract = await contractService.getContractById(data.contractId);
    if (!contract) throw new Error('Kontrak tidak ditemukan.');

    // 2. Contract must be ACTIVE
    if (contract.status !== 'ACTIVE') {
      throw new Error('Kontrak ini belum dapat diproses untuk pengembalian.');
    }

    // 3. Contract must have Handover
    const handover = await handoverRepository.getHandoverByContractId(data.contractId);
    if (!handover) throw new Error('Kontrak ini belum memiliki data serah terima.');

    // 4. No duplicate Return
    const existing = await returnRepository.getReturnByContractId(data.contractId);
    if (existing) throw new Error('Kontrak ini sudah memiliki data pengembalian.');

    // 5. Odometer validation
    if (data.odometerEnd < handover.odometerStart) {
      throw new Error('Odometer akhir tidak boleh lebih kecil dari odometer awal.');
    }

    // 6. Create Return record
    const newReturn = await returnRepository.createReturn(data);

    // 7. Contract ACTIVE → COMPLETED
    await contractService.updateContractStatus(data.contractId, 'COMPLETED');

    // 8. Rental Vehicle RENTED → READY
    const vehicleProfile = rentalVehicleRepository.getByVehicleId(data.vehicleId);
    if (vehicleProfile) {
      rentalVehicleService.updateRentalVehicle(vehicleProfile.id, {
        status: 'READY',
        currentOdometer: data.odometerEnd,
      });
    }

    return populateRelations(newReturn);
  },
};
