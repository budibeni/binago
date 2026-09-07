import { AccessCredential, CredentialStatus, CredentialType } from '@/features/core/card/types/credential';
import { credentialRepository } from '../repositories/credentialRepository';

export interface CredentialFilter {
  search?: string;
  status?: CredentialStatus | 'ALL';
  type?: CredentialType | 'ALL';
}

class CredentialService {
  async getCredentials(filter?: CredentialFilter): Promise<AccessCredential[]> {
    let data = await credentialRepository.findAll();

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

  async getCredentialById(id: string): Promise<AccessCredential | null> {
    return credentialRepository.findById(id);
  }

  async saveCredential(data: Omit<AccessCredential, 'id' | 'createdAt' | 'updatedAt'>, id?: string): Promise<AccessCredential> {
    // Validate UID uniqueness
    const existing = await credentialRepository.findByUid(data.uid);
    if (existing && existing.id !== id) {
      throw new Error('UID sudah digunakan oleh credential lain');
    }

    if (id) {
      const updated = await credentialRepository.update(id, data);
      if (!updated) throw new Error('Credential tidak ditemukan');
      return updated;
    } else {
      return credentialRepository.create(data);
    }
  }

  async deactivateCredential(id: string): Promise<AccessCredential> {
    const updated = await credentialRepository.update(id, { status: 'INACTIVE' });
    if (!updated) throw new Error('Credential tidak ditemukan');
    return updated;
  }
}

export const credentialService = new CredentialService();
