import { contractService } from './contractService';
import { rentalVehicleService } from './vehicleService';
import type { RentalHandover } from '@/features/modules/rental/handover/types/handover';
import type { RentalContract } from '@/features/modules/rental/contracts/types/contract';
import { customerRepository } from '../repositories/customerRepository';
import { bookingService } from './bookingService';
import type { BookingItem } from '@/features/modules/rental/bookings/types/booking';

// Helper to map BookingItem to RentalHandover format for UI compatibility
const mapBookingItemToHandover = (contract: RentalContract, item: BookingItem): RentalHandover => {
  return {
    id: `hnd-${item.id}`,
    handoverNumber: item.handoverNumber || `ST-${contract.contractNumber}-${item.id.slice(-4)}`,
    contractId: contract.id,
    bookingItemId: item.id,
    customerId: contract.customerId,
    vehicleId: item.vehicleId,
    itemStatus: item.itemStatus,
    handoverAt: item.handoverDate || new Date().toISOString(),
    handoverLatitude: item.handoverLocation?.latitude || 0,
    handoverLongitude: item.handoverLocation?.longitude || 0,
    handoverAddress: item.handoverLocation?.address,
    odometerStart: item.handoverOdometer || 0,
    fuelLevel: (item.handoverCondition?.fuelLevel as any) || 'FULL',
    vehicleCondition: (item.handoverCondition?.vehicleCondition as any) || 'GOOD',
    equipmentChecklist: item.handoverCondition?.equipmentChecklist || {},
    notes: item.handoverCondition?.notes,
    staffId: item.handoverBy || '',
    staffName: item.handoverCondition?.staffName,
    createdAt: item.handoverDate,
    updatedAt: item.handoverDate,
    // Add populated relations if present in contract
    contract,
    customer: contract.customer || customerRepository.getById(contract.customerId),
    vehicle: item.vehicle,
    vehicleSnapshot: item.vehicleSnapshot
  } as RentalHandover;
};

export const handoverService = {
  getHandovers: async (): Promise<RentalHandover[]> => {
    const contracts = await contractService.getContracts();
    const handovers: RentalHandover[] = [];
    
    for (const contract of contracts) {
      if (contract.status === 'CONTRACTED' || contract.status === 'ACTIVE' || contract.status === 'COMPLETED') {
        for (const item of contract.items) {
          if (item.handoverNumber) {
            let handover = mapBookingItemToHandover(contract, item);
            if (!handover.vehicle) {
              const enrichedVehicle = await rentalVehicleService.getRentalVehicleByVehicleId(item.vehicleId);
              if (enrichedVehicle) handover.vehicle = enrichedVehicle;
            }
            handovers.push(handover);
          }
        }
      }
    }
    return handovers;
  },

  getHandoverById: async (id: string): Promise<RentalHandover | undefined> => {
    // id is constructed as `hnd-${item.id}`
    const all = await handoverService.getHandovers();
    return all.find(h => h.id === id);
  },

  getHandoverByBookingItemId: async (contractId: string, bookingItemId: string): Promise<RentalHandover | undefined> => {
    const contract = await contractService.getContractById(contractId);
    if (!contract) return undefined;
    const item = contract.items.find(i => i.id === bookingItemId);
    if (!item || !item.handoverNumber) return undefined;
    
    let handover = mapBookingItemToHandover(contract, item);
    if (!handover.vehicle) {
      const enrichedVehicle = await rentalVehicleService.getRentalVehicleByVehicleId(item.vehicleId);
      if (enrichedVehicle) handover.vehicle = enrichedVehicle;
    }
    return handover;
  },

  getEligibleContracts: async (): Promise<RentalContract[]> => {
    const allContracts = await contractService.getContracts();
    const confirmedContracts = allContracts.filter(c => c.status === 'CONTRACTED' || c.status === 'ACTIVE');
    
    const eligibleContracts: RentalContract[] = [];
    for (const contract of confirmedContracts) {
      if (!contract) continue;
      
      const hasPendingItems = contract.items.some(item => !item.handoverNumber);
      if (hasPendingItems) {
        eligibleContracts.push(contract);
      }
    }
    
    return eligibleContracts;
  },

  createHandover: async (data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt' | 'handoverNumber'> & { handoverNumber?: string }): Promise<RentalHandover> => {
    const contract = await contractService.getContractById(data.contractId);
    if (!contract) throw new Error('Kontrak tidak ditemukan.');
    if (contract.status !== 'CONTRACTED' && contract.status !== 'ACTIVE') {
      throw new Error('Serah terima hanya dapat dilakukan pada kontrak berstatus CONTRACTED atau ACTIVE.');
    }

    const item = contract.items.find(i => i.id === data.bookingItemId);
    if (!item) throw new Error('Booking item tidak ditemukan.');
    if (item.handoverNumber) throw new Error('Kendaraan ini sudah diserahterimakan.');

    if (!data.handoverLatitude || !data.handoverLongitude) throw new Error('Lokasi serah terima wajib diisi.');
    if (data.odometerStart == null || isNaN(data.odometerStart)) throw new Error('Odometer wajib diisi dengan angka valid.');

    const vehicle = await rentalVehicleService.getRentalVehicleByVehicleId(data.vehicleId);
    if (vehicle && vehicle.currentOdometer > data.odometerStart) {
      throw new Error('Nilai odometer tidak boleh lebih kecil dari pembacaan sebelumnya.');
    }

    // UPDATE BookingItem with Handover data
    const itemUpdates: Partial<BookingItem> = {
      itemStatus: 'IN_USE',
      handoverNumber: data.handoverNumber || `ST-${Date.now()}`,
      handoverDate: data.handoverAt || new Date().toISOString(),
      handoverBy: data.staffId,
      handoverOdometer: data.odometerStart,
      handoverLocation: {
        latitude: data.handoverLatitude,
        longitude: data.handoverLongitude,
        address: data.handoverAddress
      },
      handoverCondition: {
        fuelLevel: data.fuelLevel,
        vehicleCondition: data.vehicleCondition,
        equipmentChecklist: data.equipmentChecklist,
        notes: data.notes,
        staffName: data.staffName
      }
    };

    await bookingService.updateBookingItem(contract.id, item.id, itemUpdates);

    if (contract.status === 'CONTRACTED') {
      await contractService.updateContractStatus(contract.id, 'ACTIVE');
    }

    if (vehicle) {
      rentalVehicleService.updateRentalVehicle(vehicle.id, {
        status: 'RENTED',
        conditionNotes: data.vehicleCondition === 'NEEDS_REPAIR' ? 'Perlu perbaikan (Serah Terima)' : '',
        currentOdometer: data.odometerStart,
      });
    }

    // Refresh contract to return updated handover map
    const updatedContract = await contractService.getContractById(contract.id);
    const updatedItem = updatedContract!.items.find(i => i.id === item.id)!;
    
    let resultHandover = mapBookingItemToHandover(updatedContract!, updatedItem);
    if (vehicle) resultHandover.vehicle = vehicle;
    
    return resultHandover;
  },
};

