'use client';

import React from 'react';
import { Button } from '@adatrack/ui';
import { User, Car, Calendar, DollarSign, FileText, FileCheck, Info } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalContract } from '../types/contract';

interface ContractDetailDrawerProps {
  contract: RentalContract | null;
  open: boolean;
  onClose: () => void;
  labels: Record<string, string>;
  onEdit?: (c: RentalContract) => void;
  onPrint?: (c: RentalContract) => void;
  onConfirm?: (c: RentalContract) => void;
  onCancel?: (c: RentalContract) => void;
  onHandover?: (c: RentalContract) => void;
  onReturn?: (c: RentalContract) => void;
}

export function ContractDetailDrawer({
  contract,
  open,
  onClose,
  labels,
  onEdit,
  onPrint,
  onConfirm,
  onCancel,
  onHandover,
  onReturn,
}: ContractDetailDrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!contract) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
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
        className={cn("fixed top-0 right-0 h-full w-[90%] sm:w-[450px] bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300 border-l border-border", open ? "translate-x-0" : "translate-x-full")}
      >
        <div className="flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="flex-none p-6 border-b border-border bg-danger/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-danger pointer-events-none">
            <FileCheck className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-foreground">{contract.contractNumber}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={cn("px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md border", getStatusColor(contract.status))}>
                {labels[`status${contract.status.charAt(0).toUpperCase() + contract.status.slice(1).toLowerCase()}`] || contract.status}
              </span>
              <p className="text-sm text-muted-foreground">Detail Kontrak Rental</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            
            {/* Info Kontrak & Reservasi */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">{labels.colReservationNo || 'No. Reservasi'}</p>
                  <p className="text-sm font-bold text-primary">{contract.reservationId}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">{labels.fieldContractDate || 'Tanggal Kontrak'}</p>
                  <p className="text-sm font-semibold">{formatDate(contract.contractDate)}</p>
                </div>
              </div>
            </div>

            {/* Informasi Pelanggan */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden flex flex-col">
              <div className="bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionCustomerInfo || 'Data Pelanggan'}</h3>
                  <p className="text-[11px] text-muted-foreground">Penyewa kendaraan</p>
                </div>
              </div>
              <div className="p-4">
                {contract.customer ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Nama</p>
                      <p className="text-sm font-semibold">{contract.customer.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Tipe</p>
                        <p className="text-sm font-medium">{contract.customer.type === 'COMPANY' ? 'Perusahaan' : 'Individu'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Telepon</p>
                        <p className="text-sm font-medium">{contract.customer.phone}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>

            {/* Informasi Kendaraan */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden flex flex-col">
              <div className="bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionVehicleInfo || 'Data Kendaraan'}</h3>
                  <p className="text-[11px] text-muted-foreground">Kendaraan yang disewa</p>
                </div>
              </div>
              <div className="p-4">
                {contract.vehicle ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Merek & Model</p>
                      <p className="text-sm font-semibold">{contract.vehicle.coreVehicle.brand} {contract.vehicle.coreVehicle.vehicleName} {contract.vehicle.coreVehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Plat Nomor</p>
                      <div className="inline-block mt-0.5 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-border rounded-md text-xs font-bold font-mono">
                        {contract.vehicle.coreVehicle.plateNumber}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>

            {/* Periode Sewa */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden">
              <div className="bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionPeriod || 'Periode Rental'}</h3>
                  <p className="text-[11px] text-muted-foreground">Waktu dan durasi</p>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Tanggal Mulai</p>
                    <p className="text-sm font-semibold">{formatDate(contract.startDate)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Tanggal Selesai</p>
                    <p className="text-sm font-semibold">{formatDate(contract.endDate)}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Durasi</p>
                    <p className="text-sm font-medium">{contract.duration} hari</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Tipe Rental</p>
                    <p className="text-sm font-medium">{contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Driver'}</p>
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
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionPricing || 'Nilai Kontrak'}</h3>
                  <p className="text-[11px] text-muted-foreground">Detail biaya dan tagihan</p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Dasar Tarif</p>
                    <p className="text-sm font-medium">{contract.rateType}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-0.5">Tarif per Satuan</p>
                    <p className="text-sm font-medium">{formatCurrency(contract.rate)}</p>
                  </div>
                </div>
                
                <div className="w-full bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-border space-y-3 mt-2">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold">Total Biaya</p>
                    <p className="text-sm font-bold text-foreground">{formatCurrency(contract.totalAmount || 0)}</p>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold">Uang Muka (Deposit)</p>
                    <p className="text-sm font-bold text-foreground">{formatCurrency(contract.deposit || 0)}</p>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <p className="text-xs font-bold text-danger">Sisa Tagihan</p>
                    <p className="text-lg font-black text-danger">{formatCurrency(contract.remainingAmount || 0)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* S&K dan Catatan */}
            <div className="bg-white dark:bg-neutral-900 border border-border shadow-sm rounded-xl overflow-hidden">
              <div className="bg-neutral-50/80 dark:bg-neutral-900/50 px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{labels.sectionTerms || 'Syarat & Ketentuan'}</h3>
                  <p className="text-[11px] text-muted-foreground">Catatan dan kesepakatan</p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {contract.notes && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-1">Catatan</p>
                    <p className="text-sm text-foreground/80 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-border italic whitespace-pre-wrap">{contract.notes}</p>
                  </div>
                )}
                {contract.terms && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase mb-1">Syarat & Ketentuan</p>
                    <p className="text-sm text-foreground/80 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-border whitespace-pre-wrap">{contract.terms}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs text-muted-foreground justify-center">
              <Info className="w-4 h-4" />
              <span>Dibuat pada: {new Date(contract.createdAt).toLocaleString('id-ID')}</span>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-none p-4 px-6 border-t border-border bg-white dark:bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button variant="outline" className="w-full sm:w-auto text-foreground" onClick={onClose}>
            Tutup
          </Button>
          
          <div className="flex w-full sm:w-auto gap-2">
            {contract.status === 'DRAFT' && onCancel && (
              <Button variant="outline" className="flex-1 sm:flex-none text-danger border-danger/30 hover:bg-danger/10" onClick={() => onCancel(contract)}>
                Batalkan
              </Button>
            )}

            {onPrint && (
              <Button variant="outline" className="flex-1 sm:flex-none border-border hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => onPrint(contract)}>
                Print Kontrak
              </Button>
            )}
            
            {contract.status === 'DRAFT' && onEdit && (
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => onEdit(contract)}>
                Edit
              </Button>
            )}

            {contract.status === 'DRAFT' && onConfirm && (
              <Button variant="primary" className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onConfirm(contract)}>
                Konfirmasi
              </Button>
            )}

            {contract.status === 'CONFIRMED' && onHandover && (
              <Button variant="primary" className="flex-1 sm:flex-none bg-success hover:bg-success/90 text-white" onClick={() => onHandover(contract)}>
                Serah Terima
              </Button>
            )}
            
            {contract.status === 'CONFIRMED' && onCancel && (
              <Button variant="outline" className="flex-1 sm:flex-none text-danger border-danger/30 hover:bg-danger/10" onClick={() => onCancel(contract)}>
                Batalkan
              </Button>
            )}

            {contract.status === 'ACTIVE' && onReturn && (
              <Button variant="primary" className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white" onClick={() => onReturn(contract)}>
                Pengembalian
              </Button>
            )}
          </div>
        </div>
        </div>
      </aside>
    </React.Fragment>
  );
}
