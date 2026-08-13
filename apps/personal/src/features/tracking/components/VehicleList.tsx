'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Car } from 'lucide-react';
import { cn } from '@binago/utils';
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
}

export function VehicleList({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  isListVisible,
  onToggleList,
}: VehicleListProps) {
  
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  
  const getStatusDisplay = (status: VehicleStatus) => {
    switch(status) {
      case 'driving':
        return { text: t.tracking.statusDriving, color: 'text-green-600', dot: 'bg-green-500' };
      case 'idle':
        return { text: t.tracking.statusIdle, color: 'text-amber-600', dot: 'bg-amber-500' };
      case 'parking':
        return { text: t.tracking.statusParking, color: 'text-neutral-500', dot: 'bg-neutral-400' };
      case 'offline':
        return { text: t.tracking.statusOffline, color: 'text-foreground-muted', dot: 'bg-neutral-400' };
      default:
        return { text: status, color: 'text-foreground-muted', dot: 'bg-neutral-400' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface text-foreground border-r border-border">
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
            {vehicles.length}
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
              <div className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center mb-3 border border-border">
                <Car className="h-6 w-6 text-foreground-subtle" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground">{t.tracking.emptyList}</p>
              <p className="text-xs text-foreground-muted mt-1">{t.tracking.emptyListDesc}</p>
            </div>
          ) : (
            vehicles.map((vehicle) => {
              const isSelected = vehicle.id === selectedVehicleId;
              const statusDisplay = getStatusDisplay(vehicle.status);
              const speed = vehicle.speed || 0;
              
              return (
                <div
                  key={vehicle.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVehicleSelect(vehicle.id);
                  }}
                  className={cn(
                    'flex items-center p-3 rounded-xl border transition-all cursor-pointer bg-surface group',
                    isSelected 
                      ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]' 
                      : 'border-border hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm'
                  )}
                >
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-lg bg-surface-elevated text-foreground-muted mr-3">
                    <Car className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div className="flex flex-col truncate pr-2">
                      <span className="font-semibold text-sm truncate text-foreground">{vehicle.type}</span>
                      <span className="text-xs text-foreground-muted mt-0.5">{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pr-2">
                      <span className="font-semibold text-xs text-foreground">
                        {speed} {t.tracking.speedUnit}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusDisplay.dot)} />
                        <span className={cn('text-[11px] font-medium', statusDisplay.color)}>
                          {statusDisplay.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-foreground-subtle shrink-0 group-hover:text-foreground-muted transition-colors" />
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bottom Button - only shown when visible */}
      {isListVisible && (
        <div className="p-4 pt-2 shrink-0 border-t border-border bg-surface">
          <button 
            onClick={onToggleList}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors"
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
