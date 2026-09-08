import { CardLog } from '@/features/core/access/log/types/log';
import { mockLogs } from '../mock/logs';

export class LogRepository {
  async findAll(): Promise<CardLog[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockLogs];
  }

  async findById(id: string): Promise<CardLog | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const log = mockLogs.find((l) => l.id === id);
    return log || null;
  }

  async findByCardId(cardId: string): Promise<CardLog[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockLogs.filter((l) => l.cardId === cardId);
  }

  async findByHolderId(holderId: string): Promise<CardLog[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockLogs.filter((l) => l.holderId === holderId);
  }

  async findByVehicleId(vehicleId: string): Promise<CardLog[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockLogs.filter((l) => l.vehicleId === vehicleId);
  }
}

export const logRepository = new LogRepository();
