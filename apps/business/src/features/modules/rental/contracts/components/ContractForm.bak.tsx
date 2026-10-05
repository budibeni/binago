'use client';

import React from 'react';
import { Button, FormShell, InputDateTime, InputTextarea } from '@adatrack/ui';
import { Search, User, Car, Calendar, DollarSign, Info, FileText, CheckCircle2, ChevronRight, Hash } from 'lucide-react';
import type { Booking } from '@/features/modules/rental/bookings/types/booking';
import type { RentalContract } from '../types/contract';
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
              <div className="bg-white dark:bg-neutral-900 border border-border/60 rounded-3xl p-5 md:p-6 flex flex-col h-[calc(100vh-220px)] min-h-[400px] max-h-[700px]">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-foreground mb-1">Pilih Booking</h3>
                  <p className="text-xs text-muted-foreground">Pilih booking untuk dibuatkan kontrak.</p>
                </div>
                
                <div className="relative mb-4 shrink-0 group">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-border/60 bg-neutral-50 dark:bg-neutral-900/50 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary transition-all"
                    placeholder="Cari no booking, pelanggan..." 
                    value={searchBooking}
                    onChange={(e) => setSearchBooking(e.target.value)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-2">
                  {filteredBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <Search className="w-6 h-6 text-neutral-400 mb-2 opacity-50" />
                      <p className="text-sm font-semibold text-foreground">Tidak ditemukan</p>
                      <p className="text-xs text-muted-foreground mt-1">Coba kata kunci lain.</p>
                    </div>
                  ) : (
                    filteredBookings.map(r => (
                      <div 
                        key={r.id} 
                        className="p-4 border border-border/40 rounded-xl hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer transition-all group relative overflow-hidden"
                        onClick={() => setSelectedRes(r)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider">{r.bookingNumber}</span>
                          <span className="text-[10px] font-medium text-muted-foreground bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Car className="w-3 h-3" /> {r.items?.length || 0}
                          </span>
                        </div>
                        <h4 className="font-bold text-foreground text-sm truncate mb-1">{r.customer?.name}</h4>
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-xs text-muted-foreground font-medium">{formatDate(r.startDate).split(' ')[0]} - {formatDate(r.endDate).split(' ')[0]}</p>
                          <p className="text-xs font-bold text-primary">{formatCurrency(r.totalAmount)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-900 text-foreground border border-border/60 rounded-3xl overflow-hidden">
                <div className="h-full flex flex-col relative">

                  <div className="p-6 md:p-8 relative z-10 flex-1">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-bold text-base text-foreground">Ringkasan Booking</h3>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => setSelectedRes(null)}
                          className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground px-3 py-1.5 rounded-full transition-colors border border-border/60"
                        >
                          Ganti Booking
                        </button>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Pelanggan</p>
                        <p className="text-base font-bold text-foreground">{displayCustomer?.name}</p>
                        <p className="text-xs text-muted-foreground">{displayCustomer?.phone}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">No. Booking</p>
                          <p className="text-sm font-semibold text-foreground">{displayRes?.bookingNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Tipe Sewa</p>
                          <p className="text-sm font-semibold text-foreground">{displayRes?.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dgn Pengemudi'}</p>
                        </div>
                      </div>

                      <div className="py-5 border-y border-border/40 grid grid-cols-2 gap-6 relative">
                        {/* Connector Line */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 border-t-2 border-dashed border-border/60"></div>
                        
                        <div>
                          <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Mulai</p>
                          <p className="text-sm font-semibold text-foreground">{formatDate(displayRes?.startDate || '').split(' ')[0]}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(displayRes?.startDate || '').split(' ')[1]}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Selesai</p>
                          <p className="text-sm font-semibold text-foreground">{formatDate(displayRes?.endDate || '').split(' ')[0]}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(displayRes?.endDate || '').split(' ')[1]}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket cutouts */}
                  <div className="h-6 w-full relative flex items-center">
                    <div className="w-6 h-6 rounded-full bg-background absolute -left-3 border-r border-border/60"></div>
                    <div className="w-full border-t-2 border-dashed border-border/40"></div>
                    <div className="w-6 h-6 rounded-full bg-background absolute -right-3 border-l border-border/60"></div>
                  </div>

                  <div className="p-6 md:p-8 bg-neutral-50/50 dark:bg-neutral-900/50 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">Total Tagihan</p>
                      <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">{displayRes?.duration} Hari</p>
                    </div>
                    <p className="text-xl font-bold text-foreground tracking-tight">{formatCurrency(displayRes?.totalAmount || 0)}</p>
                    
                    {displayRes?.items && displayRes.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/40">
                        <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-3">Kendaraan ({displayRes.items.length})</p>
                        <div className="space-y-2">
                          {displayRes.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-foreground font-medium">{item.vehicle?.coreVehicle?.plateNumber}</span>
                              <span className="text-muted-foreground">{item.vehicle?.coreVehicle?.vehicleName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-border/40">
                      <a 
                        href={`/rental/bookings?q=${displayRes?.bookingNumber}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1.5 w-full py-2 bg-primary/5 hover:bg-primary/10 rounded-lg"
                        title="Buka tab baru untuk melihat detail booking lengkap"
                      >
                        Lihat Booking Lengkap <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Form Inputs */}
          <div className="md:col-span-7 space-y-6 relative">


            <div className="bg-white dark:bg-neutral-900 border border-border/60 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/40">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Detail Kontrak Baru</h2>
                  <p className="text-sm text-muted-foreground mt-1">Lengkapi informasi untuk menerbitkan dokumen kontrak.</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <InputDateTime
                    id="contractDate"
                    label={labels.fieldContractDate || 'Tanggal Penerbitan Kontrak'}
                    value={contractDate}
                    onChange={setContractDate}
                    required
                    helpText="Tanggal kontrak ini dicetak/diterbitkan."
                  />
                </div>

                <div>
                  <InputTextarea
                    id="notes"
                    label={labels.fieldContractNotes || 'Catatan Tambahan (Opsional)'}
                    placeholder="Tambahkan catatan khusus yang akan dicetak pada dokumen kontrak..."
                    rows={6}
                    value={notes}
                    onChange={setNotes}
                    helpText="Catatan ini akan muncul pada dokumen yang dicetak."
                  />
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 p-4 rounded-2xl flex gap-4 text-amber-800 dark:text-amber-300">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold mb-1">Data Terkunci (Snapshot)</p>
                  <p className="text-xs opacity-80 leading-relaxed">
                    Data periode, tarif, dan total tagihan disalin dari booking dan tidak dapat diubah pada tahap pembuatan kontrak.
                    Silakan ubah dari menu Booking jika diperlukan penyesuaian.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormShell>
  );
}
