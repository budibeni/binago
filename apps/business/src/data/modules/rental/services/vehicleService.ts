import type { RentalVehicle, RentalVehicleProfile, RentalVehicleFilters } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';
import { rentalVehicleRepository } from '../repositories/vehicleRepository';
import { vehicleService as coreVehicleService } from '@/data/services/vehicleService';
import { rentalCustomerService } from './customerService';
import { pricingService } from './pricingService';

class RentalVehicleService {
  private isProfileComplete(profile: RentalVehicleProfile): boolean {
    return !!(
      profile.rateOverrideDaily || profile.categoryId
    ) && !!(profile.completenessChecklist?.stnkOriginal);
  }

  private enrichProfile(profile: RentalVehicleProfile): RentalVehicle | null {
    const coreVehicle = coreVehicleService.getVehicleById(profile.vehicleId);
    if (!coreVehicle) return null;

    let categoryName: string | undefined = undefined;
    let dailyRate = profile.rateOverrideDaily || 0;
    if (profile.categoryId) {
      const category = pricingService.getPricingCategory({ status: 'ACTIVE' }).find(c => c.id === profile.categoryId);
      if (category) {
        categoryName = category.name;
        const rates = pricingService.getRatesByGroupId(category.id);
        const daily = rates.find(r => r.rateType === 'DAILY');
        if (daily) {
          dailyRate = daily.amount;
        }
      }
    }

    return {
      ...profile,
      coreVehicle,
      isComplete: this.isProfileComplete(profile),
      categoryName,
      dailyRate,
    };
  }

  getRentalVehicles(filters?: Partial<RentalVehicleFilters>): RentalVehicle[] {
    const profiles = rentalVehicleRepository.getAll();
    let enrichedVehicles = profiles
      .map(p => this.enrichProfile(p))
      .filter((v): v is RentalVehicle => v !== null);

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        enrichedVehicles = enrichedVehicles.filter(v => v.status === filters.status);
      }
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        enrichedVehicles = enrichedVehicles.filter(v => 
          v.coreVehicle.plateNumber.toLowerCase().includes(query) ||
          v.coreVehicle.brand.toLowerCase().includes(query) ||
          v.coreVehicle.vehicleName.toLowerCase().includes(query)
        );
      }
    }

    return enrichedVehicles.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  getRentalVehicleById(id: string): RentalVehicle | null {
    const profile = rentalVehicleRepository.getById(id);
    if (!profile) return null;
    return this.enrichProfile(profile);
  }

  getRentalVehicleByVehicleId(vehicleId: string): RentalVehicle | null {
    const profile = rentalVehicleRepository.getByVehicleId(vehicleId);
    if (!profile) return null;
    return this.enrichProfile(profile);
  }

  getAvailableCoreVehicles(): Vehicle[] {
    const coreVehicles = coreVehicleService.getVehicles();
    const rentalProfiles = rentalVehicleRepository.getAll();
    const usedVehicleIds = new Set(rentalProfiles.map(p => p.vehicleId));
    
    return coreVehicles.filter(v => !usedVehicleIds.has(v.id));
  }

  registerVehicle(data: Omit<RentalVehicleProfile, 'id' | 'createdAt' | 'updatedAt'>): RentalVehicle {
    const existing = rentalVehicleRepository.getByVehicleId(data.vehicleId);
    if (existing) {
      throw new Error(`Vehicle ${data.vehicleId} is already registered in rental.`);
    }

    const newProfile = rentalVehicleRepository.create(data);
    const enriched = this.enrichProfile(newProfile);
    if (!enriched) throw new Error('Core vehicle not found after creation.');
    return enriched;
  }

  registerVehicles(vehicleIds: string[]): { success: number, duplicate: number } {
    let success = 0;
    let duplicate = 0;
    
    for (const vehicleId of vehicleIds) {
      const existing = rentalVehicleRepository.getByVehicleId(vehicleId);
      if (existing) {
        duplicate++;
        continue;
      }
      
      rentalVehicleRepository.create({
        vehicleId,
        status: 'READY',
        currentOdometer: 0,
        rateOverrideDaily: 0,
        completenessChecklist: {
          stnkOriginal: false,
          spareKey: false,
          jackAndTools: false,
          spareTire: false,
          firstAidKit: false,
        }
      });
      success++;
    }
    
    return { success, duplicate };
  }

  updateRentalVehicle(id: string, data: Partial<RentalVehicleProfile>): RentalVehicle {
    if (data.vehicleId) {
      delete data.vehicleId; // Never update vehicleId
    }

    const updatedProfile = rentalVehicleRepository.update(id, data);
    const enriched = this.enrichProfile(updatedProfile);
    if (!enriched) throw new Error('Core vehicle not found after update.');
    return enriched;
  }

  removeFromRental(id: string): void {
    rentalVehicleRepository.delete(id);
  }
}

export const rentalVehicleService = new RentalVehicleService();
