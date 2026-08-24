'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button, Input } from '@adatrack/ui';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import type { TripStatus } from '../types/trips';
import type { Vehicle } from '../../vehicles/types/vehicle';
import type { Driver } from '../../drivers/types/driver';

export interface TripFilterState {
  startDate: string;
  endDate: string;
  vehicleId: string;
  driverId: string;
  status: TripStatus | 'all';
  search: string;
}

export interface TripFilterProps {
  filter: TripFilterState;
  onFilterChange: (newFilter: TripFilterState) => void;
  onReset: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export function TripFilter({ filter, onFilterChange, onReset, vehicles, drivers }: TripFilterProps) {
  const locale = useBusinessLocale() || 'id';
  const tTrips = getTranslation(locale).trips;

  const handleChange = (field: keyof TripFilterState, value: string) => {
    onFilterChange({ ...filter, [field]: value });
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-surface border border-border rounded-lg shadow-sm w-full">
      <div className="flex flex-wrap items-center gap-3 w-full">
        <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
          <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.filterStart}</label>
          <Input 
            type="date"
            className="h-8 text-xs bg-background" 
            value={filter.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
          <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.filterEnd}</label>
          <Input 
            type="date"
            className="h-8 text-xs bg-background" 
            value={filter.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-[160px]">
          <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.filterVehicle}</label>
          <select 
            className="h-8 text-xs px-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-danger"
            value={filter.vehicleId}
            onChange={(e) => handleChange('vehicleId', e.target.value)}
          >
            <option value="all">{tTrips.statusAll}</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.plateNumber}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-[160px]">
          <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.filterDriver}</label>
          <select 
            className="h-8 text-xs px-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-danger"
            value={filter.driverId}
            onChange={(e) => handleChange('driverId', e.target.value)}
          >
            <option value="all">{tTrips.statusAll}</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-[130px]">
          <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.filterStatus}</label>
          <select 
            className="h-8 text-xs px-2 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-danger"
            value={filter.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="all">{tTrips.statusAll}</option>
            <option value="ongoing">{tTrips.statusOngoing}</option>
            <option value="completed">{tTrips.statusCompleted}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:flex-1 sm:min-w-[200px]">
          <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">&nbsp;</label>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder={tTrips.searchPlaceholder}
              className="h-8 text-xs pl-8 bg-background w-full"
              value={filter.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-[10px] font-bold text-transparent uppercase tracking-wider hidden sm:block">&nbsp;</label>
          <Button 
            variant="outline" 
            className="h-8 text-xs font-semibold px-4 w-full sm:w-auto"
            onClick={onReset}
          >
            {tTrips.btnReset}
          </Button>
        </div>
      </div>
    </div>
  );
}
