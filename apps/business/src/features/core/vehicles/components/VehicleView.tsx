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
  Settings,
  Power,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge, Button, DetailShell, SectionHeader } from '@adatrack/ui';
import type { Vehicle } from '../types/vehicle';
import { getTranslation } from '../../../../i18n';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';

function CompactField({ label, value, highlight, colSpan = 1 }: { label: string, value: React.ReactNode, highlight?: boolean, colSpan?: number }) {
  return (
    <div className={cn('flex flex-col', colSpan === 2 && 'col-span-2')}>
      <span className="text-[10px] uppercase tracking-wider text-foreground-muted font-semibold mb-0.5">{label}</span>
      <span className={cn('text-[12px] font-medium leading-tight', highlight ? 'text-danger font-bold' : 'text-foreground')}>{value}</span>
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface VehicleViewProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (v: Vehicle) => void;
  onDelete?: (v: Vehicle) => void;
  onTrack?: (v: Vehicle) => void;
}

// ─── Status Config ────────────────────────────────────────────────────────

function getStatusConfig(status: Vehicle['status'], labels: any) {
  const map = {
    driving: { label: labels.statusDriving, variant: 'success' as const },
    idle: { label: labels.statusIdle, variant: 'warning' as const },
    parking: { label: labels.statusParking, variant: 'default' as const },
    offline: { label: labels.statusOffline, variant: 'danger' as const },
  };
  return map[status];
}

function getCategoryLabel(cat: Vehicle['vehicleCategory'], labels: any): string {
  const map: Record<Vehicle['vehicleCategory'], string> = {
    truck: labels.categoryTruck || 'Truk',
    minibus: labels.categoryMinibus || 'Minibus',
    pickup: labels.categoryPickup || 'Pickup',
    motorcycle: labels.categoryMotorcycle || 'Motor',
    other: labels.categoryOther || 'Lainnya',
  };
  return map[cat];
}

function getFuelLabel(fuel: Vehicle['fuelType'], labels: any): string {
  const map: Record<Vehicle['fuelType'], string> = {
    solar: labels.fuelSolar || 'Solar',
    bensin: labels.fuelBensin || 'Bensin',
    listrik: labels.fuelElectric || labels.fuelListrik || 'Listrik',
  };
  return map[fuel];
}

function formatDate(iso: string, locale: string = 'id-ID'): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function formatDateTime(iso: string, locale: string = 'id-ID'): string {
  return new Date(iso).toLocaleString(locale, {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function VehicleView({ vehicle, open, onClose, onEdit, onDelete, onTrack }: VehicleViewProps) {
  const locale = useBusinessLocale();
  const dict = getTranslation(locale);
  const labels = dict.vehicles;

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
    <DetailShell
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={labels.detailTitle}
      onEdit={onEdit ? () => onEdit(vehicle) : undefined}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Header content (was inside drawer header) */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0 bg-neutral-50/50 dark:bg-neutral-900">
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
        </div>

        {onTrack && (
          <div className="px-4 py-3 border-b border-border bg-neutral-50/50 dark:bg-neutral-900 grid grid-cols-2 gap-3 shrink-0">
            <Button variant="outline" size="sm" className="w-full text-[12px] h-8 bg-transparent border-info/30 text-info hover:bg-info/10 dark:hover:bg-info/20 font-medium" onClick={() => onTrack(vehicle)}>
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              {labels.btnTrack}
            </Button>
            <Button variant="outline" size="sm" className="w-full text-[12px] h-8 bg-transparent border-danger/30 text-danger hover:bg-danger/10 dark:hover:bg-danger/20 font-medium" onClick={() => alert(labels.alertTurnOffEngine)}>
              <Power className="w-3.5 h-3.5 mr-1.5" />
              {labels.btnTurnOffEngine}
            </Button>
          </div>
        )}

        <div className="p-4 grid grid-cols-1 lg:group-data-[layout=dialog]/detail:grid-cols-2 lg:group-data-[layout=fullscreen]/detail:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-4">
            {/* Section: Informasi Dasar & Spesifikasi */}
            <SectionHeader icon={Car} title={labels.detailInfoSpec} />
          <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
            <CompactField label={labels.fieldGroup} value={vehicle.groupName} colSpan={2} />
            <CompactField label={labels.fieldCategory} value={getCategoryLabel(vehicle.vehicleCategory, labels)} />
            <CompactField label={labels.fieldBrandYear} value={`${vehicle.brand || '-'} - ${vehicle.year || '-'}`} />
            <CompactField label={labels.fieldColor} value={vehicle.color || '-'} />
            <CompactField label={labels.fieldEngineCapacity} value={vehicle.engineCapacity ? `${vehicle.engineCapacity.toLocaleString('id-ID')} CC` : '-'} />
            <CompactField label={labels.fieldAssetNumber} value={vehicle.assetNumber || '-'} />
            <CompactField label={labels.fieldSeats} value={vehicle.passengerCapacity ? `${vehicle.passengerCapacity}` : '-'} />
            <CompactField label={labels.fieldDimension} value={(vehicle.dimLength && vehicle.dimWidth && vehicle.dimHeight) ? `${vehicle.dimLength}m x ${vehicle.dimWidth}m x ${vehicle.dimHeight}m` : '-'} colSpan={2} />
          </div>

          {/* Section: Operasional & Performa */}
          <SectionHeader icon={Gauge} title={labels.detailOpsPerf} />
          <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
            <CompactField label={labels.fieldDriver} value={vehicle.driverName || labels.noDriver} colSpan={2} />
            <CompactField label={labels.fieldFuelType} value={getFuelLabel(vehicle.fuelType, labels)} />
            <CompactField label={labels.fieldFuelCap} value={vehicle.fuelCapacity ? `${vehicle.fuelCapacity} L` : '-'} />
            <CompactField label={labels.fieldFuelRatio} value={vehicle.fuelRatio ? `${vehicle.fuelRatio} km/L` : '-'} />
            <CompactField label={labels.fieldMaxSpeed} value={vehicle.maxSpeed ? `${vehicle.maxSpeed} km/h` : '-'} />
          </div>

          {/* Section: Administrasi & Perawatan */}
          <SectionHeader icon={Wrench} title={labels.detailAdminMaint} />
          <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              <CompactField label={labels.fieldOdometer} value={`${(vehicle.odometer || 0).toLocaleString('id-ID')} km`} />
              <CompactField label={labels.fieldLastService} value={`${(vehicle.lastServiceKm || 0).toLocaleString('id-ID')} km`} />
            </div>
            {/* Service progress */}
            <div className="pt-2 border-t border-border/60">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold">
                  {labels.fieldNextService}: <span className={cn("ml-1", isServiceDue ? 'text-danger font-bold' : 'text-foreground font-medium')}>{vehicle.nextServiceKm.toLocaleString('id-ID')} km</span>
                </p>
                {isServiceDue && <AlertTriangle className="h-3.5 w-3.5 text-danger" />}
              </div>
              <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    serviceProgress >= 100 ? 'bg-danger' :
                    serviceProgress >= 90 ? 'bg-warning' : 'bg-success',
                  )}
                  style={{ width: `${serviceProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-foreground-muted mt-1 text-right">
                {Math.round(serviceProgress)}%
              </p>
            </div>
          </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Section: Lisensi & Legalitas */}
            <SectionHeader icon={FileText} title={labels.detailLicensing} />
          <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
            <CompactField label={labels.fieldStnkExpiry} value={vehicle.registrationExpiry ? formatDate(vehicle.registrationExpiry) : '-'} highlight={isRegistrationExpiringSoon} />
            <CompactField label={labels.fieldStnkNo} value={vehicle.stnkNumber || '-'} />
            <CompactField label={labels.fieldKirNo} value={vehicle.kirNumber || '-'} />
            <CompactField label={labels.fieldBpkbNo} value={vehicle.bpkbNumber || '-'} />
            <CompactField label={labels.fieldEngineNo} value={vehicle.engineNumber || '-'} />
            <CompactField label={labels.fieldChassisNo} value={vehicle.chassisNumber || '-'} />
          </div>

          {/* Section: Perangkat GPS */}
          <SectionHeader icon={Cpu} title={labels.detailGpsDevice} />
          <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
            <CompactField label={labels.fieldSystemId} value={vehicle.vehicleId || '-'} colSpan={2} />
            <CompactField label={labels.fieldGpsBrand} value={`${vehicle.gpsDeviceBrand || '-'} ${vehicle.gpsDeviceType || ''}`.trim() || '-'} />
            <CompactField label={labels.fieldGpsInstall} value={vehicle.gpsInstallDate ? formatDate(vehicle.gpsInstallDate) : '-'} />
            <CompactField label={labels.fieldImei} value={vehicle.deviceImei || labels.noDevice} />
            <CompactField label={labels.fieldSim} value={vehicle.deviceSimNumber || '-'} />
            <CompactField label={labels.fieldLastUpdate} value={vehicle.lastUpdate ? formatDateTime(vehicle.lastUpdate) : '-'} colSpan={2} />
          </div>

          {/* Notes */}
          {vehicle.notes && (
            <>
              <SectionHeader icon={FileText} title={labels.detailNotes} />
              <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5">
                <p className="text-[12px] text-foreground leading-relaxed italic">{vehicle.notes}</p>
              </div>
            </>
          )}
          
          </div>
        </div>
      </div>
    </DetailShell>
  );
}
