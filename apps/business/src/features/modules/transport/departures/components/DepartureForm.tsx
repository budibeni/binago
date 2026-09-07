'use client';

import React from 'react';
import { Button, FormShell, FormCard, InputDate } from '@adatrack/ui';
import { Calendar } from 'lucide-react';

interface DepartureFormProps {
  onCancel: () => void;
  onSave: (date: string) => void;
  error?: string;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DepartureForm({
  onCancel,
  onSave,
  error,
  layout = 'default',
  open,
  onOpenChange
}: DepartureFormProps) {
  const [date, setDate] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(date);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full relative">
      <FormShell
        layout={layout}
        open={open}
        onOpenChange={onOpenChange}
        title="Generate Keberangkatan Harian"
        onCancel={onCancel}
        cancelProps={{ disabled: isSubmitting }}
        saveText={isSubmitting ? 'Memproses...' : 'Generate Keberangkatan'}
        saveProps={{ disabled: isSubmitting || !date }}
        isSubmitting={isSubmitting}
      >
        <div className="w-full mx-auto p-4 lg:p-6 flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-danger/10 text-danger rounded-xl text-sm border border-danger/20 font-medium">
            {error}
          </div>
        )}
        
        <FormCard 
          title="Keberangkatan" 
          description="Sistem akan secara otomatis memeriksa semua jadwal operasional (ACTIVE) yang memiliki hari sesuai dengan tanggal yang dipilih. Keberangkatan akan di-generate untuk masing-masing kendaraan pada jadwal tersebut. Data yang sudah di-generate sebelumnya tidak akan diduplikasi."
          icon={<Calendar className="w-5 h-5 text-primary" />}
        >

          <div className="flex flex-col gap-1.5">
            <InputDate 
              id="date"
              label="Pilih Tanggal"
              value={date} 
              onChange={setDate} 
              required 
            />
          </div>
        </FormCard>
        </div>
      </FormShell>
    </form>
  );
}
