import type { Booking, BookingStatus, RateType, BookingItem } from '@/features/modules/rental/bookings/types/booking';
import { bookingRepository } from '../repositories/bookingRepository';
import { rentalVehicleService } from './vehicleService';
import { rentalCustomerService as customerService } from './customerService';
import { pricingService } from './pricingService';
import type { RentalType } from '@/features/modules/rental/bookings/types/booking';

export interface CreateBookingPayload {
  customerId: string;
  vehicleIds: string[];
  startDate: string;
  endDate: string;
  rentalType: RentalType;
  rateType: RateType;
  deposit: number;
  paymentMethod?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
}

class BookingService {
  async getBookings(): Promise<Booking[]> {
    const bookings = await bookingRepository.getBookings();
    
    // Populate relations for UI
    const populated = await Promise.all(
      bookings.map(async (res) => {
        const customer = await customerService.getCustomerById(res.customerId);
        const populatedItems = await Promise.all(
          res.items.map(async (item) => {
            // Need to fetch vehicle. coreVehicle ID vs vehicleId? 
            // rentalVehicleService.getRentalVehicleByVehicleId expects the CORE vehicleId
            const vehicle = await rentalVehicleService.getRentalVehicleByVehicleId(item.vehicleId);
            return { ...item, vehicle: vehicle || undefined };
          })
        );
        return {
          ...res,
          customer: customer || undefined,
          items: populatedItems,
        };
      })
    );
    return populated;
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    const res = await bookingRepository.getBookingById(id);
    if (!res) return undefined;

    const customer = await customerService.getCustomerById(res.customerId);
    const populatedItems = await Promise.all(
      res.items.map(async (item) => {
        const vehicle = await rentalVehicleService.getRentalVehicleByVehicleId(item.vehicleId);
        return { ...item, vehicle: vehicle || undefined };
      })
    );
    
    return {
      ...res,
      customer: customer || undefined,
      items: populatedItems,
    };
  }

  async checkVehicleAvailability(vehicleIds: string[], startDateStr: string, endDateStr: string): Promise<{ available: boolean; reason?: string }> {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (endDate < startDate) {
      return { available: false, reason: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' };
    }

    if (!vehicleIds || vehicleIds.length === 0) {
      return { available: false, reason: 'Pilih minimal satu kendaraan.' };
    }

    // 1. Check basic vehicle status
    for (const vehicleId of vehicleIds) {
      // Since vehicleIds are CORE vehicleIds, use getRentalVehicleByVehicleId
      const vehicle = await rentalVehicleService.getRentalVehicleByVehicleId(vehicleId);
      if (!vehicle) {
        return { available: false, reason: `Kendaraan tidak ditemukan dalam modul rental.` };
      }
      if (['RENTED', 'MAINTENANCE', 'UNAVAILABLE'].includes(vehicle.status)) {
        return { available: false, reason: `Kendaraan ${vehicle.coreVehicle?.plateNumber || vehicleId} saat ini berstatus ${vehicle.status}.` };
      }
    }

    // 2. Check overlaps in all active bookings
    const allBookings = await bookingRepository.getBookings();
    const activeBookings = allBookings.filter(res => !['CANCELLED', 'COMPLETED'].includes(res.status));

    for (const res of activeBookings) {
      for (const item of res.items) {
        if (vehicleIds.includes(item.vehicleId)) {
          const resStart = new Date(item.startDate);
          const resEnd = new Date(item.endDate);
          
          // Check if dates overlap
          const isOverlap = (startDate < resEnd || startDate.getTime() === resEnd.getTime()) && 
                            (endDate > resStart || endDate.getTime() === resStart.getTime());
          
          if (isOverlap) {
            return { available: false, reason: `Sebagian kendaraan yang dipilih sudah di-booking pada periode tersebut.` };
          }
        }
      }
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
    const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  }

  generateBookingNumber(): string {
    const date = new Date();
    const dateStr = `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(2)}`;
    const randomSeq = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `RES-${dateStr}-${randomSeq}`;
  }

  async createBooking(data: CreateBookingPayload): Promise<Booking> {
    // 1. Re-validate availability
    const avail = await this.checkVehicleAvailability(data.vehicleIds, data.startDate, data.endDate);
    if (!avail.available) {
      throw new Error(avail.reason);
    }

    // 2. Calculate duration
    const duration = this.calculateDuration(data.startDate, data.endDate);

    // 3. Resolve Pricing and Build Items
    let totalAmount = 0;
    const items: BookingItem[] = data.vehicleIds.map(vehicleId => {
      let rateSnapshot = 0;
      try {
        rateSnapshot = pricingService.resolveVehicleRate(vehicleId, data.rateType);
      } catch (e) {
        throw new Error(`Gagal mendapatkan tarif untuk kendaraan ID ${vehicleId}.`);
      }

      // Special handling if logic is per week/month
      let multiplier = duration;
      if (data.rateType === 'WEEKLY') multiplier = Math.ceil(duration / 7);
      if (data.rateType === 'MONTHLY') multiplier = Math.ceil(duration / 30);

      const subtotal = rateSnapshot * multiplier;
      totalAmount += subtotal;

      return {
        id: '', // Will be generated by repository
        bookingId: '', // Will be generated by repository
        vehicleId,
        startDate: data.startDate,
        endDate: data.endDate,
        duration,
        rateType: data.rateType,
        rateSnapshot,
        subtotal
      };
    });

    const bookingNumber = this.generateBookingNumber();
    const remainingAmount = Math.max(totalAmount - (data.deposit || 0), 0);

    return bookingRepository.createBooking({
      bookingNumber,
      customerId: data.customerId,
      startDate: data.startDate,
      endDate: data.endDate,
      duration,
      rentalType: data.rentalType,
      rateType: data.rateType,
      totalAmount,
      deposit: data.deposit || 0,
      remainingAmount,
      paymentMethod: data.paymentMethod,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      notes: data.notes,
      items,
      status: 'PENDING',
    });
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    return bookingRepository.updateBookingStatus(id, status);
  }
}

export const bookingService = new BookingService();
