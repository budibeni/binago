'use client';

import React from 'react';
import { X, UserRound, MapPin, Mail, Phone, Calendar, Hash, Truck, Clock, Edit2, Trash2, Star } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Avatar, Tabs, Badge, DetailShell } from '@adatrack/ui';
import type { Driver, DriverHistory } from '../types/driver';

interface DriverViewProps {
  driver: Driver | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  labels: {
    title: string;
    close: string;
    tabInfo: string;
    tabHistory: string;
    ktp: string;
    pob: string;
    dob: string;
    joinDate: string;
    address: string;
    placement: string;
    group: string;
    licenseNo: string;
    licenseExpiry: string;
    phone: string;
    email: string;
    historyEmpty: string;
    actionEdit: string;
    actionDelete: string;
  };
}

export function DriverView({
  driver,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  labels,
}: DriverViewProps) {
// â"€â"€â"€ Helper Components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function CompactField({ label, value, highlight, colSpan = 1 }: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  colSpan?: 1 | 2;
}) {
  return (
    <div className={cn('flex flex-col gap-1', colSpan === 2 && 'col-span-2')}>
      <span className="text-[10px] text-foreground-muted font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className={cn(
        'text-[12px] text-foreground leading-tight',
        highlight && 'text-danger font-semibold'
      )}>
        {value ?? '-'}
      </span>
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
  const [activeTab, setActiveTab] = React.useState('info');

  if (!isOpen || !driver) return null;

  const renderHistoryIcon = (type: DriverHistory['type']) => {
    switch (type) {
      case 'assignment': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'violation': return <X className="w-4 h-4 text-danger" />;
      case 'achievement': return <UserRound className="w-4 h-4 text-success" />;
      case 'leave': return <Clock className="w-4 h-4 text-warning" />;
      default: return <Clock className="w-4 h-4 text-foreground-muted" />;
    }
  };

  return (
    <DetailShell
      open={isOpen}
      onOpenChange={(val) => !val && onClose()}
      title={labels.title}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0 bg-neutral-50/50 dark:bg-neutral-900">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[15px] font-bold text-foreground tracking-widest uppercase truncate">
                {driver.name}
              </h2>
              <Badge variant={driver.status === 'active' ? 'success' : driver.status === 'inactive' ? 'danger' : 'warning'} dot>
                {driver.status === 'active' ? 'Aktif' : driver.status === 'inactive' ? 'Tidak Aktif' : 'Cuti'}
              </Badge>
            </div>
            <p className="text-[12px] text-foreground-muted flex items-center gap-1.5 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5" />
              {driver.placement}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-4 pb-0 mb-4 border-b border-border/40">
          <Tabs
            tabs={[
              { id: 'info', label: labels.tabInfo },
              { id: 'history', label: labels.tabHistory }
            ]}
            activeTab={activeTab}
            // @ts-expect-error - Tabs component type has wrong onChange signature
            onChange={setActiveTab}
            variant="underline"
          />
        </div>

        <div className="px-4 pb-4">
        {activeTab === 'info' && (
          <div className="flex flex-col gap-4">
            {/* Operasional */}
            <SectionHeader icon={Truck} title="Operasional & Performa" />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
              <CompactField label="Kendaraan Ditugaskan" value={driver.assignedVehiclePlate || 'Tidak ada'} colSpan={2} />
              
              <div className="col-span-2 flex flex-col gap-1 mb-2">
                <span className="text-[10px] text-foreground-muted font-medium uppercase tracking-wider">
                  Skor Performa
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex items-center gap-0.5" title={`${driver.performanceScore || 0} / 100`}>
                    {[1, 2, 3, 4, 5].map(star => {
                      const score = driver.performanceScore || 0;
                      const rating = score >= 100 ? 5 : Math.floor(score / 20);
                      return (
                        <Star 
                          key={star} 
                          className={cn(
                            "w-3.5 h-3.5",
                            star <= rating 
                              ? "fill-warning text-warning" 
                              : "fill-neutral-200 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-800"
                          )} 
                        />
                      );
                    })}
                  </div>
                  <span className="text-[12px] font-bold tabular-nums ml-1 text-foreground">
                    {driver.performanceScore || 0} Poin
                  </span>
                </div>
              </div>
              
              <CompactField label="Harsh Driving" value={`${driver.performanceMetrics?.harshDriving || 0} kali`} highlight={(driver.performanceMetrics?.harshDriving || 0) > 2} />
              <CompactField label="Speeding" value={`${driver.performanceMetrics?.speeding || 0} kali`} highlight={(driver.performanceMetrics?.speeding || 0) > 2} />
              <CompactField label="Over Idling" value={`${driver.performanceMetrics?.overIdling || 0} kali`} />
              <CompactField label="Fatigue Driving" value={`${driver.performanceMetrics?.fatigueDriving || 0} kali`} highlight={(driver.performanceMetrics?.fatigueDriving || 0) > 0} />
            </div>

            {/* Kontak */}
            <SectionHeader icon={Phone} title="Kontak" />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
              <CompactField 
                label={labels.phone} 
                value={
                  <a 
                    href={`https://wa.me/${driver.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline decoration-border underline-offset-4 text-foreground"
                    title="Chat via WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#25D366] fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    {driver.phone}
                  </a>
                } 
              />
              <CompactField label={labels.email} value={driver.email} />
              <CompactField label={labels.address} value={driver.address} colSpan={2} />
            </div>

            {/* Identitas & Pekerjaan */}
            <SectionHeader icon={UserRound} title="Identitas & Pekerjaan" />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
              <CompactField label={labels.ktp} value={driver.ktpNumber} />
              <CompactField label={`${labels.pob} / ${labels.dob}`} value={`${driver.placeOfBirth}, ${driver.dateOfBirth}`} />
              <CompactField label={labels.group} value={driver.groupName} />
              <CompactField label={labels.placement} value={driver.placement} />
              <CompactField label={labels.joinDate} value={driver.joinDate} />
            </div>

            {/* SIM */}
            <SectionHeader icon={Hash} title="Lisensi (SIM)" />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
              <CompactField label={labels.licenseNo} value={driver.licenseNumber} />
              <CompactField label={labels.licenseExpiry} value={driver.licenseExpiry} />
            </div>

          </div>
        )}

          {activeTab === 'history' && (
            <div className="flex flex-col gap-4 relative">
              {(!driver.history || driver.history.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="w-12 h-12 text-foreground-muted opacity-20 mb-3" />
                  <p className="text-sm text-foreground-muted">{labels.historyEmpty}</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {driver.history.map((hist, idx) => (
                    <div key={hist.id} className="relative flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border shadow-sm z-10 shrink-0">
                        {renderHistoryIcon(hist.type)}
                      </div>
                      <div className="flex-1 bg-surface border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-semibold text-foreground capitalize">
                            {hist.type === 'assignment' ? 'Penugasan' : 
                             hist.type === 'violation' ? 'Pelanggaran' : 
                             hist.type === 'achievement' ? 'Pencapaian' : 'Cuti'}
                          </span>
                          <span className="text-xs text-foreground-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(hist.date).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <p className="text-sm text-foreground-subtle leading-relaxed">{hist.description}</p>
                        {hist.vehicleId && (
                          <div className="mt-3 pt-3 border-t border-border/30">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-foreground-muted">
                              <Truck className="w-3.5 h-3.5" />
                              {hist.vehicleId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="h-4" />
      </div>
    </DetailShell>
  );
}
