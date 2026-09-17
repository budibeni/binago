'use client';

import React from 'react';
import { z } from 'zod';
import { Folder, FileText } from 'lucide-react';
import { FormShell, FormCard, InputString, InputTextarea, useForm } from '@adatrack/ui';
import type { GroupData } from '../data/mockGroupsData';

export type GroupType = 'vehicle' | 'driver' | 'geofence' | 'route';

export const getGroupFormSchema = () => z.object({
  name: z.string().min(1, 'Nama grup wajib diisi'),
  description: z.string().optional(),
  type: z.enum(['vehicle', 'driver', 'geofence', 'route']),
});

interface GroupFormProps {
  group: GroupData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<GroupData>) => void;
  onCancel: () => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  defaultType?: GroupType;
  title?: string;
}

const DEFAULT_GROUP = {
  name: '',
  description: '',
  type: 'vehicle',
} as unknown as GroupData;

export function GroupForm({
  group,
  open,
  onOpenChange,
  onSave,
  onCancel,
  layout = 'default',
  defaultType = 'vehicle',
  title,
}: GroupFormProps) {
  const isEdit = !!group;
  
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<GroupData>({
    initialData: group || { ...DEFAULT_GROUP, type: defaultType },
    resetOn: [open, group, defaultType],
    schema: getGroupFormSchema(),
    onSubmit: async (data) => {
      // simulate api delay
      await new Promise(r => setTimeout(r, 500));
      onSave(data);
    },
  });

  return (
    <FormShell
      title={title || (isEdit ? 'Ubah Grup' : 'Tambah Grup')}
      open={open}
      onOpenChange={onOpenChange}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      layout={layout}
    >
      <FormCard title="Informasi Dasar">
        <InputString
          label="Nama Grup"
          value={formData.name || ''}
          onChange={(v) => handleChange('name', v)}
          error={errors.name}
          placeholder="Contoh: Logistik Area Jakarta"
        />
        <InputTextarea
          label="Deskripsi"
          value={formData.description || ''}
          onChange={(v) => handleChange('description', v)}
          error={errors.description}
          placeholder="Masukkan deskripsi grup..."
          rows={3}
        />
      </FormCard>
    </FormShell>
  );
}
