import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Maximize, Minimize, Calendar, RefreshCw } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';
import type { TrackingVehicle, DateRange } from '../../types/tracking';

export interface SpeedTableProps {
  modeSelector?: React.ReactNode;
  vehicles: TrackingVehicle[];
  locale: 'id' | 'en';
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function SpeedTable({
  modeSelector,
  vehicles,
  locale,
  dateRange,
  onDateRangeChange,
  onGenerate,
  isGenerating
}: SpeedTableProps) {
  const t = getTranslation(locale);
  
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

  // Augment vehicles with dummy speed data to keep it stable and compatible with DataTable
  const augmentedVehicles = useMemo(() => {
    return vehicles.map((v) => {
      const minSpeed = Math.floor(Math.random() * 20);
      const maxSpeed = 60 + Math.floor(Math.random() * 60);
      const avgSpeed = minSpeed + Math.floor((maxSpeed - minSpeed) / 2) + Math.floor(Math.random() * 10 - 5);
      return {
        ...v,
        speedData: {
          minSpeed,
          maxSpeed,
          avgSpeed
        }
      };
    });
  }, [vehicles]);

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
      cell: ({ row }) => <div className="text-center text-foreground-muted">{row.index + 1}</div>,
      size: 60,
    },
    {
      accessorKey: 'plateNumber',
      header: locale === 'en' ? 'Vehicle' : 'Armada',
      cell: ({ row }) => <div className="font-semibold text-foreground">{row.original.plateNumber}</div>,
    },
    {
      id: 'minSpeed',
      header: locale === 'en' ? 'Min. Speed' : 'Min. Kecepatan',
      cell: ({ row }) => {
        const { minSpeed } = row.original.speedData;
        return (
          <div className="text-right">
            <span className="font-medium">{minSpeed}</span>
            <span className="text-foreground-muted text-xs ml-1">km/h</span>
          </div>
        );
      },
    },
    {
      id: 'avgSpeed',
      header: locale === 'en' ? 'Average' : 'Rata-rata',
      cell: ({ row }) => {
        const { avgSpeed } = row.original.speedData;
        return (
          <div className="text-right">
            <span className="font-medium text-blue-600 dark:text-blue-400">{avgSpeed}</span>
            <span className="text-foreground-muted text-xs ml-1">km/h</span>
          </div>
        );
      },
    },
    {
      id: 'maxSpeed',
      header: locale === 'en' ? 'Max. Speed' : 'Max. Kecepatan',
      cell: ({ row }) => {
        const { maxSpeed } = row.original.speedData;
        return (
          <div className="text-right">
            <span className="font-bold text-danger">{maxSpeed}</span>
            <span className="text-foreground-muted text-xs ml-1">km/h</span>
          </div>
        );
      },
    }
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

          {/* Generate Button */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={!dateRange.startDate || !dateRange.endDate || isGenerating}
            className="flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500"
            title={locale === 'en' ? 'Load Data' : 'Muat Data'}
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
          searchPlaceholder={locale === 'en' ? 'Search vehicle...' : 'Cari armada...'}
          exportable
          exportFilename={`Speed_Summary_${new Date().toISOString().slice(0,10)}`}
          toolbarActions={toolbarActions}
          emptyDescription={searchQuery ? (locale === 'en' ? 'No vehicle found matching your search.' : 'Tidak ada armada yang sesuai dengan pencarian.') : (locale === 'en' ? 'No data available.' : 'Tidak ada data.')}
          tableClassName="min-w-[900px]"
        />
      </div>
    </div>
  );
}
