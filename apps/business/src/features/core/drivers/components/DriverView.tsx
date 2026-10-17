'use client';

import React from 'react';
import {
  User,
  MapPin,
  FileText,
  Briefcase,
  Truck,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { DetailShell, PhoneLink, EmailLink } from '@adatrack/ui';
import type { Driver, DriverHistory } from '../types/driver';
import { useBusinessLocale } from '@/components/BusinessShellLayout';

// ─── Helper Components ──────────────────────────────────────────────────────────

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
    <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
      {label}
    </span>
    <span
      className={cn(
        'text-[11px] font-medium',
        highlight ? 'text-danger font-bold' : 'text-neutral-900 dark:text-neutral-100',
        valueClassName,
      )}
    >
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
  extraHeader,
  children,
  contentClassName,
}: {
  id?: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  colorClass?: string;
  bgClass?: string;
  extraHeader?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
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
      <div className={cn('p-4 grid grid-cols-2 gap-y-4 gap-x-4', contentClassName)}>
        {children}
      </div>
    </div>
  );
}

export interface DriverViewProps {
  driver: Driver | null;
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  onEdit?: (driver?: Driver) => void;
  onDelete?: (driver?: Driver) => void;
  labels?: Record<string, string>;
  locale?: string;
}

export function DriverView({
  driver,
  isOpen,
  open,
  onClose,
  onEdit,
  onDelete,
  labels: propLabels = {},
  locale: propLocale,
}: DriverViewProps) {
  const currentLocale = useBusinessLocale();
  const locale = propLocale || currentLocale;
  const isEn = locale === 'en';
  const isVisible = open ?? isOpen ?? false;

  if (!isVisible || !driver) return null;

  const labels = {
    title: isEn ? 'Driver Details' : 'Detail Pengemudi',
    tabInfo: isEn ? 'Basic Info' : 'Informasi Dasar',
    tabHistory: isEn ? 'History' : 'Riwayat',
    statusActive: isEn ? 'Active' : 'Aktif',
    statusInactive: isEn ? 'Inactive' : 'Nonaktif',
    statusOnLeave: isEn ? 'On Leave' : 'Cuti',
    actionEdit: isEn ? 'Edit Driver' : 'Edit Pengemudi',
    actionDelete: isEn ? 'Delete' : 'Hapus',
    historyEmpty: isEn ? 'No history recorded for this driver yet.' : 'Belum ada riwayat tercatat untuk pengemudi ini.',
    ...propLabels,
  };

  const renderHistoryIcon = (type: DriverHistory['type']) => {
    switch (type) {
      case 'assignment':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'violation':
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'leave':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-foreground-muted" />;
    }
  };

  const statusConfig = {
    active: {
      label: labels.statusActive,
      bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
      dot: 'bg-green-500',
    },
    on_leave: {
      label: labels.statusOnLeave,
      bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
      dot: 'bg-amber-500',
    },
    inactive: {
      label: labels.statusInactive,
      bg: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
      dot: 'bg-neutral-500',
    },
  }[driver.status] || {
    label: labels.statusInactive,
    bg: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
    dot: 'bg-neutral-500',
  };

  return (
    <DetailShell
      open={isVisible}
      onOpenChange={(val) => !val && onClose()}
      title={labels.title}
      onEdit={onEdit ? () => onEdit(driver) : undefined}
      onDelete={onDelete ? () => onDelete(driver) : undefined}
    >
      <div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-950/20 pb-8">
        
        {/* Header Section */}
        <div id="driver-view-header" className="px-4 py-3 bg-background border-b border-border/40 flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground uppercase truncate">
              {driver.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {driver.groupName || 'Logistik Umum'} &bull; {driver.placement}
              </span>
            </div>
          </div>
          <div className={cn('px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5', statusConfig.bg)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', statusConfig.dot)} />
            {statusConfig.label}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col gap-4">
              {/* 1. Operasional & Performa */}
              <SectionCard
                id="driver-view-card-operations"
                icon={Truck}
                title="Operasional & Performa"
                colorClass="text-emerald-600 dark:text-emerald-400"
                bgClass="bg-emerald-100 dark:bg-emerald-900/40"
                extraHeader={
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <span className="text-[9px] font-bold tracking-wide uppercase">
                      Skor {driver.performanceScore || 0}/100
                    </span>
                  </div>
                }
              >
                <InfoItem
                  label="Kendaraan Ditugaskan"
                  value={
                    driver.assignedVehiclePlate ? (
                      <span className="font-mono uppercase font-bold tracking-wider text-[12px]">
                        {driver.assignedVehiclePlate}
                      </span>
                    ) : (
                      'Tidak ada'
                    )
                  }
                  colSpan={2}
                />

                <div className="col-span-2 flex flex-col gap-0.5">
                  <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Rating Keselamatan
                  </span>
                  <div className="flex items-center gap-1 mt-0.5" title={`${driver.performanceScore || 0} / 100`}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const score = driver.performanceScore || 0;
                      const rating = score >= 100 ? 5 : Math.floor(score / 20);
                      return (
                        <Star
                          key={star}
                          className={cn(
                            'w-3.5 h-3.5',
                            star <= rating
                              ? 'fill-warning text-warning'
                              : 'fill-neutral-200 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-800',
                          )}
                        />
                      );
                    })}
                    <span className="text-[11px] font-bold tabular-nums ml-1 text-foreground">
                      {driver.performanceScore || 0} Poin
                    </span>
                  </div>
                </div>

                <InfoItem
                  label="Harsh Driving"
                  value={`${driver.performanceMetrics?.harshDriving || 0} kali`}
                  highlight={(driver.performanceMetrics?.harshDriving || 0) > 2}
                />
                <InfoItem
                  label="Speeding"
                  value={`${driver.performanceMetrics?.speeding || 0} kali`}
                  highlight={(driver.performanceMetrics?.speeding || 0) > 2}
                />
                <InfoItem
                  label="Over Idling"
                  value={`${driver.performanceMetrics?.overIdling || 0} kali`}
                />
                <InfoItem
                  label="Fatigue Driving"
                  value={`${driver.performanceMetrics?.fatigueDriving || 0} kali`}
                  highlight={(driver.performanceMetrics?.fatigueDriving || 0) > 0}
                />
              </SectionCard>

              {/* 2. Kontak & Alamat */}
              <SectionCard
                id="driver-view-card-contact"
                icon={MapPin}
                title="Kontak & Alamat"
                colorClass="text-blue-600 dark:text-blue-400"
                bgClass="bg-blue-100 dark:bg-blue-900/40"
              >
                <InfoItem
                  label="Telepon"
                  value={<PhoneLink phone={driver.phone} />}
                />
                <InfoItem
                  label="Email"
                  value={<EmailLink email={driver.email} />}
                />
                <InfoItem
                  label="Alamat Lengkap"
                  value={driver.address || '-'}
                  colSpan={2}
                />
              </SectionCard>

              {/* 3. Identitas Resmi & Pekerjaan */}
              <SectionCard
                id="driver-view-card-identity"
                icon={FileText}
                title="Identitas Resmi & Pekerjaan"
                colorClass="text-purple-600 dark:text-purple-400"
                bgClass="bg-purple-100 dark:bg-purple-900/40"
              >
                <InfoItem
                  label="No. KTP"
                  value={<span className="font-mono">{driver.ktpNumber}</span>}
                  colSpan={2}
                />
                <InfoItem
                  label="Tempat Lahir"
                  value={driver.placeOfBirth || '-'}
                />
                <InfoItem
                  label="Tanggal Lahir"
                  value={
                    driver.dateOfBirth
                      ? new Date(driver.dateOfBirth).toLocaleDateString(isEn ? 'en-US' : 'id-ID')
                      : '-'
                  }
                />
                <InfoItem
                  label="Grup Kendaraan"
                  value={driver.groupName || '-'}
                />
                <InfoItem
                  label="Penempatan"
                  value={driver.placement || '-'}
                />
                <InfoItem
                  label="Tanggal Bergabung"
                  value={
                    driver.joinDate
                      ? new Date(driver.joinDate).toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '-'
                  }
                  colSpan={2}
                />
              </SectionCard>

              {/* 4. Lisensi Mengemudi (SIM) */}
              <SectionCard
                id="driver-view-card-license"
                icon={Briefcase}
                title="Lisensi Mengemudi (SIM)"
                colorClass="text-amber-600 dark:text-amber-400"
                bgClass="bg-amber-100 dark:bg-amber-900/40"
              >
                <InfoItem
                  label="Nomor SIM"
                  value={<span className="font-mono">{driver.licenseNumber}</span>}
                />
                <InfoItem
                  label="Masa Berlaku SIM"
                  value={(() => {
                    if (!driver.licenseExpiry) return '-';
                    const expiry = new Date(driver.licenseExpiry);
                    const isExpired = expiry.getTime() < Date.now();
                    const isExpiring = expiry.getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000;
                    return (
                      <span
                        className={cn(
                          'tabular-nums font-semibold',
                          isExpired
                            ? 'text-danger'
                            : isExpiring
                              ? 'text-warning'
                              : 'text-neutral-900 dark:text-neutral-100',
                        )}
                      >
                        {expiry.toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                        {isExpired && ' (Kedaluwarsa)'}
                        {!isExpired && isExpiring && ' (Segera Habis)'}
                      </span>
                    );
                  })()}
                />
              </SectionCard>
              {/* 5. Riwayat Aktivitas & Penugasan */}
              {driver.history && driver.history.length > 0 && (
                <SectionCard
                  id="driver-view-card-history"
                  icon={Clock}
                  title="Riwayat Aktivitas & Penugasan"
                  colorClass="text-neutral-600 dark:text-neutral-400"
                  bgClass="bg-neutral-100 dark:bg-neutral-800"
                  contentClassName="flex flex-col gap-3"
                >
                  {driver.history.map((hist) => (
                    <div
                      key={hist.id}
                      className="rounded-xl border border-border/60 bg-neutral-50/50 dark:bg-neutral-900/50 p-3 flex items-start gap-3 col-span-2"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-border/50 shrink-0 mt-0.5">
                        {renderHistoryIcon(hist.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[11px] font-semibold text-foreground capitalize">
                            {hist.type === 'assignment'
                              ? 'Penugasan'
                              : hist.type === 'violation'
                                ? 'Pelanggaran'
                                : hist.type === 'achievement'
                                  ? 'Pencapaian'
                                  : 'Cuti'}
                          </span>
                          <span className="text-[10px] text-foreground-muted flex items-center gap-1 tabular-nums">
                            <Calendar className="w-3 h-3" />
                            {new Date(hist.date).toLocaleDateString(isEn ? 'en-US' : 'id-ID')}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground-muted leading-relaxed">
                          {hist.description}
                        </p>
                        {hist.vehicleId && (
                          <div className="mt-1.5 pt-1.5 border-t border-border/30">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-foreground-muted">
                              <Truck className="w-3 h-3" />
                              {hist.vehicleId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </SectionCard>
              )}
        </div>
      </div>
    </DetailShell>
  );
}
