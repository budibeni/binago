'use client';

import React from 'react';
import { Smartphone, Radio, Truck, Phone, Calendar, Hash, Cpu, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { Badge, DetailShell, Tabs } from '@adatrack/ui';
import type { Device } from '../types/device';

interface DeviceViewProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  labels: {
    title: string;
    close: string;
    tabInfo: string;
    tabDriver?: string;
    tabVehicle: string;
    imei: string;
    protocol: string;
    brandModel: string;
    simNumber: string;
    iccid: string;
    status: string;
    company: string;
    driverName?: string;
    driverPhone?: string;
    vehicleName: string;
    plateNumber: string;
    registeredAt: string;
    updatedAt: string;
    actionEdit: string;
    actionDelete: string;
  };
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isMono,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
  isMono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <p className={`text-[13px] font-medium text-foreground truncate ${isMono ? 'font-mono' : ''}`}>
          {value || '-'}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1 mt-4 first:mt-0">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{title}</h3>
    </div>
  );
}

export function DeviceView({
  device,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  labels,
}: DeviceViewProps) {
  const [activeTab, setActiveTab] = React.useState('info');

  if (!isOpen || !device) return null;

  const isMobile = device.protocol?.toUpperCase() === 'SMARTPHONE' || device.protocol?.toUpperCase() === 'HTTP_MOBILE';
  const isAssigned = device.driverId != null || device.vehicleId != null;

  const assignmentTabLabel = isMobile
    ? (labels.tabDriver || 'Pengemudi Tertaut')
    : (labels.tabVehicle || 'Armada Tertaut');

  return (
    <DetailShell
      open={isOpen}
      onOpenChange={(val) => !val && onClose()}
      title={labels.title}
      onEdit={isMobile ? onEdit : undefined}
      onDelete={isMobile ? onDelete : undefined}
    >
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Profile Header */}
        <div className="pb-4 mb-4 border-b border-border flex items-center gap-3">
          <div className={`p-3 rounded-xl shrink-0 ${isMobile ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800'}`}>
            {isMobile ? <Smartphone className="h-6 w-6" /> : <Radio className="h-6 w-6" />}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] font-bold text-foreground font-mono truncate">{device.imei}</h3>
              <Badge variant={isAssigned ? 'success' : 'default'} dot className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                {isAssigned ? 'Terpasang' : 'Siap Pakai'}
              </Badge>
            </div>
            <span className="text-[12px] text-foreground-muted truncate">
              {device.deviceBrand} {device.deviceModel}
            </span>
          </div>
        </div>

        {!isMobile && (
          <div className="mb-4 p-2.5 rounded-lg border border-border/80 bg-neutral-50 dark:bg-neutral-900/40 flex items-center gap-2.5 text-[12px] text-foreground-muted">
            <Radio className="h-4 w-4 text-primary shrink-0" />
            <span>Perangkat GPS Fisik hanya dapat dilihat (Read-only). Pengelolaan dilakukan melalui Admin Portal.</span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4">
          <Tabs
            tabs={[
              { id: 'info', label: labels.tabInfo },
              { id: 'assignment', label: assignmentTabLabel },
            ]}
            activeTab={activeTab}
            // @ts-expect-error - Tabs onChange signature
            onChange={setActiveTab}
            variant="underline"
          />
        </div>

        {activeTab === 'info' && (
          <div className="flex flex-col gap-4">
            <SectionHeader icon={Cpu} title="Spesifikasi Perangkat" />
            <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
              <InfoRow icon={Hash} label={labels.imei} value={device.imei} isMono />
              <InfoRow icon={isMobile ? Smartphone : Radio} label={labels.protocol} value={device.protocol} />
              <InfoRow icon={Cpu} label={labels.brandModel} value={`${device.deviceBrand} - ${device.deviceModel}`} />
              <InfoRow icon={Phone} label={labels.simNumber} value={device.simNumber} isMono />
              {device.iccid && <InfoRow icon={Hash} label={labels.iccid} value={device.iccid} isMono />}
            </div>

            <SectionHeader icon={Calendar} title="Informasi Sistem" />
            <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
              <InfoRow icon={Calendar} label={labels.registeredAt} value={new Date(device.createdAt).toLocaleString('id-ID')} />
              <InfoRow icon={Calendar} label={labels.updatedAt} value={new Date(device.updatedAt).toLocaleString('id-ID')} />
            </div>
          </div>
        )}

        {activeTab === 'assignment' && (
          <div className="flex flex-col gap-4">
            {isMobile ? (
              <>
                <SectionHeader icon={User} title="Status Penugasan Pengemudi" />
                {device.driverName ? (
                  <div className="p-4 rounded-xl border border-success/30 bg-success/5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span className="text-[13px] font-bold">Tertaut ke Pengemudi</span>
                    </div>
                    <div className="space-y-1.5 text-[13px]">
                      <p>
                        <span className="text-foreground-muted">Nama Pengemudi:</span>{' '}
                        <strong className="font-semibold text-foreground">{device.driverName}</strong>
                      </p>
                      {device.driverPhone && (
                        <p>
                          <span className="text-foreground-muted">Nomor Telepon:</span>{' '}
                          <span className="font-medium text-foreground">{device.driverPhone}</span>
                        </p>
                      )}
                      {device.plateNumber && (
                        <div className="pt-2 mt-2 border-t border-border/40 text-[12px] flex items-center gap-1.5 text-foreground-muted">
                          <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>Kendaraan yang sedang dikendarai: <strong className="text-foreground">{device.plateNumber}</strong> {device.vehicleName ? `(${device.vehicleName})` : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-2 py-8">
                    <AlertCircle className="h-6 w-6 text-foreground-muted" />
                    <p className="text-[13px] font-medium text-foreground">Perangkat Belum Ditugaskan ke Pengemudi</p>
                    <p className="text-[12px] text-foreground-muted max-w-xs">
                      Perangkat smartphone ini masih berstatus idle dan belum ditautkan ke akun pengemudi mana pun.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <SectionHeader icon={Truck} title="Status Penugasan Armada" />
                {device.vehicleId && device.plateNumber ? (
                  <div className="p-4 rounded-xl border border-success/30 bg-success/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-[13px] font-bold">Perangkat Terpasang di Armada</span>
                    </div>
                    <div className="mt-2 space-y-1.5 text-[13px]">
                      <p><span className="text-foreground-muted">Plat Nomor:</span> <strong className="font-semibold text-foreground">{device.plateNumber}</strong></p>
                      {device.vehicleName && <p><span className="text-foreground-muted">Nama Kendaraan:</span> <span className="font-medium text-foreground">{device.vehicleName}</span></p>}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-2 py-8">
                    <AlertCircle className="h-6 w-6 text-foreground-muted" />
                    <p className="text-[13px] font-medium text-foreground">Perangkat Belum Ditugaskan</p>
                    <p className="text-[12px] text-foreground-muted max-w-xs">
                      Perangkat ini masih berstatus idle dan siap dipasangkan ke salah satu kendaraan armada.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </DetailShell>
  );
}
