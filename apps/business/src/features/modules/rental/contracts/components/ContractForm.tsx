'use client';

import React from 'react';
import { Button, Checkbox, FormShell, FormCard, InputDateTime, InputTextarea, InputSelect } from '@adatrack/ui';
import { Search, User, Car, Calendar, DollarSign, Info } from 'lucide-react';
import type { Reservation } from '@/features/modules/rental/reservations/types/reservation';
import type { RentalContract } from '../types/contract';
import { ReservationSelectModal } from './ReservationSelectModal';

interface ContractFormProps {
  contract?: RentalContract; // If present, it's Edit Mode
  availableReservations?: Reservation[]; // Required for Create Mode
  labels: Record<string, string>;
  onSubmit: (data: Partial<RentalContract>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContractForm({
  contract,
  availableReservations = [],
  labels,
  onSubmit,
  onCancel,
  isSubmitting,
  layout = 'default',
  open,
  onOpenChange,
}: ContractFormProps) {
  const isEditing = !!contract;

  // Create Mode state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRes, setSelectedRes] = React.useState<Reservation | null>(null);
  
  // Shared Form State
  const [contractDate, setContractDate] = React.useState<string>(contract?.contractDate?.slice(0, 16) || new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = React.useState<string>(contract?.notes || '');
  const [terms, setTerms] = React.useState<string>(contract?.terms || '1. Penyewa wajib mengembalikan kendaraan tepat waktu.\n2. Segala kerusakan selama masa sewa menjadi tanggung jawab penyewa.\n3. Dilarang memindahtangankan kendaraan kepada pihak ketiga.');
  const [agreed, setAgreed] = React.useState(isEditing ? true : false);

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
    
    if (isEditing) {
      await onSubmit({
        contractDate: new Date(contractDate).toISOString(),
        notes,
        terms,
      });
    } else {
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
    }
  };

  // Derive display values based on mode
  const displayRes = isEditing ? contract?.reservation : selectedRes;
  const displayCustomer = isEditing ? contract?.customer : selectedRes?.customer;
  const displayVehicle = isEditing ? contract?.vehicle : selectedRes?.vehicle;
  
  const displayDuration = isEditing ? contract?.duration : selectedRes?.duration;
  const displayRentalType = isEditing ? contract?.rentalType : selectedRes?.rentalType;
  const displayRateType = isEditing ? contract?.rateType : selectedRes?.rateType;
  const displayRate = isEditing ? contract?.rate : (selectedRes?.rateType === 'DAILY' ? selectedRes.dailyRate : selectedRes?.rateType === 'WEEKLY' ? selectedRes.weeklyRate : selectedRes?.monthlyRate);
  const displayTotal = isEditing ? contract?.totalAmount : selectedRes?.totalAmount;
  const displayDeposit = isEditing ? contract?.deposit : selectedRes?.deposit;
  const displayRemaining = isEditing ? (contract!.totalAmount - contract!.deposit) : selectedRes?.remainingAmount;
  const displayStartDate = isEditing ? contract?.startDate : selectedRes?.startDate;
  const displayEndDate = isEditing ? contract?.endDate : selectedRes?.endDate;

  if (!isEditing && !selectedRes) {
    return (
      <FormShell
        layout={layout}
        open={open}
        onOpenChange={onOpenChange}
        title={labels.actionCreate || 'Buat Kontrak Baru'}
        subtitle="Pilih reservasi yang sudah dikonfirmasi untuk dibuatkan kontrak rental."
        onCancel={onCancel}
        cancelText={labels.btnCancel || 'Batal'}
        saveText="Lanjut"
        saveProps={{ disabled: true }}
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-6 p-4 lg:p-6">
          <FormCard 
            title="Pilih Reservasi" 
            description="Pilih reservasi yang sudah dikonfirmasi untuk dibuatkan kontrak rental."
            icon={<Search className="w-5 h-5 text-muted-foreground" />}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <InputSelect
                  label="Cari Reservasi"
                  value=""
                  onChange={(val) => {
                    const res = availableReservations.find(r => r.id === val);
                    if (res) setSelectedRes(res);
                  }}
                  placeholder="Pilih reservasi..."
                  options={availableReservations.map(r => ({
                    value: r.id,
                    label: `${r.reservationNumber} - ${r.customer?.name} (${r.vehicle?.coreVehicle?.plateNumber})`
                  }))}
                />
              </div>
            </div>
          </FormCard>
        </div>
      </FormShell>
    );
  }

  return (
    <>
      <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title={isEditing ? (labels.actionEdit || 'Edit Kontrak') : (labels.actionCreate || 'Buat Kontrak Baru')}
      onCancel={onCancel}
      cancelProps={{ disabled: isSubmitting }}
      cancelText={labels.btnCancel || 'Batal'}
      saveText={isSubmitting ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : (labels.btnSaveDraft || 'Simpan Draft Kontrak')}
      saveProps={{ disabled: (!isEditing && !agreed) || (!isEditing && !selectedRes) || isSubmitting }}
      isSubmitting={isSubmitting}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-6 p-4 lg:p-6">
        
        {!isEditing ? (
              <FormCard 
                title="Pilih Reservasi" 
                description="Pilih reservasi yang sudah dikonfirmasi untuk dibuatkan kontrak rental."
                action={
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setModalOpen(true)}
                    className="bg-neutral-50 hover:bg-neutral-100"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {selectedRes ? 'Ganti Reservasi' : 'Cari Reservasi'}
                  </Button>
                }
              >
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
              </FormCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormCard
                  title="Informasi Reservasi"
                  icon={<Info className="w-5 h-5 text-primary" />}
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold mb-1">No. Reservasi</p>
                      <p className="text-sm font-medium">{displayRes?.reservationNumber || '-'}</p>
                    </div>
                    
                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">Pelanggan</p>
                      </div>
                      <p className="text-sm font-bold text-primary">{displayCustomer?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {displayCustomer?.type === 'COMPANY' ? displayCustomer.picName : (displayCustomer?.type === 'INDIVIDUAL' ? displayCustomer.nik : '')}
                      </p>
                      <p className="text-xs text-muted-foreground">{displayCustomer?.phone}</p>
                    </div>
                  </div>
                </FormCard>

                <FormCard
                  title="Kendaraan"
                  icon={<Car className="w-5 h-5 text-primary" />}
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-border shrink-0 flex items-center justify-center">
                      <Car className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-primary truncate">{displayVehicle?.coreVehicle?.plateNumber}</h4>
                      <p className="text-sm text-muted-foreground font-medium mb-2 truncate">
                        {displayVehicle?.coreVehicle?.brand} {displayVehicle?.coreVehicle?.vehicleName} ({displayVehicle?.coreVehicle?.year})
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-neutral-50 dark:bg-neutral-900 px-2 py-1.5 rounded border border-border">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Warna</p>
                          <p className="text-xs font-semibold">{(displayVehicle?.coreVehicle as any)?.color || '-'}</p>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-900 px-2 py-1.5 rounded border border-border">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">KM Saat Ini</p>
                          <p className="text-xs font-semibold">{displayVehicle?.currentOdometer?.toLocaleString('id-ID')} KM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormCard>
              </div>
            )}

            {(selectedRes || isEditing) && (
              <>
                {!isEditing && (
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
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Snapshot Info */}
                  <div className="space-y-6">
                    <FormCard 
                      title={isEditing ? "Periode & Nilai Kontrak" : "Detail Waktu & Tarif"}
                      icon={!isEditing ? <Calendar className="w-5 h-5 text-muted-foreground" /> : undefined}
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-border">
                          <div>
                            <p className="text-[11px] text-muted-foreground font-semibold">Durasi Sewa</p>
                            <p className="text-sm font-medium">{displayDuration} hari</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground font-semibold">Tipe Sewa</p>
                            <p className="text-sm font-medium">{displayRentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Driver'}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground font-semibold">Mulai</p>
                            <p className="text-sm font-medium">{formatDate(displayStartDate!)}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground font-semibold">Selesai</p>
                            <p className="text-sm font-medium">{formatDate(displayEndDate!)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-border">
                          <div>
                            <p className="text-[11px] text-muted-foreground font-semibold">Dasar Tarif</p>
                            <p className="text-sm font-medium">{displayRateType}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground font-semibold">Tarif Digunakan</p>
                            <p className="text-sm font-medium">{formatCurrency(displayRate || 0)}</p>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-border pt-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{isEditing ? 'Total Pembayaran' : 'Total Tagihan'}</span>
                            <span className="font-semibold">{formatCurrency(displayTotal || 0)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Deposit / DP</span>
                            <span className="font-semibold">{formatCurrency(displayDeposit || 0)}</span>
                          </div>
                          {!isEditing && (
                            <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-border">
                              <span className="text-danger">Sisa Tagihan</span>
                              <span className="text-danger">{formatCurrency(displayRemaining || 0)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </FormCard>
                  </div>

                  {/* Right Column - Contract Inputs */}
                  <div className="space-y-6">
                    <FormCard title={isEditing ? "Informasi Kontrak (Edit)" : "Informasi Kontrak"}>
                      <div className="space-y-4">
                        <div>
                          <InputDateTime
                            id="contractDate"
                            label={labels.fieldContractDate || 'Tanggal Kontrak'}
                            value={contractDate}
                            onChange={(val) => setContractDate(val || '')}
                            required
                          />
                        </div>
                        
                        <div>
                          <InputTextarea
                            id="notes"
                            label={labels.fieldContractNotes || 'Catatan (Opsional)'}
                            placeholder="Tambahkan catatan khusus untuk kontrak ini..."
                            rows={3}
                            value={notes}
                            onChange={setNotes}
                          />
                        </div>

                        <div>
                          <InputTextarea
                            id="terms"
                            label={labels.fieldTerms || 'Syarat & Ketentuan'}
                            rows={5}
                            value={terms}
                            onChange={setTerms}
                            required
                            className="font-mono text-xs leading-relaxed"
                            helpText="Syarat dan ketentuan ini akan dicetak pada dokumen kontrak."
                          />
                        </div>
                      </div>
                    </FormCard>
                  </div>
                </div>

                {/* Submit Action for Create Mode */}
                {!isEditing && (
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
                  </div>
                )}
              </>
            )}
          </div>
      </FormShell>

      {!isEditing && (
        <ReservationSelectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          reservations={availableReservations || []}
          onSelect={setSelectedRes}
          labels={labels}
        />
      )}
    </>
  );
}
