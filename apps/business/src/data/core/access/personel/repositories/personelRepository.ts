import type { Personel } from '@/features/core/access/personel/types/personel';
import { mockPersonel } from '@/features/core/access/personel/data/mockPersonel';

class PersonelRepository {
  private personel: Personel[];

  constructor() {
    this.personel = mockPersonel.map((p) => ({ ...p }));
  }

  getAll(): Personel[] {
    return this.personel;
  }

  getById(id: string): Personel | undefined {
    return this.personel.find((p) => p.id === id);
  }

  create(personel: Omit<Personel, 'id' | 'createdAt' | 'updatedAt'>): Personel {
    const newPersonel: Personel = {
      ...personel,
      id: `per-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.personel.push(newPersonel);
    return newPersonel;
  }

  update(id: string, updates: Partial<Omit<Personel, 'id' | 'createdAt' | 'updatedAt'>>): Personel | undefined {
    const index = this.personel.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.personel[index] = {
      ...this.personel[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.personel[index];
  }

  delete(id: string): boolean {
    const index = this.personel.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.personel.splice(index, 1);
    return true;
  }
}

export const personelRepository = new PersonelRepository();
