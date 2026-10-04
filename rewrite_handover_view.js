const fs = require('fs');
const path = require('path');

const srcPath = './apps/business/src/features/modules/rental/handover/components/HandoverDetailDrawer.tsx';
const destPath = './apps/business/src/features/modules/rental/handover/components/HandoverView.tsx';
const featurePath = './apps/business/src/features/modules/rental/handover/HandoversFeature.tsx';

const newCode = `'use client';

import React from 'react';
import { Button, DetailShell } from '@adatrack/ui';
import { User, Car, MapPin, Key, CheckCircle, Navigation, Info, FileCheck } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalHandover } from '../types/handover';

interface HandoverViewProps {
  handover: RentalHandover | null;
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
  if (!handover) return null;

  const formatDate = (dateStr: string) => {
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
  const customer = c.customer;
  const vehicle = c.vehicle;
  const coreVehicle = vehicle?.coreVehicle;
  const eq = c.equipmentChecklist || {};

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
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20">
        
        {/* Header Section */}
        <div className="px-4 py-4 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground">{c.id}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-muted-foreground font-medium">No. Kontrak: {c.contract?.contractNumber || c.contractId}</span>
            </div>
          </div>
          <div className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            Diserahkan
          </div>
        </div>

        <div className="p-3 flex flex-col gap-3">
          
          {/* INFORMASI TRANSAKSI */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <FileCheck className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Informasi Transaksi</h3>
            </div>
            <div className="p-3.5 grid grid-cols-2 gap-3">
              <InfoItem label="Tanggal & Jam" value={formatDate(c.handoverAt)} />
              <InfoItem label="Petugas" value={c.staffName || '-'} />
            </div>
          </div>

          {/* INFORMASI PELANGGAN */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Informasi Pelanggan</h3>
            </div>
            <div className="p-3.5">
              {customer ? (
                <div className="flex flex-col gap-3.5">
                  <InfoItem label="Nama" value={customer.name} valueClassName="text-sm" />
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                    <InfoItem label="Tipe" value={customer.type === 'COMPANY' ? 'Perusahaan' : 'Individu'} />
                    <InfoItem label="No. Telepon" value={customer.phone || '-'} />
                    {customer.type === 'INDIVIDUAL' && <InfoItem label="KTP / NIK" value={(customer as any).nik || '-'} />}
                    {customer.type === 'COMPANY' && <InfoItem label="PIC" value={(customer as any).picName || '-'} />}
                  </div>
                  <div className="pt-3 border-t border-border/40">
                    <InfoItem label="Alamat" value={customer.address} />
                  </div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">Tidak ada data pelanggan</span>
              )}
            </div>
          </div>

          {/* KENDARAAN */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Car className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Kendaraan</h3>
            </div>
            <div className="p-3.5">
              {coreVehicle ? (
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <Car className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{coreVehicle.brand} {coreVehicle.vehicleName}</p>
                      <p className="text-xs font-semibold text-primary">{coreVehicle.plateNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                    <InfoItem label="Tahun" value={coreVehicle.year || '-'} />
                    <InfoItem label="Tipe" value={coreVehicle.vehicleCategory || '-'} />
                  </div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">Data kendaraan tidak tersedia</span>
              )}
            </div>
          </div>

          {/* LOKASI SERAH TERIMA */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Lokasi Serah Terima</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              <InfoItem label="Alamat" value={c.handoverAddress || '-'} />
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                <InfoItem label="Latitude" value={<span className="font-mono">{c.handoverLatitude}</span>} />
                <InfoItem label="Longitude" value={<span className="font-mono">{c.handoverLongitude}</span>} />
              </div>
              {c.handoverLatitude && c.handoverLongitude ? (
                <div className="h-32 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg overflow-hidden mt-1">
                  <iframe
                    title="Mini Map"
                    width="100%"
                    height="100%"
                    className="border-0"
                    src={"https://www.openstreetmap.org/export/embed.html?bbox=" + (c.handoverLongitude - 0.005) + "," + (c.handoverLatitude - 0.005) + "," + (c.handoverLongitude + 0.005) + "," + (c.handoverLatitude + 0.005) + "&layer=mapnik&marker=" + c.handoverLatitude + "," + c.handoverLongitude}
                  />
                </div>
              ) : (
                <div className="h-20 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-1 mt-1">
                  <Navigation className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">Lokasi Tidak Tersedia</span>
                </div>
              )}
            </div>
          </div>

          {/* KONDISI SAAT SERAH TERIMA */}
          <div className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-900/30">
              <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">Kondisi & Kelengkapan</h3>
            </div>
            <div className="p-3.5 flex flex-col gap-3.5">
              <div className="grid grid-cols-3 gap-3">
                <InfoItem label="Odometer Awal" value={new Intl.NumberFormat("id-ID").format(c.odometerStart) + " KM"} />
                <InfoItem label="Level BBM" value={c.fuelLevel} />
                <InfoItem label="Kondisi" value={getConditionLabel(c.vehicleCondition)} />
              </div>
              
              {c.vehicleCondition !== 'GOOD' && c.notes && (
                <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg mt-1">
                  <InfoItem label="Detail Kerusakan" value={c.notes} valueClassName="text-warning-700 dark:text-warning" />
                </div>
              )}

              <div className="pt-3 border-t border-border/40">
                <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 block">Kelengkapan</span>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
                  {[
                    { label: 'STNK', key: 'stnk' },
                    { label: 'Ban Cadangan', key: 'spareTire' },
                    { label: 'Dongkrak', key: 'jack' },
                    { label: 'Toolkit', key: 'toolkit' },
                    { label: 'Segitiga Pengaman', key: 'triangle' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2 text-xs">
                      {eq[item.key as keyof typeof eq] ? (
                        <span className="text-success font-bold text-[10px]">✓</span>
                      ) : (
                        <span className="text-neutral-400 text-[10px]">○</span>
                      )}
                      <span className={eq[item.key as keyof typeof eq] ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {c.notes && c.vehicleCondition === 'GOOD' && (
                <div className="pt-3 border-t border-border/40">
                  <InfoItem label="Catatan Tambahan" value={c.notes} />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DetailShell>
  );
}
`;

fs.writeFileSync(destPath, newCode);

// Update HandoversFeature.tsx
let featureCode = fs.readFileSync(featurePath, 'utf8');
featureCode = featureCode.replace(/HandoverDetailDrawer/g, 'HandoverView');
featureCode = featureCode.replace(/'\.\/components\/HandoverDetailDrawer'/, "'./components/HandoverView'");
fs.writeFileSync(featurePath, featureCode);

if (fs.existsSync(srcPath)) {
  fs.unlinkSync(srcPath);
}

console.log('Success');
