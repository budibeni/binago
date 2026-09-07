export type CredentialType = 'RFID' | 'NFC';
export type CredentialStatus = 'ACTIVE' | 'INACTIVE';
export type CredentialHolderType = 'DRIVER' | 'CHECKER' | 'MANAGEMENT' | 'TECHNICIAN' | 'STAFF' | 'OTHER';
export type CredentialPurpose = 'ATTENDANCE' | 'CHECKER' | 'ENGINE_AUTH';

export interface AccessCredential {
  id: string;
  name: string;
  type: CredentialType;
  uid: string;
  holderType: CredentialHolderType;
  holderId: string | null;
  purposes: CredentialPurpose[];
  status: CredentialStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
