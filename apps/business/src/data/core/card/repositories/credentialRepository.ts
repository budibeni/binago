import { AccessCredential } from '@/features/core/card/types/credential';
import { mockCredentials } from '../mock/credentials';

class CredentialRepository {
  private credentials: AccessCredential[] = [...mockCredentials];

  async findAll(): Promise<AccessCredential[]> {
    return Promise.resolve([...this.credentials]);
  }

  async findById(id: string): Promise<AccessCredential | null> {
    const cred = this.credentials.find(c => c.id === id);
    return Promise.resolve(cred ? { ...cred } : null);
  }

  async findByUid(uid: string): Promise<AccessCredential | null> {
    const cred = this.credentials.find(c => c.uid === uid);
    return Promise.resolve(cred ? { ...cred } : null);
  }

  async create(data: Omit<AccessCredential, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccessCredential> {
    const now = new Date().toISOString();
    const newCred: AccessCredential = {
      ...data,
      id: `cred-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.credentials.unshift(newCred);
    return Promise.resolve({ ...newCred });
  }

  async update(id: string, data: Partial<Omit<AccessCredential, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AccessCredential | null> {
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

export const credentialRepository = new CredentialRepository();
