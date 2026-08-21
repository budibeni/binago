'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, CarFront, Motorbike } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { Vehicle, VehicleStatus } from '../types';

export interface VehicleListProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: VehicleStatus | 'all';
  onStatusFilterChange: (status: VehicleStatus | 'all') => void;
  isListVisible: boolean;
  onToggleList: () => void;
  hiddenVehicleIds: Set<string>;
  onToggleVehicleVisibility: (id: string) => void;
}

export function VehicleList({
  vehicles,
  onVehicleSelect,
  isListVisible,
  onToggleList,
  hiddenVehicleIds,
  onToggleVehicleVisibility,
}: VehicleListProps) {

  const locale = usePersonalLocale();
  const t = getTranslation(locale);

  const getStatusDisplay = (status: VehicleStatus) => {
    switch (status) {
      case 'driving':
        return { text: t.tracking.statusDriving, color: 'text-green-600', dot: 'bg-green-500', iconColor: 'text-green-600' };
      case 'idle':
        return { text: t.tracking.statusIdle, color: 'text-amber-600', dot: 'bg-amber-500', iconColor: 'text-amber-500' };
      case 'parking':
        return { text: t.tracking.statusParking, color: 'text-blue-600', dot: 'bg-blue-500', iconColor: 'text-blue-500' };
      case 'offline':
        return { text: t.tracking.statusOffline, color: 'text-foreground-muted', dot: 'bg-neutral-400', iconColor: 'text-neutral-500' };
      default:
        return { text: status, color: 'text-foreground-muted', dot: 'bg-neutral-400', iconColor: 'text-neutral-400' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface text-foreground border-r border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-5 py-4 shrink-0 cursor-pointer select-none transition-colors",
          !isListVisible && "hover:bg-surface-elevated"
        )}
        onClick={onToggleList}
        role="button"
        aria-expanded={isListVisible}
        aria-label={isListVisible ? t.tracking.hideList : t.nav.vehicles}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[15px]">{t.nav.vehicles}</h2>
          <span className="bg-surface-elevated text-foreground-muted text-[11px] font-medium px-2 py-0.5 rounded-full">
            {vehicles.length - hiddenVehicleIds.size}/{vehicles.length}
          </span>
        </div>
        <button
          className="p-1 -mr-1 text-foreground-subtle hover:text-foreground-muted transition-colors"
          aria-label={isListVisible ? t.tracking.hideList : t.nav.vehicles}
          tabIndex={-1}
          aria-hidden="true"
        >
          {isListVisible ? (
            <>
              <ChevronLeft className="h-5 w-5 hidden md:block" />
              <ChevronDown className="h-5 w-5 md:hidden" />
            </>
          ) : (
            <>
              <ChevronRight className="h-5 w-5 hidden md:block" />
              <ChevronUp className="h-5 w-5 md:hidden" />
            </>
          )}
        </button>
      </div>

      {/* List - Rendered conditionally but with stable flex behavior when visible */}
      {isListVisible && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center mb-3 border border-neutral-200 dark:border-neutral-800">
                <CarFront className="h-6 w-6 text-foreground-subtle" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground">{t.tracking.emptyList}</p>
              <p className="text-xs text-foreground-muted mt-1">{t.tracking.emptyListDesc}</p>
            </div>
          ) : (
            vehicles.map((vehicle) => {
              const isMapVisible = !hiddenVehicleIds.has(vehicle.id);
              const statusDisplay = getStatusDisplay(vehicle.status);
              
              const speedText = (isMapVisible && vehicle.status !== 'offline') ? `${vehicle.speed || 0} ${t.tracking.speedUnit}` : '—';
              const nameClass = isMapVisible ? 'text-foreground' : 'text-neutral-400';
              const plateClass = isMapVisible ? 'text-foreground-muted' : 'text-neutral-400/70';
              const statusText = isMapVisible ? statusDisplay.text : (t.tracking?.hidden || 'Disembunyikan');
              const statusColor = isMapVisible ? statusDisplay.color : 'text-neutral-400';
              const iconColor = isMapVisible ? statusDisplay.iconColor : 'text-neutral-300';

              return (
                <div
                  key={vehicle.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVehicleSelect(vehicle.id);
                  }}
                  className="flex items-center p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface transition-all cursor-pointer overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVehicleVisibility(vehicle.id);
                    }}
                    className={cn(
                      "w-12 h-12 shrink-0 flex items-center justify-center rounded-lg mr-4 transition-colors",
                      iconColor
                    )}
                    title={isMapVisible ? 'Tampilkan di peta' : 'Sembunyikan dari peta'}
                  >
                    {vehicle.category === 'motorcycle' ? (
                      <Motorbike className="w-8 h-8" strokeWidth={1.5} />
                    ) : (
                      <CarFront className="w-8 h-8" strokeWidth={1.5} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div className="flex flex-col truncate pr-2 gap-0.5">
                      <span className={cn("font-semibold text-[15px] truncate", nameClass)}>{vehicle.type}</span>
                      <span className={cn("text-[13px]", plateClass)}>{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pl-2 gap-1.5">
                      <span className={cn("font-semibold text-[13px]", isMapVisible ? 'text-foreground' : 'text-neutral-400')}>
                        {speedText}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isMapVisible ? (
                          <span className={cn('w-2 h-2 rounded-full', statusDisplay.dot)} />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-neutral-400 bg-transparent" />
                        )}
                        <span className={cn('text-xs font-medium', statusColor)}>
                          {statusText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0 ml-3" />
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bottom Button - only shown when visible */}
      {isListVisible && (
        <div className="p-4 pt-2 shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-surface">
          <button
            type="button"
            onClick={onToggleList}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors"
          >
            <ChevronDown className="w-4 h-4 md:hidden" />
            <ChevronLeft className="w-4 h-4 hidden md:block" />
            {t.tracking.hideList}
          </button>
        </div>
      )}
    </div>
  );
}
