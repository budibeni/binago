import { mockReturns } from '../mock/returns';
import type { RentalReturn } from '@/features/modules/rental/returns/types/return';

class ReturnRepository {
  private returns = [...mockReturns];

  async getReturns(): Promise<RentalReturn[]> {
    return [...this.returns];
  }

  async getReturnById(id: string): Promise<RentalReturn | undefined> {
    return this.returns.find(r => r.id === id);
  }

  async getReturnByContractId(contractId: string): Promise<RentalReturn | undefined> {
    return this.returns.find(r => r.contractId === contractId);
  }

  async createReturn(data: Omit<RentalReturn, 'id' | 'createdAt' | 'updatedAt'>): Promise<RentalReturn> {
    const now = new Date().toISOString();
    const newReturn: RentalReturn = {
      ...data,
      id: `RET-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.returns.push(newReturn);
    return { ...newReturn };
  }
}

export const returnRepository = new ReturnRepository();
