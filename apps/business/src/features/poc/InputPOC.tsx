import React, { useState } from 'react';
import { FormShell, FormCard, FormFooter } from '@adatrack/ui';
import {
  InputString,
  InputNumber,
  InputDecimal,
  InputDate,
  InputTime,
  InputDateTime,
  InputSelect,
  InputMultiSelect,
  InputTextarea,
  InputPhone,
  InputEmail,
  InputPassword,
  InputSearch,
} from '@adatrack/ui';

export function InputPOC() {
  const [formData, setFormData] = useState({
    stringVal: '',
    numberVal: null as number | null,
    decimalVal: null as number | null,
    dateVal: '',
    timeVal: '',
    datetimeVal: '',
    selectVal: '',
    multiSelectVal: [] as string[],
    textareaVal: '',
    phoneVal: '',
    emailVal: '',
    passwordVal: '',
    searchVal: '',
  });

  const options = [
    { value: '1', label: 'Opsi Pertama' },
    { value: '2', label: 'Opsi Kedua' },
    { value: '3', label: 'Opsi Ketiga' },
  ];

  return (
    <FormShell
      open={true}
      layout="default"
      title="POC Standardized Inputs"
      subtitle="Menampilkan semua implementasi 13 komponen form."
    >
      <div className="space-y-6">
        <FormCard
          title="Teks Dasar"
          description="Komponen input teks dasar seperti String, Textarea, dan Search."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputString
              label="Input String"
              value={formData.stringVal}
              onChange={(v) => setFormData({ ...formData, stringVal: v })}
              placeholder="Ketik teks biasa..."
              required
              helpText="Ini adalah InputString biasa."
            />
            <InputSearch
              label="Input Search"
              value={formData.searchVal}
              onChange={(v) => setFormData({ ...formData, searchVal: v })}
            />
            <div className="md:col-span-2">
              <InputTextarea
                label="Input Textarea"
                value={formData.textareaVal}
                onChange={(v) => setFormData({ ...formData, textareaVal: v })}
                placeholder="Teks panjang..."
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Angka" description="Input khusus angka bulat dan desimal.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputNumber
              label="Input Number"
              value={formData.numberVal}
              onChange={(v) => setFormData({ ...formData, numberVal: v })}
              placeholder="0"
              helpText="Hanya menerima angka bulat."
            />
            <InputDecimal
              label="Input Decimal"
              value={formData.decimalVal}
              onChange={(v) => setFormData({ ...formData, decimalVal: v })}
              placeholder="0.00"
              helpText="Menerima angka desimal (titik)."
            />
          </div>
        </FormCard>

        <FormCard title="Tanggal & Waktu" description="Input Native Date & Time.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputDate
              label="Input Date"
              value={formData.dateVal}
              onChange={(v) => setFormData({ ...formData, dateVal: v })}
            />
            <InputTime
              label="Input Time"
              value={formData.timeVal}
              onChange={(v) => setFormData({ ...formData, timeVal: v })}
            />
            <InputDateTime
              label="Input DateTime"
              value={formData.datetimeVal}
              onChange={(v) => setFormData({ ...formData, datetimeVal: v })}
            />
          </div>
        </FormCard>

        <FormCard title="Pilihan" description="Select dropdowns.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSelect
              label="Input Select"
              value={formData.selectVal}
              onChange={(v) => setFormData({ ...formData, selectVal: v })}
              options={options}
            />
            <InputMultiSelect
              label="Input MultiSelect"
              value={formData.multiSelectVal}
              onChange={(v) => setFormData({ ...formData, multiSelectVal: v })}
              options={options}
              helpText="Pilih beberapa opsi sekaligus."
            />
          </div>
        </FormCard>

        <FormCard title="Spesial" description="Input email, password, dan telepon.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputEmail
              label="Input Email"
              value={formData.emailVal}
              onChange={(v) => setFormData({ ...formData, emailVal: v })}
            />
            <InputPhone
              label="Input Phone"
              value={formData.phoneVal}
              onChange={(v) => setFormData({ ...formData, phoneVal: v })}
            />
            <InputPassword
              label="Input Password"
              value={formData.passwordVal}
              onChange={(v) => setFormData({ ...formData, passwordVal: v })}
            />
          </div>
        </FormCard>

        <FormFooter
          leftContent={<span className="text-sm text-foreground-muted">POC Preview</span>}
          onSave={() => console.log(formData)}
          saveText="Simpan Data"
        />
      </div>
    </FormShell>
  );
}
