'use client';

import React from 'react';
import { FormShell, FormCard, InputString, InputTextarea, useForm, toast } from '@adatrack/ui';
import type { Locale } from '@adatrack/types';
import type { Group, GroupType } from '../types';
import { getGroupFormSchema } from '../types';
import { getGroupTranslation } from '../i18n';

interface GroupFormProps {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Group>) => void;
  onCancel: () => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  defaultType?: GroupType;
  title?: string;
  locale?: Locale;
}

const DEFAULT_GROUP: Omit<Group, 'id' | 'memberCount'> = {
  name: '',
  description: '',
  type: 'vehicle',
};

export function GroupForm({
  group,
  open,
  onOpenChange,
  onSave,
  onCancel,
  layout = 'drawer',
  defaultType = 'vehicle',
  title,
  locale = 'id',
}: GroupFormProps) {
  const isEdit = !!group;
  const t = getGroupTranslation(locale);
  const formT = t.form;

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<Group>({
    initialData: (group || { ...DEFAULT_GROUP, type: defaultType, id: '', memberCount: 0 }) as Group,
    resetOn: [open, group, defaultType],
    schema: getGroupFormSchema(t.validation),
    onError: () => {
      toast.error(t.validation?.incompleteForm || (locale === 'en' ? 'Please complete the required fields' : 'Mohon lengkapi formulir dengan benar'));
    },
    onSubmit: async (data) => {
      // Small simulated delay for enterprise feel
      await new Promise((r) => setTimeout(r, 200));
      onSave(data);
    },
  });

  const getPlaceholder = () => {
    switch (formData.type) {
      case 'vehicle':
        return formT.placeholders.vehicle;
      case 'driver':
        return formT.placeholders.driver;
      case 'geofence':
        return formT.placeholders.geofence;
      case 'route':
        return formT.placeholders.route;
      default:
        return formT.placeholders.default;
    }
  };

  return (
    <FormShell
      title={title || (isEdit ? formT.editTitle : formT.addTitle)}
      open={open}
      onOpenChange={onOpenChange}
      onCancel={onCancel}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      layout={layout}
      saveProps={{ id: 'group-form-save-btn' }}
    >
      <div id="group-form-card" className="space-y-4">
        <FormCard>
          <InputString
            label={formT.name}
            value={formData.name || ''}
            onChange={(v) => handleChange('name', v)}
            error={errors.name}
            placeholder={getPlaceholder()}
            required
          />
          <InputTextarea
            label={formT.description}
            value={formData.description || ''}
            onChange={(v) => handleChange('description', v)}
            error={errors.description}
            placeholder={formT.descriptionPlaceholder}
            rows={3}
          />
        </FormCard>
      </div>
    </FormShell>
  );
}
