import React from 'react';
import { Button, DetailShell } from '@adatrack/ui';
import { User, Car, Calendar, DollarSign, FileText, FileCheck, Info, CheckCircle, Printer, XCircle, CheckCircle2 } from 'lucide-react';
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

export function ContractView({
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
  if (!contract) return null;

  const formatCurrency = (value: number) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const renderStatus = () => {
    const s = contract.status;
    let label = labels[`status${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}`] || s;
    let colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    
    if (s === 'DRAFT') colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    else if (s === 'CONFIRMED') colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
    else if (s === 'ACTIVE') colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
    else if (s === 'CANCELLED') colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
    else if (s === 'COMPLETED') colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';

    return (
      <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold", colorClass)}>
        {label}
      </div>
    );
  };

  const InfoItem = ({ label, value, highlight = false, valueClassName }: { label: string, value: React.ReactNode, highlight?: boolean, valueClassName?: string }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</span>
      <span className={cn("text-xs font-medium", highlight ? "text-danger font-bold" : "text-neutral-900 dark:text-neutral-100", valueClassName)}>
        {value}
      </span>
    </div>
  );

  return (
    <DetailShell
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title="Detail Kontrak Rental"
      onEdit={contract.status === 'DRAFT' && onEdit ? () => onEdit(contract) : undefined}
      extraFooterActions={
        <div className="flex items-center gap-2">
          {contract.status === 'DRAFT' && onCancel && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancel(contract)}
              className="h-7 text-xs px-3 text-danger border-danger/30 hover:bg-danger/10 hover:text-danger"
            >
              Batalkan Kontrak
            </Button>
          )}
          {onPrint && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPrint(contract)}
              className="h-7 text-xs px-3 text-neutral-600 border-neutral-300 hover:bg-neutral-100"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Cetak
            </Button>
          )}
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20">
        
        {/* Header Section */}
        <div className="px-4 py-4 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground">{contract.contractNumber}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-muted-foreground font-medium">Detail Informasi Kontrak</span>
            </div>
          </div>
          {renderStatus()}
        </div>

        {/* Quick Actions */}
        {contract.status === 'DRAFT' && onConfirm && (
          <div className="px-4 py-2.5 bg-background flex gap-2 border-b border-border/40">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-[11px] font-semibold hover:bg-success/5 hover:text-success hover:border-success/30 transition-all"
              onClick={() => onConfirm(contract)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Konfirmasi Kontrak
            </Button>
          </div>
        )}
        
        {contract.status === 'CONFIRMED' && onHandover && (
          <div className="px-4 py-2.5 bg-background flex gap-2 border-b border-border/40">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-[11px] font-semibold hover:bg-blue-600/5 hover:text-blue-600 hover:border-blue-600/30 transition-all"
              onClick={() => onHandover(contract)}
              leftIcon={<Car className="w-3.5 h-3.5" />}
            >
              Serah Terima Kendaraan
            </Button>
          </div>
        )}

        {contract.status === 'ACTIVE' && onReturn && (
          <div className="px-4 py-2.5 bg-background flex gap-2 border-b border-border/40">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-[11px] font-semibold hover:bg-amber-600/5 hover:text-amber-600 hover:border-amber-600/30 transition-all"
              onClick={() => onReturn(contract)}
              leftIcon={<FileCheck className="w-3.5 h-3.5" />}
            >
              Pengembalian Kendaraan
            </Button>
          </div>
        )}

        {/* Konten Utama */}
        <div className="p-4 flex flex-col gap-4">

          {/* INFORMASI UTAMA & BOOKING */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Informasi Utama</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label={labels.colBookingNo || 'No. Booking'} value={contract.bookingId} />
                <InfoItem label={labels.fieldContractDate || 'Tanggal Kontrak'} value={formatDate(contract.contractDate)} />
              </div>
            </div>
          </div>

          {/* INFORMASI PELANGGAN */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionCustomerInfo || 'Data Pelanggan'}</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              {contract.customer ? (
                <>
                  <InfoItem label="Nama" value={contract.customer.name} />
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                    <InfoItem label="Tipe" value={contract.customer.type === 'COMPANY' ? 'Perusahaan' : 'Individu'} />
                    <InfoItem label="Telepon" value={contract.customer.phone} />
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground italic">Data pelanggan tidak tersedia</div>
              )}
            </div>
          </div>

          {/* KENDARAAN DISEWA */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Car className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionVehicleInfo || 'Data Kendaraan'}</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              {contract.booking?.items && contract.booking.items.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {contract.booking.items.map((item, index) => (
                    <div key={item.id} className={cn("flex flex-col gap-2", index > 0 && "pt-3 border-t border-border/40")}>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-foreground uppercase tracking-widest">
                          Kendaraan {index + 1}
                        </span>
                        {item.vehicle && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                            {item.vehicle.coreVehicle.plateNumber}
                          </span>
                        )}
                      </div>
                      
                      {item.vehicle && (
                        <>
                          <InfoItem label="Merek & Model" value={`${item.vehicle.coreVehicle.brand} ${item.vehicle.coreVehicle.vehicleName} ${item.vehicle.coreVehicle.year}`} />
                          <InfoItem label="Subtotal" value={formatCurrency(item.subtotal)} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic">Tidak ada kendaraan yang dipilih</div>
              )}
            </div>
          </div>

          {/* PERIODE SEWA */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionPeriod || 'Periode Rental'}</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="grid grid-cols-1 gap-3">
                <InfoItem label="Tanggal Mulai" value={formatDate(contract.startDate)} />
                <InfoItem label="Tanggal Selesai" value={formatDate(contract.endDate)} />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                <InfoItem label="Durasi" value={`${contract.booking?.duration || '-'} hari`} />
                <InfoItem label="Tipe Rental" value={contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Pengemudi'} />
              </div>
            </div>
          </div>

          {/* NILAI KONTRAK */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionPricing || 'Nilai Kontrak'}</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Dasar Tarif" value={contract.rateType} />
                <InfoItem label="Jumlah Kendaraan" value={`${contract.booking?.items?.length || 0} Unit`} />
              </div>

              <div className="w-full bg-neutral-50/80 dark:bg-neutral-900/50 p-3 rounded-xl border border-border/60 flex flex-col gap-2.5 mt-1">
                <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Total Biaya</span>
                  <span className="text-xs font-bold text-foreground">{formatCurrency(contract.totalAmount || 0)}</span>
                </div>
                {(contract.driverFee || 0) > 0 && (
                  <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Biaya Pengemudi</span>
                    <span className="text-xs font-bold text-foreground">{formatCurrency(contract.driverFee || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Uang Muka (Deposit)</span>
                  <span className="text-xs font-bold text-foreground">{formatCurrency(contract.deposit || 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-danger uppercase tracking-wider">Sisa Tagihan</span>
                  <span className="text-base font-bold text-danger">{formatCurrency(contract.remainingAmount || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* S&K DAN CATATAN */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden mb-6">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionTerms || 'Syarat & Ketentuan'}</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              {contract.notes && (
                <div>
                  <InfoItem label="Catatan" value={<span className="italic leading-relaxed text-muted-foreground">{contract.notes}</span>} />
                </div>
              )}
              {contract.terms && (
                <div className={cn(contract.notes ? "pt-3 border-t border-border/40" : "")}>
                  <InfoItem label="Syarat & Ketentuan" value={<span className="leading-relaxed text-muted-foreground whitespace-pre-wrap">{contract.terms}</span>} />
                </div>
              )}
              {!contract.notes && !contract.terms && (
                <div className="text-xs text-muted-foreground italic">Tidak ada catatan atau syarat & ketentuan</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DetailShell>
  );
}
