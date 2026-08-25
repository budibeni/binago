import { handoverRepository } from '../repositories/handoverRepository';
import { contractService } from './contractService';
import { rentalVehicleService } from './vehicleService';
import type { RentalHandover } from '@/features/modules/rental/handover/types/handover';
import { customerRepository } from '../repositories/customerRepository';
import { rentalVehicleRepository } from '../repositories/vehicleRepository';
import { vehicleRepository as coreVehicleRepository } from '@/data/repositories/vehicleRepository';

const populateRelations = async (handover: RentalHandover): Promise<RentalHandover> => {
  const result = { ...handover };
  
  try {
    const contract = await contractService.getContractById(handover.contractId);
    if (contract) {
      result.contract = contract;
    }
    
    const customer = customerRepository.getById(handover.customerId);
    if (customer) {
      result.customer = customer;
    }

    const vehicleProfile = rentalVehicleRepository.getById(handover.vehicleId);
    if (vehicleProfile) {
      const coreVehicles = coreVehicleRepository.getAll();
      const core = coreVehicles.find((v: any) => v.id === vehicleProfile.vehicleId);
      if (core) {
        result.vehicle = { ...vehicleProfile, coreVehicle: core, isComplete: true };
      }
    }
  } catch (error) {
    console.error('Error populating relations for handover', error);
  }
  
  return result;
};

export const handoverService = {
  getHandovers: async (): Promise<RentalHandover[]> => {
    const handovers = await handoverRepository.getHandovers();
    const populated = await Promise.all(handovers.map(h => populateRelations(h)));
    return populated;
  },

  getHandoverById: async (id: string): Promise<RentalHandover | undefined> => {
    const handover = await handoverRepository.getHandoverById(id);
    if (!handover) return undefined;
    return populateRelations(handover);
  },

  getHandoverByContractId: async (contractId: string): Promise<RentalHandover | undefined> => {
    const handover = await handoverRepository.getHandoverByContractId(contractId);
    if (!handover) return undefined;
    return populateRelations(handover);
  },

  createHandover: async (data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>): Promise<RentalHandover> => {
    // 1. Cek duplikasi
    const existing = await handoverRepository.getHandoverByContractId(data.contractId);
    if (existing) {
      throw new Error('Kontrak ini sudah memiliki serah terima yang aktif.');
    }

    // 2. Load Contract & Validasi Status
    const contract = await contractService.getContractById(data.contractId);
    if (!contract) {
      throw new Error('Kontrak tidak ditemukan.');
    }
    if (contract.status !== 'CONFIRMED') {
      throw new Error('Serah terima hanya dapat dilakukan pada kontrak berstatus CONFIRMED.');
    }

    // 3. Validasi Lokasi
    if (!data.handoverLatitude || !data.handoverLongitude) {
      throw new Error('Lokasi serah terima wajib diisi.');
    }

    // 4. Validasi Odometer
    if (data.odometerStart == null || isNaN(data.odometerStart)) {
      throw new Error('Odometer wajib diisi dengan angka valid.');
    }

    // Validation against previous odometer
    const vehicle = contract.vehicle;
    if (vehicle && vehicle.currentOdometer > data.odometerStart) {
      throw new Error('Nilai odometer tidak boleh lebih kecil dari pembacaan sebelumnya.');
    }

    // 5. Simpan Handover (Snapshot)
    const newHandover = await handoverRepository.createHandover(data);

    // 6. Update Contract Status -> ACTIVE
    await contractService.updateContractStatus(contract.id, 'ACTIVE');

    // 7. Update Rental Vehicle Status -> RENTED
    if (vehicle) {
      rentalVehicleService.updateRentalVehicle(vehicle.id, {
        status: 'RENTED',
        condition: data.vehicleCondition,
        currentOdometer: data.odometerStart,
        rentalStartOdometer: data.odometerStart,
      });
    }

    return populateRelations(newHandover);
  },
};
