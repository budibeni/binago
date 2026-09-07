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

// ─── Statics ─────────────────────────────────────────────────────────────────

const CARD_TYPE_OPTIONS = [
  { value: 'RFID', label: 'RFID' },
  { value: 'NFC', label: 'NFC' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'INACTIVE', label: 'Tidak Aktif' },
];

const PURPOSE_OPTIONS = [
  { value: 'ATTENDANCE',  label: 'Absensi' },
  { value: 'CHECKER',     label: 'Checker' },
  { value: 'ENGINE_AUTH', label: 'Menghidupkan Mesin' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CardFormProps {
  /** Edit-only: card yang sedang diedit. */
  card: AccessCredential;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<AccessCredential>) => void;
  onCancel: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CardForm({ card, open, onOpenChange, onSave, onCancel }: CardFormProps) {
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
      title="Edit Card"
      subtitle={`${formData.name ?? ''} · ${formData.uid ?? ''}`}
      onCancel={onCancel}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-6">

        {/* ── Informasi Card ────────────────────────────────────── */}
        <FormCard
          title="Informasi Card"
          description="Identitas dan nomor kartu."
          icon={<CreditCard className="w-5 h-5 text-blue-500" />}
          columns={2}
        >

          <InputString
            label="UID / Card Number"
            value={formData.uid || ''}
            onChange={(val) => handleChange('uid', val as any)}
            error={errors.uid}
            required
            placeholder="04:XX:XX:XX:XX:XX"
            disabled
            helpText="UID hanya dapat diubah melalui aplikasi Admin."
          />
          <InputSelect
            label="Jenis Card"
            value={formData.type || ''}
            onChange={(val) => handleChange('type', val as any)}
            options={CARD_TYPE_OPTIONS}
            error={errors.type}
            required
            disabled
            helpText="Jenis card hanya dapat diubah melalui aplikasi Admin."
          />
          <InputString
            label="Nama Card"
            value={formData.name || ''}
            onChange={(val) => handleChange('name', val as any)}
            error={errors.name}
            required
            placeholder="Contoh: CARD-DRV-001"
          />
        </FormCard>

        {/* ── Penggunaan & Status ───────────────────────────────── */}
        <FormCard
          title="Penggunaan & Status"
          description="Fungsi dan status aktif kartu."
          icon={<ToggleRight className="w-5 h-5 text-green-500" />}
          columns={1}
        >
          <InputMultiCheckbox
            label="Penggunaan Kartu"
            value={(formData.purposes as string[]) || []}
            onChange={(val) => handleChange('purposes', val as any)}
            options={PURPOSE_OPTIONS}
          />
          <InputSelect
            label="Status"
            value={formData.status || ''}
            onChange={(val) => handleChange('status', val as any)}
            options={STATUS_OPTIONS}
            error={errors.status}
            required
          />
          <InputTextarea
            label="Catatan"
            value={formData.notes || ''}
            onChange={(val) => handleChange('notes', val as any)}
            placeholder="Tambahkan catatan (opsional)"
          />
        </FormCard>

      </div>
    </FormShell>
  );
}
