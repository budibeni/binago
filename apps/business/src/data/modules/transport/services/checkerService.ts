import { checkerRepository } from '../repositories/checkerRepository';
import { trackingService, geofenceService, vehicleService } from '@/data/services';

import { departureService } from './departureService';
import type { Checker } from '@/features/modules/transport/checker/types/checker';
import type { Departure } from '@/features/modules/transport/departures/types/departure';

export const checkerService = {
  getCheckerById(id: string): Checker | undefined {
    return checkerRepository.getById(id);
  },

  getAllCheckers(): Checker[] {
    return checkerRepository.getAll();
  },

  getBusesAtGeofence(geofenceId: string) {
    const geofence = geofenceService.getGeofenceById(geofenceId);
    if (!geofence) return [];

    const allTracking = trackingService.getLiveVehicles();
    
    // Buses currently at geofence
    const vehiclesAtGeofence = allTracking.filter(t => t.geofenceName === geofence.name);
    
    // Map to CORE Vehicles and find their active departure
    const result = vehiclesAtGeofence.map(t => {
      const coreVehicle = vehicleService.getVehicleById(t.id);
      if (!coreVehicle) return null;

      const allDepartures = departureService.getDepartures();
      const activeDeparture = allDepartures.find(
        d => d.vehicleId === t.id && d.status === 'ONGOING'
      );

      return {
        tracking: t,
        coreVehicle,
        activeDeparture
      };
    }).filter(v => v !== null && v.activeDeparture !== undefined);

    return result;
  },

  getActiveDeparturesForManualSelect(): Departure[] {
    const allDepartures = departureService.getDepartures();
    return allDepartures.filter(d => d.status === 'ONGOING');
  }
};
