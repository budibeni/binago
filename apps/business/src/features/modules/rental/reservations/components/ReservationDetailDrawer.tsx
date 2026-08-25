'use client';

import React from 'react';
import { Button } from '@adatrack/ui';
import { User, Car, Calendar, DollarSign, FileText, Trash2, Edit2, ClipboardList } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { Reservation } from '../types/reservation';

interface ReservationDetailDrawerProps {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
  labels: Record<string, string>;
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservation: Reservation) => void;
}

export function ReservationDetailDrawer({
  reservation,
  open,
  onClose,
  labels,
  onEdit,
  onDelete,
}: ReservationDetailDrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!reservation) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case 'ACTIVE': return 'bg-success/15 text-success border-success/30';
      case 'COMPLETED': return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
      case 'CANCELLED': return 'bg-danger/10 text-danger border-danger/20';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <React.Fragment>
      <div 
        className={cn("fixed inset-0 bg-black/40 z-50 transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none")} 
        onClick={onClose} 
      />
      <aside 
        className={cn("fixed top-0 right-0 h-full w-[90%] sm:w-[420px] bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300 border-l border-border", open ? "translate-x-0" : "translate-x-full")}
      >
        <div className="flex flex-col h-full overflow-hidden">
        
        {/* Header - Danger Colored */}
        <div className="flex-none p-6 border-b border-border bg-danger/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-danger pointer-events-none">
            <ClipboardList className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-foreground">{reservation.reservationNumber}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={cn("px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border", getStatusColor(reservation.status))}>
                {labels[`status${reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).toLowerCase()}`] || reservation.status}
              </span>
              <p className="text-sm text-muted-foreground">Detail Informasi Reservasi</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            
            {/* Informasi Pelanggan */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
              <div className="bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionCustomer}</h3>
                  <p className="text-[11px] text-muted-foreground">Detail penyewa kendaraan</p>
                </div>
              </div>
              <div className="p-4 flex-1">
                {reservation.customer ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">{labels.fieldCustomer || 'Nama'}</p>
                      <p className="text-sm font-semibold">{reservation.customer.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Tipe</p>
                        <p className="text-sm font-medium">{reservation.customer.type === 'COMPANY' ? 'Perusahaan' : 'Individu'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Telepon</p>
                        <p className="text-sm font-medium">{reservation.customer.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Email</p>
                      <p className="text-sm font-medium">{reservation.customer.email || '-'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>

            {/* Informasi Kendaraan */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
              <div className="bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionVehicle}</h3>
                  <p className="text-[11px] text-muted-foreground">Kendaraan yang disewa</p>
                </div>
              </div>
              <div className="p-4 flex-1">
                {reservation.vehicle ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Merek & Model</p>
                      <p className="text-sm font-semibold">{reservation.vehicle.coreVehicle.brand} {reservation.vehicle.coreVehicle.vehicleName} {reservation.vehicle.coreVehicle.year}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Plat Nomor</p>
                        <div className="inline-block mt-0.5 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-border rounded-md text-xs font-bold font-mono">
                          {reservation.vehicle.coreVehicle.plateNumber}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Status Kendaraan</p>
                      <p className="text-sm font-medium">{reservation.vehicle.status}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>

            {/* Periode Reservasi */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden">
              <div className="bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionPeriod}</h3>
                  <p className="text-[11px] text-muted-foreground">Waktu dan durasi penyewaan</p>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">{labels.fieldStartDate}</p>
                    <p className="text-sm font-semibold">{formatDate(reservation.startDate)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">{labels.fieldEndDate}</p>
                    <p className="text-sm font-semibold">{formatDate(reservation.endDate)}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">{labels.fieldDuration}</p>
                    <p className="text-sm font-medium">{reservation.duration} hari</p>
                  </div>
                  <div className="mt-2 col-span-3">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">{labels.fieldRentalType}</p>
                    <p className="text-sm font-medium">{reservation.rentalType === 'SELF_DRIVE' ? labels.rentalTypeSelfDrive : labels.rentalTypeWithDriver}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Biaya */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden">
              <div className="bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionPricing}</h3>
                  <p className="text-[11px] text-muted-foreground">Detail biaya dan tagihan</p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Dasar Tarif</p>
                      <p className="text-sm font-medium">{reservation.rateType}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Tarif per Satuan</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(
                          reservation.rateType === 'DAILY' ? (reservation.dailyRate || 0) :
                          reservation.rateType === 'WEEKLY' ? (reservation.weeklyRate || 0) :
                          (reservation.monthlyRate || 0)
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {reservation.notes && (
                    <div className="pt-2">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">{labels.fieldNotes}</p>
                      <p className="text-sm text-foreground/80 bg-neutral-50 dark:bg-neutral-900/50 p-2.5 rounded-lg border border-border italic">"{reservation.notes}"</p>
                    </div>
                  )}
                </div>
                
                <div className="w-full bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-border space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold">Total Biaya</p>
                    <p className="text-sm font-bold text-foreground">{formatCurrency(reservation.totalAmount || 0)}</p>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold">Uang Muka (Deposit)</p>
                    <p className="text-sm font-bold text-foreground">{formatCurrency(reservation.deposit || 0)}</p>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <p className="text-xs font-bold text-danger">Sisa Tagihan</p>
                    <p className="text-lg font-black text-danger">{formatCurrency(Math.max((reservation.totalAmount || 0) - (reservation.deposit || 0), 0))}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex-none p-4 px-6 border-t border-border bg-white dark:bg-neutral-950 flex items-center justify-between">
          <div className="flex gap-3">
            <Button variant="outline" className="text-foreground" onClick={onClose}>
              Tutup
            </Button>
            <Button variant="primary" className="bg-danger hover:bg-danger/90 text-white gap-2" onClick={() => onEdit(reservation)}>
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <Button variant="outline" className="text-danger border-danger/30 hover:bg-danger/10 gap-2" onClick={() => onDelete(reservation)}>
            <Trash2 className="w-4 h-4" />
            Hapus
          </Button>
        </div>
        </div>
      </aside>
    </React.Fragment>
  );
}
