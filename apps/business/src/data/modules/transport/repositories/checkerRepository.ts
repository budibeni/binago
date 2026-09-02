import type { Checker } from '@/features/modules/transport/checker/types/checker';
import { mockCheckers } from '../mock/checkers';

class CheckerRepository {
  private checkers: Checker[];

  constructor() {
    this.checkers = [...mockCheckers];
  }

  getAll(): Checker[] {
    return this.checkers;
  }

  getById(id: string): Checker | undefined {
    return this.checkers.find(c => c.id === id);
  }
}

export const checkerRepository = new CheckerRepository();
