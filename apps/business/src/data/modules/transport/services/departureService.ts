import type { Departure, DepartureFilters } from '@/features/modules/transport/departures/types/departure';
import { departureRepository } from '../repositories/departureRepository';
import { operationalScheduleService } from './scheduleService';
import { routeService, driverService, vehicleService } from '@/data/services'; // CORE

export const departureService = {
  getDepartures(filters?: Partial<DepartureFilters>): Departure[] {
    let departures = departureRepository.getAll();

    // Populate relations for filtering if needed
    let populatedDepartures = departures.map(departure => {
      const schedule = operationalScheduleService.getScheduleById(departure.scheduleId);
      const route = routeService.getRouteById(departure.routeId);
      const vehicle = vehicleService.getVehicleById(departure.vehicleId);
      const driver = departure.driverId ? driverService.getDriverById(departure.driverId) : undefined;
      
      return {
        ...departure,
        schedule,
        route,
        vehicle,
        driver
      };
    });

    if (filters) {
      if (filters.search?.trim()) {
        const q = filters.search.toLowerCase();
        populatedDepartures = populatedDepartures.filter(d => 
          d.schedule?.name.toLowerCase().includes(q) ||
          d.route?.name.toLowerCase().includes(q) ||
          d.vehicle?.plateNumber.toLowerCase().includes(q)
        );
      }
      if (filters.status && filters.status !== 'all') {
        populatedDepartures = populatedDepartures.filter(d => d.status === filters.status);
      }
    }

    return populatedDepartures;
  },

  getDepartureById(id: string): Departure | undefined {
    const departure = departureRepository.getById(id);
    if (!departure) return undefined;

    const schedule = operationalScheduleService.getScheduleById(departure.scheduleId);
    const route = routeService.getRouteById(departure.routeId);
    const vehicle = vehicleService.getVehicleById(departure.vehicleId);
    const driver = departure.driverId ? driverService.getDriverById(departure.driverId) : undefined;

    return {
      ...departure,
      schedule,
      route,
      vehicle,
      driver
    };
  },

  checkVehicleAvailability(vehicleId: string): boolean {
    const vehicle = vehicleService.getVehicleById(vehicleId);
    return !!vehicle;
  },

  generateDeparturesForDate(dateStr: string): { created: number, skipped: number } {
    const activeSchedules = operationalScheduleService.getSchedules().filter(s => s.status === 'ACTIVE');
    const existingDepartures = departureRepository.getAll().filter(d => d.date === dateStr);
    
    // Determine DayOfWeek for the given date
    const dateObj = new Date(dateStr);
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
    const targetDay = dayNames[dateObj.getDay()];

    let createdCount = 0;
    let skippedCount = 0;

    for (const schedule of activeSchedules) {
      if (!schedule.activeDays.includes(targetDay)) continue;

      for (const time of schedule.times) {
        for (const vehicleId of time.vehicleIds) {
          // Check for exact duplicate
          const isDuplicate = existingDepartures.some(d => 
            d.scheduleId === schedule.id && 
            d.scheduleTimeId === time.id && 
            d.vehicleId === vehicleId
          );

          if (isDuplicate) {
            skippedCount++;
            continue;
          }

          if (!this.checkVehicleAvailability(vehicleId)) {
            skippedCount++; // Vehicle not available, skip
            continue;
          }

          const [hours, minutes] = time.departureTime.split(':').map(Number);
          const scheduledTime = new Date(dateObj);
          scheduledTime.setHours(hours, minutes, 0, 0);

          const newDeparture: Departure = {
            id: `dep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            scheduleId: schedule.id,
            scheduleTimeId: time.id,
            routeId: schedule.routeId,
            vehicleId,
            date: dateStr,
            scheduledDepartureAt: scheduledTime.toISOString(),
            status: 'SCHEDULED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          departureRepository.add(newDeparture);
          createdCount++;
        }
      }
    }

    return { created: createdCount, skipped: skippedCount };
  },

  startDeparture(id: string): Departure {
    const existing = departureRepository.getById(id);
    if (!existing) throw new Error('Departure not found');

    if (existing.status !== 'SCHEDULED') {
      throw new Error(`Invalid status transition from ${existing.status} to ONGOING`);
    }

    if (!this.checkVehicleAvailability(existing.vehicleId)) {
      throw new Error('Kendaraan tidak tersedia (harus berstatus ACTIVE)');
    }
    
    // Validasi 1 vehicle hanya boleh 1 active departure
    const allDepartures = departureRepository.getAll();
    const hasActiveDeparture = allDepartures.some(
      d => d.vehicleId === existing.vehicleId && d.status === 'ONGOING'
    );
    if (hasActiveDeparture) {
      throw new Error('Kendaraan sedang melakukan perjalanan (status ONGOING)');
    }

    departureRepository.update(id, {
      status: 'ONGOING',
      actualDepartureAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return departureRepository.getById(id)!;
  },

  completeDeparture(id: string): Departure {
    const existing = departureRepository.getById(id);
    if (!existing) throw new Error('Departure not found');

    if (existing.status !== 'ONGOING') {
      throw new Error(`Invalid status transition from ${existing.status} to COMPLETED`);
    }

    departureRepository.update(id, {
      status: 'COMPLETED',
      actualArrivalAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return departureRepository.getById(id)!;
  },

  cancelDeparture(id: string): Departure {
    const existing = departureRepository.getById(id);
    if (!existing) throw new Error('Departure not found');

    if (existing.status !== 'SCHEDULED') {
      throw new Error(`Invalid status transition from ${existing.status} to CANCELLED`);
    }

    departureRepository.update(id, {
      status: 'CANCELLED',
      updatedAt: new Date().toISOString()
    });

    return departureRepository.getById(id)!;
  }
};
