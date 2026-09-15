import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Maximize, Minimize, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';
import type { TrackingVehicle, DateRange } from '../../types/tracking';

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
      header: locale === 'en' ? 'Vehicle' : 'Armada',
      cell: ({ row }) => <div className="font-semibold text-foreground">{row.original.plateNumber}</div>,
    },
    {
      id: 'address',
      header: locale === 'en' ? 'Address' : 'Alamat',
      cell: ({ row }) => (
        <div className="text-foreground-muted truncate max-w-[200px] xl:max-w-[300px]" title={row.original.parkingData.address}>
          {row.original.parkingData.address}
        </div>
      ),
    },
    {
      id: 'geofence',
      header: locale === 'en' ? 'Geofence' : 'Geofence',
      cell: ({ row }) => {
        const gf = row.original.parkingData.geofence;
        return gf !== '-' ? (
          <span className="inline-flex px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[11px] font-medium border border-blue-200 dark:border-blue-800">
            {gf}
          </span>
        ) : <span className="text-foreground-muted">-</span>;
      }
    },
    {
      id: 'duration',
      header: locale === 'en' ? 'Duration' : 'Durasi Parkir',
      cell: ({ row }) => {
        const { hours, mins } = row.original.parkingData;
        return (
          <div className="font-medium text-amber-600 dark:text-amber-500">
            {hours > 0 ? `${hours}j ${mins}m` : `${mins}m`}
          </div>
        );
      },
    },
    {
      id: 'action',
      header: locale === 'en' ? 'Action' : 'Aksi',
      cell: () => (
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=-6.200000,106.816666`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-blue-600 dark:text-blue-400 transition-colors"
          title="Buka di Google Maps"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      ),
      size: 80,
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

          {/* Min Duration Filter */}
          <div className="relative w-[120px] shrink-0">
            <select
              value={minDuration}
              onChange={(e) => onMinDurationChange(Number(e.target.value))}
              disabled={isGenerating}
              className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all appearance-none cursor-pointer"
            >
              <option value={5}>{locale === 'en' ? '> 5 Minutes' : '> 5 Menit'}</option>
              <option value={15}>{locale === 'en' ? '> 15 Minutes' : '> 15 Menit'}</option>
              <option value={30}>{locale === 'en' ? '> 30 Minutes' : '> 30 Menit'}</option>
              <option value={60}>{locale === 'en' ? '> 1 Hour' : '> 1 Jam'}</option>
              <option value={240}>{locale === 'en' ? '> 4 Hours' : '> 4 Jam'}</option>
              <option value={480}>{locale === 'en' ? '> 8 Hours' : '> 8 Jam'}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
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
          exportFilename={`Parking_Summary_${new Date().toISOString().slice(0,10)}`}
          toolbarActions={toolbarActions}
          emptyDescription={searchQuery ? (locale === 'en' ? 'No vehicle found matching your search.' : 'Tidak ada armada yang sesuai dengan pencarian.') : (locale === 'en' ? 'No data available.' : 'Tidak ada data.')}
          tableClassName="min-w-[900px]"
        />
      </div>
    </div>
  );
}
