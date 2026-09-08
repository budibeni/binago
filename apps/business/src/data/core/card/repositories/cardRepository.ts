import { CardModel } from '@/features/core/card/types/card';
import { mockCards } from '../mock/cards';

class CredentialRepository {
  private credentials: CardModel[] = [...mockCards];

  async findAll(): Promise<CardModel[]> {
    return Promise.resolve([...this.credentials]);
  }

  async findById(id: string): Promise<CardModel | null> {
    const cred = this.credentials.find(c => c.id === id);
    return Promise.resolve(cred ? { ...cred } : null);
  }

  async findByUid(uid: string): Promise<CardModel | null> {
    const cred = this.credentials.find(c => c.uid === uid);
    return Promise.resolve(cred ? { ...cred } : null);
  }

  async create(data: Omit<CardModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<CardModel> {
    const now = new Date().toISOString();
    const newCred: CardModel = {
      ...data,
      id: `cred-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.credentials.unshift(newCred);
    return Promise.resolve({ ...newCred });
  }

  async update(id: string, data: Partial<Omit<CardModel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CardModel | null> {
    const index = this.credentials.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedCred = {
      ...this.credentials[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.credentials[index] = updatedCred;
    return Promise.resolve({ ...updatedCred });
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.credentials.length;
    this.credentials = this.credentials.filter(c => c.id !== id);
    return Promise.resolve(this.credentials.length < initialLength);
  }
}

export const cardRepository = new CredentialRepository();
