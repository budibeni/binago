const fs = require('fs');
const path = './apps/business/src/features/modules/rental/handover/components/HandoverView.tsx';

const code = `'use client';

import React from 'react';
import { Button, DetailShell } from '@adatrack/ui';
import { User, Car, MapPin, Key, CheckCircle, Navigation, Info, FileText, StickyNote } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalHandover } from '../types/handover';

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
  const [activeTab, setActiveTab] = React.useState<string>('');

  React.useEffect(() => {
    if (handover?.items && handover.items.length > 0) {
      setActiveTab(handover.items[0].id);
    }
  }, [handover]);

  if (!handover) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

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
      <span className={cn("text-xs font-medium", highlight ? "text-danger font-bold" : "text-neutral-900 dark:text-neutral-100", valueClassName)}>
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
        <div className="px-4 py-4 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground">{c.id}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-muted-foreground font-medium">No. Kontrak: {contract?.contractNumber || c.contractId}</span>
            </div>
          </div>
          <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold", isCompleted ? "bg-success/10 text-success" : "bg-warning/10 text-warning-600 dark:text-warning")}>
            {isCompleted ? 'Selesai' : 'Sebagian'}
          </div>
        </div>

        <div className="p-3 flex flex-col gap-3">
          
          {/* INFORMASI KONTRAK (Like HandoverForm) */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Informasi Kontrak</h3>
            </div>
            <div className="p-3.5 grid grid-cols-2 gap-y-3.5 gap-x-3">
              <InfoItem label="Nomor Kontrak" value={contract?.contractNumber || c.contractId} />
              <InfoItem label="Pelanggan" value={customer?.name || '-'} />
              <InfoItem label="Periode Sewa" value={contract ? \`\${formatDate(contract.startDate)} - \${formatDate(contract.endDate)}\` : '-'} />
              <InfoItem label="Layanan" value={contract ? (contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dgn Sopir') : '-'} />
            </div>
          </div>

          {/* DETAIL KENDARAAN (TABS) */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Car className="w-3.5 h-3.5 text-sky-500" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Detail Kendaraan</h3>
            </div>
            
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
                          "px-3 h-[38px] text-[11px] font-semibold border-b-2 transition-colors focus:outline-none flex items-center gap-1.5 pt-[2px] whitespace-nowrap",
                          isSelected ? 'border-b-sky-500 text-sky-600 dark:text-sky-400' : 'border-b-transparent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Car className={cn("h-3 w-3", isSelected ? "text-sky-500 dark:text-sky-400" : "opacity-70")} />
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
                <div className="p-3.5 flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                    <div className="w-9 h-9 rounded-full bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center">
                      <Car className="w-4 h-4 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-foreground">{cv?.brand} {cv?.vehicleName}</p>
                      <p className="text-[11px] font-semibold text-primary">{cv?.plateNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <InfoItem label="Tanggal & Jam" value={formatDateTime(item.handoverAt)} />
                    <InfoItem label="Petugas" value={item.staffName || '-'} />
                    <InfoItem label="Odometer Awal" value={new Intl.NumberFormat("id-ID").format(item.odometerStart) + " KM"} />
                    <InfoItem label="Level BBM" value={item.fuelLevel} />
                    <InfoItem label="Kondisi" value={getConditionLabel(item.vehicleCondition)} />
                  </div>
                  
                  {item.vehicleCondition !== 'GOOD' && item.notes && (
                    <div className="bg-warning/10 border border-warning/20 p-2.5 rounded-lg">
                      <InfoItem label="Detail Kerusakan" value={item.notes} valueClassName="text-warning-700 dark:text-warning" />
                    </div>
                  )}

                  <div className="pt-3 border-t border-border/40">
                    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5 block">Kelengkapan</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-3">
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
                  <div className="pt-3 border-t border-border/40">
                    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2.5 block flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Lokasi Serah Terima</span>
                    <InfoItem label="Alamat" value={item.handoverAddress || '-'} />
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <InfoItem label="Latitude" value={<span className="font-mono text-[10px]">{item.handoverLatitude}</span>} />
                      <InfoItem label="Longitude" value={<span className="font-mono text-[10px]">{item.handoverLongitude}</span>} />
                    </div>
                    {item.handoverLatitude && item.handoverLongitude ? (
                      <div className="h-32 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg overflow-hidden mt-2">
                        <iframe
                          title="Mini Map"
                          width="100%"
                          height="100%"
                          className="border-0"
                          src={"https://www.openstreetmap.org/export/embed.html?bbox=" + (item.handoverLongitude - 0.005) + "," + (item.handoverLatitude - 0.005) + "," + (item.handoverLongitude + 0.005) + "," + (item.handoverLatitude + 0.005) + "&layer=mapnik&marker=" + item.handoverLatitude + "," + item.handoverLongitude}
                        />
                      </div>
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
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Catatan Tambahan</h3>
            </div>
            <div className="p-3.5 text-xs text-muted-foreground">
              {c.items.some(i => i.notes && i.vehicleCondition === 'GOOD') ? (
                <ul className="list-disc list-inside space-y-1">
                  {c.items.filter(i => i.notes && i.vehicleCondition === 'GOOD').map((item, idx) => (
                    <li key={idx}><span className="font-semibold text-foreground mr-1">{item.vehicle?.coreVehicle?.plateNumber}:</span> {item.notes}</li>
                  ))}
                </ul>
              ) : (
                <span className="italic">Tidak ada catatan khusus.</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </DetailShell>
  );
}
`;

fs.writeFileSync(path, code);
console.log('Success');
