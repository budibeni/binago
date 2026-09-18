import type {
  RentalPricingGroup,
  RentalRate,
  VehicleRateOverride,
  VehiclePricingAssignment
} from '../../../../features/modules/rental/pricing-groups/types/pricing';
import { 
  mockPricingGroups, 
  mockRentalRates, 
  mockVehicleRateOverrides, 
  mockVehiclePricingAssignments 
} from '../mock/pricing';
import type { RateType } from '../../../../features/modules/rental/reservations/types/reservation';

let pricingGroupsData = [...mockPricingGroups];
let rentalRatesData = [...mockRentalRates];
let vehicleOverridesData = [...mockVehicleRateOverrides];
let vehicleAssignmentsData = [...mockVehiclePricingAssignments];

class PricingRepository {
  // --- Pricing Groups ---
  getPricingGroups(filters?: any): RentalPricingGroup[] {
    let result = [...pricingGroupsData];
    if (filters) {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(g => 
          g.name.toLowerCase().includes(query) || 
          g.description?.toLowerCase().includes(query)
        );
      }
      if (filters.status && filters.status !== 'all') {
        result = result.filter(g => g.status === filters.status);
      }
    }
    return result;
  }

  getPricingGroupById(id: string): RentalPricingGroup | undefined {
    return pricingGroupsData.find(g => g.id === id);
  }

  createPricingGroup(data: Omit<RentalPricingGroup, 'id' | 'createdAt' | 'updatedAt'>): RentalPricingGroup {
    const newGroup: RentalPricingGroup = {
      ...data,
      id: `prg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    pricingGroupsData.push(newGroup);
    return newGroup;
  }

  updatePricingGroup(id: string, data: Partial<RentalPricingGroup>): RentalPricingGroup | undefined {
    const index = pricingGroupsData.findIndex(g => g.id === id);
    if (index === -1) return undefined;
    
    pricingGroupsData[index] = {
      ...pricingGroupsData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return pricingGroupsData[index];
  }

  deletePricingGroup(id: string): boolean {
    const index = pricingGroupsData.findIndex(g => g.id === id);
    if (index === -1) return false;
    pricingGroupsData.splice(index, 1);
    // Also remove associated rates and vehicle assignments
    const rateIndices = rentalRatesData.reduce((acc, r, i) => r.pricingGroupId === id ? [...acc, i] : acc, [] as number[]).reverse();
    rateIndices.forEach(i => rentalRatesData.splice(i, 1));
    
    const assignIndices = vehicleAssignmentsData.reduce((acc: number[], a, i) => a.pricingGroupId === id ? [...acc, i] : acc, []).reverse();
    assignIndices.forEach(i => vehicleAssignmentsData.splice(i, 1));
    return true;
  }

  // --- Rates ---
  getRatesByGroupId(groupId: string): RentalRate[] {
    return rentalRatesData.filter(r => r.pricingGroupId === groupId);
  }

  setRatesForGroup(groupId: string, rates: { rateType: RateType, amount: number }[]): RentalRate[] {
    // Remove existing rates for this group
    rentalRatesData = rentalRatesData.filter(r => r.pricingGroupId !== groupId);
    
    const newRates = rates.map((r, index) => ({
      id: `rate-${Date.now()}-${index}`,
      pricingGroupId: groupId,
      rateType: r.rateType,
      amount: r.amount,
      status: 'ACTIVE' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    rentalRatesData.push(...newRates);
    return newRates;
  }

  // --- Vehicle Assignments ---
  getAssignedVehiclesByGroupId(groupId: string): VehiclePricingAssignment[] {
    return vehicleAssignmentsData.filter(a => a.pricingGroupId === groupId);
  }

  getPricingGroupForVehicle(vehicleId: string): RentalPricingGroup | undefined {
    const assignment = vehicleAssignmentsData.find(a => a.vehicleId === vehicleId);
    if (!assignment) return undefined;
    return this.getPricingGroupById(assignment.pricingGroupId);
  }

  assignVehiclesToGroup(groupId: string, vehicleIds: string[]) {
    // Remove these vehicles from any other groups first
    vehicleAssignmentsData = vehicleAssignmentsData.filter(a => !vehicleIds.includes(a.vehicleId));
    
    const newAssignments = vehicleIds.map(vid => ({
      vehicleId: vid,
      pricingGroupId: groupId,
      assignedAt: new Date().toISOString(),
    }));
    
    vehicleAssignmentsData.push(...newAssignments);
  }

  removeVehicleFromGroup(vehicleId: string, groupId: string) {
    vehicleAssignmentsData = vehicleAssignmentsData.filter(
      a => !(a.vehicleId === vehicleId && a.pricingGroupId === groupId)
    );
  }

  setVehiclesForGroup(groupId: string, vehicleIds: string[]) {
    // 1. Remove all existing assignments for this group
    vehicleAssignmentsData = vehicleAssignmentsData.filter(a => a.pricingGroupId !== groupId);
    
    // 2. Remove these new vehicleIds from any other groups they might belong to
    vehicleAssignmentsData = vehicleAssignmentsData.filter(a => !vehicleIds.includes(a.vehicleId));
    
    // 3. Add the new assignments
    const newAssignments = vehicleIds.map(vid => ({
      vehicleId: vid,
      pricingGroupId: groupId,
      assignedAt: new Date().toISOString(),
    }));
    
    vehicleAssignmentsData.push(...newAssignments);
  }

  // --- Overrides ---
  getVehicleOverrides(vehicleId: string): VehicleRateOverride[] {
    return vehicleOverridesData.filter(o => o.vehicleId === vehicleId);
  }

  getVehicleOverride(vehicleId: string, rateType: RateType): VehicleRateOverride | undefined {
    return vehicleOverridesData.find(
      o => o.vehicleId === vehicleId && o.rateType === rateType && o.status === 'ACTIVE'
    );
  }

  setVehicleOverride(vehicleId: string, rateType: RateType, amount: number): VehicleRateOverride {
    const index = vehicleOverridesData.findIndex(
      o => o.vehicleId === vehicleId && o.rateType === rateType
    );
    
    if (index !== -1) {
      vehicleOverridesData[index] = {
        ...vehicleOverridesData[index],
        amount,
        updatedAt: new Date().toISOString(),
        status: 'ACTIVE',
      };
      return vehicleOverridesData[index];
    }
    
    const newOverride: VehicleRateOverride = {
      id: `ovr-${Date.now()}`,
      vehicleId,
      rateType,
      amount,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vehicleOverridesData.push(newOverride);
    return newOverride;
  }
  
  removeVehicleOverride(vehicleId: string, rateType: RateType) {
    vehicleOverridesData = vehicleOverridesData.filter(
      o => !(o.vehicleId === vehicleId && o.rateType === rateType)
    );
  }

  clearVehicleOverrides(vehicleId: string) {
    vehicleOverridesData = vehicleOverridesData.filter(
      o => o.vehicleId !== vehicleId
    );
  }
}

export const pricingRepository = new PricingRepository();
