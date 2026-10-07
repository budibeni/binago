'use client';

import React from 'react';
import { Button, FormShell, FormCard, InputDateTime, InputTextarea, Label } from '@adatrack/ui';
import { Search, User, Car, Calendar, DollarSign, Info, FileText, CheckCircle2, ChevronRight, Hash, ClipboardList } from 'lucide-react';
import type { Booking } from '@/features/modules/rental/bookings/types/booking';
import type { RentalContract } from '../types/contract';
import { BookingView } from '@/features/modules/rental/bookings/components/BookingView';
import { cn, formatCurrency, formatDate } from '@adatrack/utils';

interface ContractFormProps {
  contract?: RentalContract; // If present, it's Edit Mode
  availableBookings?: Booking[]; // Required for Create Mode
  labels: Record<string, any>;
  onSubmit: (data: Partial<RentalContract>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}


  const getMaxEndDate = (items: any[]) => {
    if (!items || items.length === 0) return "";
    let max = new Date(items[0].startDate || "");
    for (const item of items) {
      if (!item.startDate) continue;
      const d = new Date(item.startDate);
      if (item.rateType === "HOURLY") d.setHours(d.getHours() + (item.duration || 1));
      else d.setDate(d.getDate() + (item.duration || 1)); // simplifying package/daily
      if (d > max) max = d;
    }
    return max.toISOString();
  };

export function ContractForm({
  contract,
  availableBookings = [],
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
  const [selectedRes, setSelectedRes] = React.useState<Booking | null>(null);
  const [searchBooking, setSearchBooking] = React.useState('');
  const [showBookingDetail, setShowBookingDetail] = React.useState(false);

  // Shared Form State
  const [contractDate, setContractDate] = React.useState<string>(contract?.contractDate?.slice(0, 16) || new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = React.useState<string>(contract?.notes || '');
  const [agreed, setAgreed] = React.useState(isEditing ? true : false);

  
  
  const filteredBookings = React.useMemo(() => {
    if (!searchBooking) return availableBookings;
    const s = searchBooking.toLowerCase();
    return availableBookings.filter(r => 
      r.bookingNumber?.toLowerCase().includes(s) ||
      r.customerSnapshot?.name?.toLowerCase().includes(s) ||
      r.items?.some(item => item.vehicleSnapshot?.licensePlate?.toLowerCase().includes(s))
    );
  }, [availableBookings, searchBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      await onSubmit({
        contractDate: new Date(contractDate).toISOString(),
        notes,
      });
    } else {
      if (!selectedRes) return;

      await onSubmit({
        /* bookingId was here */
        contractDate: new Date(contractDate).toISOString(),
        notes,
      });
    }
  };

  // Derive display values based on mode
  const displayRes = isEditing ? contract : selectedRes;
  const displayCustomer = isEditing ? contract?.customer : selectedRes?.customer;

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title={isEditing ? (labels.actionEdit || 'Edit Kontrak') : (labels.actionCreate || 'Buat Kontrak Baru')}
      subtitle={isEditing ? (labels.subtitleEdit || 'Ubah informasi kontrak.') : (labels.subtitleCreate || 'Terbitkan dokumen kontrak dari booking.')}
      onCancel={onCancel}
      cancelProps={{ disabled: isSubmitting }}
      cancelText={labels.btnCancel || 'Batal'}
      saveText={isSubmitting ? (labels.actionSaving || 'Menyimpan...') : isEditing ? (labels.actionSaveChanges || 'Simpan Perubahan') : (labels.btnSaveDraft || 'Simpan Kontrak')}
      saveProps={{ disabled: (!isEditing && !selectedRes) || isSubmitting }}
      isSubmitting={isSubmitting}
      columns={2}
    >
      {/* KIRI: BOOKING */}
      <div className="flex flex-col gap-6 h-full">
        {!selectedRes ? (
          <FormCard
            title={labels.titleSelectBooking || 'Pilih Booking'}
            description={labels.descSelectBooking || 'Pilih booking untuk dibuatkan kontrak.'}
            icon={<Search className="w-5 h-5 text-primary" />}
            iconWrapperClassName="bg-primary/10"
            className="h-full"
            contentClassName="flex flex-col h-[calc(100vh-220px)] min-h-[400px] max-h-[700px]"
          >
            <div className="relative mb-3 shrink-0 group">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                className="w-full h-9 pl-8 pr-3 rounded-lg border border-border/60 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-[13px] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-all"
                placeholder={labels.searchPlaceholder || 'Cari no booking, pelanggan...'} 
                value={searchBooking}
                onChange={(e) => setSearchBooking(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-1.5">
              {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Search className="w-6 h-6 text-neutral-400 mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-foreground">{labels.notFoundTitle || 'Tidak ditemukan'}</p>
                  <p className="text-xs text-muted-foreground mt-1">{labels.notFoundDesc || 'Coba kata kunci lain.'}</p>
                </div>
              ) : (
                filteredBookings.map(r => (
                  <div 
                    key={r.id} 
                    className="py-2 px-3 border border-border/60 rounded-lg hover:border-primary hover:bg-primary/[0.02] cursor-pointer transition-all group relative overflow-hidden"
                    onClick={() => setSelectedRes(r)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">{r.bookingNumber}</span>
                      <span className="text-[10px] font-medium text-muted-foreground bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Car className="w-3 h-3" /> {r.items?.length || 0}
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground text-[13px] truncate">{r.customerSnapshot?.name}</h4>
                    <div className="flex justify-between items-end mt-1">
                      <p className="text-[11px] text-muted-foreground font-medium">{formatDate(r.startDate).split(' ')[0]} - {formatDate(getMaxEndDate(r.items)).split(' ')[0]}</p>
                      <p className="text-xs font-bold text-foreground">{formatCurrency(r.totalAmount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </FormCard>
        ) : (
          <FormCard
            title={labels.titleBookingSummary || 'Ringkasan Booking'}
            description={labels.descBookingSummary || 'Informasi pesanan yang telah dipilih.'}
            icon={<ClipboardList className="w-5 h-5 text-blue-500" />}
            iconWrapperClassName="bg-blue-100 dark:bg-blue-900/30"
            className="h-full"
            action={
              !isEditing && (
                <button
                  type="button"
                  onClick={() => setSelectedRes(null)}
                  className="text-xs text-muted-foreground hover:text-primary font-medium underline underline-offset-4"
                >
                  {labels.btnChange || 'Ganti'}
                </button>
              )
            }
          >
            <div className="flex flex-col gap-5 h-full">
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                <div>
                  <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{labels.fieldCustomer || 'Pelanggan'}</p>
                  <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">
                    {isEditing ? (contract?.customerSnapshot?.name || contract?.customer?.name) : displayRes?.customerSnapshot?.name}
                  </p>
                  <p className="text-[12px] group-data-[layout=drawer]/form:!text-[11px] group-data-[layout=dialog]/form:!text-[11px] text-muted-foreground">
                    {isEditing ? (contract?.customerSnapshot?.phone || contract?.customer?.phone) : displayRes?.customerSnapshot?.phone}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{labels.fieldBookingNo || 'No. Booking'}</p>
                    <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">{displayRes?.bookingNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{labels.fieldRentalType || 'Tipe Sewa'}</p>
                    <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">{displayRes?.rentalType === 'SELF_DRIVE' ? (labels.rentalTypeSelfDrive || 'Lepas Kunci') : (labels.rentalTypeWithDriver || 'Dgn Pengemudi')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{labels.fieldStart || 'Mulai'}</p>
                    <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">{formatDate(displayRes?.startDate || '').split(' ')[0]}</p>
                  </div>
                  <div>
                    <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{labels.fieldEnd || 'Selesai'}</p>
                    <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">{formatDate(getMaxEndDate(displayRes?.items || []) || '').split(' ')[0]}</p>
                  </div>
                </div>
              </div>

              {displayRes?.items && displayRes.items.length > 0 && (
                <div className="border border-border/60 rounded-xl overflow-hidden">
                  <div className="bg-neutral-50 dark:bg-neutral-900 px-3 py-2 border-b border-border/60 flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground">{labels.fieldVehicles || 'Kendaraan'} ({displayRes.items.length})</p>
                  </div>
                  <div className="divide-y divide-border/60 bg-white dark:bg-neutral-900/50">
                    {displayRes.items.map((item) => (
                      <div key={item.id} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="text-[13px] font-bold text-foreground">{item.vehicleSnapshot?.licensePlate}</p>
                          <p className="text-[11px] text-muted-foreground">{item.vehicleSnapshot?.brand} {item.vehicleSnapshot?.model}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-muted-foreground">Durasi: {item.duration} {item.rateType === 'HOURLY' ? 'Jam' : 'Hari'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-auto border-t border-border/50 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[13px] text-muted-foreground font-medium">{labels.fieldTotalAmount || 'Total Tagihan'}</span>
                  <span className="text-[16px] font-bold text-primary">{formatCurrency(displayRes?.totalAmount || 0)}</span>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setShowBookingDetail(true)}
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1.5 w-full py-2 bg-primary/5 hover:bg-primary/10 rounded-lg"
                  title="Tampilkan detail booking lengkap"
                >
                  {labels.btnViewFullBooking || 'Lihat Booking Lengkap'} <span>↗</span>
                </button>
              </div>
            </div>
          </FormCard>
        )}
      </div>

      {/* KANAN: DETAIL KONTRAK */}
      <div className="flex flex-col gap-6 h-full">
        <FormCard
          title={isEditing ? (labels.titleEditContractDetail || 'Detail Kontrak') : (labels.titleNewContractDetail || 'Detail Kontrak')}
          description={labels.descNewContractDetail || 'Lengkapi informasi untuk menerbitkan dokumen kontrak.'}
          icon={<FileText className="w-5 h-5 text-amber-500" />}
          iconWrapperClassName="bg-amber-100 dark:bg-amber-900/30"
          className="h-full"
        >
          <div className="flex flex-col gap-6 h-full">
            <div>
              <InputDateTime
                id="contractDate"
                label={labels.fieldContractDate || 'Tanggal Penerbitan Kontrak'}
                value={contractDate}
                onChange={setContractDate}
                required
                helpText={labels.descContractDate || 'Tanggal kontrak ini dicetak/diterbitkan.'}
              />
            </div>

            <div>
              <InputTextarea
                id="notes"
                label={labels.fieldNotes || 'Catatan Tambahan (Opsional)'}
                placeholder={labels.placeholderNotes || 'Tambahkan catatan khusus yang akan dicetak pada dokumen kontrak...'}
                rows={6}
                value={notes}
                onChange={setNotes}
                helpText={labels.descNotes || 'Catatan ini akan muncul pada dokumen yang dicetak.'}
                className="min-h-[120px]"
              />
            </div>

            {!isEditing && (
              <div className="mt-auto pt-6 border-t border-border/50 w-full">
                <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-lg p-3 w-full">
                  <div className="flex gap-3">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">{labels.snapshotTitle || 'Data Terkunci (Snapshot)'}</span>
                      <span className="text-[11px] text-muted-foreground/90 leading-relaxed mt-0.5">
                        {labels.snapshotDesc || 'Data periode, tarif, dan total tagihan disalin dari booking dan tidak dapat diubah pada tahap pembuatan kontrak. Silakan ubah dari menu Booking jika diperlukan penyesuaian.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FormCard>
      </div>

      <BookingView
        open={showBookingDetail}
        onClose={() => setShowBookingDetail(false)}
        booking={displayRes || null}
        labels={labels}
        layout="dialog"
      />
    </FormShell>
  );
}
