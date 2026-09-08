export type CardActivityType = 'ATTENDANCE' | 'CHECKER' | 'ENGINE_AUTH';

export type CardLogStatus = 'SUCCESS' | 'FAILED';

export type HolderType = 'DRIVER' | 'PERSONEL' | null;

export interface CardLog {
  id: string;
  timestamp: string; // ISO string
  createdAt: string; // ISO string
  
  cardId: string;
  cardName: string;
  cardUid: string;
  
  holderType: HolderType;
  holderId: string | null;
  holderName: string | null;
  
  activityType: CardActivityType;
  
  vehicleId: string | null;
  vehicleName: string | null;
  vehiclePlateNumber: string | null;
  
  status: CardLogStatus;
  message?: string; // Reason for failure, etc.
}
