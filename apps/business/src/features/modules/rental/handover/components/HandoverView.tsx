'use client';

import React from 'react';
import { Button, DetailShell } from '@adatrack/ui';
import { User, Car, MapPin, Key, CheckCircle, Navigation, Info, FileText, StickyNote } from 'lucide-react';
import { PaymentsFeature } from '../../payments/PaymentsFeature';
import type { RentalHandover } from '../types/handover';
import { cn, formatDate, formatDateTime, formatNumber } from '@adatrack/utils';

interface HandoverGroup {
  id: string; // group ID (contractId)
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
}

export function HandoverView({
  handover,
  open,
  onClose,
  layout = 'drawer',
}: HandoverViewProps) {
  const [mainTab, setMainTab] = React.useState<'detail' | 'payment'>('detail');
  const [activeTab, setActiveTab] = React.useState<string>('');

  React.useEffect(() => {
    if (handover?.items && handover.items.length > 0) {
      setActiveTab(handover.items[0].id);
    }
  }, [handover]);

  if (!handover) return null;

  
  
  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'GOOD': return 'Baik';
      case 'MINOR_DAMAGE': return 'Kerusakan Ringan';
      case 'NEEDS_REPAIR': return 'Perlu Perbaikan';
      default: return condition;
    }
  };

  const c = handover;
  const contract = c.contract;
  const customer = c.customer;
  const isCompleted = c.status === 'COMPLETED';

  const InfoItem = ({ label, value, highlight = false, valueClassName }: { label: string, value: React.ReactNode, highlight?: boolean, valueClassName?: string }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</span>
      <span className={cn("text-[11px] font-medium", highlight ? "text-danger font-bold" : "text-neutral-900 dark:text-neutral-100", valueClassName)}>
        {value}
      </span>
    </div>
  );

  return (
    <DetailShell
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title="Detail Serah Terima"
      layout={layout}
    >
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20 pb-8">

        {/* Header Section */}
        <div className="px-3 py-3 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground">{c.id}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-medium">No. Kontrak: {contract?.contractNumber || c.contractId}</span>
            </div>
          </div>
          <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold", isCompleted ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400")}>
            {isCompleted ? 'Selesai' : 'Sebagian'}
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex px-4 border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 z-10 pt-2">
          <button
            className={cn(
              "px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
              mainTab === 'detail' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
            onClick={() => setMainTab('detail')}
          >
            Detail Handover
          </button>
          <button
            className={cn(
              "px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
              mainTab === 'payment' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
            onClick={() => setMainTab('payment')}
          >
            Pembayaran
          </button>
        </div>

        {mainTab === 'detail' ? (
          <div className="p-4 flex flex-col gap-4">

          {/* INFORMASI KONTRAK (Like HandoverForm) */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-3 py-2.5 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Informasi Kontrak</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-4">
              <InfoItem label="Nomor Kontrak" value={contract?.contractNumber || c.contractId} />
              <InfoItem label="Pelanggan" value={customer?.name || '-'} />
              <InfoItem label="Periode Sewa" value={contract ? `${formatDate(contract.startDate)} - ${formatDate(contract.endDate)}` : '-'} />
              <InfoItem label="Layanan" value={contract ? (contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dgn Sopir') : '-'} />
            </div>
          </div>

          {/* DETAIL KENDARAAN (TABS) */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">

            {/* TABS */}
            {c.items.length > 1 && (
              <div className="shrink-0 bg-background border-b border-border/40">
                <div className="flex items-center overflow-x-auto hide-scrollbar px-2">
                  {c.items.map(item => {
                    const id = item.id;
                    const isSelected = activeTab === id;
                    const cv = item.vehicle?.coreVehicle;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={cn(
                          "px-2.5 h-[30px] text-[10px] font-semibold border-b-[1.5px] transition-colors focus:outline-none flex items-center gap-1.5 pt-[2px] whitespace-nowrap",
                          isSelected ? 'border-b-danger text-danger' : 'border-b-transparent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Car className={cn("h-3 w-3", isSelected ? "text-danger" : "opacity-70")} />
                        {cv?.plateNumber || item.vehicleId}
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
              const cv = item.vehicle?.coreVehicle;
              const eq = item.equipmentChecklist || {};

              return (
                <div className="p-4 flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/40">
                    <div className="w-9 h-9 rounded-full bg-danger/10 flex items-center justify-center">
                      <Car className="w-4 h-4 text-danger" />
                    </div>
                    <div>
                      <p className="font-bold text-[12px] text-foreground">{cv?.brand} {cv?.vehicleName}</p>
                      <p className="text-[11px] font-semibold text-primary">{cv?.plateNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <InfoItem label="Tanggal & Jam" value={formatDateTime(item.handoverAt)} />
                    <InfoItem label="Petugas" value={item.staffName || '-'} />
                    <InfoItem label="Odometer Awal" value={formatNumber(item.odometerStart) + " KM"} />
                    <InfoItem label="Level BBM" value={item.fuelLevel} />
                    <InfoItem label="Kondisi" value={getConditionLabel(item.vehicleCondition)} />
                  </div>

                  {item.vehicleCondition !== 'GOOD' && item.notes && (
                    <div className="bg-warning/10 border border-warning/20 p-2.5 rounded-lg">
                      <InfoItem label="Detail Kerusakan" value={item.notes} valueClassName="text-warning-700 dark:text-warning" />
                    </div>
                  )}

                  <div className="pt-2.5 border-t border-border/40">
                    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5 block">Kelengkapan</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-2">
                      {[
                        { label: 'STNK', key: 'stnk' },
                        { label: 'Ban Cadangan', key: 'spareTire' },
                        { label: 'Dongkrak', key: 'jack' },
                        { label: 'Toolkit', key: 'toolkit' },
                        { label: 'Segitiga Pengaman', key: 'triangle' },
                      ].map((eqItem) => (
                        <div key={eqItem.key} className="flex items-center gap-1.5 text-[11px]">
                          {eq[eqItem.key as keyof typeof eq] ? (
                            <span className="text-success font-bold text-[10px]">✓</span>
                          ) : (
                            <span className="text-neutral-400 text-[10px]">○</span>
                          )}
                          <span className={eq[eqItem.key as keyof typeof eq] ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                            {eqItem.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LOKASI KHUSUS KENDARAAN INI */}
                  <div className="pt-2.5 border-t border-border/40">
                    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5 block flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Lokasi Serah Terima</span>
                    <InfoItem label="Alamat" value={item.handoverAddress || '-'} />
                    <div className="grid grid-cols-2 gap-2.5 mt-2">
                      <InfoItem label="Latitude" value={<span className="font-mono text-[10px]">{item.handoverLatitude}</span>} />
                      <InfoItem label="Longitude" value={<span className="font-mono text-[10px]">{item.handoverLongitude}</span>} />
                    </div>
                    {item.handoverLatitude && item.handoverLongitude ? (
                      <a 
                        href={`https://maps.google.com/?q=${item.handoverLatitude},${item.handoverLongitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-24 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg overflow-hidden mt-2 relative group hover:opacity-90 transition-opacity cursor-pointer"
                        title="Buka di Google Maps"
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
                      <div className="h-20 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-1 mt-2">
                        <Navigation className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Lokasi Tidak Tersedia</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}
          </div>

          {/* CATATAN UMUM */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-3 py-2.5 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <StickyNote className="w-3 h-3 text-muted-foreground" />
              <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Catatan Tambahan</h3>
            </div>
            <div className="p-4 text-[11px] text-muted-foreground">
              {c.items.some(i => i.notes && i.vehicleCondition === 'GOOD') ? (
                <ul className="list-disc list-inside space-y-1">
                  {c.items.filter(i => i.notes && i.vehicleCondition === 'GOOD').map((item, idx) => (
                    <li key={idx}><span className="font-semibold text-foreground mr-1">{item.vehicleSnapshot?.licensePlate}:</span> {item.notes}</li>
                  ))}
                </ul>
              ) : (
                <span className="italic">Tidak ada catatan khusus.</span>
              )}
            </div>
          </div>

        </div>
        ) : (
          <PaymentsFeature 
            bookingId={contractId || c.contractId}
            customerId={customer?.id || ''}
            totalAmount={contract?.totalAmount || 0}
            deposit={contract?.deposit || 0}
            remainingAmount={contract?.remainingAmount || 0}
            defaultStage="HANDOVER"
          />
        )}
      </div>
    </DetailShell>
  );
}
