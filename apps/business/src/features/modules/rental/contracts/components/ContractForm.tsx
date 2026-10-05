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
      r.customer?.name?.toLowerCase().includes(s) ||
      r.items?.some(item => item.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s))
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
        bookingId: selectedRes.id,
        contractDate: new Date(contractDate).toISOString(),
        notes,
      });
    }
  };

  // Derive display values based on mode
  const displayRes = isEditing ? contract?.booking : selectedRes;
  const displayCustomer = isEditing ? contract?.customer : selectedRes?.customer;

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title={isEditing ? (labels.actionEdit || 'Edit Kontrak') : (labels.actionCreate || 'Buat Kontrak Baru')}
      onCancel={onCancel}
      cancelProps={{ disabled: isSubmitting }}
      cancelText={labels.btnCancel || 'Batal'}
      saveText={isSubmitting ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : (labels.btnSaveDraft || 'Simpan Kontrak')}
      saveProps={{ disabled: (!isEditing && !selectedRes) || isSubmitting }}
      isSubmitting={isSubmitting}
    >
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Booking Selector OR Booking Summary */}
          <div className="md:col-span-5 space-y-6">
            {!selectedRes ? (
              <FormCard
                title={labels.titleSelectBooking || 'Pilih Booking'}
                description={labels.descSelectBooking || 'Pilih booking untuk dibuatkan kontrak.'}
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
                        <h4 className="font-bold text-foreground text-[13px] truncate">{r.customer?.name}</h4>
                        <div className="flex justify-between items-end mt-1">
                          <p className="text-[11px] text-muted-foreground font-medium">{formatDate(r.startDate).split(' ')[0]} - {formatDate(r.endDate).split(' ')[0]}</p>
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
                className="!p-5 sm:!p-6"
                icon={<ClipboardList className="w-5 h-5 text-blue-500" />}
                iconWrapperClassName="bg-transparent w-auto h-auto rounded-none p-0"
                action={
                  !isEditing && (
                    <button
                      type="button"
                      onClick={() => setSelectedRes(null)}
                      className="text-xs text-muted-foreground hover:text-foreground font-medium underline underline-offset-4"
                    >
                      {labels.btnChange || 'Ganti'}
                    </button>
                  )
                }
              >
                <div className="space-y-6">
                  <div>
                    <Label className="text-neutral-500 dark:text-neutral-400 font-normal">{labels.fieldCustomer || 'Pelanggan'}</Label>
                    <p className="text-[14px] mt-0.5 font-semibold text-foreground">{displayCustomer?.name} - {displayCustomer?.phone}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-neutral-500 dark:text-neutral-400 font-normal">{labels.fieldBookingNo || 'No. Booking'}</Label>
                      <p className="text-[14px] mt-0.5 font-semibold text-foreground">{displayRes?.bookingNumber || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-neutral-500 dark:text-neutral-400 font-normal">{labels.fieldRentalType || 'Tipe Sewa'}</Label>
                      <p className="text-[14px] mt-0.5 font-semibold text-foreground">{displayRes?.rentalType === 'SELF_DRIVE' ? (labels.rentalTypeSelfDrive || 'Lepas Kunci') : (labels.rentalTypeWithDriver || 'Dgn Pengemudi')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-neutral-500 dark:text-neutral-400 font-normal">{labels.fieldStart || 'Mulai'}</Label>
                      <p className="text-[14px] mt-0.5 font-semibold text-foreground">{formatDate(displayRes?.startDate || '')}</p>
                    </div>
                    <div>
                      <Label className="text-neutral-500 dark:text-neutral-400 font-normal">{labels.fieldEnd || 'Selesai'}</Label>
                      <p className="text-[14px] mt-0.5 font-semibold text-foreground">{formatDate(displayRes?.endDate || '')}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/40 mt-6">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-neutral-500 dark:text-neutral-400 font-normal">{labels.fieldTotalAmount || 'Total Tagihan'} ({displayRes?.duration} {labels.fieldDays || 'Hari'})</Label>
                  </div>
                  <p className="text-2xl font-bold text-foreground tracking-tight">{formatCurrency(displayRes?.totalAmount || 0)}</p>
                </div>

                {displayRes?.items && displayRes.items.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border/40">
                    <Label className="mb-3 text-neutral-500 dark:text-neutral-400 font-normal">{labels.fieldVehicles || 'Kendaraan'} ({displayRes.items.length})</Label>
                    <div className="space-y-2">
                      {displayRes.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded-lg border border-border/50 dark:border-neutral-700">
                          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.vehicle?.coreVehicle?.plateNumber}</span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.vehicle?.coreVehicle?.vehicleName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <button 
                    type="button"
                    onClick={() => setShowBookingDetail(true)}
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1.5 w-full py-2 bg-primary/5 hover:bg-primary/10 rounded-lg"
                    title="Tampilkan detail booking lengkap"
                  >
                    {labels.btnViewFullBooking || 'Lihat Booking Lengkap'} <span>↗</span>
                  </button>
                </div>
              </FormCard>
            )}
          </div>

          {/* RIGHT COLUMN: Form Inputs */}
          <div className="md:col-span-7 space-y-6 relative">


            <FormCard
              title={isEditing ? (labels.titleEditContractDetail || 'Ubah Detail Kontrak') : (labels.titleNewContractDetail || 'Detail Kontrak Baru')}
              description={labels.descNewContractDetail || 'Lengkapi informasi untuk menerbitkan dokumen kontrak.'}
              icon={<FileText className="w-5 h-5 text-danger" />}
              iconWrapperClassName="bg-transparent w-auto h-auto rounded-none p-0"
            >
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
                  />
                </div>
            </FormCard>

            {!isEditing && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 p-4 rounded-2xl flex gap-4 text-amber-800 dark:text-amber-300">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold mb-1">{labels.snapshotTitle || 'Data Terkunci (Snapshot)'}</p>
                  <p className="text-xs opacity-80 leading-relaxed">
                    {labels.snapshotDesc || 'Data periode, tarif, dan total tagihan disalin dari booking dan tidak dapat diubah pada tahap pembuatan kontrak. Silakan ubah dari menu Booking jika diperlukan penyesuaian.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
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
