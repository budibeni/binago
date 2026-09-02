import { vehicleService } from '@/data/services';
import type { PassengerEvent, PassengerEventType } from '@/features/modules/transport/passenger-events/types/passengerEvent';
import { passengerEventRepository } from '../repositories/passengerEventRepository';
import { departureService } from './departureService';

export const passengerEventService = {
  getEventsByDepartureId(departureId: string): PassengerEvent[] {
    return passengerEventRepository.getByDepartureId(departureId);
  },

  getCurrentOnboard(departureId: string): number {
    const events = this.getEventsByDepartureId(departureId);
    let total = 0;
    for (const event of events) {
      if (event.type === 'BOARDING') total += event.quantity;
      else if (event.type === 'ALIGHTING') total -= event.quantity;
    }
    return Math.max(0, total);
  },

  recordEvent(
    departureId: string, 
    geofenceId: string, 
    type: PassengerEventType, 
    quantity: number, 
    recordedBy?: string, 
    note?: string
  ): PassengerEvent {
    if (quantity <= 0) {
      throw new Error('Jumlah penumpang harus lebih besar dari 0');
    }

    const departure = departureService.getDepartureById(departureId);
    if (!departure) {
      throw new Error('Departure tidak ditemukan');
    }

    if (departure.status !== 'ONGOING') {
      throw new Error('Penumpang hanya bisa dicatat pada perjalanan yang sedang berlangsung (ONGOING)');
    }

    const vehicle = vehicleService.getVehicleById(departure.vehicleId);
    if (!vehicle) {
      throw new Error('Kendaraan tidak ditemukan');
    }

    const currentOnboard = this.getCurrentOnboard(departureId);

    if (type === 'BOARDING') {
      if (currentOnboard + quantity > 40) {
        throw new Error(`Kapasitas tidak mencukupi. Sisa kursi: ${40 - currentOnboard}`);
      }
    } else if (type === 'ALIGHTING') {
      if (currentOnboard - quantity < 0) {
        throw new Error(`Jumlah turun melebihi jumlah penumpang saat ini (${currentOnboard})`);
      }
    }

    const newEvent: PassengerEvent = {
      id: `pe-${Date.now()}`,
      departureId,
      vehicleId: departure.vehicleId,
      geofenceId,
      type,
      quantity,
      recordedAt: new Date().toISOString(),
      recordedBy,
      note,
    };

    passengerEventRepository.add(newEvent);
    return newEvent;
  }
};
