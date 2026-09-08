'use client';

import React from 'react';
import { CreditCard, ToggleRight } from 'lucide-react';
import {
  FormShell,
  FormCard,
  InputString,
  InputSelect,
  InputMultiCheckbox,
  InputTextarea,
  useForm,
} from '@adatrack/ui';
import { AccessCredential, CredentialType, CredentialStatus } from '../types/credential';
import type { getCardTranslation } from '../i18n';

type CardTranslation = ReturnType<typeof getCardTranslation>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface CardFormProps {
  /** Edit-only: card yang sedang diedit. */
  card: AccessCredential;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<AccessCredential>) => void;
  onCancel: () => void;
  t: CardTranslation;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CardForm({ card, open, onOpenChange, onSave, onCancel, t }: CardFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<AccessCredential>({
    initialData: card,
    resetOn: [open, card],
    onSubmit: async (data) => {
      await new Promise((r) => setTimeout(r, 600));
      onSave(data);
    },
  });

  return (
    <FormShell
      layout="drawer"
      open={open}
      onOpenChange={onOpenChange}
      title={t.form.title}
      subtitle={`${formData.name ?? ''} · ${formData.uid ?? ''}`}
      onCancel={onCancel}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-6">

        {/* ── Informasi Card ───────────────────────────────────────────── */}
        <FormCard
          title={t.form.sectionInfo}
          description={t.form.descInfo}
          icon={<CreditCard className="w-5 h-5 text-blue-500" />}
          columns={2}
        >

          <InputString
            label={t.form.labelUid}
            value={formData.uid || ''}
            onChange={(val) => handleChange('uid', val as any)}
            error={errors.uid}
            required
            placeholder="04:XX:XX:XX:XX:XX"
            disabled
            helpText={t.form.helpUid}
          />
          <InputSelect
            label={t.form.labelType}
            value={formData.type || ''}
            onChange={(val) => handleChange('type', val as any)}
            options={t.form.typeOptions}
            error={errors.type}
            required
            disabled
            helpText={t.form.helpType}
          />
          <InputString
            label={t.form.labelName}
            value={formData.name || ''}
            onChange={(val) => handleChange('name', val as any)}
            error={errors.name}
            required
            placeholder={t.form.placeholderName}
          />
        </FormCard>

        {/* ── Penggunaan & Status ───────────────────────────────────────────── */}
        <FormCard
          title={t.form.sectionUsage}
          description={t.form.descUsage}
          icon={<ToggleRight className="w-5 h-5 text-green-500" />}
          columns={1}
        >
          <InputMultiCheckbox
            label={t.form.labelPurposes}
            value={(formData.purposes as string[]) || []}
            onChange={(val) => handleChange('purposes', val as any)}
            options={t.form.purposeOptions}
          />
          <InputSelect
            label={t.form.labelStatus}
            value={formData.status || ''}
            onChange={(val) => handleChange('status', val as any)}
            options={t.form.statusOptions}
            error={errors.status}
            required
          />
          <InputTextarea
            label={t.form.labelNotes}
            value={formData.notes || ''}
            onChange={(val) => handleChange('notes', val as any)}
            placeholder={t.form.placeholderNotes}
          />
        </FormCard>

      </div>
    </FormShell>
  );
}
