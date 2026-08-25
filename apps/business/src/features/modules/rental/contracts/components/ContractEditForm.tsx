'use client';

import React from 'react';
import { Button, Input, Textarea, Label } from '@adatrack/ui';
import { User, Car, Calendar, DollarSign, Info } from 'lucide-react';
import type { RentalContract } from '../types/contract';

interface ContractEditFormProps {
  contract: RentalContract;
  labels: Record<string, string>;
  onSubmit: (data: Partial<RentalContract>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ContractEditForm({
  contract,
  labels,
  onSubmit,
  onCancel,
  isSubmitting,
}: ContractEditFormProps) {
  // Editable fields
  const [contractDate, setContractDate] = React.useState<string>(contract.contractDate.slice(0, 16));
  const [notes, setNotes] = React.useState<string>(contract.notes || '');
  const [terms, setTerms] = React.useState<string>(contract.terms || '');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      contractDate: new Date(contractDate).toISOString(),
      notes,
      terms,
    });
  };

  const res = contract.reservation;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      
      {/* 1. INFORMASI RESERVASI & PELANGGAN (READONLY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Informasi Reservasi</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">No. Reservasi</p>
              <p className="text-sm font-medium">{res?.reservationNumber || '-'}</p>
            </div>
            
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Pelanggan</p>
              </div>
              <p className="text-sm font-bold text-primary">{contract.customer?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {contract.customer?.type === 'COMPANY' ? contract.customer.picName : (contract.customer?.type === 'INDIVIDUAL' ? contract.customer.nik : '')}
              </p>
              <p className="text-xs text-muted-foreground">{contract.customer?.phone}</p>
            </div>
          </div>
        </div>

        {/* 2. KENDARAAN (READONLY) */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Car className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Kendaraan</h3>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-border shrink-0 flex items-center justify-center">
              <Car className="w-8 h-8 text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg text-primary truncate">{contract.vehicle?.coreVehicle?.plateNumber}</h4>
              <p className="text-sm text-muted-foreground font-medium mb-2 truncate">
                {contract.vehicle?.coreVehicle?.brand} {contract.vehicle?.coreVehicle?.vehicleName} ({contract.vehicle?.coreVehicle?.year})
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-neutral-50 dark:bg-neutral-900 px-2 py-1.5 rounded border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Warna</p>
                  <p className="text-xs font-semibold">{(contract.vehicle?.coreVehicle as any)?.color || '-'}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 px-2 py-1.5 rounded border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">KM Saat Ini</p>
                  <p className="text-xs font-semibold">{contract.vehicle?.currentOdometer?.toLocaleString('id-ID')} KM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PERIODE & NILAI (READONLY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Periode Rental</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold">Tipe Sewa</p>
              <p className="text-sm font-medium">{contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Driver'}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold">Durasi</p>
              <p className="text-sm font-medium">{contract.duration} Hari</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold">Mulai</p>
              <p className="text-sm font-medium">{formatDate(contract.startDate)}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold">Selesai</p>
              <p className="text-sm font-medium">{formatDate(contract.endDate)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Nilai Kontrak</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Tarif ({contract.rateType})</span>
              <span className="font-medium">{formatCurrency(contract.rate)} / {contract.rateType === 'DAILY' ? 'hari' : contract.rateType === 'WEEKLY' ? 'minggu' : 'bulan'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal ({contract.duration} hari)</span>
              <span className="font-medium">{formatCurrency(contract.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-success">
              <span className="font-semibold">Deposit</span>
              <span className="font-semibold">{formatCurrency(contract.deposit)}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="font-bold">Total Pembayaran</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(contract.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INFORMASI KONTRAK (EDITABLE) */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 pb-3 border-b border-border">Informasi Kontrak (Edit)</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Tanggal Kontrak</Label>
              <Input 
                type="datetime-local" 
                value={contractDate}
                onChange={(e) => setContractDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Catatan (Opsional)</Label>
            <Textarea 
              placeholder="Tambahkan catatan khusus untuk kontrak ini..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Syarat & Ketentuan</Label>
            <Textarea 
              rows={6}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Syarat dan ketentuan ini akan dicetak pada dokumen kontrak.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-lg flex justify-end gap-3 z-40">
        <div className="max-w-5xl mx-auto w-full flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </form>
  );
}
