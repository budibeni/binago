'use client';

import React, { useState } from 'react';
import { Button, DetailShell, PhoneLink } from '@adatrack/ui';
import { User, Car, Calendar, DollarSign, FileText, CheckCircle2, XCircle, Trash2, ClipboardList, Clock, CreditCard, Tag, MapPin, Package, Pencil } from 'lucide-react';
import type { RentalContract } from '../types/contract';
import { PaymentsFeature } from '../../payments/PaymentsFeature';
import { cn, formatCurrency, formatDate } from '@adatrack/utils';

interface ContractViewProps {
  contract: RentalContract | null;
  open: boolean;
  onClose: () => void;
  labels: Record<string, any>;
  onPrint?: (contract: RentalContract) => void;
  onConfirm?: (contract: RentalContract) => void;
  onCancel?: (contract: RentalContract) => void;
  onDelete?: (contract: RentalContract) => void;
  onOpenMap?: (vehicleIds: string[]) => void;
  layout?: 'drawer' | 'dialog' | 'fullscreen';
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

export function ContractView({
  contract,
  open,
  onClose,
  labels,
  onPrint,
  onConfirm,
  onCancel,
  onDelete,
  onOpenMap,
  layout = 'drawer',
}: ContractViewProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'payment'>('detail');
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  if (!contract) return null;

  
  
  const renderStatus = () => {
    const s = contract.status;
    let label = labels[`status${s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}`] || s;
    if (s === 'CONTRACTED') label = labels.statusIssued || 'Diterbitkan';
    if (s === 'ACTIVE') label = labels.statusActive || 'Berjalan';
    let colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    let dotClass = 'bg-neutral-400 dark:bg-neutral-600';
    if (s === 'DRAFT') { colorClass = 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'; dotClass = 'bg-neutral-500'; }
    else if (s === 'BOOKED') { colorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'; dotClass = 'bg-warning'; }
    else if (s === 'CONTRACTED') { colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'; dotClass = 'bg-blue-500'; }
    else if (s === 'ACTIVE') { colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'; dotClass = 'bg-success'; }
    else if (s === 'COMPLETED') { colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'; dotClass = 'bg-neutral-500'; }
    else if (s === 'CANCELLED') { colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'; dotClass = 'bg-danger'; }

    return (
      <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5", colorClass)}>
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />
        {label}
      </div>
    );
  };

  const InfoItem = ({ label, value, highlight = false, valueClassName, colSpan = 1 }: { 
    label: string; 
    value: React.ReactNode; 
    highlight?: boolean; 
    valueClassName?: string;
    colSpan?: 1 | 2;
  }) => (
    <div className={cn("flex flex-col gap-0.5", colSpan === 2 && "col-span-2")}>
      <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</span>
      <span className={cn("text-[11px] font-medium", highlight ? "text-danger font-bold" : "text-neutral-900 dark:text-neutral-100", valueClassName)}>
        {value}
      </span>
    </div>
  );

  function SectionCard({ 
    icon: Icon, 
    title, 
    colorClass = "text-muted-foreground",
    bgClass = "",
    children,
    extraHeader
  }: { 
    icon: any; 
    title: string; 
    colorClass?: string;
    bgClass?: string;
    children: React.ReactNode;
    extraHeader?: React.ReactNode;
  }) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
        <div className="px-3 py-2 flex items-center justify-between border-b border-border/40 bg-neutral-50/80 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            <div className={cn("flex items-center justify-center rounded-md p-1", bgClass)}>
              <Icon className={cn("w-3.5 h-3.5", colorClass)} />
            </div>
            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider pt-[2px]">{title}</h3>
          </div>
          {extraHeader && <div>{extraHeader}</div>}
        </div>
        <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <DetailShell
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={labels.contractDetail || "Detail Kontrak"}
      closeLabel={labels.cancel || "Tutup"}
      layout={layout}
      extraFooterActions={
        <>

          {onPrint && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onPrint(contract)} 
              className="h-7 text-xs px-3 bg-background"
            >
              {labels.actionPrint || 'Cetak Kontrak'}</Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              setActiveTab('payment');
              // Gunakan setTimeout agar React sempat me-mount PaymentsFeature sebelum form dibuka
              setTimeout(() => setIsPaymentFormOpen(true), 0);
            }}
            className="h-7 text-xs px-3 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {labels.payContract || "Bayar"}
          </Button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20">
        
        {/* Header Section */}
        <div className="px-4 py-4 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground">{contract.contractNumber}</h2>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {labels.contractDateText || 'Tanggal Kontrak:'} {formatDate(contract.contractDate)}</span>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> {labels.bookingRefText || 'Ref. Booking:'} {contract.bookingNumber} ({formatDate(contract.createdAt)})</span>
            </div>
          </div>
          {renderStatus()}
        </div>

        {/* Quick Actions */}
        {contract.status === 'CONTRACTED' && (
          <div className="px-4 py-2.5 bg-background flex gap-2 border-b border-border/40">
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-[11px] font-semibold hover:bg-warning/5 hover:text-warning hover:border-warning/50 text-warning border-warning/30 transition-all"
                onClick={() => onDelete(contract)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                title={labels.actionDeleteTitle || 'Tarik/Hapus dokumen kontrak, kembali ke status Booking'}
              >
                {labels.actionDelete || 'Hapus Kontrak'}</Button>
            )}
            {onCancel && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-[11px] font-semibold hover:bg-danger/5 hover:text-danger hover:border-danger/30 text-danger border-danger/30 transition-all"
                onClick={() => onCancel(contract)}
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
                title={labels.actionCancelTitle || 'Batalkan keseluruhan pesanan sewa'}
              >
                {labels.actionCancel || 'Batal Sewa'}</Button>
            )}
          </div>
        )}

        {/* Tab Navigasi */}
        <div className="flex border-b border-border/60 bg-background px-4">
          <button
            onClick={() => setActiveTab('detail')}
            className={cn(
              "px-3 py-2.5 text-[11px] font-medium transition-all border-b-2 relative",
              activeTab === 'detail' 
                ? "text-primary border-primary" 
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >{labels.contractDetail || 'Detail Kontrak'}</button>
          <button
            onClick={() => setActiveTab('payment')}
            className={cn(
              "px-3 py-2.5 text-[11px] font-medium transition-all border-b-2 relative",
              activeTab === 'payment' 
                ? "text-primary border-primary" 
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >{labels.paymentTab || "Pembayaran"}</button>
        </div>

        {/* Content Body */}
        {activeTab === 'detail' ? (
          <div className="p-4 flex flex-col gap-4">

          {/* INFORMASI PELANGGAN */}
          <SectionCard 
            icon={User} 
            title={labels.sectionCustomer || 'Informasi Pelanggan'}
            colorClass="text-blue-600 dark:text-blue-400"
            bgClass="bg-blue-100 dark:bg-blue-900/40"
          >
            {contract.customerSnapshot ? (
              <>
                <InfoItem label={labels.fieldCustomer || 'Nama'} value={contract.customerSnapshot.name} colSpan={2} />
                <InfoItem label={labels.customerType || 'Tipe Pelanggan'} value={contract.customerSnapshot.type === 'COMPANY' ? (labels.typeCompany || 'Perusahaan') : (labels.typeIndividual || 'Individu')} />
                <InfoItem label={labels.contact || "No. Telepon"} value={<PhoneLink phone={contract.customerSnapshot.phone || ''} className="text-[11px] font-bold text-foreground hover:underline" />} />
                <InfoItem label={labels.address || "Lokasi"} value={[contract.customerSnapshot.city, contract.customerSnapshot.province].filter(Boolean).join(' - ') || '-'} colSpan={2} />
              </>
            ) : (
              <span className="text-[11px] text-muted-foreground italic col-span-2">{labels.noCustomerData || "Tidak ada data pelanggan"}</span>
            )}
          </SectionCard>

          {/* PERIODE BOOKING */}
          <SectionCard 
            icon={Clock} 
            title={labels.sectionPeriod || 'Periode Sewa'}
            colorClass="text-emerald-600 dark:text-emerald-400"
            bgClass="bg-emerald-100 dark:bg-emerald-900/40"
          >
            <InfoItem label={labels.fieldStartDate || 'Tgl Mulai'} value={formatDate(contract.startDate)} />
            <InfoItem label={labels.fieldEndDate || 'Tgl Selesai'} value={formatDate(getMaxEndDate(contract.items))} />
            <InfoItem label={labels.fieldDuration || 'Durasi'} value={`${(contract.items?.[0]?.duration || 1)} ${labels.day || 'Hari'}`} />
            <InfoItem label={labels.fieldRentalType || 'Jenis Sewa'} value={contract.rentalType === 'SELF_DRIVE' ? (labels.selfDrive || 'Lepas Kunci') : (labels.withDriver || 'Dengan Pengemudi')} />
          </SectionCard>

          {/* KENDARAAN YANG DISEWA */}
          <SectionCard 
            icon={Car} 
            title={labels.sectionVehicle || 'Daftar Kendaraan'}
            colorClass="text-purple-600 dark:text-purple-400"
            bgClass="bg-purple-100 dark:bg-purple-900/40"
          >
            <div className="col-span-2">
              {contract.items && contract.items.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {contract.items.map((item, index) => {
                    const plates = [item.vehicleSnapshot?.licensePlate].filter(Boolean);
                    const isTrackable = contract.status !== 'COMPLETED' && contract.status !== 'CANCELLED';
                    return (
                      <div key={item.id} className="py-2.5 flex flex-col gap-1.5 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[9px] font-bold text-muted-foreground">{index + 1}</span>
                            {isTrackable ? (
                              <div 
                                className="flex items-center gap-1 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-border rounded text-[10px] font-bold font-mono hover:text-danger hover:border-danger/40 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenMap && item.vehicleId) onOpenMap([item.vehicleId]);
                                }}
                                title={plates.join(', ')}
                              >
                                <MapPin className="h-3 w-3 shrink-0" />
                                {plates.join(', ') || item.vehicleId}
                              </div>
                            ) : (
                              <span className="inline-block px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 border border-border rounded text-[10px] font-bold font-mono">
                                {plates.join(', ') || item.vehicleId}
                              </span>
                            )}
                          </div>
                        <span className="text-[11px] font-bold">{formatCurrency(item.subtotal)}</span>
                      </div>
                      
                      {item.vehicleSnapshot && (
                        <div className="flex flex-col gap-0.5 mt-1 ml-6">
                          <span className="text-[11px] font-medium text-foreground">{item.vehicleSnapshot.brand} {item.vehicleSnapshot.model}</span>
                          <span className="text-[10px] text-muted-foreground">Tarif: {formatCurrency(item.unitPrice)} / {item.rateType === 'DAILY' ? (labels.daily || 'Hari') : item.rateType === 'HOURLY' ? 'Jam' : (item.packageName || 'Paket')}</span>
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground italic">{labels.noVehicleSelected || "Tidak ada kendaraan yang dipilih"}</div>
              )}
            </div>
          </SectionCard>

          

          {/* INFORMASI BIAYA & TAGIHAN */}
          <SectionCard 
            icon={CreditCard} 
            title={labels.sectionPricing || 'Rincian Biaya'}
            colorClass="text-amber-600 dark:text-amber-400"
            bgClass="bg-amber-100 dark:bg-amber-900/40"
          >
            <div className="col-span-2 w-full bg-neutral-50/80 dark:bg-neutral-900/50 p-3 rounded-xl border border-border/60 flex flex-col gap-2.5 mb-3">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{labels.subtotalRental || "Subtotal RentalContract"}</span>
                <span className="text-[11px] font-bold text-foreground">{formatCurrency(contract.totalAmount || 0)}</span>
              </div>
              {(contract.driverFee || 0) > 0 && (
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{labels.globalDriverFee || "Biaya Pengemudi"}</span>
                  <span className="text-[11px] font-bold text-foreground">{formatCurrency(contract.driverFee || 0)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-0.5 pb-2 border-b border-border/40">
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">{labels.totalBilling || "Total Tagihan"}</span>
                <span className="text-sm font-bold text-foreground">{formatCurrency(contract.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="text-[11px] font-bold text-danger uppercase tracking-wider">{labels.remaining || 'Sisa Tagihan'}</span>
                <span className="text-sm font-bold text-danger">{formatCurrency(contract.remainingAmount || 0)}</span>
              </div>
            </div>

            <div className="col-span-2 mb-2 p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">{labels.depositText || 'Uang Jaminan (Deposit)'}</span>
                  <span className="text-[9px] text-muted-foreground/80 leading-relaxed mt-0.5">{labels.depositNotes || '* Ditagih terpisah dari biaya sewa dan akan di-refund utuh saat kendaraan kembali dengan aman.'}</span>
                </div>
                <span className="text-[12px] font-semibold text-amber-700/90 dark:text-amber-400/90 whitespace-nowrap ml-2 mt-0.5">{formatCurrency(contract.deposit || 0)}</span>
              </div>
            </div>
            
            {contract.notes && (
              <div className="col-span-2 mt-1">
                <InfoItem label={labels.fieldNotes || 'Catatan'} value={<span className="italic leading-relaxed text-muted-foreground">{contract.notes}</span>} colSpan={1} />
              </div>
            )}
          </SectionCard>
          </div>
        ) : (
          <PaymentsFeature 
            bookingId={contract.id}
            customerId={contract.customerId}
            totalAmount={contract.totalAmount || 0}
            deposit={contract.deposit || 0}
            remainingAmount={contract.remainingAmount || 0}
            defaultStage="BOOKING"
            isFormOpen={isPaymentFormOpen}
            onFormOpenChange={setIsPaymentFormOpen}
            hideAddButton={true}
          />
        )}
      </div>
    </DetailShell>
  );
}
