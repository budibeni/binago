import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Maximize, Minimize, Calendar, ChevronDown, RefreshCw, MapPin } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';
import { TrackingVehicle, DateRange } from '../../types/tracking';
import { TableFilterPopover } from '../shared/TableFilterPopover';
import { VehicleSelect } from '../shared/VehicleSelect';
import type { MockPlaybackData, MockPlaybackTrackPoint } from '../../data/mockTrackingData';

export interface PlaybackTableProps {
  modeSelector?: React.ReactNode;
  playbackData: MockPlaybackData | null;
  locale: 'id' | 'en';
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  selectedVehicleId: string | null;
  onVehicleChange: (id: string) => void;
  vehicles: TrackingVehicle[];
  onLoad: () => void;
  isLoading?: boolean;
}

function StatusBadge({ speed }: { speed: number }) {
  const isDriving = speed > 0;
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full shrink-0", isDriving ? "bg-emerald-500" : "bg-blue-500")} />
      <span className="text-sm font-medium truncate">{isDriving ? 'Berjalan' : 'Parkir'}</span>
    </div>
  );
}

export function PlaybackTable({
  modeSelector,
  playbackData,
  locale,
  dateRange,
  onDateRangeChange,
  selectedVehicleId,
  onVehicleChange,
  vehicles,
  onLoad,
  isLoading
}: PlaybackTableProps) {
  const t = getTranslation(locale);
  const tTracking = t.tracking;
  const [searchQuery, setSearchQuery] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const handleReset = () => {
    onVehicleChange('');
    onDateRangeChange({ startDate: '', endDate: '', startTime: '06:00', endTime: '18:00' });
  };

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

  const points = useMemo(() => playbackData?.points || [], [playbackData]);
  
  const filteredPoints = useMemo(() => {
    if (!searchQuery) return points;
    const q = searchQuery.toLowerCase();
    return points.filter((p) => {
      const addressMatch = p.address?.toLowerCase().includes(q) || false;
      const speedMatch = p.speed.toString().includes(q);
      return addressMatch || speedMatch;
    });
  }, [points, searchQuery]);

  const columns = useMemo<DataTableColumnDef<MockPlaybackTrackPoint>[]>(() => [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => <span className="text-foreground-muted">{row.index + 1}</span>,
      size: 60,
    },
    {
      accessorKey: 'timestamp',
      header: locale === 'en' ? 'Time' : 'Waktu',
      cell: ({ row }) => <span className="font-medium text-foreground">{formatDate(row.original.timestamp)}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge speed={row.original.speed} />,
    },
    {
      accessorKey: 'speed',
      header: locale === 'en' ? 'Speed (km/h)' : 'Kecepatan (km/j)',
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.speed}</span>,
    },
    {
      accessorKey: 'odometer',
      header: 'Odometer',
      cell: ({ row }) => <span className="text-foreground-muted">{row.original.odometer}</span>,
    },
    {
      accessorKey: 'address',
      header: locale === 'en' ? 'Location' : 'Lokasi',
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-1.5 text-foreground-muted group-hover:text-foreground transition-colors max-w-[300px] truncate" title={p.address}>
            <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate">{p.address || `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`}</span>
          </div>
        );
      },
    },
  ], [locale]);

  const toolbarActions = (
    <>
      {modeSelector}
      <TableFilterPopover locale={locale} onReset={handleReset}>
        {/* Vehicle Select */}
        <div>
          <label className="text-[11px] font-medium text-foreground-muted mb-1 block">
            {tTracking.playbackSelectVehicle || (locale === 'en' ? 'Select Vehicle' : 'Pilih Kendaraan')}
          </label>
          <VehicleSelect
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleChange={onVehicleChange}
            isLoading={isLoading}
            locale={locale}
          />
        </div>

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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
          </div>
        </div>

        {/* Load Button */}
        <button
          type="button"
          onClick={onLoad}
          disabled={!selectedVehicleId || !dateRange.startDate || !dateRange.endDate || isLoading}
          className="flex items-center justify-center h-8 w-full rounded-md bg-danger hover:bg-danger/90 text-danger-foreground disabled:opacity-50 transition-colors focus:outline-none focus:ring-1 focus:ring-danger font-medium text-[12px] mt-2 gap-2"
        >
          {isLoading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {tTracking.playbackLoading || (locale === 'en' ? 'Load Data' : 'Muat Data')}
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
          data={filteredPoints}
          searchable
          columnVisibility
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={locale === 'en' ? 'Search address...' : 'Cari lokasi...'}
          exportable
          exportFilename={`Playback_History_${new Date().toISOString().slice(0,10)}`}
          toolbarActions={toolbarActions}
          onRefresh={onLoad}
          isLoading={isLoading}
          emptyDescription={
            !playbackData ? (locale === 'en' ? 'Please load playback data first.' : 'Silakan muat data perjalanan terlebih dahulu.') :
            searchQuery ? (locale === 'en' ? 'No points match your search.' : 'Tidak ada titik yang cocok dengan pencarian.') : 
            (locale === 'en' ? 'No history data available.' : 'Data riwayat tidak tersedia.')
          }
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
