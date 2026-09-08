export type CardType = 'RFID' | 'NFC';
export type CardStatus = 'ACTIVE' | 'INACTIVE';
export type CardHolderType = 'DRIVER' | 'PERSONEL';
export type CardPurpose = 'ATTENDANCE' | 'CHECKER' | 'ENGINE_AUTH';

export interface CardModel {
  id: string;
  name: string;
  type: CardType;
  uid: string;
  holderType: CardHolderType | null;
  holderId: string | null;
  purposes: CardPurpose[];
  status: CardStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // UI ONLY
  holderName?: string;
  holderSubtitle?: string;
}
