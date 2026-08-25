import { mockHandovers } from '../mock/handovers';
import type { RentalHandover } from '@/features/modules/rental/handover/types/handover';

class HandoverRepository {
  private handovers = [...mockHandovers];

  async getHandovers(): Promise<RentalHandover[]> {
    return [...this.handovers];
  }

  async getHandoverById(id: string): Promise<RentalHandover | undefined> {
    return this.handovers.find(h => h.id === id);
  }

  async getHandoverByContractId(contractId: string): Promise<RentalHandover | undefined> {
    return this.handovers.find(h => h.contractId === contractId);
  }

  async createHandover(data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>): Promise<RentalHandover> {
    const newHandover: RentalHandover = {
      ...data,
      id: `hndv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.handovers.push(newHandover);
    return { ...newHandover };
  }
}

export const handoverRepository = new HandoverRepository();
