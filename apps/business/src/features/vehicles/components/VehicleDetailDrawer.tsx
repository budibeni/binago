'use client';

import React from 'react';
import {
  Car,
  User,
  Cpu,
  Gauge,
  Wrench,
  FileText,
  X,
  MapPin,
  Clock,
  Fuel,
  Calendar,
  Hash,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge } from '@adatrack/ui';
import type { Vehicle } from '../types/vehicle';

// â"€â"€â"€ Types â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

interface VehicleDetailDrawerProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  labels: {
    detailTitle: string;
    detailVehicleInfo: string;
    detailOperational: string;
    detailMaintenance: string;
    detailClose: string;
    noDriver: string;
    noDevice: string;
    statusDriving: string;
    statusIdle: string;
    statusParking: string;
    statusOffline: string;
  };
}

// â"€â"€â"€ Status Config â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function getStatusConfig(status: Vehicle['status'], labels: VehicleDetailDrawerProps['labels']) {
  const map = {
    driving: { label: labels.statusDriving, variant: 'success' as const },
    idle: { label: labels.statusIdle, variant: 'warning' as const },
    parking: { label: labels.statusParking, variant: 'default' as const },
    offline: { label: labels.statusOffline, variant: 'danger' as const },
  };
  return map[status];
}

function getCategoryLabel(cat: Vehicle['vehicleCategory']): string {
  const map: Record<Vehicle['vehicleCategory'], string> = {
    truck: 'Truk',
    minibus: 'Minibus',
    pickup: 'Pickup',
    motorcycle: 'Motor',
    other: 'Lainnya',
  };
  return map[cat];
}

function getFuelLabel(fuel: Vehicle['fuelType']): string {
  const map: Record<Vehicle['fuelType'], string> = {
    solar: 'Solar',
    bensin: 'Bensin',
    listrik: 'Listrik',
  };
  return map[fuel];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// â"€â"€â"€ Info Row â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function InfoRow({ icon: Icon, label, value, highlight }: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <p className={cn(
          'text-[13px] font-medium text-foreground truncate',
          highlight && 'text-warning-600 dark:text-warning-400 font-semibold',
        )}>
          {value ?? '-'}
        </p>
      </div>
    </div>
  );
}

// â"€â"€â"€ Section Header â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1 mt-4 first:mt-0">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{title}</h3>
    </div>
  );
}

// â"€â"€â"€ Component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

export function VehicleDetailDrawer({ vehicle, open, onClose, labels }: VehicleDetailDrawerProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!vehicle) return null;

  const statusCfg = getStatusConfig(vehicle.status, labels);
  const isRegistrationExpiringSoon = (() => {
    const expiry = new Date(vehicle.registrationExpiry);
    const diff = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff < 60;
  })();
  const serviceProgress = Math.min(
    ((vehicle.odometer - vehicle.lastServiceKm) / (vehicle.nextServiceKm - vehicle.lastServiceKm)) * 100,
    100,
  );
  const isServiceDue = serviceProgress >= 90;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={labels.detailTitle}
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-[400px] flex-col bg-background shadow-xl',
          'border-l border-border',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[15px] font-bold text-foreground tracking-widest uppercase truncate">
                {vehicle.plateNumber}
              </h2>
              <Badge variant={statusCfg.variant} dot>
                {statusCfg.label}
              </Badge>
            </div>
            <p className="text-[12px] text-foreground-muted truncate">{vehicle.vehicleName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50 hover:text-foreground transition-colors focus:outline-none"
            aria-label={labels.detailClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3">

          {/* Section: Vehicle Info */}
          <SectionHeader icon={Car} title={labels.detailVehicleInfo} />
          <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
            <InfoRow icon={Hash} label="Plat Nomor" value={vehicle.plateNumber} />
            <InfoRow icon={Car} label="Kendaraan" value={vehicle.vehicleName} />
            <InfoRow icon={Car} label="Kategori" value={getCategoryLabel(vehicle.vehicleCategory)} />
            <InfoRow icon={Car} label="Merk / Tahun" value={`${vehicle.brand} - ${vehicle.year}`} />
            <InfoRow icon={Fuel} label="Jenis BBM" value={getFuelLabel(vehicle.fuelType)} />
          </div>

          {/* Section: Operational */}
          <SectionHeader icon={MapPin} title={labels.detailOperational} />
          <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
            <InfoRow icon={User} label="Pengemudi" value={vehicle.driverName || labels.noDriver} />
            <InfoRow icon={Car} label="Grup" value={vehicle.groupName} />
            <InfoRow icon={Cpu} label="IMEI Device" value={vehicle.deviceImei || labels.noDevice} />
            <InfoRow icon={Gauge} label="Odometer" value={`${vehicle.odometer.toLocaleString('id-ID')} km`} />
            <InfoRow icon={Clock} label="Update Terakhir" value={formatDateTime(vehicle.lastUpdate)} />
          </div>

          {/* Section: Maintenance */}
          <SectionHeader icon={Wrench} title={labels.detailMaintenance} />
          <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
            <InfoRow icon={Wrench} label="Servis Terakhir" value={`${vehicle.lastServiceKm.toLocaleString('id-ID')} km`} />

            {/* Service progress */}
            <div className="py-2.5 border-b border-border/60">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="mt-0.5 p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0">
                  <Wrench className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">
                    Servis Berikutnya
                  </p>
                  <p className={cn(
                    'text-[13px] font-medium',
                    isServiceDue ? 'text-warning-600 dark:text-warning-400 font-semibold' : 'text-foreground',
                  )}>
                    {vehicle.nextServiceKm.toLocaleString('id-ID')} km
                  </p>
                </div>
                {isServiceDue && (
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                )}
              </div>
              {/* Progress bar */}
              <div className="ml-[2.375rem] h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    serviceProgress >= 100 ? 'bg-danger' :
                    serviceProgress >= 90 ? 'bg-warning' : 'bg-success',
                  )}
                  style={{ width: `${serviceProgress}%` }}
                />
              </div>
              <p className="ml-[2.375rem] text-[10px] text-foreground-muted mt-1">
                {Math.round(serviceProgress)}% menuju servis berikutnya
              </p>
            </div>

            <InfoRow
              icon={Calendar}
              label="STNK Kedaluwarsa"
              value={formatDate(vehicle.registrationExpiry)}
              highlight={isRegistrationExpiringSoon}
            />
          </div>

          {/* Notes */}
          {vehicle.notes && (
            <>
              <SectionHeader icon={FileText} title="Catatan" />
              <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3 py-2.5">
                <p className="text-[13px] text-foreground leading-relaxed">{vehicle.notes}</p>
              </div>
            </>
          )}

          <div className="h-4" />
        </div>
      </aside>
    </>
  );
}
