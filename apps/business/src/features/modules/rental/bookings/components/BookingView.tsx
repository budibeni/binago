'use client';

import React from 'react';
import { Button, DetailShell } from '@adatrack/ui';
import { User, Car, Calendar, DollarSign, FileText, CheckCircle2, ClipboardList, Clock, CreditCard, Tag } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { Booking } from '../types/booking';

interface BookingViewProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  labels: Record<string, any>;
  onEdit: (booking: Booking) => void;
  onConfirm: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}

export function BookingView({
  booking,
  open,
  onClose,
  labels,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
}: BookingViewProps) {
  if (!booking) return null;

  const formatCurrency = (value: number) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const renderStatus = () => {
    const s = booking.status;
    let label = labels[`status${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}`] || s;
    let colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    
    if (s === 'PENDING') colorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    else if (s === 'CONFIRMED') colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
    else if (s === 'ACTIVE') colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
    else if (s === 'CANCELLED') colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';

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
      title="Detail Booking"
      onEdit={() => onEdit(booking)}
      onDelete={() => onDelete(booking)}
      extraFooterActions={
        (booking.status === 'PENDING' || booking.status === 'CONFIRMED') ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCancel(booking)}
            className="h-7 text-xs px-3 text-neutral-600 border-neutral-300 hover:bg-neutral-100"
          >
            {labels.cancelBooking || 'Batalkan'}
          </Button>
        ) : null
      }
    >
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20">
        
        {/* Header Section */}
        <div className="px-4 py-4 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground">{booking.bookingNumber}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-muted-foreground font-medium">Detail Informasi Booking</span>
            </div>
          </div>
          {renderStatus()}
        </div>

        {/* Quick Actions */}
        {booking.status === 'PENDING' && (
          <div className="px-4 py-2.5 bg-background flex gap-2 border-b border-border/40">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-[11px] font-semibold hover:bg-success/5 hover:text-success hover:border-success/30 transition-all"
              onClick={() => onConfirm(booking)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Konfirmasi Booking
            </Button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-3 flex flex-col gap-3">

          {/* INFORMASI PELANGGAN */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionCustomer || 'Informasi Pelanggan'}</h3>
            </div>
            <div className="p-3.5">
              {booking.customer ? (
                <div className="flex flex-col gap-3.5">
                  <InfoItem label={labels.fieldCustomer || 'Nama'} value={booking.customer.name} valueClassName="text-sm" />
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                    <InfoItem label="Tipe Pelanggan" value={booking.customer.type === 'COMPANY' ? 'Perusahaan' : 'Individu'} />
                    <InfoItem label="No. Telepon" value={booking.customer.phone || '-'} />
                    <InfoItem label="Email" value={booking.customer.email || '-'} />
                  </div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">Tidak ada data pelanggan</span>
              )}
            </div>
          </div>

          {/* KENDARAAN YANG DISEWA */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Car className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionVehicle || 'Daftar Kendaraan'}</h3>
            </div>
            <div className="p-0">
              {booking.items && booking.items.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {booking.items.map((item, index) => (
                    <div key={item.id} className="p-3.5 grid grid-cols-2 gap-y-3.5 gap-x-3 bg-white dark:bg-neutral-950 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                      <div className="col-span-2 flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-muted-foreground">{index + 1}</span>
                          <span className="inline-block px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-border rounded-md text-[11px] font-bold font-mono">
                            {item.vehicle?.coreVehicle?.plateNumber || item.vehicleId}
                          </span>
                        </div>
                        <span className="text-xs font-bold">{formatCurrency(item.subtotal)}</span>
                      </div>
                      
                      {item.vehicle && (
                        <>
                          <InfoItem label="Merek & Model" value={`${item.vehicle.coreVehicle.brand} ${item.vehicle.coreVehicle.vehicleName} ${item.vehicle.coreVehicle.year}`} />
                          <InfoItem label="Tarif Satuan" value={formatCurrency(item.rateSnapshot)} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 text-xs text-muted-foreground italic">Tidak ada kendaraan yang dipilih</div>
              )}
            </div>
          </div>

          {/* PERIODE BOOKING */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionPeriod || 'Periode Sewa'}</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="grid grid-cols-1 gap-3">
                <InfoItem label={labels.fieldStartDate} value={formatDate(booking.startDate)} />
                <InfoItem label={labels.fieldEndDate} value={formatDate(booking.endDate)} />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                <InfoItem label={labels.fieldDuration} value={`${booking.duration} hari`} />
                <InfoItem label={labels.fieldRentalType} value={booking.rentalType === 'SELF_DRIVE' ? labels.rentalTypeSelfDrive : labels.rentalTypeWithDriver} />
              </div>
            </div>
          </div>

          {/* INFORMASI BIAYA & TAGIHAN */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden mb-6">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{labels.sectionPricing || 'Rincian Biaya'}</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Dasar Tarif" value={booking.rateType} />
                <InfoItem label="Metode Pembayaran" value={booking.paymentMethod || 'TRANSFER'} />
              </div>
              
              {booking.notes && (
                <div className="pt-3 border-t border-border/40">
                  <InfoItem label={labels.fieldNotes || 'Catatan'} value={<span className="italic leading-relaxed text-muted-foreground">{booking.notes}</span>} />
                </div>
              )}

              <div className="w-full bg-neutral-50/80 dark:bg-neutral-900/50 p-3 rounded-xl border border-border/60 flex flex-col gap-2.5 mt-1">
                <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Total Biaya</span>
                  <span className="text-xs font-bold text-foreground">{formatCurrency(booking.totalAmount || 0)}</span>
                </div>
                {(booking.driverFee || 0) > 0 && (
                  <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Biaya Pengemudi</span>
                    <span className="text-xs font-bold text-foreground">{formatCurrency(booking.driverFee || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-2.5 border-b border-border/40">
                  <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Uang Muka (Deposit)</span>
                  <span className="text-xs font-bold text-foreground">{formatCurrency(booking.deposit || 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-bold text-danger uppercase tracking-wider">Sisa Tagihan</span>
                  <span className="text-base font-bold text-danger">{formatCurrency(Math.max((booking.totalAmount || 0) - (booking.deposit || 0), 0))}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </DetailShell>
  );
}
