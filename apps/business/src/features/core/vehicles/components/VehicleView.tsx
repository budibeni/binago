'use client';

import React from 'react';
import {
  Car,
  Activity,
  Gauge,
  FileText,
  Cpu,
  MapPin,
  RefreshCw,
  Power,
  Star,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { cn, formatDate, formatDateTime, formatNumber } from '@adatrack/utils';
import { Button, DetailShell, Dialog, ConfirmDialog, Checkbox, toast } from '@adatrack/ui';
import type { Vehicle } from '../types/vehicle';
import { getTranslation } from '../../../../i18n';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';

// ─── Types ──────────────────────────────────────────────────────────────────

interface VehicleViewProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (v: Vehicle) => void;
  onTrack?: (v: Vehicle) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCategoryLabel(cat: Vehicle['vehicleCategory'], labels: Record<string, string | undefined>, locale: string): string {
  const map: Record<string, string> = {
    truck: labels.categoryTruck || (locale === 'en' ? 'Truck' : 'Truk'),
    minibus: labels.categoryMinibus || (locale === 'en' ? 'Minibus' : 'Minibus'),
    pickup: labels.categoryPickup || (locale === 'en' ? 'Pickup' : 'Pickup'),
    motorcycle: labels.categoryMotorcycle || (locale === 'en' ? 'Motorcycle' : 'Motor'),
    car: locale === 'en' ? 'Car' : 'Mobil',
    other: labels.categoryOther || (locale === 'en' ? 'Other' : 'Lainnya'),
  };
  return map[cat] || cat;
}

function getFuelLabel(fuel: Vehicle['fuelType'], labels: Record<string, string | undefined>, locale: string): string {
  const map: Record<string, string> = {
    solar: labels.fuelSolar || (locale === 'en' ? 'Diesel' : 'Solar'),
    bensin: labels.fuelBensin || (locale === 'en' ? 'Gasoline' : 'Bensin'),
    listrik: labels.fuelElectric || labels.fuelListrik || (locale === 'en' ? 'Electric' : 'Listrik'),
  };
  return map[fuel] || fuel;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function VehicleView({
  vehicle,
  open,
  onClose,
  onEdit,
  onTrack,
}: VehicleViewProps) {
  const locale = useBusinessLocale();
  const dict = getTranslation(locale);
  const labels = dict.vehicles;

  // State simulasi real-time status pemutusan relay (Remote Immobilizer)
  const [isEngineCut, setIsEngineCut] = React.useState(false);

  // State untuk dialog Restart GPS
  const [restartGpsOpen, setRestartGpsOpen] = React.useState(false);
  const [restartGpsLoading, setRestartGpsLoading] = React.useState(false);

  // State untuk dialog Aktifkan Kembali Mesin
  const [resumeEngineOpen, setResumeEngineOpen] = React.useState(false);
  const [resumeEngineLoading, setResumeEngineLoading] = React.useState(false);

  // State untuk dialog Matikan Mesin (Immobilizer + password)
  const [cutEngineDialog, setCutEngineDialog] = React.useState({
    open: false,
    isLoading: false,
    password: '',
    showPassword: false,
    confirmedSafety: false,
    error: null as string | null,
  });

  if (!vehicle) return null;

  // Deteksi status kecepatan gerak kendaraan
  const isMoving = vehicle.status === 'driving' || (vehicle.speed != null && vehicle.speed > 0);
  const currentSpeed = vehicle.speed != null && vehicle.speed > 0
    ? vehicle.speed
    : (vehicle.status === 'driving' ? 48 : 0);

  const stnkStatusInfo = (() => {
    if (!vehicle.registrationExpiry) return null;
    const expiry = new Date(vehicle.registrationExpiry);
    const diff = (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (diff < 0) {
      return {
        isExpired: true,
        isExpiring: false,
        label: labels.badgeStnkExpired || labels.stnkExpired || (locale === 'en' ? 'Registration Expired' : 'STNK Kedaluwarsa'),
        colorClass: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20',
      };
    }
    if (diff < 60) {
      return {
        isExpired: false,
        isExpiring: true,
        label: labels.badgeStnkExpiring || labels.stnkExpiring || (locale === 'en' ? 'Registration Expiring Soon' : 'STNK Segera Habis'),
        colorClass: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
      };
    }
    return {
      isExpired: false,
      isExpiring: false,
      label: labels.badgeStnkValid || labels.stnkActive || (locale === 'en' ? 'Registration Valid' : 'STNK Masih Berlaku'),
      colorClass: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-500/20',
    };
  })();

  const hasServiceData = !!(
    vehicle.nextServiceKm &&
    vehicle.lastServiceKm &&
    vehicle.nextServiceKm > vehicle.lastServiceKm
  );

  const serviceProgress = hasServiceData
    ? Math.min(
        Math.max(
          (((vehicle.odometer || 0) - (vehicle.lastServiceKm || 0)) /
            ((vehicle.nextServiceKm || 1) - (vehicle.lastServiceKm || 0))) *
            100,
          0
        ),
        100
      )
    : 0;

  const isServiceDue = hasServiceData && serviceProgress >= 90;

  const handleConfirmRestartGps = async () => {
    setRestartGpsLoading(true);
    // Simulasi pengiriman sinyal telematika ke perangkat GPS
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRestartGpsLoading(false);
    setRestartGpsOpen(false);
    toast.success(
      labels.toastRestartGpsSuccess
        ? labels.toastRestartGpsSuccess.replace('{plate}', vehicle.plateNumber)
        : (locale === 'en'
            ? `GPS restart command successfully sent to vehicle ${vehicle.plateNumber}. Device will reboot connection in 1-2 minutes.`
            : `Perintah restart GPS berhasil dikirim ke kendaraan ${vehicle.plateNumber}. Perangkat akan me-reboot koneksi dalam 1-2 menit.`)
    );
  };

  const handleOpenCutEngine = () => {
    setCutEngineDialog({
      open: true,
      isLoading: false,
      password: '',
      showPassword: false,
      confirmedSafety: false,
      error: null,
    });
  };

  const handleConfirmCutEngine = async () => {
    if (!cutEngineDialog.confirmedSafety) {
      setCutEngineDialog((prev) => ({
        ...prev,
        error: labels.dialogTurnOffSafetyRequired || (locale === 'en' ? 'Check the operational safety confirmation before executing' : 'Centang konfirmasi keselamatan operasional sebelum mengeksekusi'),
      }));
      return;
    }

    if (!cutEngineDialog.password.trim()) {
      setCutEngineDialog((prev) => ({
        ...prev,
        error: labels.dialogTurnOffPasswordRequired || (locale === 'en' ? 'Login password is required for security authorization' : 'Kata sandi login wajib diisi untuk otorisasi keamanan'),
      }));
      return;
    }

    setCutEngineDialog((prev) => ({ ...prev, isLoading: true, error: null }));
    // Simulasi pengiriman perintah remote immobilizer ke perangkat GPS
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsEngineCut(true);
    setCutEngineDialog({
      open: false,
      isLoading: false,
      password: '',
      showPassword: false,
      confirmedSafety: false,
      error: null,
    });

    if (isMoving) {
      toast.warning(
        (labels.toastTurnOffMovingSuccess || (locale === 'en' ? 'Engine cut-off command sent to {plate}: Vehicle is moving ({speed} km/h), gradual deceleration activated before complete shutdown.' : 'Perintah pemutusan mesin dikirim ke {plate}: Kendaraan sedang melaju ({speed} km/h), perlambatan bertahap aktif sebelum mesin dimatikan total.'))
          .replace('{plate}', vehicle.plateNumber)
          .replace('{speed}', String(currentSpeed))
      );
    } else {
      toast.success(
        (labels.toastTurnOffStoppedSuccess || (locale === 'en' ? 'Engine relay cut-off executed successfully. Vehicle {plate} is now immobilized.' : 'Perintah pemutusan relay mesin berhasil dieksekusi. Kendaraan {plate} telah terkunci (immobilized).'))
          .replace('{plate}', vehicle.plateNumber)
      );
    }
  };

  const handleConfirmResumeEngine = async () => {
    setResumeEngineLoading(true);
    // Simulasi pengiriman perintah normalisasi relay kelistrikan
    await new Promise((resolve) => setTimeout(resolve, 800));
    setResumeEngineLoading(false);
    setResumeEngineOpen(false);
    setIsEngineCut(false);
    toast.success(
      (labels.toastResumeSuccess || (locale === 'en' ? 'Relay restoration command successful. Engine power on {plate} is now reconnected.' : 'Perintah pemulihan relay berhasil. Aliran listrik mesin {plate} telah tersambung kembali.'))
        .replace('{plate}', vehicle.plateNumber)
    );
  };

  const renderStatus = () => {
    const s = vehicle.status as string;
    let label = labels.statusOffline || (locale === 'en' ? 'Offline' : 'Offline');
    let colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    let dotClass = 'bg-neutral-400 dark:bg-neutral-600';

    if (s === 'driving') {
      label = labels.statusDriving || (locale === 'en' ? 'Driving' : 'Berjalan');
      colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
      dotClass = 'bg-success';
    } else if (s === 'idle') {
      label = labels.statusIdle || (locale === 'en' ? 'Idle' : 'Berhenti');
      colorClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
      dotClass = 'bg-warning';
    } else if (s === 'parking') {
      label = labels.statusParking || (locale === 'en' ? 'Parking' : 'Parkir');
      colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      dotClass = 'bg-blue-500';
    } else if (s === 'offline') {
      label = labels.statusOffline || (locale === 'en' ? 'Offline' : 'Offline');
      colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
      dotClass = 'bg-red-500';
    } else if (s === 'active') {
      label = locale === 'en' ? 'Active' : 'Aktif';
      colorClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
      dotClass = 'bg-success';
    } else if (s === 'inactive') {
      label = locale === 'en' ? 'Inactive' : 'Tidak Aktif';
      colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
      dotClass = 'bg-neutral-400';
    } else if (s === 'maintenance') {
      label = locale === 'en' ? 'Maintenance' : 'Perawatan';
      colorClass = 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400';
      dotClass = 'bg-orange-500';
    } else if (s === 'available') {
      label = locale === 'en' ? 'Available' : 'Tersedia';
      colorClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
      dotClass = 'bg-emerald-500';
    } else if (s === 'rented') {
      label = locale === 'en' ? 'Rented' : 'Disewa';
      colorClass = 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400';
      dotClass = 'bg-purple-500';
    }

    return (
      <div className={cn('px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5 shrink-0', colorClass)}>
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />
        {label}
      </div>
    );
  };

  const InfoItem = ({
    label,
    value,
    highlight = false,
    valueClassName,
    colSpan = 1,
  }: {
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
    valueClassName?: string;
    colSpan?: 1 | 2;
  }) => (
    <div className={cn('flex flex-col gap-0.5', colSpan === 2 && 'col-span-2')}>
      <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</span>
      <span className={cn('text-[11px] font-medium', highlight ? 'text-danger font-bold' : 'text-neutral-900 dark:text-neutral-100', valueClassName)}>
        {value}
      </span>
    </div>
  );

  function SectionCard({
    id,
    icon: Icon,
    title,
    colorClass = 'text-muted-foreground',
    bgClass = '',
    children,
    extraHeader,
  }: {
    id?: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    colorClass?: string;
    bgClass?: string;
    children: React.ReactNode;
    extraHeader?: React.ReactNode;
  }) {
    return (
      <div id={id} className="rounded-2xl border border-border/60 bg-background overflow-hidden shadow-sm">
        <div className="px-3 py-2 flex items-center justify-between border-b border-border/40 bg-neutral-50/80 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            <div className={cn('flex items-center justify-center rounded-md p-1', bgClass)}>
              <Icon className={cn('w-3.5 h-3.5', colorClass)} />
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
    <>
      <DetailShell
        open={open}
        onOpenChange={(isOpen) => !isOpen && onClose()}
        title={labels.detailTitle || (locale === 'en' ? 'Vehicle Details' : 'Detail Kendaraan')}
        closeLabel={labels.detailClose || (locale === 'en' ? 'Close' : 'Tutup')}
        editLabel={labels.actionEdit || (locale === 'en' ? 'Edit' : 'Edit Kendaraan')}
        onEdit={onEdit ? () => onEdit(vehicle) : undefined}
      >
        <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20">

          {/* Header Section */}
          <div id="vehicle-view-header" className="px-4 py-4 bg-background border-b border-border/40 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h2 className="text-[15px] font-bold tracking-tight text-foreground">
                {vehicle.brand ? `${vehicle.brand} ${vehicle.vehicleName}` : vehicle.vehicleName}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-600 dark:text-neutral-300 font-mono">
                  {vehicle.plateNumber}
                </span>
                {vehicle.year && (
                  <>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span className="text-[11px] text-muted-foreground">{vehicle.year}</span>
                  </>
                )}
                {isEngineCut && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800 flex items-center gap-1 animate-pulse">
                    <Power className="w-2.5 h-2.5" />
                    {labels.badgeImmobilizerActive || (locale === 'en' ? 'Immobilizer Active' : 'Immobilizer Aktif')}
                  </span>
                )}
              </div>
            </div>
            {renderStatus()}
          </div>

          {/* Quick Actions */}
          <div id="vehicle-view-quick-actions" className="px-4 py-2.5 bg-background flex gap-2 border-b border-border/40">
            {onTrack && (
              <Button
                variant="outline"
                size="sm"
                className="group flex-1 h-8 text-[11px] font-semibold bg-neutral-100 text-neutral-700 border-neutral-200/60 hover:bg-red-50 hover:border-red-200/60 hover:text-red-600 dark:bg-neutral-800/40 dark:text-neutral-300 dark:border-neutral-700/60 dark:hover:bg-red-900/40 dark:hover:text-red-400 transition-all shadow-sm"
                onClick={() => onTrack(vehicle)}
                leftIcon={<MapPin className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 group-hover:text-red-500 transition-colors" />}
              >
                {labels.btnTrack || (locale === 'en' ? 'Track Location' : 'Lacak Posisi')}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-[11px] font-semibold bg-neutral-100 text-neutral-700 border-neutral-200/60 hover:bg-amber-50 hover:border-amber-200/60 hover:text-amber-600 dark:bg-neutral-800/40 dark:text-neutral-300 dark:border-neutral-700/60 dark:hover:bg-amber-900/40 dark:hover:text-amber-400 transition-all shadow-sm"
              onClick={() => setRestartGpsOpen(true)}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              {labels.btnRestartGps || 'Restart GPS'}
            </Button>

            {isEngineCut ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900/50 transition-all shadow-sm"
                onClick={() => setResumeEngineOpen(true)}
                leftIcon={<Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              >
                <span className="truncate">{labels.btnResumeEngine || (locale === 'en' ? 'Resume Engine' : 'Aktifkan Mesin')}</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-[11px] font-semibold bg-neutral-100 text-neutral-700 border-neutral-200/60 hover:bg-danger/5 hover:text-danger hover:border-danger/30 dark:bg-neutral-800/40 dark:text-neutral-300 dark:border-neutral-700/60 dark:hover:bg-red-900/40 dark:hover:text-red-400 transition-all shadow-sm"
                onClick={handleOpenCutEngine}
                leftIcon={<Power className="w-3.5 h-3.5" />}
              >
                <span className="truncate">
                  {isMoving
                    ? (labels.btnTurnOffEngineGradual || (locale === 'en' ? 'Gradual Engine Cut-Off' : 'Matikan Mesin Bertahap'))
                    : (labels.btnTurnOffEngine || (locale === 'en' ? 'Cut Engine' : 'Matikan Mesin'))}
                </span>
              </Button>
            )}
          </div>

          {/* Content Body */}
          <div className="p-4 grid grid-cols-1 lg:group-data-[layout=dialog]/detail:grid-cols-2 lg:group-data-[layout=fullscreen]/detail:grid-cols-2 gap-4 items-start">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-4">

              {/* CARD 1: EFISIENSI & STABILITAS */}
              <SectionCard
                id="vehicle-view-card-efficiency"
                icon={Activity}
                title={labels.cardEfficiency || (locale === 'en' ? 'Efficiency & Stability' : 'Efisiensi & Stabilitas')}
                colorClass="text-emerald-600 dark:text-emerald-400"
                bgClass="bg-emerald-100 dark:bg-emerald-900/40"
                extraHeader={
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <span className="text-[9px] font-bold tracking-wide uppercase">
                      {labels.scorePrefix || (locale === 'en' ? 'Score' : 'Skor')} {vehicle.performanceMetrics?.score || 0}/100
                    </span>
                  </div>
                }
              >
                <InfoItem
                  label={labels.lblIdleRatio || (locale === 'en' ? 'Idle Ratio' : 'Rasio Idle')}
                  value={`${vehicle.performanceMetrics?.idleRatio || 0}%`}
                  highlight={(vehicle.performanceMetrics?.idleRatio || 0) > 10}
                />
                <InfoItem
                  label={labels.lblActiveHours || (locale === 'en' ? 'Active Engine Hours' : 'Jam Mesin Aktif')}
                  value={`${vehicle.performanceMetrics?.activeHours || 0} ${labels.hoursUnit || (locale === 'en' ? 'Hours' : 'Jam')}`}
                />
                <InfoItem
                  label={labels.lblSpeedingRatio || (locale === 'en' ? 'Speeding Violations' : 'Pelanggaran Ngebut')}
                  value={`${vehicle.performanceMetrics?.speedingRatio || 0}%`}
                  highlight={(vehicle.performanceMetrics?.speedingRatio || 0) > 5}
                />
                <InfoItem
                  label={labels.lblSignalStability || (locale === 'en' ? 'Signal Stability' : 'Stabilitas Sinyal')}
                  value={`${vehicle.performanceMetrics?.signalStability || 0}%`}
                  highlight={(vehicle.performanceMetrics?.signalStability || 0) < 95}
                />

                <div className="col-span-2 pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {labels.lblDriverRating || (locale === 'en' ? 'Driver Rating' : 'Peringkat Pengemudi')}
                  </span>
                  <div className="flex items-center gap-0.5" title={`${labels.scorePrefix || (locale === 'en' ? 'Score' : 'Skor')}: ${vehicle.performanceMetrics?.score || 0}/100`}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const score = vehicle.performanceMetrics?.score || 0;
                      const rating = score >= 100 ? 5 : Math.floor(score / 20);
                      return (
                        <Star
                          key={star}
                          className={cn(
                            'w-3.5 h-3.5',
                            star <= rating
                              ? 'fill-warning text-warning'
                              : 'fill-neutral-200 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-800'
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              </SectionCard>

              {/* CARD 2: IDENTITAS FISIK & SPESIFIKASI */}
              <SectionCard
                id="vehicle-view-card-specs"
                icon={Car}
                title={labels.detailInfoSpec || (locale === 'en' ? 'Physical Info & Specs' : 'Identitas Fisik & Spesifikasi')}
                colorClass="text-blue-600 dark:text-blue-400"
                bgClass="bg-blue-100 dark:bg-blue-900/40"
              >
                <InfoItem label={labels.fieldGroup || (locale === 'en' ? 'Group' : 'Grup')} value={vehicle.groupName || '-'} colSpan={2} />
                <InfoItem label={labels.fieldCategory || (locale === 'en' ? 'Category' : 'Kategori')} value={getCategoryLabel(vehicle.vehicleCategory, labels, locale)} />
                <InfoItem label={labels.fieldBrandYear || (locale === 'en' ? 'Brand & Year' : 'Merk & Tahun')} value={`${vehicle.brand || '-'} • ${vehicle.year || '-'}`} />
                <InfoItem label={labels.fieldColor || (locale === 'en' ? 'Color' : 'Warna')} value={vehicle.color || '-'} />
                <InfoItem label={labels.fieldAssetNumber || (locale === 'en' ? 'Asset No.' : 'No. Aset')} value={vehicle.assetNumber || '-'} />
                <InfoItem label={labels.fieldEngineCapacity || (locale === 'en' ? 'Engine Capacity' : 'Kapasitas Mesin')} value={vehicle.engineCapacity ? `${formatNumber(vehicle.engineCapacity)} CC` : '-'} />
                <InfoItem label={labels.fieldSeats || (locale === 'en' ? 'Seat Capacity' : 'Kapasitas Kursi')} value={vehicle.passengerCapacity ? `${vehicle.passengerCapacity} ${labels.seatsUnit || (locale === 'en' ? 'Seats' : 'Kursi')}` : '-'} />
                <InfoItem
                  label={labels.fieldDimension || (locale === 'en' ? 'Dimensions (L × W × H)' : 'Dimensi (P × L × T)')}
                  value={(vehicle.dimLength && vehicle.dimWidth && vehicle.dimHeight) ? `${vehicle.dimLength}m × ${vehicle.dimWidth}m × ${vehicle.dimHeight}m` : '-'}
                  colSpan={2}
                />
              </SectionCard>

              {/* CARD 3: OPERASIONAL & PERFORMA */}
              <SectionCard
                id="vehicle-view-card-operations"
                icon={Gauge}
                title={labels.detailOpsPerf || (locale === 'en' ? 'Operations & Performance' : 'Operasional & Performa')}
                colorClass="text-purple-600 dark:text-purple-400"
                bgClass="bg-purple-100 dark:bg-purple-900/40"
              >
                <InfoItem label={labels.fieldDriver || (locale === 'en' ? 'Primary Driver' : 'Pengemudi Utama')} value={vehicle.driverName || labels.noDriver || (locale === 'en' ? 'No Driver' : 'Tanpa Pengemudi')} colSpan={2} />
                <InfoItem label={labels.fieldFuelType || (locale === 'en' ? 'Fuel Type' : 'Jenis BBM')} value={getFuelLabel(vehicle.fuelType, labels, locale)} />
                <InfoItem label={labels.fieldFuelCap || (locale === 'en' ? 'Tank Capacity' : 'Kapasitas Tangki')} value={vehicle.fuelCapacity ? `${vehicle.fuelCapacity} L` : '-'} />
                <InfoItem label={labels.fieldFuelRatio || (locale === 'en' ? 'Fuel Ratio' : 'Rasio BBM')} value={vehicle.fuelRatio ? `${vehicle.fuelRatio} km/L` : '-'} />
                <InfoItem label={labels.fieldMaxSpeed || (locale === 'en' ? 'Speed Limit' : 'Batas Kecepatan')} value={vehicle.maxSpeed ? `${vehicle.maxSpeed} km/h` : '-'} />
              </SectionCard>

            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">

              {/* CARD 4: ADMINISTRASI & PERAWATAN */}
              <SectionCard
                id="vehicle-view-card-maintenance"
                icon={Wrench}
                title={labels.detailAdminMaint || (locale === 'en' ? 'Administration & Maintenance' : 'Administrasi & Perawatan')}
                colorClass="text-amber-600 dark:text-amber-400"
                bgClass="bg-amber-100 dark:bg-amber-900/40"
                extraHeader={
                  hasServiceData ? (
                    isServiceDue ? (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-wide uppercase">
                          {labels.badgeNeedService || (locale === 'en' ? 'Service Due' : 'Perlu Servis')}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-wide uppercase">
                          {labels.badgeGoodCondition || (locale === 'en' ? 'Good Condition' : 'Kondisi Baik')}
                        </span>
                      </div>
                    )
                  ) : null
                }
              >
                <InfoItem label={labels.fieldOdometer || 'Odometer'} value={vehicle.odometer != null ? `${formatNumber(vehicle.odometer)} km` : '-'} />
                <InfoItem label={labels.fieldLastService || (locale === 'en' ? 'Last Service' : 'Servis Terakhir')} value={vehicle.lastServiceKm != null ? `${formatNumber(vehicle.lastServiceKm)} km` : '-'} />

                {hasServiceData && (
                  <div className="col-span-2 pt-2 border-t border-border/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        {labels.fieldNextService || (locale === 'en' ? 'Next Service' : 'Servis Berikutnya')}:{' '}
                        <span className={cn('ml-1 font-bold', isServiceDue ? 'text-danger' : 'text-neutral-900 dark:text-neutral-100')}>
                          {formatNumber(vehicle.nextServiceKm)} km
                        </span>
                      </span>
                      <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                        {Math.round(serviceProgress)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          serviceProgress >= 100 ? 'bg-danger' :
                          serviceProgress >= 90 ? 'bg-warning' : 'bg-success'
                        )}
                        style={{ width: `${serviceProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {vehicle.notes && (
                  <div className="col-span-2 pt-2 border-t border-border/40">
                    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                      {labels.detailNotes || (locale === 'en' ? 'Special Notes' : 'Catatan Khusus')}
                    </span>
                    <p className="text-[11px] italic leading-relaxed text-muted-foreground bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-lg border border-border/40">
                      {vehicle.notes}
                    </p>
                  </div>
                )}
              </SectionCard>

              {/* CARD 5: LISENSI & LEGALITAS */}
              <SectionCard
                id="vehicle-view-card-documents"
                icon={FileText}
                title={labels.detailLicensing || (locale === 'en' ? 'Licensing & Legality' : 'Lisensi & Legalitas')}
                colorClass="text-indigo-600 dark:text-indigo-400"
                bgClass="bg-indigo-100 dark:bg-indigo-900/40"
                extraHeader={
                  stnkStatusInfo ? (
                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide uppercase", stnkStatusInfo.colorClass)}>
                      {stnkStatusInfo.isExpired || stnkStatusInfo.isExpiring ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      <span>{stnkStatusInfo.label}</span>
                    </div>
                  ) : null
                }
              >
                <InfoItem
                  label={labels.fieldStnkExpiry || (locale === 'en' ? 'Registration Expiry' : 'Masa Berlaku STNK')}
                  value={vehicle.registrationExpiry ? formatDate(vehicle.registrationExpiry, locale === 'en' ? 'en-US' : 'id-ID') : '-'}
                  highlight={stnkStatusInfo?.isExpired || stnkStatusInfo?.isExpiring}
                />
                <InfoItem label={labels.fieldStnkNo || (locale === 'en' ? 'STNK No.' : 'No. STNK')} value={vehicle.stnkNumber || '-'} />
                <InfoItem label={labels.fieldKirNo || (locale === 'en' ? 'KIR No.' : 'No. Uji KIR')} value={vehicle.kirNumber || '-'} />
                <InfoItem label={labels.fieldBpkbNo || (locale === 'en' ? 'BPKB No.' : 'No. BPKB')} value={vehicle.bpkbNumber || '-'} />
                <InfoItem label={labels.fieldEngineNo || (locale === 'en' ? 'Engine No.' : 'No. Mesin')} value={vehicle.engineNumber || '-'} />
                <InfoItem label={labels.fieldChassisNo || (locale === 'en' ? 'Chassis No.' : 'No. Rangka')} value={vehicle.chassisNumber || '-'} />
              </SectionCard>

              {/* CARD 6: PERANGKAT GPS & TELEMETRI */}
              <SectionCard
                id="vehicle-view-card-device"
                icon={Cpu}
                title={labels.detailGpsDevice || (locale === 'en' ? 'GPS & Telemetry Device' : 'Perangkat GPS & Telemetri')}
                colorClass="text-cyan-600 dark:text-cyan-400"
                bgClass="bg-cyan-100 dark:bg-cyan-900/40"
              >
                <InfoItem label={labels.fieldSystemId || (locale === 'en' ? 'System ID' : 'ID Sistem')} value={vehicle.vehicleId || '-'} />
                <InfoItem label={labels.fieldImei || 'IMEI'} value={vehicle.deviceImei || labels.noDevice || (locale === 'en' ? 'No Device' : 'Tanpa Perangkat')} />
                <InfoItem label={labels.fieldSim || (locale === 'en' ? 'SIM Card No.' : 'No. SIM Card')} value={vehicle.deviceSimNumber || '-'} />
                <InfoItem label={labels.fieldGpsBrandOnly || (locale === 'en' ? 'GPS Brand' : 'Merek GPS')} value={vehicle.gpsDeviceBrand || '-'} />
                <InfoItem label={labels.fieldGpsTypeOnly || (locale === 'en' ? 'GPS Type' : 'Tipe GPS')} value={vehicle.gpsDeviceType || '-'} />
                <InfoItem label={labels.fieldGpsInstall || (locale === 'en' ? 'Install Date' : 'Tgl Pasang')} value={vehicle.gpsInstallDate ? formatDate(vehicle.gpsInstallDate, locale === 'en' ? 'en-US' : 'id-ID') : '-'} />
                {vehicle.lastUpdate && (
                  <InfoItem
                    label={labels.fieldLastUpdate || (locale === 'en' ? 'Last Update' : 'Update Terakhir')}
                    value={formatDateTime(vehicle.lastUpdate, locale === 'en' ? 'en-US' : 'id-ID')}
                    colSpan={2}
                  />
                )}
              </SectionCard>

            </div>

          </div>
        </div>
      </DetailShell>

      {/* Dialog Konfirmasi Restart GPS */}
      <ConfirmDialog
        open={restartGpsOpen}
        onOpenChange={(isOpen) => !restartGpsLoading && setRestartGpsOpen(isOpen)}
        title={labels.dialogRestartGpsTitle || (locale === 'en' ? 'Restart GPS Device' : 'Restart Perangkat GPS')}
        description={
          <span>
            {(labels.dialogRestartGpsDesc || (locale === 'en' ? 'Send restart signal to the GPS telemetry device on vehicle {plate} ({name})? The device will reboot connection within 1-2 minutes.' : 'Kirim sinyal restart ke perangkat telemetri GPS pada kendaraan {plate} ({name})? Perangkat akan me-reboot koneksi dalam 1-2 menit.'))
              .replace('{name}', vehicle.vehicleName)
              .split('{plate}')
              .flatMap((part: string, i: number) =>
                i === 0 ? (
                  [part]
                ) : (
                  [
                    <strong key={i} className="text-foreground">
                      {vehicle.plateNumber}
                    </strong>,
                    part,
                  ]
                )
              )}
          </span>
        }
        icon={<RefreshCw className="w-6 h-6" />}
        variant="warning"
        confirmLabel={labels.dialogRestartGpsConfirm || (locale === 'en' ? 'Restart Now' : 'Restart Sekarang')}
        cancelLabel={labels.btnCancel || (locale === 'en' ? 'Cancel' : 'Batal')}
        isLoading={restartGpsLoading}
        onConfirm={handleConfirmRestartGps}
      />

      {/* Dialog Otorisasi Password untuk Matikan Mesin (Remote Immobilizer) */}
      <Dialog
        open={cutEngineDialog.open}
        onOpenChange={(isOpen) => {
          if (!cutEngineDialog.isLoading) {
            setCutEngineDialog((prev) => ({
              ...prev,
              open: isOpen,
              password: '',
              showPassword: false,
              confirmedSafety: false,
              error: null,
            }));
          }
        }}
        className="max-w-md p-6"
      >
        <div className="flex flex-col gap-4">
          
          {/* Header with Danger Badge */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0 border border-danger/20">
              <Power className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-foreground">
                {labels.dialogTurnOffTitle || (locale === 'en' ? 'Turn Off Vehicle Engine' : 'Matikan Mesin Kendaraan')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {labels.dialogTurnOffSubtitle || (locale === 'en' ? 'Electrical Relay Disconnection (Remote Immobilizer)' : 'Pemutusan Arus Relay Kelistrikan (Remote Immobilizer)')}
              </p>
            </div>
          </div>

          {/* Vehicle Context & Real-time Speed Callout */}
          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-border/60 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                {labels.dialogTurnOffTarget || (locale === 'en' ? 'Target Vehicle' : 'Target Kendaraan')}
              </span>
              <span className="text-[13px] font-bold text-foreground">{vehicle.brand} {vehicle.vehicleName}</span>
              <span className="text-[11px] font-mono font-semibold text-muted-foreground">{vehicle.plateNumber}</span>
            </div>
            {isMoving ? (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                  {labels.dialogTurnOffGpsCondition || (locale === 'en' ? 'GPS Condition' : 'Kondisi GPS')}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] font-bold">
                  <Activity className="w-3 h-3 animate-pulse text-amber-600" />
                  {labels.dialogTurnOffMovingStatus || (locale === 'en' ? 'Moving' : 'Melaju')} • {currentSpeed} km/h
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                  {labels.dialogTurnOffGpsCondition || (locale === 'en' ? 'GPS Condition' : 'Kondisi GPS')}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {labels.dialogTurnOffStoppedStatus || (locale === 'en' ? 'Stopped (0 km/h)' : 'Berhenti (0 km/h)')}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Protocol Notice: Gradual vs Direct Cut-Off */}
          {isMoving ? (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong className="text-[12px] text-amber-950 dark:text-amber-100 font-bold">
                  {labels.dialogTurnOffNoticeMovingTitle || (locale === 'en' ? 'Automatic Gradual Deceleration (Driving Safety)' : 'Perlambatan Bertahap Otomatis (Keamanan Berkendara)')}
                </strong>
                <p>
                  {(labels.dialogTurnOffNoticeMovingDesc || (locale === 'en'
                    ? 'Vehicle is currently moving ({speed} km/h). To prevent steering lock or brake vacuum loss at high speeds, the telematics device will gradually disrupt fuel supply to safely slow down the vehicle before completely locking the engine below 10 km/h.'
                    : 'Kendaraan sedang melaju ({speed} km/h). Untuk mencegah setir terkunci atau rem kehilangan tekanan vakum di kecepatan tinggi, perangkat telematika akan memutus suplai bahan bakar secara bertahap agar laju kendaraan melambat aman sebelum mesin dimatikan total saat kecepatan di bawah 10 km/h.'))
                    .replace('{speed}', `${currentSpeed}`)}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-[11px] text-red-900 dark:text-red-200 leading-relaxed">
                <strong className="text-[12px] text-red-950 dark:text-red-100 font-bold">
                  {labels.dialogTurnOffNoticeStoppedTitle || (locale === 'en' ? 'Direct Electrical Cut-Off (Direct Immobilizer)' : 'Pemutusan Arus Langsung (Direct Immobilizer)')}
                </strong>
                <p>
                  {labels.dialogTurnOffNoticeStoppedDesc || (locale === 'en' ? 'Vehicle is stopped in a safe position. The relay command will immediately cut starter and fuel pump power so the engine cannot be started.' : 'Kendaraan dalam posisi berhenti aman. Perintah relay akan memutus arus starter dan pompa bahan bakar seketika sehingga mesin tidak dapat dihidupkan.')}
                </p>
              </div>
            </div>
          )}

          {/* Form Confirmation & Password */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirmCutEngine();
            }}
            className="flex flex-col gap-3 mt-1"
          >
            {/* Operator Safety Confirmation Checkbox */}
            <div className="p-2.5 rounded-lg border border-border/60 bg-neutral-50/50 dark:bg-neutral-900/30">
              <Checkbox
                id="safety-confirm-checkbox"
                checked={cutEngineDialog.confirmedSafety}
                onCheckedChange={(checked) =>
                  setCutEngineDialog((prev) => ({
                    ...prev,
                    confirmedSafety: !!checked,
                    error: null,
                  }))
                }
                label={labels.dialogTurnOffSafetyCheckbox || (locale === 'en' ? 'I have verified the vehicle safety situation in the field and take responsibility for executing this command.' : 'Saya telah memverifikasi situasi keselamatan kendaraan di lapangan dan bertanggung jawab atas eksekusi perintah ini.')}
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                {labels.dialogTurnOffPasswordLabel || (locale === 'en' ? 'Login Authorization Password' : 'Password Login Otorisasi')} <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type={cutEngineDialog.showPassword ? 'text' : 'password'}
                  value={cutEngineDialog.password}
                  onChange={(e) =>
                    setCutEngineDialog((prev) => ({
                      ...prev,
                      password: e.target.value,
                      error: null,
                    }))
                  }
                  placeholder={labels.dialogTurnOffPasswordPlaceholder || (locale === 'en' ? 'Enter your account login password' : 'Masukkan password login akun Anda')}
                  disabled={cutEngineDialog.isLoading}
                  className={cn(
                    'w-full h-9 px-3 pr-10 text-[13px] rounded-lg border bg-background text-foreground transition-all focus:outline-none focus:ring-2',
                    cutEngineDialog.error
                      ? 'border-danger focus:ring-danger/20'
                      : 'border-border focus:border-danger focus:ring-danger/10'
                  )}
                />
                <button
                  type="button"
                  onClick={() =>
                    setCutEngineDialog((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {cutEngineDialog.showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {cutEngineDialog.error && (
                <p className="text-[11px] font-medium text-danger flex items-center gap-1 mt-0.5">
                  • {cutEngineDialog.error}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setCutEngineDialog((prev) => ({ ...prev, open: false, error: null }))
                }
                disabled={cutEngineDialog.isLoading}
                className="h-9 px-4 text-xs font-semibold"
              >
                {labels.btnCancel || (locale === 'en' ? 'Cancel' : 'Batal')}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  cutEngineDialog.isLoading ||
                  !cutEngineDialog.confirmedSafety ||
                  !cutEngineDialog.password.trim()
                }
                leftIcon={
                  cutEngineDialog.isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Power className="w-3.5 h-3.5" />
                  )
                }
                className="h-9 px-4 text-xs font-semibold bg-danger hover:bg-danger/90 text-white shadow-sm disabled:opacity-50"
              >
                {cutEngineDialog.isLoading
                  ? (labels.dialogTurnOffSending || (locale === 'en' ? 'Sending Signal...' : 'Mengirim Sinyal...'))
                  : isMoving
                  ? (labels.btnTurnOffEngineGradual || (locale === 'en' ? 'Gradual Engine Cut-Off' : 'Matikan Mesin Bertahap'))
                  : (labels.btnTurnOffEngine || (locale === 'en' ? 'Cut Engine' : 'Matikan Mesin'))}
              </Button>
            </div>
          </form>

        </div>
      </Dialog>

      {/* Dialog Konfirmasi Pemulihan Mesin */}
      <ConfirmDialog
        open={resumeEngineOpen}
        onOpenChange={(isOpen) => !resumeEngineLoading && setResumeEngineOpen(isOpen)}
        title={labels.dialogResumeTitle || (locale === 'en' ? 'Resume Vehicle Engine' : 'Aktifkan Kembali Mesin Kendaraan')}
        description={
          <span>
            {(labels.dialogResumeDesc || (locale === 'en' ? 'Send relay restore signal to the GPS device on vehicle {plate} ({name})? Starter and fuel pump relay circuits will be restored so the vehicle can be started normally.' : 'Kirim sinyal pemulihan relay kelistrikan ke perangkat GPS pada kendaraan {plate} ({name})? Aliran relay starter dan pompa bahan bakar akan disambung kembali sehingga kendaraan dapat dihidupkan normal.'))
              .replace('{name}', vehicle.vehicleName)
              .split('{plate}')
              .flatMap((part: string, i: number) =>
                i === 0 ? (
                  [part]
                ) : (
                  [
                    <strong key={i} className="text-foreground">
                      {vehicle.plateNumber}
                    </strong>,
                    part,
                  ]
                )
              )}
          </span>
        }
        icon={<Zap className="w-6 h-6 text-emerald-600" />}
        variant="primary"
        confirmLabel={labels.dialogResumeConfirm || (locale === 'en' ? 'Resume Engine' : 'Aktifkan Mesin')}
        cancelLabel={labels.btnCancel || (locale === 'en' ? 'Cancel' : 'Batal')}
        isLoading={resumeEngineLoading}
        onConfirm={handleConfirmResumeEngine}
      />
    </>
  );
}
