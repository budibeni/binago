'use client';

import React from 'react';
import { Button } from '@adatrack/ui';
import { User, Car, Calendar, MapPin, Key, CheckCircle, Navigation, Info, X, FileCheck } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalHandover } from '../types/handover';

interface HandoverDetailDrawerProps {
  handover: RentalHandover | null;
  open: boolean;
  onClose: () => void;
}

export function HandoverDetailDrawer({
  handover,
  open,
  onClose,
}: HandoverDetailDrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

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

  return (
    <React.Fragment>
      <div 
        className={cn("fixed inset-0 bg-black/40 z-50 transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none")} 
        onClick={onClose} 
      />
      <aside 
        className={cn("fixed top-0 right-0 h-full w-[90%] sm:w-[450px] bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300 border-l border-border", open ? "translate-x-0" : "translate-x-full")}
      >
        {/* Header */}
        <div className="flex-none p-6 border-b border-border bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col gap-4 relative">
          <Button variant="ghost" size="sm" className="absolute top-4 right-4 h-8 w-8 rounded-full p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-bold">Detail Serah Terima</h2>
            <p className="text-sm text-muted-foreground">{c.id}</p>
          </div>
          <div className="flex items-center gap-3">

            <span className="text-sm font-medium text-foreground">{formatDate(c.handoverAt)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          
          {/* INFORMASI TRANSAKSI */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4" /> INFORMASI TRANSAKSI
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID Handover</p>
                <p className="font-semibold text-sm">{c.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">No. Kontrak</p>
                <p className="font-semibold text-sm">{c.contract?.contractNumber || c.contractId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tanggal & Jam</p>
                <p className="font-semibold text-sm">{formatDate(c.handoverAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Petugas</p>
                <p className="font-semibold text-sm">{c.staffName || '-'}</p>
              </div>
            </div>
          </section>

          {/* CUSTOMER */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> CUSTOMER
            </h3>
            {customer ? (
              <div className="grid gap-3">
                <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-border">
                  <p className="font-bold text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">{customer.type.toLowerCase()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nomor Telepon</p>
                    <p className="font-medium text-sm">{customer.phone}</p>
                  </div>
                  {customer.type === 'INDIVIDUAL' && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">KTP / NIK</p>
                      <p className="font-medium text-sm">{(customer as any).nik || '-'}</p>
                    </div>
                  )}
                  {customer.type === 'COMPANY' && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">PIC</p>
                      <p className="font-medium text-sm">{(customer as any).picName || '-'}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Alamat</p>
                  <p className="font-medium text-sm">{customer.address}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Data customer tidak tersedia</p>
            )}
          </section>

          {/* KENDARAAN */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <Car className="w-4 h-4" /> KENDARAAN
            </h3>
            {coreVehicle ? (
              <div className="grid gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <Car className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{coreVehicle.brand} {coreVehicle.vehicleName}</p>
                    <p className="text-sm font-semibold text-primary">{coreVehicle.plateNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tahun</p>
                    <p className="font-medium text-sm">{coreVehicle.year || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tipe</p>
                    <p className="font-medium text-sm">{coreVehicle.vehicleCategory || '-'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Data kendaraan tidak tersedia</p>
            )}
          </section>

          {/* LOKASI */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> LOKASI SERAH TERIMA
            </h3>
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Alamat</p>
                <p className="font-medium text-sm">{c.handoverAddress || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Latitude</p>
                  <p className="font-medium text-sm font-mono">{c.handoverLatitude}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Longitude</p>
                  <p className="font-medium text-sm font-mono">{c.handoverLongitude}</p>
                </div>
              </div>
              {c.handoverLatitude && c.handoverLongitude ? (
                <div className="h-40 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg overflow-hidden relative">
                  <iframe
                    title="Mini Map"
                    width="100%"
                    height="100%"
                    className="border-0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.handoverLongitude - 0.005},${c.handoverLatitude - 0.005},${c.handoverLongitude + 0.005},${c.handoverLatitude + 0.005}&layer=mapnik&marker=${c.handoverLatitude},${c.handoverLongitude}`}
                  />
                </div>
              ) : (
                <div className="h-24 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-1">
                  <Navigation className="w-5 h-5" />
                  <span className="text-xs">Lokasi Tidak Tersedia</span>
                </div>
              )}
            </div>
          </section>

          {/* KONDISI */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> KONDISI SAAT SERAH TERIMA
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Odometer Awal</p>
                  <p className="font-medium text-sm">{new Intl.NumberFormat('id-ID').format(c.odometerStart)} KM</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Level BBM</p>
                  <p className="font-medium text-sm">{c.fuelLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Kondisi</p>
                  <p className="font-medium text-sm">{getConditionLabel(c.vehicleCondition)}</p>
                </div>
              </div>
              {c.vehicleCondition !== 'GOOD' && c.notes && (
                <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-warning-foreground mb-1">Detail Kerusakan</p>
                  <p className="text-sm text-warning-foreground">{c.notes}</p>
                </div>
              )}
            </div>
          </section>

          {/* KELENGKAPAN */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <Key className="w-4 h-4" /> KELENGKAPAN KENDARAAN
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {[
                { label: 'STNK', key: 'stnk' },
                { label: 'Ban Cadangan', key: 'spareTire' },
                { label: 'Dongkrak', key: 'jack' },
                { label: 'Toolkit', key: 'toolkit' },
                { label: 'Segitiga Pengaman', key: 'triangle' },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-sm">
                  {eq[item.key as keyof typeof eq] ? (
                    <span className="text-success font-bold">✓</span>
                  ) : (
                    <span className="text-neutral-400">○</span>
                  )}
                  <span className={eq[item.key as keyof typeof eq] ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* CATATAN */}
          {c.notes && c.vehicleCondition === 'GOOD' && (
            <section>
              <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> CATATAN
              </h3>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-border text-sm">
                {c.notes}
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-neutral-50 dark:bg-neutral-900/30 flex justify-end">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </div>
      </aside>
    </React.Fragment>
  );
}
