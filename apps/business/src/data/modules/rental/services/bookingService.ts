import type { Booking, BookingStatus, RateType, BookingItem } from '@/features/modules/rental/bookings/types/booking';
import { bookingRepository } from '../repositories/bookingRepository';
import { rentalVehicleService } from './vehicleService';
import { rentalCustomerService as customerService } from './customerService';
import { pricingService } from './pricingService';
import type { RentalType } from '@/features/modules/rental/bookings/types/booking';

export interface CreateBookingPayload {
  customerId: string;
  items: {
    vehicleId: string;
    rateType: RateType;
    packageId?: string;
    packageName?: string;
    duration: number;
    unitPrice: number;
    depositSnapshot: number;
    subtotal: number;
  }[];
  startDate: string;
  endDate: string;
  duration: number;
  rentalType: RentalType;
  deposit: number;
  driverFee?: number;
  
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
}

class BookingService {
  async getBookings(): Promise<Booking[]> {
    return await bookingRepository.getBookings();
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    return await bookingRepository.getBookingById(id);
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
    const vehicleIds = data.items.map(i => i.vehicleId);
    const avail = await this.checkVehicleAvailability(vehicleIds, data.startDate, data.endDate);
    if (!avail.available) {
      throw new Error(avail.reason);
    }

    // 2. Calculate duration
    const duration = this.calculateDuration(data.startDate, data.endDate);

    // 3. Generate Snapshots
    const customer = await customerService.getCustomerById(data.customerId);
    const customerSnapshot = customer ? {
      name: customer.type === 'COMPANY' ? customer.companyName! : customer.name,
      type: customer.type === 'COMPANY' ? 'Perusahaan' : 'Individu',
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      picName: customer.picName,
      picPhone: customer.picPhone
    } : undefined;

    // 4. Resolve Pricing and Build Items
    let totalAmount = 0;
    const items: BookingItem[] = await Promise.all(data.items.map(async item => {
      totalAmount += item.subtotal;
      
      const vehicle = await rentalVehicleService.getRentalVehicleByVehicleId(item.vehicleId);
      const vehicleSnapshot = vehicle ? {
        licensePlate: vehicle.coreVehicle?.licensePlate || item.vehicleId,
        brand: vehicle.coreVehicle?.brand || '-',
        model: vehicle.coreVehicle?.model || '-',
        categoryName: vehicle.categoryName || '-'
      } : undefined;

      return {
        id: '', // Will be generated by repository
        bookingId: '', // Will be generated by repository
        vehicleId: item.vehicleId,
        startDate: data.startDate,
        endDate: (() => { const d = new Date(data.startDate); if (item.rateType === "HOURLY") { d.setHours(d.getHours() + item.duration); } else { d.setDate(d.getDate() + item.duration); } return d.toISOString(); })(),
        duration: item.duration || 1,
        rateType: item.rateType,
        packageId: item.packageId,
        packageName: item.packageName,
        unitPrice: item.unitPrice,
        depositSnapshot: item.depositSnapshot,
        subtotal: item.subtotal,
        vehicleSnapshot
      };
    }));

    const bookingNumber = this.generateBookingNumber();
    const finalTotal = totalAmount + (data.driverFee || 0);
    // DP not deducted automatically here unless we have downPayment field, so remainingAmount is totalAmount
    const remainingAmount = finalTotal;

    return bookingRepository.createBooking({
      bookingNumber,
      customerId: data.customerId,
      startDate: data.startDate,
      
            rentalType: data.rentalType,
      totalAmount: finalTotal,
      deposit: data.deposit || 0,
      remainingAmount,
      driverFee: data.driverFee,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      notes: data.notes,
      items,
      customerSnapshot,
      status: 'BOOKED',
    });
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    return bookingRepository.updateBookingStatus(id, status);
  }
}

export const bookingService = new BookingService();
