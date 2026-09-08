import { CardModel, CardStatus, CardType } from '@/features/core/card/types/card';
import { cardRepository } from '../repositories/cardRepository';

export interface CardFilter {
  search?: string;
  status?: CardStatus | 'ALL';
  type?: CardType | 'ALL';
}

class CardService {
  async getCredentials(filter?: CardFilter): Promise<CardModel[]> {
    let data = await cardRepository.findAll();

    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        data = data.filter(c => 
          c.name.toLowerCase().includes(searchLower) ||
          c.uid.toLowerCase().includes(searchLower) ||
          (c.holderId && c.holderId.toLowerCase().includes(searchLower))
        );
      }
      
      if (filter.status && filter.status !== 'ALL') {
        data = data.filter(c => c.status === filter.status);
      }

      if (filter.type && filter.type !== 'ALL') {
        data = data.filter(c => c.type === filter.type);
      }
    }

    // Sort by newest first
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return data;
  }

  async getCredentialById(id: string): Promise<CardModel | null> {
    return cardRepository.findById(id);
  }

  async saveCredential(data: Omit<CardModel, 'id' | 'createdAt' | 'updatedAt'>, id?: string): Promise<CardModel> {
    // Validate UID uniqueness
    const existing = await cardRepository.findByUid(data.uid);
    if (existing && existing.id !== id) {
      throw new Error('UID sudah digunakan oleh Card lain');
    }

    // Validate 1 person = 1 active card
    if (data.holderType && data.holderId && data.status === 'ACTIVE') {
      const allCards = await cardRepository.findAll();
      const duplicate = allCards.find(c => 
        c.holderType === data.holderType && 
        c.holderId === data.holderId && 
        c.status === 'ACTIVE' && 
        c.id !== id
      );
      if (duplicate) {
        throw new Error('Orang tersebut sudah memiliki Card aktif. Lepas Card sebelumnya terlebih dahulu.');
      }
    }

    // Ensure if type is null, id is also null
    if (!data.holderType) {
      data.holderId = null;
    }

    if (id) {
      const updated = await cardRepository.update(id, data);
      if (!updated) throw new Error('Card tidak ditemukan');
      return updated;
    } else {
      return cardRepository.create(data);
    }
  }

  async deactivateCredential(id: string): Promise<CardModel> {
    const updated = await cardRepository.update(id, { status: 'INACTIVE' });
    if (!updated) throw new Error('Card tidak ditemukan');
    return updated;
  }

  async getActiveAssignments(): Promise<Set<string>> {
    const allCards = await cardRepository.findAll();
    const activeAssignments = new Set<string>();
    allCards.forEach(c => {
      if (c.status === 'ACTIVE' && c.holderId) {
        activeAssignments.add(c.holderId);
      }
    });
    return activeAssignments;
  }
}

export const cardService = new CardService();
