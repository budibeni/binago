import type { Departure } from '@/features/modules/transport/departures/types/departure';
import { mockOperationalSchedules } from './schedules';

export const mockDepartures: Departure[] = [];

let depIdCounter = 1;

mockOperationalSchedules.forEach((schedule, sIdx) => {
  schedule.times.forEach((time, tIdx) => {
    time.vehicleIds.forEach((vehicleId, vIdx) => {
      // Create a few departures per vehicle for recent dates
      for (let i = 0; i < 3; i++) {
        const num = (depIdCounter++).toString().padStart(3, '0');
        
        let status: Departure['status'] = 'SCHEDULED';
        if (i === 0) status = 'COMPLETED'; // past
        else if (i === 1) status = 'ONGOING'; // today
        else status = 'SCHEDULED'; // future

        const date = new Date(2026, 7, 24 + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const [hours, minutes] = time.departureTime.split(':').map(Number);
        const scheduledTime = new Date(date);
        scheduledTime.setHours(hours, minutes, 0, 0);

        mockDepartures.push({
          id: `dep-${num}`,
          scheduleId: schedule.id,
          scheduleTimeId: time.id,
          routeId: schedule.routeId,
          vehicleId: vehicleId,
          driverId: `drv-00${(depIdCounter % 5) + 1}`,
          date: dateStr,
          scheduledDepartureAt: scheduledTime.toISOString(),
          actualDepartureAt: status === 'ONGOING' || status === 'COMPLETED' ? new Date(scheduledTime.getTime() + 5 * 60000).toISOString() : undefined,
          actualArrivalAt: status === 'COMPLETED' ? new Date(scheduledTime.getTime() + 120 * 60000).toISOString() : undefined,
          status,
          createdAt: new Date(2026, 7, 1).toISOString(),
          updatedAt: new Date(2026, 7, 1).toISOString()
        });
      }
    });
  });
});
