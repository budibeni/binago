'use client';

import React from 'react';
import { X, UserRound, MapPin, Mail, Phone, Calendar, Hash, Truck, Clock, Edit2, Trash2 } from 'lucide-react';
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
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Profile Header */}
        <div className="pb-4 mb-4 border-b border-border flex items-center gap-3">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-[15px] font-bold text-foreground">{driver.name}</h3>
              <Badge variant={driver.status === 'active' ? 'success' : driver.status === 'inactive' ? 'danger' : 'warning'} dot className="text-[10px] px-1.5 py-0 h-4">
                {driver.status === 'active' ? 'Aktif' : driver.status === 'inactive' ? 'Tidak Aktif' : 'Cuti'}
              </Badge>
            </div>
            <span className="text-[12px] text-foreground-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {driver.placement}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
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

        {activeTab === 'info' && (
          <div className="flex flex-col gap-4">
            {/* Kontak */}
            <SectionHeader icon={Phone} title="Kontak" />
            <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
              <InfoRow icon={Phone} label={labels.phone} value={driver.phone} />
              <InfoRow icon={Mail} label={labels.email} value={driver.email} />
              <InfoRow icon={MapPin} label={labels.address} value={driver.address} />
            </div>

            {/* Identitas */}
            <SectionHeader icon={UserRound} title="Identitas" />
            <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
              <InfoRow icon={Hash} label={labels.ktp} value={driver.ktpNumber} />
              <InfoRow icon={Calendar} label={`${labels.pob} / ${labels.dob}`} value={`${driver.placeOfBirth}, ${driver.dateOfBirth}`} />
              <InfoRow icon={Clock} label={labels.joinDate} value={driver.joinDate} />
            </div>

            {/* SIM */}
            <SectionHeader icon={Hash} title="Lisensi (SIM)" />
            <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
              <InfoRow icon={Hash} label={labels.licenseNo} value={driver.licenseNumber} />
              <InfoRow icon={Calendar} label={labels.licenseExpiry} value={driver.licenseExpiry} />
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
        <div className="h-4" />
      </div>
    </DetailShell>
  );
}
