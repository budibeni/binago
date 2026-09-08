'use client';

import React from 'react';
import { CreditCard, ToggleRight, UserCircle2 } from 'lucide-react';
import {
  FormShell,
  FormCard,
  InputString,
  InputSelect,
  InputMultiCheckbox,
  InputTextarea,
  useForm,
} from '@adatrack/ui';
import { CardModel, CardType, CardStatus } from '../types/card';
import type { getCardTranslation } from '../i18n';
import { driverService } from '@/data/services/driverService';
import { personelService } from '@/data/services/personelService';

type CardTranslation = ReturnType<typeof getCardTranslation>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface CardFormProps {
  /** Edit-only: card yang sedang diedit. */
  card: CardModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<CardModel>) => void;
  onCancel: () => void;
  activeAssignments: Set<string>;
  layout?: 'default' | 'drawer' | 'fullscreen';
  t: CardTranslation;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CardForm({ card, open, onOpenChange, onSave, onCancel, activeAssignments, layout = 'drawer', t }: CardFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<CardModel>({
    initialData: card,
    resetOn: [open, card],
    onSubmit: async (data) => {
      await new Promise((r) => setTimeout(r, 600));
      onSave(data);
    },
  });

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={t.form.title}
      subtitle={`${formData.name ?? ''} · ${formData.uid ?? ''}`}
      onCancel={onCancel}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      columns={2}
    >
      {/* Kolom Kiri */}
      <div className="flex flex-col gap-6">
        {/* ── Informasi Card ───────────────────────────────────────────── */}
        <FormCard
          title={t.form.sectionInfo}
          description={t.form.descInfo}
          icon={<CreditCard className="w-5 h-5 text-blue-500" />}
          columns={2}
        >

          <div className="col-span-2 group-data-[layout=default]/form:md:col-span-1">
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
          </div>
          <div className="col-span-2 group-data-[layout=default]/form:md:col-span-1">
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
          </div>
          <div className="col-span-2 group-data-[layout=default]/form:md:col-span-1">
            <InputString
              label={t.form.labelName}
              value={formData.name || ''}
              onChange={(val) => handleChange('name', val as any)}
              error={errors.name}
              required
              placeholder={t.form.placeholderName}
            />
          </div>
          <div className="col-span-2 group-data-[layout=default]/form:md:col-span-1">
            <InputSelect
              label={t.form.labelStatus}
              value={formData.status || ''}
              onChange={(val) => handleChange('status', val as any)}
              options={t.form.statusOptions}
              error={errors.status}
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <InputTextarea
              label={t.form.labelNotes}
              value={formData.notes || ''}
              onChange={(val) => handleChange('notes', val as any)}
              placeholder={t.form.placeholderNotes}
            />
          </div>
        </FormCard>
      </div>

      {/* Kolom Kanan */}
      <div className="flex flex-col gap-6">
        {/* ── Pemegang Card ───────────────────────────────────────────── */}
        <FormCard
          title={t.form.sectionHolder}
          description={t.form.descHolder}
          icon={<UserCircle2 className="w-5 h-5 text-indigo-500" />}
          columns={1}
        >
          <InputSelect
            label={t.form.labelHolderType}
            value={formData.holderType ?? 'NONE'}
            onChange={(val) => {
              handleChange('holderType', val === 'NONE' ? null : (val as any));
              handleChange('holderId', null);
            }}
            options={[
              { value: 'NONE', label: t.form.valNone },
              { value: 'DRIVER', label: t.form.valDriver },
              { value: 'PERSONEL', label: t.form.valPersonel },
            ]}
          />
          {formData.holderType === 'DRIVER' && (
            <InputSelect
              label={t.form.labelHolder}
              value={formData.holderId || ''}
              onChange={(val) => handleChange('holderId', val as string)}
              options={driverService.getDrivers().filter(d =>
                !activeAssignments.has(d.id) || d.id === card.holderId
              ).map(d => ({ value: d.id, label: d.name }))}
            />
          )}
          {formData.holderType === 'PERSONEL' && (
            <InputSelect
              label={t.form.labelHolder}
              value={formData.holderId || ''}
              onChange={(val) => handleChange('holderId', val as string)}
              options={personelService.getPersonel().filter(p =>
                !activeAssignments.has(p.id) || p.id === card.holderId
              ).map(p => ({ value: p.id, label: `${p.name} (${p.personelType})` }))}
            />
          )}

          <div className="pt-4 border-t border-border mt-2">
            <InputMultiCheckbox
              label={t.form.labelPurposes}
              value={(formData.purposes as string[]) || []}
              onChange={(val) => handleChange('purposes', val as any)}
              options={t.form.purposeOptions}
            />
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}
