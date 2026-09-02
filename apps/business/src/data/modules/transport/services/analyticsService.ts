import { departureService } from './departureService';
import { passengerEventService } from './passengerEventService';

import { routeService, vehicleService } from '@/data/services';
import type { Departure } from '@/features/modules/transport/departures/types/departure';

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

function isWithinRange(dateStr: string, range?: DateRange) {
  if (!range || (!range.startDate && !range.endDate)) return true;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  
  if (range.startDate) {
    const s = new Date(range.startDate);
    s.setHours(0, 0, 0, 0);
    if (d < s) return false;
  }
  if (range.endDate) {
    const e = new Date(range.endDate);
    e.setHours(0, 0, 0, 0);
    if (d > e) return false;
  }
  return true;
}

export const analyticsService = {
  getDeparturesByRange(range?: DateRange): Departure[] {
    return departureService.getDepartures().filter(d => isWithinRange(d.date, range));
  },

  getDashboardSummary(range?: DateRange) {
    const departures = this.getDeparturesByRange(range);
    
    let total = departures.length;
    let departed = 0;
    let completed = 0;
    let delayed = 0;
    let cancelled = 0;
    let onTimeCount = 0;
    let eligibleForOnTime = 0;

    let totalBoarding = 0;
    let totalAlighting = 0;
    let totalCapacity = 0;

    departures.forEach(dep => {
      if (['ONGOING'].includes(dep.status)) departed++;
      if (['COMPLETED'].includes(dep.status)) completed++;
      if (dep.status === 'CANCELLED') cancelled++;

      // On-time performance
      if (dep.status !== 'CANCELLED' && dep.scheduledDepartureAt && dep.actualDepartureAt) {
        eligibleForOnTime++;
        const scheduledTime = new Date(`${dep.date}T${dep.scheduledDepartureAt}`).getTime();
        const actualTime = new Date(dep.actualDepartureAt).getTime();
        if (actualTime <= scheduledTime) {
          onTimeCount++;
        }
      }

      // Capacity & Passengers from Events
      const events = passengerEventService.getEventsByDepartureId(dep.id);
      events.forEach(e => {
        if (e.type === 'BOARDING') totalBoarding += e.quantity;
        if (e.type === 'ALIGHTING') totalAlighting += e.quantity;
      });

      const vehicle = vehicleService.getVehicleById(dep.vehicleId);
      if (vehicle) {
        totalCapacity += 40;
      }
    });

    const onTimeRate = eligibleForOnTime > 0 ? (onTimeCount / eligibleForOnTime) * 100 : 0;
    const avgOccupancy = totalCapacity > 0 ? (totalBoarding / totalCapacity) * 100 : 0; // Using boarding as rough occupancy proxy for dashboard

    return {
      total,
      departed,
      completed,
      delayed,
      cancelled,
      onTimeRate,
      totalBoarding,
      totalAlighting,
      avgOccupancy
    };
  },

  getDepartureStatistics(range?: DateRange) {
    const departures = this.getDeparturesByRange(range);
    const stats: Record<string, number> = {
      SCHEDULED: 0,
      ONGOING: 0,
      COMPLETED: 0,
      CANCELLED: 0
    };

    departures.forEach(d => {
      stats[d.status] = (stats[d.status] || 0) + 1;
    });

    return stats;
  },

  getOnTimePerformance(range?: DateRange) {
    const departures = this.getDeparturesByRange(range);
    let onTimeCount = 0;
    let eligibleForOnTime = 0;
    
    departures.forEach(dep => {
      if (dep.status !== 'CANCELLED' && dep.scheduledDepartureAt && dep.actualDepartureAt) {
        eligibleForOnTime++;
        const scheduledTime = new Date(`${dep.date}T${dep.scheduledDepartureAt}`).getTime();
        const actualTime = new Date(dep.actualDepartureAt).getTime();
        if (actualTime <= scheduledTime) {
          onTimeCount++;
        }
      }
    });
    
    return {
      eligible: eligibleForOnTime,
      onTime: onTimeCount,
      late: eligibleForOnTime - onTimeCount,
      rate: eligibleForOnTime > 0 ? (onTimeCount / eligibleForOnTime) * 100 : 0
    };
  },

  getPassengerOccupancy(range?: DateRange) {
    const departures = this.getDeparturesByRange(range);
    let totalBoarding = 0;
    let totalCapacity = 0;
    
    departures.forEach(dep => {
      const events = passengerEventService.getEventsByDepartureId(dep.id);
      events.forEach(e => {
        if (e.type === 'BOARDING') totalBoarding += e.quantity;
      });
      const vehicle = vehicleService.getVehicleById(dep.vehicleId);
      if (vehicle) {
        totalCapacity += 40;
      }
    });
    
    return {
      totalPassengers: totalBoarding,
      totalCapacity,
      averageOccupancy: totalCapacity > 0 ? (totalBoarding / totalCapacity) * 100 : 0
    };
  },

  getVehicleUtilization(range?: DateRange) {
    const departures = this.getDeparturesByRange(range);
    const utilMap = new Map<string, {
      vehicleId: string;
      total: number;
      completed: number;
      cancelled: number;
    }>();

    departures.forEach(d => {
      if (!utilMap.has(d.vehicleId)) {
        utilMap.set(d.vehicleId, { vehicleId: d.vehicleId, total: 0, completed: 0, cancelled: 0 });
      }
      const data = utilMap.get(d.vehicleId)!;
      data.total++;
      if (['COMPLETED'].includes(d.status)) data.completed++;
      if (d.status === 'CANCELLED') data.cancelled++;
    });

    return Array.from(utilMap.values())
      .map(u => {
        const profile = vehicleService.getVehicleById(u.vehicleId);
        const name = profile?.vehicleName || profile?.plateNumber || 'Unknown Vehicle';
        return {
          ...u,
          name
        };
      })
      .sort((a, b) => b.total - a.total);
  },

  getRoutePerformance(range?: DateRange) {
    const departures = this.getDeparturesByRange(range);
    const routeMap = new Map<string, {
      routeId: string;
      total: number;
      completed: number;
      delayed: number;
      cancelled: number;
      onTimeCount: number;
      eligibleOnTime: number;
      passengerCount: number;
    }>();

    departures.forEach(d => {
      if (!routeMap.has(d.routeId)) {
        routeMap.set(d.routeId, { routeId: d.routeId, total: 0, completed: 0, delayed: 0, cancelled: 0, onTimeCount: 0, eligibleOnTime: 0, passengerCount: 0 });
      }
      const data = routeMap.get(d.routeId)!;
      data.total++;
      if (['COMPLETED'].includes(d.status)) data.completed++;
      if (d.status === 'CANCELLED') data.cancelled++;

      if (d.status !== 'CANCELLED' && d.scheduledDepartureAt && d.actualDepartureAt) {
        data.eligibleOnTime++;
        const scheduledTime = new Date(`${d.date}T${d.scheduledDepartureAt}`).getTime();
        const actualTime = new Date(d.actualDepartureAt).getTime();
        if (actualTime <= scheduledTime) {
          data.onTimeCount++;
        }
      }

      const events = passengerEventService.getEventsByDepartureId(d.id);
      events.forEach(e => {
        if (e.type === 'BOARDING') data.passengerCount += e.quantity;
      });
    });

    return Array.from(routeMap.values())
      .map(r => {
        const coreRoute = routeService.getRouteById(r.routeId);
        const name = coreRoute?.name || 'Unknown Route';
        const onTimeRate = r.eligibleOnTime > 0 ? (r.onTimeCount / r.eligibleOnTime) * 100 : 0;
        return {
          ...r,
          name,
          onTimeRate
        };
      })
      .sort((a, b) => b.total - a.total);
  },
  
  getRecentDepartures(limit: number = 5, range?: DateRange) {
    return this.getDeparturesByRange(range)
      .sort((a, b) => {
        return new Date(`${b.date}T${b.scheduledDepartureAt}`).getTime() - new Date(`${a.date}T${a.scheduledDepartureAt}`).getTime();
      })
      .slice(0, limit);
  }
};
