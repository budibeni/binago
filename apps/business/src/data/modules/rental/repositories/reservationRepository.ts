import type { Reservation, ReservationStatus } from '@/features/modules/rental/reservations/types/reservation';
import { mockReservations } from '../mock/reservations';

class ReservationRepository {
  private reservations: Reservation[] = [...mockReservations];

  async getReservations(): Promise<Reservation[]> {
    // In a real app, this would fetch from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.reservations]);
      }, 500);
    });
  }

  async getReservationById(id: string): Promise<Reservation | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const res = this.reservations.find(r => r.id === id);
        resolve(res ? { ...res } : undefined);
      }, 300);
    });
  }

  async createReservation(data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const newReservation: Reservation = {
          ...data,
          id: `res-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        this.reservations.unshift(newReservation);
        resolve({ ...newReservation });
      }, 800);
    });
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index === -1) {
          reject(new Error('Reservation not found'));
          return;
        }
        this.reservations[index] = {
          ...this.reservations[index],
          status,
          updatedAt: new Date().toISOString()
        };
        resolve({ ...this.reservations[index] });
      }, 500);
    });
  }
}

export const reservationRepository = new ReservationRepository();
