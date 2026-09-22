import { pricingRepository } from '../repositories/pricingRepository';
import type { 
  RentalPricingCategory, 
  RentalRate, 
  PricingCategoryFilters, 
  VehiclePricingAssignment,
  VehicleRateOverride
} from '../../../../features/modules/rental/pricing-category/types/pricing';
import type { RateType } from '../../../../features/modules/rental/bookings/types/booking';
import { rentalVehicleService } from './vehicleService';
import type { RentalVehicle } from '../../../../features/modules/rental/vehicles/types/rentalVehicle';

export interface VehiclePricingSelection {
  vehicle: RentalVehicle;
  status: 'AVAILABLE' | 'CURRENT_GROUP' | 'OTHER_GROUP';
  otherGroupName?: string;
}

class PricingService {
  getPricingCategory(filters?: Partial<PricingCategoryFilters>): RentalPricingCategory[] {
    return pricingRepository.getPricingCategory(filters);
  }

  getPricingCategoryById(id: string): RentalPricingCategory | undefined {
    return pricingRepository.getPricingCategoryById(id);
  }

  createPricingCategory(data: Omit<RentalPricingCategory, 'id' | 'createdAt' | 'updatedAt'>, rates: { rateType: RateType, amount: number }[]): RentalPricingCategory {
    const group = pricingRepository.createPricingCategory(data);
    pricingRepository.setRatesForGroup(group.id, rates);
    return group;
  }

  updatePricingCategory(id: string, data: Partial<RentalPricingCategory>, rates?: { rateType: RateType, amount: number }[]): RentalPricingCategory {
    const group = pricingRepository.updatePricingCategory(id, data);
    if (!group) throw new Error('Grup tarif tidak ditemukan');
    
    if (rates) {
      pricingRepository.setRatesForGroup(id, rates);
    }
    return group;
  }

  deletePricingCategory(id: string): boolean {
    return pricingRepository.deletePricingCategory(id);
  }

  getRatesByGroupId(groupId: string): RentalRate[] {
    return pricingRepository.getRatesByGroupId(groupId);
  }

  getAssignedVehicles(groupId: string): VehiclePricingAssignment[] {
    return pricingRepository.getAssignedVehiclesByGroupId(groupId);
  }

  assignVehiclesToGroup(groupId: string, vehicleIds: string[]) {
    pricingRepository.assignVehiclesToGroup(groupId, vehicleIds);
  }

  updatePricingCategoryVehicles(groupId: string, vehicleIds: string[]) {
    pricingRepository.setVehiclesForGroup(groupId, vehicleIds);
    // Remove independent rates for vehicles that just joined a group
    for (const vid of vehicleIds) {
      pricingRepository.clearVehicleOverrides(vid);
    }
  }

  async getAvailableVehiclesForPricingCategory(groupId: string): Promise<VehiclePricingSelection[]> {
    const allVehicles = await rentalVehicleService.getRentalVehicles();
    const selections: VehiclePricingSelection[] = [];

    for (const vehicle of allVehicles) {
      const currentGroup = pricingRepository.getPricingCategoryForVehicle(vehicle.id);
      
      let status: 'AVAILABLE' | 'CURRENT_GROUP' | 'OTHER_GROUP' = 'AVAILABLE';
      let otherGroupName: string | undefined;

      if (currentGroup) {
        if (currentGroup.id === groupId) {
          status = 'CURRENT_GROUP';
        } else {
          status = 'OTHER_GROUP';
          otherGroupName = currentGroup.name;
        }
      }

      selections.push({
        vehicle,
        status,
        otherGroupName
      });
    }

    return selections;
  }

  removeVehicleFromGroup(vehicleId: string, groupId: string) {
    pricingRepository.removeVehicleFromGroup(vehicleId, groupId);
  }

  getVehicleOverrides(vehicleId: string): VehicleRateOverride[] {
    return pricingRepository.getVehicleOverrides(vehicleId);
  }

  setVehicleOverride(vehicleId: string, rateType: RateType, amount: number): VehicleRateOverride {
    // If set an independent rate, remove from any group
    const currentGroup = pricingRepository.getPricingCategoryForVehicle(vehicleId);
    if (currentGroup) {
      pricingRepository.removeVehicleFromGroup(vehicleId, currentGroup.id);
    }
    return pricingRepository.setVehicleOverride(vehicleId, rateType, amount);
  }

  removeVehicleOverride(vehicleId: string, rateType: RateType) {
    pricingRepository.removeVehicleOverride(vehicleId, rateType);
  }

  /**
   * Resolves the final rate for a vehicle based on priorities:
   * 1. Active Vehicle Rate Override
   * 2. Active Kategori Tarif Rate
   * 3. Throws Error if not found (No fallback to arbitrary values)
   */
  resolveVehicleRate(vehicleId: string, rateType: RateType): number {
    // 1. Check for Active Override
    const override = pricingRepository.getVehicleOverride(vehicleId, rateType);
    if (override && override.status === 'ACTIVE') {
      return override.amount;
    }

    // 2. Check Kategori Tarif
    const group = pricingRepository.getPricingCategoryForVehicle(vehicleId);
    if (group && group.status === 'ACTIVE') {
      const rates = pricingRepository.getRatesByGroupId(group.id);
      const groupRate = rates.find(r => r.rateType === rateType && r.status === 'ACTIVE');
      if (groupRate) {
        return groupRate.amount;
      }
    }

    // 3. No Rate Found - Return Error
    throw new Error(`Tarif sewa tidak ditemukan. Pastikan kendaraan dimasukkan ke dalam Kategori Tarif atau diberikan Tarif Khusus (Override).`);
  }
}

export const pricingService = new PricingService();
