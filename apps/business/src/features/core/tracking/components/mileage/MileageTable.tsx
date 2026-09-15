import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Maximize, Minimize, Calendar, RefreshCw } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';
import { TableFilterPopover } from '../shared/TableFilterPopover';
import type { TrackingVehicle, DateRange } from '../../types/tracking';

export interface MileageTableProps {
  modeSelector?: React.ReactNode;
  vehicles: TrackingVehicle[];
  locale: 'id' | 'en';
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function MileageTable({
  modeSelector,
  vehicles,
  locale,
  dateRange,
  onDateRangeChange,
  onGenerate,
  isGenerating
}: MileageTableProps) {
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

  // Augment vehicles with dummy mileage data to keep it stable and compatible with DataTable
  const augmentedVehicles = useMemo(() => {
    return vehicles.map((v) => {
      const hours = Math.floor(Math.random() * 8);
      const mins = Math.floor(Math.random() * 60);
      const km = (Math.random() * 300);
      return {
        ...v,
        mileageData: {
          hours,
          mins,
          km
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
      id: 'engineOn',
      header: locale === 'en' ? 'Total Engine ON' : 'Total Mesin Hidup',
      cell: ({ row }) => {
        const { hours, mins } = row.original.mileageData;
        return (
          <div className="text-right">
            <span className="font-medium text-blue-600 dark:text-blue-400">{hours}j {mins}m</span>
          </div>
        );
      },
    },
    {
      id: 'totalKm',
      header: locale === 'en' ? 'Total KM' : 'Total KM',
      cell: ({ row }) => {
        const { km } = row.original.mileageData;
        return (
          <div className="text-right">
            <span className="font-bold text-emerald-600 dark:text-emerald-500">{km.toFixed(1)}</span>
            <span className="text-foreground-muted text-xs ml-1">km</span>
          </div>
        );
      },
    }
  ], [locale]);

  const handleReset = () => {
    onDateRangeChange({ startDate: '', endDate: '', startTime: '06:00', endTime: '18:00' });
  };

  const toolbarActions = (
    <>
      {modeSelector}
      <TableFilterPopover locale={locale} hideLabel={true} onReset={handleReset}>
        {/* Start Date */}
        <div>
          <label className="text-[11px] font-medium text-foreground-muted mb-1 block">
            {locale === 'en' ? 'Start Date' : 'Tanggal Mulai'}
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
            {locale === 'en' ? 'End Date' : 'Tanggal Selesai'}
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
          {locale === 'en' ? 'Load Data' : 'Muat Data'}
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
          searchPlaceholder={locale === 'en' ? 'Search vehicle...' : 'Cari armada...'}
          exportable
          exportFilename={`Mileage_Summary_${new Date().toISOString().slice(0,10)}`}
          toolbarActions={toolbarActions}
          onRefresh={onGenerate}
          isLoading={isGenerating}
          emptyDescription={searchQuery ? (locale === 'en' ? 'No vehicle found matching your search.' : 'Tidak ada armada yang sesuai dengan pencarian.') : (locale === 'en' ? 'No data available.' : 'Tidak ada data.')}
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
