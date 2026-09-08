import { personelRepository } from '../repositories/personelRepository';
import type { Personel, PersonelStatusFilter, PersonelTypeFilter } from '@/features/core/personel/types/personel';

export const personelService = {
  getPersonel(search?: string, status?: PersonelStatusFilter, type?: PersonelTypeFilter): Personel[] {
    let personel = personelRepository.getAll();

    if (search) {
      const q = search.toLowerCase();
      personel = personel.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nik && p.nik.toLowerCase().includes(q)) ||
          (p.phone && p.phone.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      personel = personel.filter((p) => p.status === status);
    }

    if (type && type !== 'all') {
      personel = personel.filter((p) => p.personelType === type);
    }

    return personel;
  },

  getPersonelById(id: string): Personel | undefined {
    return personelRepository.getById(id);
  },

  createPersonel(data: Omit<Personel, 'id' | 'createdAt' | 'updatedAt'>): Personel {
    return personelRepository.create(data);
  },

  updatePersonel(id: string, updates: Partial<Omit<Personel, 'id' | 'createdAt' | 'updatedAt'>>): Personel {
    const updated = personelRepository.update(id, updates);
    if (!updated) {
      throw new Error(`Personel with id ${id} not found`);
    }
    return updated;
  },

  deletePersonel(id: string): void {
    const deleted = personelRepository.delete(id);
    if (!deleted) {
      throw new Error(`Personel with id ${id} not found`);
    }
  },
};
