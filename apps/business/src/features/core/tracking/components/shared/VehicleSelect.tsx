import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { TrackingVehicle } from '@/features/core/tracking/types/tracking';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@adatrack/ui';
import { getTrackingTranslation } from '../../i18n';

interface VehicleSelectProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId: string | null;
  onVehicleChange: (vehicleId: string) => void;
  isLoading?: boolean;
  locale: 'id' | 'en';
}

export function VehicleSelect({ vehicles, selectedVehicleId, onVehicleChange, isLoading, locale }: VehicleSelectProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const tTrackingLocal = getTrackingTranslation(locale);

  // Always show search since the user explicitly asked for it
  const showSearch = true; // or vehicles.length > 5

  const filteredVehicles = useMemo(() => {
    if (!showSearch || !search) return vehicles;
    const lowerSearch = search.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.plateNumber.toLowerCase().includes(lowerSearch) ||
        (v.vehicleType && v.vehicleType.toLowerCase().includes(lowerSearch))
    );
  }, [vehicles, search, showSearch]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setSearch(''), 200);
    }
  };

  return (
    <Select value={selectedVehicleId ?? undefined} onValueChange={onVehicleChange} disabled={isLoading} open={open} onOpenChange={handleOpenChange}>
      <SelectTrigger className="w-full h-8 px-2 text-[12px] rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary">
        <SelectValue placeholder={tTrackingLocal.messages.selectVehiclePlaceholder} />
      </SelectTrigger>
      <SelectContent className="z-[99999]">
        {showSearch && (
          <div className="px-2 pb-2 pt-1 relative sticky top-0 bg-background z-10 border-b border-border/50 mb-1">
            <div className="relative flex items-center w-full">
              <Search className="w-3.5 h-3.5 absolute left-2 text-foreground-muted" />
              <input
                type="text"
                placeholder={tTrackingLocal.messages.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-7 pr-3 py-1.5 text-[12px] bg-transparent border rounded border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-foreground-muted/60 transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
        <div className="max-h-[220px] overflow-y-auto overflow-x-hidden p-1">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((v) => (
              <SelectItem key={v.id} value={v.id} className="text-[12px] py-1.5">
                {v.plateNumber} - {v.vehicleType}
              </SelectItem>
            ))
          ) : (
            <div className="py-4 text-center text-[12px] text-foreground-muted">
              {tTrackingLocal.messages.noResult}
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
