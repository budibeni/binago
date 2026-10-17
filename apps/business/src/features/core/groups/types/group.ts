import { z } from 'zod';

export type GroupType = 'vehicle' | 'driver' | 'geofence' | 'route';

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: GroupType;
}

// Backward-compatible alias
export type GroupData = Group;

export const getGroupFormSchema = (t?: Record<string, string>) =>
  z.object({
    name: z.string().min(1, t?.nameRequired || 'Nama grup wajib diisi'),
    description: z.string().optional().default(''),
    type: z.enum(['vehicle', 'driver', 'geofence', 'route'], {
      message: t?.typeRequired || 'Tipe grup wajib dipilih',
    }),
  });

export const groupFormSchema = getGroupFormSchema();

export type GroupFormValues = z.infer<typeof groupFormSchema>;
