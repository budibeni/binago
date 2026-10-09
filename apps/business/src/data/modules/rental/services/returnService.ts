import { contractService } from './contractService';
import { rentalVehicleService } from './vehicleService';
import { rentalVehicleRepository } from '../repositories/vehicleRepository';
import type { ReturnPayload } from '@/features/modules/rental/returns/types/return';
import type { RentalContract } from '@/features/modules/rental/contracts/types/contract';
import type { BookingItem } from '@/features/modules/rental/bookings/types/booking';
import { v4 as uuidv4 } from 'uuid';
import { mockBookings } from '../mock/bookings';

export const returnService = {
  // Returns Contract ACTIVE/COMPLETED that have items IN_USE
  getEligibleContracts: async (): Promise<RentalContract[]> => {
    const allContracts = await contractService.getContracts();
    const activeContracts = allContracts.filter(c => c.status === 'ACTIVE' || c.status === 'COMPLETED');

    const eligible: RentalContract[] = [];
    for (const contract of activeContracts) {
      if (!contract) continue;
      
      const hasPendingItems = contract.items?.some(i => i.itemStatus === 'IN_USE');
      if (hasPendingItems) eligible.push(contract);
    }
    return eligible;
  },

  // Returns all items that have been RETURNED (for the list view)
  getReturnedItemsGroupedByContract: async () => {
    const allContracts = await contractService.getContracts();
    const groups: any[] = [];
    
    for (const contract of allContracts) {
      const returnedItems = (contract.items || []).filter(i => i.itemStatus === 'RETURNED');
      if (returnedItems.length > 0) {
        groups.push({
          id: contract.id, // Group by contract ID
          contractId: contract.id,
          contract: contract,
          customer: contract.customer,
          // Use the latest returnDate for the group summary
          returnedAt: Math.max(...returnedItems.map(i => new Date(i.returnDate || '').getTime())),
          returnAddress: returnedItems[0]?.returnLocation?.address,
          returnLatitude: returnedItems[0]?.returnLocation?.latitude,
          returnLongitude: returnedItems[0]?.returnLocation?.longitude,
          status: contract.items.every(i => i.itemStatus === 'RETURNED' || i.itemStatus === 'CANCELLED') ? 'COMPLETED' : 'PARTIAL',
          items: returnedItems
        });
      }
    }
    return groups.sort((a, b) => b.returnedAt - a.returnedAt);
  },

  createReturn: async (data: ReturnPayload): Promise<BookingItem> => {
    // 1. Contract exists
    const contract = await contractService.getContractById(data.contractId);
    if (!contract) throw new Error('Kontrak tidak ditemukan.');

    // 2. Contract must be ACTIVE or COMPLETED
    if (contract.status !== 'ACTIVE' && contract.status !== 'COMPLETED') {
      throw new Error('Kontrak ini belum dapat diproses untuk pengembalian.');
    }

    // 3. Find BookingItem
    const itemIndex = mockBookings.findIndex(b => b.id === data.contractId);
    if (itemIndex === -1) throw new Error('Booking tidak ditemukan.');
    
    const booking = mockBookings[itemIndex];
    const targetItemIndex = booking.items.findIndex(i => i.id === data.bookingItemId);
    if (targetItemIndex === -1) throw new Error('Item kendaraan tidak ditemukan.');
    
    const targetItem = booking.items[targetItemIndex];

    // 4. Validate Status and Odometer
    if (targetItem.itemStatus !== 'IN_USE') {
      throw new Error('Kendaraan ini tidak dalam status IN_USE.');
    }
    if ((targetItem.handoverOdometer || 0) > data.returnOdometer) {
      throw new Error('Odometer akhir tidak boleh lebih kecil dari odometer awal.');
    }

    // 5. Update BookingItem
    const updatedItem: BookingItem = {
      ...targetItem,
      itemStatus: 'RETURNED',
      returnNumber: `RET-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      returnDate: data.returnDate,
      returnLocation: data.returnLocation,
      returnOdometer: data.returnOdometer,
      returnCondition: data.returnCondition,
      extraCharges: data.extraCharges,
      lateFee: data.lateFee,
      damageFee: data.damageFee,
    };
    
    mockBookings[itemIndex].items[targetItemIndex] = updatedItem;

    // 6. Check if all items are returned, if so mark contract as COMPLETED
    let allReturned = true;
    for (const item of mockBookings[itemIndex].items || []) {
      if (item.itemStatus !== 'RETURNED' && item.itemStatus !== 'CANCELLED') {
        allReturned = false;
        break;
      }
    }

    if (allReturned && mockBookings[itemIndex].status === 'ACTIVE') {
      await contractService.updateContractStatus(data.contractId, 'COMPLETED');
    }

    // 7. Rental Vehicle RENTED → READY
    const vehicleProfile = rentalVehicleRepository.getByVehicleId(data.vehicleId);
    if (vehicleProfile) {
      rentalVehicleService.updateRentalVehicle(vehicleProfile.id, {
        status: 'READY',
        currentOdometer: data.returnOdometer,
      });
    }

    return updatedItem;
  },
};
