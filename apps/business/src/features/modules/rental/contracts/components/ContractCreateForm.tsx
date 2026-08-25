'use client';

import React from 'react';
import { Button, Input, Textarea, Label, Checkbox } from '@adatrack/ui';
import { Search, User, Car, Calendar, DollarSign, Info } from 'lucide-react';
import type { Reservation } from '@/features/modules/rental/reservations/types/reservation';
import type { RentalContract } from '../types/contract';
import { ReservationSelectModal } from './ReservationSelectModal';

interface ContractCreateFormProps {
  availableReservations: Reservation[];
  labels: Record<string, string>;
  onSubmit: (data: Partial<RentalContract>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ContractCreateForm({
  availableReservations,
  labels,
  onSubmit,
  onCancel,
  isSubmitting,
}: ContractCreateFormProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRes, setSelectedRes] = React.useState<Reservation | null>(null);
  
  // Form State
  const [contractDate, setContractDate] = React.useState<string>(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = React.useState<string>('');
  const [terms, setTerms] = React.useState<string>('1. Penyewa wajib mengembalikan kendaraan tepat waktu.\n2. Segala kerusakan selama masa sewa menjadi tanggung jawab penyewa.\n3. Dilarang memindahtangankan kendaraan kepada pihak ketiga.');
  const [agreed, setAgreed] = React.useState(false);

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
    if (!selectedRes) return;
    if (!agreed) return;

    await onSubmit({
      reservationId: selectedRes.id,
      customerId: selectedRes.customerId,
      vehicleId: selectedRes.vehicleId,
      contractDate: new Date(contractDate).toISOString(),
      
      // Snapshot fields from reservation
      startDate: selectedRes.startDate,
      endDate: selectedRes.endDate,
      duration: selectedRes.duration,
      rentalType: selectedRes.rentalType,
      rateType: selectedRes.rateType,
      rate: selectedRes.rateType === 'DAILY' ? selectedRes.dailyRate : selectedRes.rateType === 'WEEKLY' ? selectedRes.weeklyRate : selectedRes.monthlyRate,
      subtotal: selectedRes.totalAmount,
      totalAmount: selectedRes.totalAmount,
      deposit: selectedRes.deposit,
      remainingAmount: selectedRes.remainingAmount,
      
      notes,
      terms,
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Reservation Selection Section */}
        <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Pilih Reservasi</h2>
              <p className="text-sm text-muted-foreground mt-1">Pilih reservasi yang sudah dikonfirmasi untuk dibuatkan kontrak rental.</p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setModalOpen(true)}
              className="bg-neutral-50 hover:bg-neutral-100"
            >
              <Search className="w-4 h-4 mr-2" />
              {selectedRes ? 'Ganti Reservasi' : 'Cari Reservasi'}
            </Button>
          </div>

          {selectedRes && (
            <div className="mt-6 border border-border rounded-lg p-4 bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">No. Reservasi</p>
                  <p className="font-bold text-primary">{selectedRes.reservationNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Pelanggan</p>
                  <p className="font-semibold">{selectedRes.customer?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedRes.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Kendaraan</p>
                  <p className="font-semibold">{selectedRes.vehicle?.coreVehicle?.plateNumber}</p>
                  <p className="text-xs text-muted-foreground">{selectedRes.vehicle?.coreVehicle?.brand} {selectedRes.vehicle?.coreVehicle?.vehicleName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Periode</p>
                  <p className="font-medium text-sm">{formatDate(selectedRes.startDate)}</p>
                  <p className="font-medium text-sm">{formatDate(selectedRes.endDate)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedRes && (
          <>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Data Terkunci (Snapshot)</p>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
                  Data periode, tarif, dan total tagihan disalin dari reservasi dan tidak dapat diubah pada tahap pembuatan kontrak. 
                  Jika ada perubahan, harap sesuaikan di menu Reservasi terlebih dahulu.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Snapshot Info */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Detail Waktu & Tarif
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-border">
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold">Durasi Sewa</p>
                        <p className="text-sm font-medium">{selectedRes.duration} hari</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold">Tipe Sewa</p>
                        <p className="text-sm font-medium">{selectedRes.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Driver'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-border">
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold">Dasar Tarif</p>
                        <p className="text-sm font-medium">{selectedRes.rateType}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold">Tarif Digunakan</p>
                        <p className="text-sm font-medium">{formatCurrency(selectedRes.rateType === 'DAILY' ? selectedRes.dailyRate : selectedRes.rateType === 'WEEKLY' ? selectedRes.weeklyRate : selectedRes.monthlyRate)}</p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Tagihan</span>
                        <span className="font-semibold">{formatCurrency(selectedRes.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Deposit / DP</span>
                        <span className="font-semibold">{formatCurrency(selectedRes.deposit)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-border">
                        <span className="text-danger">Sisa Tagihan</span>
                        <span className="text-danger">{formatCurrency(selectedRes.remainingAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contract Inputs */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">Informasi Kontrak</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractDate">{labels.fieldContractDate || 'Tanggal Kontrak'}</Label>
                      <Input
                        id="contractDate"
                        type="datetime-local"
                        value={contractDate}
                        onChange={(e) => setContractDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">{labels.fieldContractNotes || 'Catatan Kontrak'}</Label>
                      <Textarea
                        id="notes"
                        placeholder="Tambahkan catatan khusus untuk kontrak ini..."
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="terms">{labels.fieldTerms || 'Syarat & Ketentuan'}</Label>
                      <Textarea
                        id="terms"
                        rows={5}
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                        className="font-mono text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="agree" 
                  checked={agreed} 
                  onCheckedChange={(val) => setAgreed(!!val)} 
                  className="mt-0.5"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="agree"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Setujui Syarat & Ketentuan
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {labels.checklistAgreement || 'Saya telah memeriksa data reservasi dan menyetujui isi kontrak.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="flex-1 sm:flex-none">
                  {labels.btnCancel || 'Batal'}
                </Button>
                <Button type="submit" disabled={!agreed || isSubmitting} className="flex-1 sm:flex-none">
                  {isSubmitting ? 'Menyimpan...' : (labels.btnSaveDraft || 'Simpan Draft Kontrak')}
                </Button>
              </div>
            </div>
          </>
        )}
      </form>

      <ReservationSelectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        reservations={availableReservations}
        onSelect={setSelectedRes}
        labels={labels}
      />
    </div>
  );
}
