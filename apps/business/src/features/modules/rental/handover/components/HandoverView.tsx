'use client';

import React, { useState } from 'react';
import { Button, DetailShell, PhoneLink } from '@adatrack/ui';
import { User, Car, MapPin, Key, CheckCircle2, Navigation, FileText, StickyNote, Calendar, DollarSign, Printer } from 'lucide-react';
import { PaymentsFeature } from '../../payments/PaymentsFeature';
import type { RentalHandover } from '../types/handover';
import { cn, formatDate, formatDateTime, formatNumber } from '@adatrack/utils';

export interface HandoverGroup {
  id: string; // group ID (handoverNumber or contractId)
  handoverNumber?: string;
  contractId: string;
  contract?: any;
  customer?: any;
  handoverAt: string;
  handoverAddress?: string;
  handoverLatitude: number;
  handoverLongitude: number;
  status: 'PARTIAL' | 'COMPLETED';
  items: RentalHandover[];
}

interface HandoverViewProps {
  handover: HandoverGroup | null;
  open: boolean;
  onClose: () => void;
  layout?: 'drawer' | 'dialog' | 'fullscreen';
  labels?: Record<string, string>;
  onPrint?: (group: HandoverGroup) => void;
}

export function HandoverView({
  handover,
  open,
  onClose,
  layout = 'drawer',
  labels = {},
  onPrint,
}: HandoverViewProps) {
  const [mainTab, setMainTab] = useState<'detail' | 'payment'>('detail');
  const [activeTab, setActiveTab] = useState<string>('');
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  React.useEffect(() => {
    if (handover?.items && handover.items.length > 0) {
      setActiveTab(handover.items[0].id);
    }
  }, [handover]);

  if (!handover) return null;

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'GOOD': return labels.condGood || 'Baik';
      case 'MINOR_DAMAGE': return labels.condMinorDamage || 'Kerusakan Ringan';
      case 'NEEDS_REPAIR': return labels.condNeedsRepair || 'Perlu Perbaikan';
      default: return condition;
    }
  };

  const c = handover;
  const contract = c.contract;
  const customer = c.customer;

  const renderItemStatus = (s: string) => {
    let label = labels[`status${s}`] || s;
    if (s === 'IN_USE') label = labels.statusInUse || 'Sedang Digunakan';
    if (s === 'RETURNED') label = labels.statusReturned || 'Telah Kembali';
    if (s === 'PENDING') label = labels.statusPending || 'Menunggu';
    if (s === 'CANCELLED') label = labels.statusCancelled || 'Batal';

    let colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    let dotClass = 'bg-neutral-400 dark:bg-neutral-600';
    if (s === 'IN_USE') { colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'; dotClass = 'bg-success'; }
    else if (s === 'RETURNED') { colorClass = 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-400'; dotClass = 'bg-slate-500'; }
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
    extraHeader,
    bodyClassName = "p-4 grid grid-cols-2 gap-y-4 gap-x-4",
  }: { 
    icon: any; 
    title: string; 
    colorClass?: string;
    bgClass?: string;
    children: React.ReactNode;
    extraHeader?: React.ReactNode;
    bodyClassName?: string;
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
        <div className={bodyClassName}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <DetailShell
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={labels.viewTitle || "Detail Serah Terima"}
      closeLabel={labels.btnClose || "Tutup"}
      layout={layout}
      extraFooterActions={
        <>
          <Button
            size="sm"
            onClick={() => {
              setMainTab('payment');
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
          <div className="flex flex-col gap-1.5 pt-0.5">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {labels.handoverDateText || 'Tgl Serah Terima:'} {formatDateTime(c.handoverAt)}</span>
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> {labels.contractRefText || 'Ref. Kontrak:'} {contract?.contractNumber || c.contractId}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground text-right">{c.handoverNumber || c.id}</h2>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="px-4 py-2.5 bg-background flex gap-2 border-b border-border/40">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            onClick={() => onPrint?.(c)}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            title={labels.actionPrintTitle || 'Cetak dokumen Bukti Serah Terima'}
          >
            {labels.actionPrint || 'Cetak Bukti Serah Terima'}
          </Button>
        </div>

        {/* Tab Navigasi */}
        <div className="flex border-b border-border/60 bg-background px-4">
          <button
            onClick={() => setMainTab('detail')}
            className={cn(
              "px-3 py-2.5 text-[11px] font-medium transition-all border-b-2 relative",
              mainTab === 'detail' 
                ? "text-primary border-primary" 
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >{labels.tabDetail || 'Detail Handover'}</button>
          <button
            onClick={() => setMainTab('payment')}
            className={cn(
              "px-3 py-2.5 text-[11px] font-medium transition-all border-b-2 relative",
              mainTab === 'payment' 
                ? "text-primary border-primary" 
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >{labels.tabPayment || 'Pembayaran'}</button>
        </div>

        {mainTab === 'detail' ? (
          <div className="p-4 flex flex-col gap-4">

          {/* INFORMASI KONTRAK */}
          <SectionCard 
            icon={FileText} 
            title={labels.sectionContract || 'Informasi Kontrak'} 
            colorClass="text-blue-600 dark:text-blue-400"
            bgClass="bg-blue-100 dark:bg-blue-900/40"
          >
            <InfoItem label={labels.fieldContractNumber || "Nomor Kontrak"} value={contract?.contractNumber || c.contractId} />
            <InfoItem label={labels.fieldCustomer || "Pelanggan"} value={customer?.name || '-'} />
            <InfoItem label={labels.fieldRentPeriod || "Periode Sewa"} value={contract ? `${formatDate(contract.startDate)} - ${formatDate(contract.endDate)}` : '-'} />
            <InfoItem label={labels.fieldService || "Layanan"} value={contract ? (contract.rentalType === 'SELF_DRIVE' ? (labels.typeSelfDrive || 'Lepas Kunci') : (labels.typeWithDriver || 'Dgn Sopir')) : '-'} />
          </SectionCard>

          {/* DETAIL KENDARAAN (TABS) */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            {/* TABS */}
            {c.items.length > 1 && (
              <div className="shrink-0 bg-background border-b border-border/40">
                <div className="flex items-center overflow-x-auto hide-scrollbar px-2">
                  {c.items.map(item => {
                    const id = item.id;
                    const isSelected = activeTab === id;
                    const cv = item.vehicle?.coreVehicle || item.vehicleSnapshot;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={cn(
                          "px-3.5 h-[42px] text-[11px] font-semibold border-b-2 transition-colors focus:outline-none flex items-center gap-2 pt-[2px] whitespace-nowrap",
                          isSelected ? 'border-b-danger text-danger' : 'border-b-transparent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Key className={cn("h-3.5 w-3.5", isSelected ? "text-danger" : "opacity-70")} />
                        {cv?.plateNumber || cv?.licensePlate || item.vehicleId}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT */}
            {activeTab && (() => {
              const item = c.items.find(i => i.id === activeTab);
              if (!item) return null;
              const cv = item.vehicle?.coreVehicle || item.vehicleSnapshot;
              const eq = item.equipmentChecklist || {};

              return (
                <div className="flex flex-col animate-in fade-in duration-300">
                  <div className="flex items-start justify-between pb-3 border-b border-border/40 p-4 bg-neutral-50/50 dark:bg-neutral-900/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                        <Key className="w-5 h-5 text-danger" />
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-foreground">{cv?.brand} {cv?.vehicleName || cv?.model}</p>
                        <p className="text-[11px] font-semibold text-primary">{cv?.plateNumber || cv?.licensePlate}</p>
                      </div>
                    </div>
                    {renderItemStatus(item.itemStatus || 'IN_USE')}
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 p-4">
                    <InfoItem label={labels.fieldHandoverTime || "Waktu Serah Terima"} value={formatDateTime(item.handoverAt)} colSpan={2} />
                    <InfoItem label={labels.fieldStaff || "Petugas"} value={item.staffName || '-'} />
                    <InfoItem label={labels.fieldFuelLevel || "Level BBM"} value={item.fuelLevel} />
                    <InfoItem label={labels.fieldOdometerStart || "Odometer Awal"} value={formatNumber(item.odometerStart) + " KM"} />
                    <InfoItem label={labels.fieldPhysicalCondition || "Kondisi Fisik"} value={getConditionLabel(item.vehicleCondition)} />
                  </div>

                  {item.vehicleCondition !== 'GOOD' && item.notes && (
                    <div className="px-4 pb-4">
                      <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
                        <InfoItem label="Detail Kerusakan" value={item.notes} valueClassName="text-warning-700 dark:text-warning" />
                      </div>
                    </div>
                  )}

                  <div className="px-4 py-4 border-t border-border/40">
                    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 block">{labels.fieldEquipment || 'Kelengkapan Kendaraan'}</span>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
                      {[
                        { label: labels.equipStnk || 'STNK Asli', key: 'stnkOriginal' },
                        { label: labels.equipSpareKey || 'Kunci Cadangan', key: 'spareKey' },
                        { label: labels.equipJackAndTools || 'Dongkrak & Kunci Roda', key: 'jackAndTools' },
                        { label: labels.equipSpareTire || 'Ban Serep', key: 'spareTire' },
                        { label: labels.equipFirstAid || 'P3K & Segitiga', key: 'firstAidKit' },
                      ].map((eqItem) => {
                        const isChecked = eq[eqItem.key as keyof typeof eq];
                        return (
                          <div key={eqItem.key} className="flex items-center gap-2 text-[11px]">
                            {isChecked ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
                              </div>
                            )}
                            <span className={isChecked ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                              {eqItem.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* LOKASI KHUSUS KENDARAAN INI */}
                  <div className="px-4 py-4 border-t border-border/40">
                    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {labels.locHandover || 'Lokasi Serah Terima'}</span>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoItem label={labels.fieldLatitude || "Latitude"} value={<span className="font-mono text-[10px]">{item.handoverLatitude}</span>} />
                      <InfoItem label={labels.fieldLongitude || "Longitude"} value={<span className="font-mono text-[10px]">{item.handoverLongitude}</span>} />
                    </div>
                    {item.handoverLatitude && item.handoverLongitude ? (
                      <a 
                        href={`https://maps.google.com/?q=${item.handoverLatitude},${item.handoverLongitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-28 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg overflow-hidden mt-3 relative group hover:opacity-90 transition-opacity cursor-pointer"
                        title={labels.btnOpenMap || "Buka di Google Maps"}
                      >
                        <iframe
                          title="Mini Map"
                          width="100%"
                          height="100%"
                          className="border-0 pointer-events-none"
                          src={"https://www.openstreetmap.org/export/embed.html?bbox=" + (item.handoverLongitude - 0.005) + "," + (item.handoverLatitude - 0.005) + "," + (item.handoverLongitude + 0.005) + "," + (item.handoverLatitude + 0.005) + "&layer=mapnik&marker=" + item.handoverLatitude + "," + item.handoverLongitude}
                        />
                      </a>
                    ) : (
                      <div className="h-24 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-1.5 mt-3">
                        <Navigation className="w-5 h-5 opacity-50" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">{labels.locNotAvailable || 'Lokasi Tidak Tersedia'}</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}
          </div>

          {/* CATATAN UMUM */}
          <SectionCard 
            icon={StickyNote} 
            title={labels.sectionNotes || 'Catatan Tambahan'} 
            colorClass="text-amber-600 dark:text-amber-400"
            bgClass="bg-amber-100 dark:bg-amber-900/40"
            bodyClassName="p-4"
          >
            <div className="text-[11px] text-muted-foreground">
              {c.items.some(i => i.notes && i.vehicleCondition === 'GOOD') ? (
                <ul className="list-disc list-inside space-y-1">
                  {c.items.filter(i => i.notes && i.vehicleCondition === 'GOOD').map((item, idx) => {
                    const cv = (item as any).vehicle?.coreVehicle || (item as any).vehicleSnapshot;
                    return (
                      <li key={idx}><span className="font-semibold text-foreground mr-1">{cv?.plateNumber || cv?.licensePlate}:</span> {item.notes}</li>
                    )
                  })}
                </ul>
              ) : (
                <span className="italic">Tidak ada catatan tambahan.</span>
              )}
            </div>
          </SectionCard>

        </div>
        ) : (
          <PaymentsFeature 
            bookingId={c.contractId}
            customerId={customer?.id || ''}
            totalAmount={contract?.totalAmount || 0}
            deposit={contract?.deposit || 0}
            remainingAmount={contract?.remainingAmount || 0}
            defaultStage="HANDOVER"
            isFormOpen={isPaymentFormOpen}
            onFormOpenChange={setIsPaymentFormOpen}
            hideAddButton={true}
          />
        )}
      </div>
    </DetailShell>
  );
}
