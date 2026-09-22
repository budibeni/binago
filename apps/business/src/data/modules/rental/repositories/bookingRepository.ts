import type { Booking, BookingStatus } from '@/features/modules/rental/bookings/types/booking';
import { mockBookings } from '../mock/bookings';

class BookingRepository {
  private bookings: Booking[] = [...mockBookings];

  async getBookings(): Promise<Booking[]> {
    // In a real app, this would fetch from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.bookings]);
      }, 500);
    });
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const res = this.bookings.find(r => r.id === id);
        resolve(res ? { ...res } : undefined);
      }, 300);
    });
  }

  async createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const bookingId = `res-${Date.now()}`;
        
        // Ensure items have the correct bookingId and generated id
        const items = data.items.map((item, index) => ({
          ...item,
          id: item.id || `${bookingId}-item-${index + 1}`,
          bookingId: bookingId,
        }));
        
        const newBooking: Booking = {
          ...data,
          id: bookingId,
          items,
          createdAt: now,
          updatedAt: now,
        };
        this.bookings.unshift(newBooking);
        resolve({ ...newBooking });
      }, 800);
    });
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.bookings.findIndex(r => r.id === id);
        if (index === -1) {
          reject(new Error('Booking not found'));
          return;
        }
        this.bookings[index] = {
          ...this.bookings[index],
          status,
          updatedAt: new Date().toISOString()
        };
        resolve({ ...this.bookings[index] });
      }, 500);
    });
  }
}

export const bookingRepository = new BookingRepository();
