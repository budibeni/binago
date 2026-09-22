import { handoverRepository } from '../repositories/handoverRepository';
import { contractService } from './contractService';
import { rentalVehicleService } from './vehicleService';
import type { RentalHandover } from '@/features/modules/rental/handover/types/handover';
import type { RentalContract } from '@/features/modules/rental/contracts/types/contract';
import { customerRepository } from '../repositories/customerRepository';

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

    const enrichedVehicle = await rentalVehicleService.getRentalVehicleByVehicleId(handover.vehicleId);
    if (enrichedVehicle) {
      result.vehicle = enrichedVehicle;
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

  getHandoverByBookingItemId: async (contractId: string, bookingItemId: string): Promise<RentalHandover | undefined> => {
    const handover = await handoverRepository.getHandoverByBookingItemId(contractId, bookingItemId);
    if (!handover) return undefined;
    return populateRelations(handover);
  },

  getEligibleContracts: async (): Promise<RentalContract[]> => {
    const allContracts = await contractService.getContracts();
    const confirmedContracts = allContracts.filter(c => c.status === 'CONFIRMED' || c.status === 'ACTIVE');
    
    const eligibleContracts: RentalContract[] = [];
    for (const contract of confirmedContracts) {
      if (!contract.booking) continue;
      
      let hasPendingItems = false;
      for (const item of contract.booking.items) {
        const existing = await handoverRepository.getHandoverByBookingItemId(contract.id, item.id);
        if (!existing) {
          hasPendingItems = true;
          break;
        }
      }
      
      if (hasPendingItems) {
        eligibleContracts.push(contract);
      }
    }
    
    return eligibleContracts;
  },

  createHandover: async (data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>): Promise<RentalHandover> => {
    // 1. Cek duplikasi
    const existing = await handoverRepository.getHandoverByBookingItemId(data.contractId, data.bookingItemId);
    if (existing) {
      throw new Error('Kendaraan ini sudah diserahterimakan.');
    }

    // 2. Load Contract & Validasi Status
    const contract = await contractService.getContractById(data.contractId);
    if (!contract) {
      throw new Error('Kontrak tidak ditemukan.');
    }
    if (contract.status !== 'CONFIRMED' && contract.status !== 'ACTIVE') {
      throw new Error('Serah terima hanya dapat dilakukan pada kontrak berstatus CONFIRMED atau ACTIVE.');
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
    const item = contract.booking?.items.find(i => i.id === data.bookingItemId);
    const vehicle = await rentalVehicleService.getRentalVehicleByVehicleId(data.vehicleId);
    if (vehicle && vehicle.currentOdometer > data.odometerStart) {
      throw new Error('Nilai odometer tidak boleh lebih kecil dari pembacaan sebelumnya.');
    }

    // 5. Simpan Handover (Snapshot)
    const newHandover = await handoverRepository.createHandover(data);

    // 6. Update Contract Status -> ACTIVE (jika masih CONFIRMED)
    if (contract.status === 'CONFIRMED') {
      await contractService.updateContractStatus(contract.id, 'ACTIVE');
    }

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
