import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Maximize, Minimize, Calendar, RefreshCw, MapPin } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';
import { TableFilterPopover } from '../shared/TableFilterPopover';
import type { TrackingVehicle, DateRange } from '../../types/tracking';
import { getTrackingTranslation } from '../../i18n';

export interface ParkingTableProps {
  modeSelector?: React.ReactNode;
  vehicles: TrackingVehicle[];
  locale: 'id' | 'en';
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  minDuration: number;
  onMinDurationChange: (duration: number) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function ParkingTable({
  modeSelector,
  vehicles,
  locale,
  dateRange,
  onDateRangeChange,
  minDuration,
  onMinDurationChange,
  onGenerate,
  isGenerating
}: ParkingTableProps) {
  const t = getTranslation(locale);
  const tTracking = t.tracking;
  const tTrackingLocal = getTrackingTranslation(locale);

  const [searchQuery, setSearchQuery] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      tableContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Augment vehicles with dummy parking data to keep it stable and compatible with DataTable
  const augmentedVehicles = useMemo(() => {
    return vehicles.map((v) => {
      const dummyDurationMinutes = minDuration + Math.floor(Math.random() * 120);
      const hours = Math.floor(dummyDurationMinutes / 60);
      const mins = dummyDurationMinutes % 60;
      const address = "Jl. Sudirman No. 45, Jakarta Pusat";
      const geofence = Math.random() > 0.5 ? "Kantor Pusat" : "-";
      return {
        ...v,
        parkingData: {
          dummyDurationMinutes,
          hours,
          mins,
          address,
          geofence
        }
      };
    });
  }, [vehicles, minDuration]);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return augmentedVehicles;
    const q = searchQuery.toLowerCase();
    return augmentedVehicles.filter((v) => 
      v.plateNumber.toLowerCase().includes(q) ||
      (v.driverName || '').toLowerCase().includes(q) ||
      v.groupName.toLowerCase().includes(q)
    );
  }, [augmentedVehicles, searchQuery]);

  type AugmentedVehicle = typeof augmentedVehicles[0];

  const columns = useMemo<DataTableColumnDef<AugmentedVehicle>[]>(() => [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => <span className="text-foreground-muted">{row.index + 1}</span>,
      size: 60,
    },
    {
      accessorKey: 'plateNumber',
      header: tTrackingLocal.columns.vehicle,
      size: 140,
      cell: ({ row }) => <span className="font-medium text-foreground whitespace-nowrap">{row.original.plateNumber}</span>,
    },
    {
      id: 'duration',
      header: tTrackingLocal.columns.durationParking,
      size: 140,
      cell: ({ row }) => {
        const { hours, mins } = row.original.parkingData;
        return (
          <div className="font-medium text-amber-600 dark:text-amber-500 tabular-nums">
            {hours > 0 ? `${hours}j ${mins}m` : `${mins}m`}
          </div>
        );
      },
    },
    {
      id: 'address',
      header: tTrackingLocal.columns.address,
      size: 250,
      cell: ({ row }) => {
        const v = row.original;
        const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${v.location.lat},${v.location.lng}`;
        return (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-foreground-muted hover:text-primary transition-colors cursor-pointer max-w-[220px] xl:max-w-[300px] truncate"
            title={`${tTrackingLocal.columns.openMaps}: ${v.parkingData.address}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin className="h-3 w-3 shrink-0 opacity-70" />
            <span className="truncate hover:underline">{v.parkingData.address}</span>
          </a>
        );
      }
    },
    {
      id: 'geofence',
      header: tTrackingLocal.columns.geofence,
      size: 160,
      cell: ({ row }) => {
        const gf = row.original.parkingData.geofence;
        return <span className="text-foreground-muted whitespace-nowrap">{gf}</span>;
      }
    }
  ], [tTrackingLocal]);

  const handleReset = () => {
    onMinDurationChange(10);
    onDateRangeChange({ startDate: '', endDate: '', startTime: '06:00', endTime: '18:00' });
  };

  const toolbarActions = (
    <>
      {modeSelector}
      <TableFilterPopover locale={locale} hideLabel={true} onReset={handleReset}>
        {/* Min Duration */}
        <div>
          <label className="text-[11px] font-medium text-foreground-muted mb-1 block">
            {tTrackingLocal.filters.minDuration}
          </label>
          <input
            type="number"
            min="1"
            className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all"
            value={minDuration}
            onChange={(e) => onMinDurationChange(Number(e.target.value))}
            disabled={isGenerating}
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="text-[11px] font-medium text-foreground-muted mb-1 block">
            {tTrackingLocal.filters.startDate}
          </label>
          <div className="relative w-full">
            <input
              type="date"
              className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 pr-7 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
              value={dateRange.startDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
              disabled={isGenerating}
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="text-[11px] font-medium text-foreground-muted mb-1 block">
            {tTrackingLocal.filters.endDate}
          </label>
          <div className="relative w-full">
            <input
              type="date"
              className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 pr-7 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
              value={dateRange.endDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
              disabled={isGenerating}
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!dateRange.startDate || !dateRange.endDate || isGenerating}
          className="flex items-center justify-center h-8 w-full rounded-md bg-danger hover:bg-danger/90 text-danger-foreground disabled:opacity-50 transition-colors focus:outline-none focus:ring-1 focus:ring-danger font-medium text-[12px] mt-2 gap-2"
        >
          {isGenerating ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {tTrackingLocal.filters.generate}
        </button>
      </TableFilterPopover>
    </>
  );

  return (
    <div ref={tableContainerRef} className="flex flex-col flex-1 min-h-0 w-full px-1.5 sm:px-2 pb-1.5 sm:pb-2 gap-2 mt-3">


      {/* DataTable */}
      <div className="flex-1 min-h-0 border border-border rounded-lg overflow-hidden bg-background">
        <DataTable
          columns={columns}
          data={filteredVehicles}
          searchable
          columnVisibility
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={tTrackingLocal.messages.searchVehicle}
          exportable
          exportFilename={`Parking_Summary_${new Date().toISOString().slice(0,10)}`}
          toolbarActions={toolbarActions}
          onRefresh={onGenerate}
          isLoading={isGenerating}
          emptyDescription={searchQuery ? tTrackingLocal.messages.noVehicleFound : tTrackingLocal.messages.noData}
          showFullscreen
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          hideToolbarLabels={true}
          tableClassName="min-w-[900px]"
        />
      </div>
    </div>
  );
}
