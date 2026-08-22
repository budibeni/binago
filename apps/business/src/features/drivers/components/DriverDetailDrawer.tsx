'use client';

import React from 'react';
import { X, UserRound, MapPin, Mail, Phone, Calendar, Hash, Truck, Clock, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Avatar, Tabs, Badge } from '@adatrack/ui';
import type { Driver, DriverHistory } from '../types/driver';

interface DriverDetailDrawerProps {
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

export function DriverDetailDrawer({
  driver,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  labels,
}: DriverDetailDrawerProps) {
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
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:px-4 py-2 border-b border-border bg-surface">
          <h2 className="text-sm font-semibold text-foreground">{labels.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-foreground-muted hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Profile Header */}
        <div className="px-4 md:px-5 pt-4 pb-1 flex items-center gap-3">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-base font-bold text-foreground">{driver.name}</h3>
              <Badge variant={driver.status === 'active' ? 'success' : driver.status === 'inactive' ? 'danger' : 'warning'} dot className="text-[10px] px-1.5 py-0 h-4">
                {driver.status === 'active' ? 'Aktif' : driver.status === 'inactive' ? 'Tidak Aktif' : 'Cuti'}
              </Badge>
            </div>
            <span className="text-xs text-foreground-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {driver.placement}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-5 mt-3 border-b border-border/50">
          <Tabs
            tabs={[
              { id: 'info', label: labels.tabInfo },
              { id: 'history', label: labels.tabHistory }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:px-5">
          {activeTab === 'info' && (
            <div className="flex flex-col gap-4">
              
              {/* Kontak */}
              <section>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-danger" /> Kontak
                </h4>
                <div className="bg-surface border border-border/50 rounded-xl px-3.5 py-2.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">{labels.phone}</span>
                    <span className="font-medium text-foreground">{driver.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">{labels.email}</span>
                    <span className="font-medium text-foreground">{driver.email}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 pt-1.5 border-t border-border/50 mt-1.5">
                    <span className="text-foreground-muted">{labels.address}</span>
                    <span className="font-medium text-foreground leading-relaxed">{driver.address}</span>
                  </div>
                </div>
              </section>

              {/* Identitas */}
              <section>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <UserRound className="w-3.5 h-3.5 text-danger" /> Identitas
                </h4>
                <div className="bg-surface border border-border/50 rounded-xl px-3.5 py-2.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">{labels.ktp}</span>
                    <span className="font-medium text-foreground">{driver.ktpNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">{labels.pob} / {labels.dob}</span>
                    <span className="font-medium text-foreground">{driver.placeOfBirth}, {driver.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-border/50 mt-1.5">
                    <span className="text-foreground-muted">{labels.joinDate}</span>
                    <span className="font-medium text-foreground">{driver.joinDate}</span>
                  </div>
                </div>
              </section>

              {/* SIM */}
              <section>
                <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-danger" /> Lisensi (SIM)
                </h4>
                <div className="bg-surface border border-border/50 rounded-xl px-3.5 py-2.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">{labels.licenseNo}</span>
                    <span className="font-medium text-foreground">{driver.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">{labels.licenseExpiry}</span>
                    <span className="font-medium text-foreground">{driver.licenseExpiry}</span>
                  </div>
                </div>
              </section>

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

        {/* Footer */}
        <div className="p-3 border-t border-border bg-surface flex items-center justify-between">
          <Button variant="outline" size="sm" className="text-xs h-8" onClick={onEdit}>
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            {labels.actionEdit}
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 text-danger border-danger/30 hover:bg-danger/10 hover:border-danger hover:text-danger" onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            {labels.actionDelete}
          </Button>
        </div>
      </div>
    </>
  );
}
