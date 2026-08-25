'use client';

import React from 'react';
import { Button } from '@adatrack/ui';
import { User, Car, Calendar, MapPin, CheckCircle, Navigation, X, FileCheck, Gauge, Fuel, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalReturn } from '../types/return';

interface ReturnDetailDrawerProps {
  ret: RentalReturn | null;
  open: boolean;
  onClose: () => void;
}

const FUEL_LABELS: Record<string, string> = {
  EMPTY: 'Kosong',
  QUARTER: '1/4',
  HALF: '1/2',
  THREE_QUARTER: '3/4',
  FULL: 'Penuh',
};

const getConditionLabel = (c: string) => {
  if (c === 'GOOD') return 'Baik';
  if (c === 'MINOR_DAMAGE') return 'Kerusakan Ringan';
  return 'Perlu Perbaikan';
};

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);

export function ReturnDetailDrawer({ ret, open, onClose }: ReturnDetailDrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!ret) return null;

  const customer = ret.customer;
  const vehicle = ret.vehicle;
  const coreVehicle = vehicle?.coreVehicle;
  const handover = ret.handover;
  const distanceUsed = handover ? ret.odometerEnd - handover.odometerStart : null;
  const totalCharges = ret.additionalCharges || 0;

  const eq = ret.equipmentChecklistEnd || {};
  const eqItems = [
    { label: 'STNK', key: 'stnk' },
    { label: 'Ban Cadangan', key: 'spareTire' },
    { label: 'Dongkrak', key: 'jack' },
    { label: 'Toolkit', key: 'toolkit' },
    { label: 'Segitiga Pengaman', key: 'triangle' },
    { label: 'Alat Pemadam', key: 'fireExtinguisher' },
  ];

  return (
    <React.Fragment>
      <div
        className={cn("fixed inset-0 bg-black/40 z-50 transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-[90%] sm:w-[500px] bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transition-transform duration-300 border-l border-border",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex-none p-6 border-b border-border bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col gap-3 relative">
          <Button variant="ghost" size="sm" className="absolute top-4 right-4 h-8 w-8 rounded-full p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-bold">Detail Pengembalian</h2>
            <p className="text-sm text-muted-foreground">{ret.id}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            {formatDate(ret.returnedAt)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">

          {/* Handover vs Return Comparison */}
          {handover && (
            <section>
              <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4" /> RINGKASAN PERJALANAN
              </h3>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-3 bg-neutral-50 dark:bg-neutral-900/50 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <div className="p-2 text-center">ITEM</div>
                  <div className="p-2 text-center border-l border-border">SERAH TERIMA</div>
                  <div className="p-2 text-center border-l border-border">PENGEMBALIAN</div>
                </div>
                <div className="grid grid-cols-3 border-b border-border text-sm">
                  <div className="p-2 text-muted-foreground">Waktu</div>
                  <div className="p-2 border-l border-border text-xs">{formatDate(handover.handoverAt)}</div>
                  <div className="p-2 border-l border-border text-xs">{formatDate(ret.returnedAt)}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-border text-sm">
                  <div className="p-2 text-muted-foreground">Odometer</div>
                  <div className="p-2 border-l border-border font-medium">{handover.odometerStart.toLocaleString('id-ID')} KM</div>
                  <div className="p-2 border-l border-border font-medium">{ret.odometerEnd.toLocaleString('id-ID')} KM</div>
                </div>
                <div className="grid grid-cols-3 border-b border-border text-sm">
                  <div className="p-2 text-muted-foreground">BBM</div>
                  <div className="p-2 border-l border-border">{FUEL_LABELS[handover.fuelLevel]}</div>
                  <div className="p-2 border-l border-border">{FUEL_LABELS[ret.fuelLevelEnd]}</div>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <div className="p-2 text-muted-foreground">Kondisi</div>
                  <div className="p-2 border-l border-border">{getConditionLabel(handover.vehicleCondition)}</div>
                  <div className="p-2 border-l border-border">{getConditionLabel(ret.vehicleConditionEnd)}</div>
                </div>
              </div>
              {distanceUsed !== null && (
                <div className="mt-3 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 flex justify-between text-sm">
                  <span className="font-bold text-muted-foreground">Total Jarak Tempuh</span>
                  <span className="font-bold text-primary">{distanceUsed.toLocaleString('id-ID')} KM</span>
                </div>
              )}
            </section>
          )}

          {/* Transaction Info */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4" /> INFORMASI TRANSAKSI
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">ID Pengembalian</p>
                <p className="font-semibold text-sm">{ret.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">No. Kontrak</p>
                <p className="font-semibold text-sm">{ret.contract?.contractNumber || ret.contractId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tanggal Pengembalian</p>
                <p className="font-semibold text-sm">{formatDate(ret.returnedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Petugas</p>
                <p className="font-semibold text-sm">{ret.staffName || '-'}</p>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> CUSTOMER
            </h3>
            {customer ? (
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-border">
                <p className="font-bold text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">{customer.type?.toLowerCase()}</p>
                <p className="text-sm text-muted-foreground mt-1">{customer.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Data customer tidak tersedia</p>
            )}
          </section>

          {/* Vehicle */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <Car className="w-4 h-4" /> KENDARAAN
            </h3>
            {coreVehicle ? (
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                  <Car className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{coreVehicle.brand} {coreVehicle.vehicleName}</p>
                  <p className="text-sm font-semibold text-primary">{coreVehicle.plateNumber}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Data kendaraan tidak tersedia</p>
            )}
          </section>

          {/* Location */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> LOKASI PENGEMBALIAN
            </h3>
            <div className="grid gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Alamat</p>
                <p className="font-medium text-sm">{ret.returnAddress || '-'}</p>
              </div>
              {(ret.returnLatitude || ret.returnLongitude) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Latitude</p>
                    <p className="font-medium text-sm font-mono">{ret.returnLatitude}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Longitude</p>
                    <p className="font-medium text-sm font-mono">{ret.returnLongitude}</p>
                  </div>
                </div>
              )}
              <div className="h-24 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground gap-1">
                <Navigation className="w-5 h-5" />
                <span className="text-xs">Mini Map</span>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section>
            <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> KELENGKAPAN
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {eqItems.map(item => (
                <div key={item.key} className="flex items-center gap-2 text-sm">
                  {(eq as any)[item.key] ? (
                    <span className="text-success font-bold">✓</span>
                  ) : (
                    <span className="text-danger font-bold">✗</span>
                  )}
                  <span className={(eq as any)[item.key] ? 'text-foreground' : 'text-muted-foreground line-through'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Damage */}
          {ret.damageNotes && (
            <section>
              <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> KERUSAKAN
              </h3>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                {ret.damageNotes}
              </div>
            </section>
          )}

          {/* Charges */}
          {totalCharges > 0 && (
            <section>
              <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> BIAYA TAMBAHAN
              </h3>
              <div className="space-y-2">
                {(ret.lateFee || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Keterlambatan</span>
                    <span className="font-medium">{formatCurrency(ret.lateFee!)}</span>
                  </div>
                )}
                {(ret.damageFee || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Kerusakan</span>
                    <span className="font-medium">{formatCurrency(ret.damageFee!)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                  <span>Total Biaya Tambahan</span>
                  <span className="text-danger">{formatCurrency(totalCharges)}</span>
                </div>
              </div>
            </section>
          )}

          {/* Notes */}
          {ret.notes && (
            <section>
              <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4">CATATAN</h3>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-border text-sm">
                {ret.notes}
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
