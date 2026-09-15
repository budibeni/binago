import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Maximize, Minimize, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';
import type { TrackingVehicle, DateRange } from '../../types/tracking';

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
      cell: ({ row }) => <span className="text-foreground-muted">{row.index + 1}</span>,
      size: 60,
    },
    {
      accessorKey: 'plateNumber',
      header: locale === 'en' ? 'Vehicle' : 'Armada',
      cell: ({ row }) => <div className="font-semibold text-foreground">{row.original.plateNumber}</div>,
    },
    {
      accessorKey: 'groupName',
      header: locale === 'en' ? 'Group' : 'Grup',
      cell: ({ row }) => <div className="text-foreground-muted">{row.original.groupName}</div>,
    },
    {
      accessorKey: 'vehicleType',
      header: locale === 'en' ? 'Vehicle Type' : 'Tipe Kendaraan',
      cell: ({ row }) => <div className="text-foreground-muted">{row.original.vehicleType || '-'}</div>,
    },
  ], [locale]);

  const toolbarActions = (
    <button
      type="button"
      onClick={handleToggleFullscreen}
      className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-white dark:bg-neutral-900 text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
      title={isFullscreen ? (locale === 'en' ? 'Exit Fullscreen' : 'Keluar Layar Penuh') : (locale === 'en' ? 'Fullscreen' : 'Layar Penuh')}
    >
      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
    </button>
  );

  return (
    <div ref={tableContainerRef} className="flex flex-col flex-1 min-h-0 w-full px-1.5 sm:px-2 pb-1.5 sm:pb-2 gap-2 mt-3">
      {/* Mode Selector & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between p-2 shrink-0 bg-background border border-border rounded-lg gap-2">
        {modeSelector && (
          <div className="flex items-center shrink-0 w-full xl:w-auto">
            {modeSelector}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-start xl:justify-end gap-3 w-full xl:w-auto">
          {/* Start Date */}
          <div className="relative w-[120px] shrink-0">
            <input
              type="date"
              className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 pr-7 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
              value={dateRange.startDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
              disabled={isGenerating}
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
          </div>

          <span className="text-foreground-muted text-[11px] font-bold mx-1">-</span>

          {/* End Date */}
          <div className="relative w-[120px] shrink-0">
            <input
              type="date"
              className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 pr-7 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
              value={dateRange.endDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
              disabled={isGenerating}
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
          </div>

          {/* Status Filter */}
          <div className="relative w-[100px] shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as any)}
              disabled={isGenerating}
              className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all appearance-none cursor-pointer"
            >
              <option value="driving">{tTracking.statusDriving}</option>
              <option value="idle">{tTracking.statusIdle}</option>
              <option value="parking">{tTracking.statusParking}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={!dateRange.startDate || !dateRange.endDate || isGenerating}
            className="flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500"
            title={tTracking.heatmapGenerate}
          >
            <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
          </button>
        </div>
      </div>

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
          emptyDescription={searchQuery ? (locale === 'en' ? 'No vehicles match your search.' : 'Tidak ada kendaraan yang cocok dengan pencarian.') : (tTracking.emptyDescription || 'Tidak ada kendaraan.')}
          tableClassName="min-w-[900px]"
        />
      </div>
    </div>
  );
}
