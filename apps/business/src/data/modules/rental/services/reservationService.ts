import type { Reservation, ReservationStatus, RateType } from '@/features/modules/rental/reservations/types/reservation';
import { reservationRepository } from '../repositories/reservationRepository';
import { rentalVehicleService } from './vehicleService';
import { rentalCustomerService as customerService } from './customerService';


class ReservationService {
  async getReservations(): Promise<Reservation[]> {
    const reservations = await reservationRepository.getReservations();
    
    // Populate relations for UI
    const populated = await Promise.all(
      reservations.map(async (res) => {
        const customer = await customerService.getCustomerById(res.customerId);
        const vehicle = await rentalVehicleService.getRentalVehicleByVehicleId(res.vehicleId);
        return {
          ...res,
          customer: customer || undefined,
          vehicle: vehicle || undefined
        };
      })
    );
    return populated;
  }

  async getReservationById(id: string): Promise<Reservation | undefined> {
    const res = await reservationRepository.getReservationById(id);
    if (!res) return undefined;

    const customer = await customerService.getCustomerById(res.customerId);
    const vehicle = await rentalVehicleService.getRentalVehicleByVehicleId(res.vehicleId);
    
    return {
      ...res,
      customer: customer || undefined,
      vehicle: vehicle || undefined
    };
  }

  async checkVehicleAvailability(vehicleId: string, startDateStr: string, endDateStr: string): Promise<{ available: boolean; reason?: string }> {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (endDate < startDate) {
      return { available: false, reason: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' };
    }

    // Get vehicle to ensure it exists and has valid basic status
    const vehicle = await rentalVehicleService.getRentalVehicleById(vehicleId);
    if (!vehicle) {
      return { available: false, reason: 'Kendaraan tidak ditemukan.' };
    }

    if (['RENTED', 'MAINTENANCE', 'UNAVAILABLE'].includes(vehicle.status)) {
      return { available: false, reason: `Kendaraan saat ini berstatus ${vehicle.status}.` };
    }

    // Check overlaps
    const allReservations = await reservationRepository.getReservations();
    const overlapping = allReservations.find(res => {
      // Only care about active/pending reservations for the same vehicle
      if (res.vehicleId !== vehicleId) return false;
      if (['CANCELLED', 'COMPLETED'].includes(res.status)) return false;

      const resStart = new Date(res.startDate);
      const resEnd = new Date(res.endDate);

      // Check if dates overlap
      return (startDate < resEnd || startDate.getTime() === resEnd.getTime()) && 
             (endDate > resStart || endDate.getTime() === resStart.getTime());
    });

    if (overlapping) {
      return { available: false, reason: 'Kendaraan sudah memiliki reservasi pada periode tersebut.' };
    }

    return { available: true };
  }

  calculateDuration(startDateStr: string, endDateStr: string): number {
    if (!startDateStr || !endDateStr) return 0;
    const start = new Date(startDateStr);
    start.setHours(0,0,0,0);
    const end = new Date(endDateStr);
    end.setHours(0,0,0,0);
    
    if (end < start) return 0;
    
    // Add 1 to include both start and end day in the calculation if needed
    // Usually duration = difference + 1 day? Let's use difference in days, if 0 then 1 day minimum
    const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  }

  calculateTotalAmount(rateType: RateType, duration: number, dailyRate: number, weeklyRate: number, monthlyRate: number): number {
    switch (rateType) {
      case 'DAILY':
        return dailyRate * duration;
      case 'WEEKLY':
        // example logic: round up weeks
        return weeklyRate * Math.ceil(duration / 7);
      case 'MONTHLY':
        return monthlyRate * Math.ceil(duration / 30);
      default:
        return 0;
    }
  }

  generateReservationNumber(): string {
    const date = new Date();
    const dateStr = `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(2)}`;
    const randomSeq = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `RES-${dateStr}-${randomSeq}`;
  }

  async createReservation(data: Omit<Reservation, 'id' | 'reservationNumber' | 'createdAt' | 'updatedAt' | 'remainingAmount' | 'status'>): Promise<Reservation> {
    // 1. Re-validate availability
    const avail = await this.checkVehicleAvailability(data.vehicleId, data.startDate, data.endDate);
    if (!avail.available) {
      throw new Error(avail.reason);
    }

    const reservationNumber = this.generateReservationNumber();
    const remainingAmount = Math.max(data.totalAmount - data.deposit, 0);

    return reservationRepository.createReservation({
      ...data,
      reservationNumber,
      remainingAmount,
      status: 'PENDING', // Force pending
    });
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    return reservationRepository.updateReservationStatus(id, status);
  }
}

export const reservationService = new ReservationService();
