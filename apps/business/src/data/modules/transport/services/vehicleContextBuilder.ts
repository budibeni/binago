import type { VehicleContext, VehicleContextField } from '@/features/core/tracking/types/tracking';
import { vehicleService as vehicleService } from '@/data/services';
import { operationalScheduleService } from './scheduleService';
import { departureService } from './departureService';
import { routeService } from '@/data/services'; // CORE

import type { Locale } from '@adatrack/types';

export async function buildTransportVehicleContext(vehicleId: string, locale: Locale = 'id'): Promise<VehicleContext | null> {
  try {
    const vehicle = vehicleService.getVehicleById(vehicleId);
    if (!vehicle) return null;

    const isEn = locale === 'en';
    
    const data: VehicleContextField[] = [
      { label: isEn ? 'Type' : 'Tipe', value: vehicle.vehicleCategory || '-', type: 'text' },
      { label: isEn ? 'Status' : 'Status', value: vehicle.status, type: 'status' }
    ];

    let entityId = vehicle.id;
    let entityType = 'vehicle';

    // Cari departure yang sedang aktif untuk kendaraan ini (misal SCHEDULED atau ONGOING)
    const activeDepartures = departureService.getDepartures().filter(d => 
      d.vehicleId === vehicleId && 
      ['SCHEDULED', 'ONGOING'].includes(d.status)
    );
    
    // Sort by scheduledDepartureAt (closest first)
    activeDepartures.sort((a, b) => {
      return new Date(`${a.date}T${a.scheduledDepartureAt}`).getTime() - new Date(`${b.date}T${b.scheduledDepartureAt}`).getTime();
    });

    const activeDeparture = activeDepartures[0];

    if (activeDeparture) {
      entityId = activeDeparture.id;
      entityType = 'departure';

      const schedule = activeDeparture.schedule || operationalScheduleService.getScheduleById(activeDeparture.scheduleId);
      const route = activeDeparture.route || routeService.getRouteById(activeDeparture.routeId);

      if (route) {
        data.push({ 
          label: 'Route', 
          value: `${route.origin?.address || '-'} ➔ ${route.destination?.address || '-'}`, 
          type: 'text' 
        });
      }

      data.push({
        label: isEn ? 'Departure Status' : 'Status Perjalanan',
        value: activeDeparture.status,
        type: 'status'
      });

      data.push({
        label: isEn ? 'Date' : 'Tanggal',
        value: new Date(activeDeparture.date).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: 'date'
      });

      data.push({
        label: isEn ? 'Departure Time' : 'Jam Berangkat',
        value: activeDeparture.scheduledDepartureAt,
        type: 'text'
      });

      if (activeDeparture.status === 'ONGOING') {
        const { passengerEventService } = await import('./passengerEventService');
        const currentOnboard = passengerEventService.getCurrentOnboard(activeDeparture.id);
        data.push({
          label: isEn ? 'Passenger Onboard' : 'Penumpang Saat Ini',
          value: `${currentOnboard}`,
          type: 'text'
        });
      }
    } else {
      // Jika tidak ada departure aktif, cek apakah ada schedule aktif
      const schedules = operationalScheduleService.getSchedules().filter(s => s.times.some(t => t.vehicleIds.includes(vehicleId)) && s.status === 'ACTIVE');
      if (schedules.length > 0) {
        const routeNames = schedules.map(s => {
          const r = routeService.getRouteById(s.routeId);
          return r ? r.name : s.routeId;
        }).join(', ');
        
        data.push({
          label: isEn ? 'Active Schedules' : 'Jadwal Aktif',
          value: routeNames,
          type: 'text'
        });
      }
    }

    return {
      vehicleId: vehicleId,
      module: 'transport',
      entityType,
      entityId,
      label: 'Transport',
      data
    };
  } catch (error) {
    console.error('Failed to build transport vehicle context:', error);
    return null;
  }
}
