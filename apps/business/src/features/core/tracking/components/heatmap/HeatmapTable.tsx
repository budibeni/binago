import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Maximize, Minimize, Calendar, ChevronDown, RefreshCw, MapPin } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';
import { TableFilterPopover } from '../shared/TableFilterPopover';
import type { TrackingVehicle, DateRange } from '../../types/tracking';
import { getTrackingTranslation } from '../../i18n';

export interface HeatmapTableProps {
  modeSelector?: React.ReactNode;
  vehicles: TrackingVehicle[];
  locale: 'id' | 'en';
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  statusFilter: 'driving' | 'idle' | 'parking';
  onStatusFilterChange: (status: 'driving' | 'idle' | 'parking') => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function HeatmapTable({
  modeSelector,
  vehicles,
  locale,
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
  onGenerate,
  isGenerating
}: HeatmapTableProps) {
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

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return vehicles;
    const q = searchQuery.toLowerCase();
    return vehicles.filter((v) => 
      v.plateNumber.toLowerCase().includes(q) ||
      (v.driverName || '').toLowerCase().includes(q) ||
      v.groupName.toLowerCase().includes(q)
    );
  }, [vehicles, searchQuery]);

  const columns = useMemo<DataTableColumnDef<TrackingVehicle>[]>(() => [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => <div className="text-center text-foreground-muted">{row.index + 1}</div>,
      size: 60,
    },
    {
      accessorKey: 'plateNumber',
      header: tTrackingLocal.columns.vehicle,
      size: 140,
      cell: ({ row }) => <span className="font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap">{row.original.plateNumber}</span>,
    },
    {
      accessorKey: 'groupName',
      header: tTrackingLocal.columns.group,
      size: 130,
      cell: ({ row }) => <span className="text-foreground-muted whitespace-nowrap">{row.original.groupName}</span>,
    },
    {
      accessorKey: 'vehicleType',
      header: tTrackingLocal.columns.vehicleType,
      cell: ({ row }) => <div className="text-foreground-muted">{row.original.vehicleType || '-'}</div>,
    },
  ], [tTrackingLocal]);

  const handleReset = () => {
    onStatusFilterChange('driving');
    onDateRangeChange({ startDate: '', endDate: '', startTime: '06:00', endTime: '18:00' });
  };

  const toolbarActions = (
    <>
      {modeSelector}
      <TableFilterPopover locale={locale} hideLabel={true} onReset={handleReset}>
        {/* Status Filter */}
        <div>
          <label className="text-[11px] font-medium text-foreground-muted mb-1 block">
            {locale === 'en' ? 'Status' : 'Status'}
          </label>
          <div className="relative w-full">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as 'driving' | 'idle' | 'parking')}
              disabled={isGenerating}
              className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all appearance-none cursor-pointer"
            >
              <option value="driving">{tTrackingLocal.filters.statusDriving}</option>
              <option value="idle">{tTrackingLocal.filters.statusIdle}</option>
              <option value="parking">{tTrackingLocal.filters.statusParking}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
          </div>
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
            <MapPin className="h-3.5 w-3.5" />
          )}
          {tTrackingLocal.filters.generateHeatmap}
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
          searchPlaceholder={tTracking.searchPlaceholder || "Cari kendaraan..."}
          exportable
          exportFilename={`Heatmap_Summary_${new Date().toISOString().slice(0,10)}`}
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
