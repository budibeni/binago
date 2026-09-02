'use client';

import React from 'react';
import { Button, Input, Label } from '@adatrack/ui';
import { Calendar } from 'lucide-react';

interface DepartureFormProps {
  onCancel: () => void;
  onSave: (date: string) => void;
  error?: string;
}

export function DepartureForm({
  onCancel,
  onSave,
  error
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
      <div className="w-full mx-auto p-4 lg:p-6 pb-24 flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-danger/10 text-danger rounded-xl text-sm border border-danger/20 font-medium">
            {error}
          </div>
        )}
        
        <div className="bg-background border border-border/60 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground mb-2">
            Sistem akan secara otomatis memeriksa semua jadwal operasional (ACTIVE) yang memiliki hari sesuai dengan tanggal yang dipilih. Keberangkatan akan di-generate untuk masing-masing kendaraan pada jadwal tersebut. Data yang sudah di-generate sebelumnya tidak akan diduplikasi.
          </p>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-foreground-subtle">Pilih Tanggal <span className="text-danger">*</span></Label>
            <Input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-end gap-3 z-50 md:pl-[256px]">
        <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>Batal</Button>
        <Button variant="primary" type="submit" disabled={isSubmitting || !date}>
          {isSubmitting ? 'Memproses...' : 'Generate Keberangkatan'}
        </Button>
      </div>
    </form>
  );
}
