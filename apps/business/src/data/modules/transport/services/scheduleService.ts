import type { OperationalSchedule, ScheduleFilters, DayOfWeek, ScheduleTime } from '@/features/modules/transport/schedules/types/schedule';
import { operationalScheduleRepository } from '../repositories/scheduleRepository';
import { routeService, vehicleService } from '@/data/services'; // CORE

export const operationalScheduleService = {
  getSchedules(filters?: Partial<ScheduleFilters>): OperationalSchedule[] {
    let schedules = operationalScheduleRepository.getAll();

    if (filters) {
      if (filters.search?.trim()) {
        const q = filters.search.toLowerCase();
        schedules = schedules.filter(s => s.name.toLowerCase().includes(q));
      }
      if (filters.status && filters.status !== 'all') {
        schedules = schedules.filter(s => s.status === filters.status);
      }
    }

    // Populate relations
    return schedules.map(schedule => {
      const route = routeService.getRouteById(schedule.routeId);
      return {
        ...schedule,
        route
      };
    });
  },

  getScheduleById(id: string): OperationalSchedule | undefined {
    const schedule = operationalScheduleRepository.getById(id);
    if (!schedule) return undefined;

    const route = routeService.getRouteById(schedule.routeId);

    return {
      ...schedule,
      route
    };
  },

  validateVehicleAssignments(times: ScheduleTime[], activeDays: DayOfWeek[], routeId: string, excludeScheduleId?: string): boolean {
    const route = routeService.getRouteById(routeId);
    // As per specs: use route.estimatedDuration if available, else 0 (allow overlap checking only on exact time)
    // Wait, the generic CORE route doesn't have estimatedDuration in the basic type, we'll assume exact time overlap for now.
    
    const activeSchedules = operationalScheduleRepository.getAll().filter(s => s.status === 'ACTIVE' && s.id !== excludeScheduleId);
    
    for (const time of times) {
      for (const vehicleId of time.vehicleIds) {
        // Check within same schedule
        const sameVehicleOtherTimes = times.filter(t => t.id !== time.id && t.vehicleIds.includes(vehicleId));
        for (const otherTime of sameVehicleOtherTimes) {
           if (otherTime.departureTime === time.departureTime) return false;
        }

        // Check against other schedules
        const conflict = activeSchedules.some(s => {
          // Check if days overlap
          if (!s.activeDays.some(day => activeDays.includes(day))) return false;

          return s.times.some(t => t.departureTime === time.departureTime && t.vehicleIds.includes(vehicleId));
        });

        if (conflict) return false;
      }
    }

    return true;
  },

  createSchedule(data: Omit<OperationalSchedule, 'id' | 'route'>): OperationalSchedule {
    if (data.status === 'ACTIVE' && !this.validateVehicleAssignments(data.times, data.activeDays, data.routeId)) {
      throw new Error('Jadwal konflik: Kendaraan sudah memiliki jadwal aktif di hari dan jam yang sama.');
    }

    const newSchedule: OperationalSchedule = {
      ...data,
      id: `sch-${Date.now()}`
    };

    operationalScheduleRepository.add(newSchedule);
    return newSchedule;
  },

  updateSchedule(id: string, updates: Partial<Omit<OperationalSchedule, 'id' | 'route'>>): void {
    const existing = operationalScheduleRepository.getById(id);
    if (!existing) throw new Error('Schedule not found');

    const activeDays = updates.activeDays || existing.activeDays;
    const times = updates.times || existing.times;
    const routeId = updates.routeId || existing.routeId;
    const status = updates.status || existing.status;

    if (status === 'ACTIVE' && !this.validateVehicleAssignments(times, activeDays, routeId, id)) {
      throw new Error('Jadwal konflik: Kendaraan sudah memiliki jadwal aktif di hari dan jam yang sama.');
    }

    operationalScheduleRepository.update(id, updates);
  },

  deleteSchedule(id: string): void {
    operationalScheduleRepository.remove(id);
  }
};
