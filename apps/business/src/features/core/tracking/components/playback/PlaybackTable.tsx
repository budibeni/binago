import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Maximize, Minimize, Calendar, ChevronDown, RefreshCw, MapPin } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';
import { TrackingVehicle, DateRange } from '../../types/tracking';
import { TableFilterPopover } from '../shared/TableFilterPopover';
import { VehicleSelect } from '../shared/VehicleSelect';
import { getTrackingTranslation } from '../../i18n';
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
    <div className="flex items-center gap-1.5">
      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", isDriving ? "bg-emerald-500" : "bg-blue-500")} />
      <span className="text-[13px] text-foreground-muted truncate">{isDriving ? 'Berjalan' : 'Parkir'}</span>
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
  const tTrackingLocal = getTrackingTranslation(locale);
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
      header: tTrackingLocal.columns.time || 'Waktu',
      size: 160,
      cell: ({ row }) => {
        const d = new Date(row.original.timestamp);
        return <span className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer tabular-nums">{formatDate(d.toISOString())}</span>;
      }
    },
    {
      accessorKey: 'speed',
      header: tTrackingLocal.columns.speed,
      size: 120,
      cell: ({ row }) => <span className="font-medium text-foreground tabular-nums">{row.original.speed > 0 ? `${Math.round(row.original.speed)}` : '0'}</span>,
    },
    {
      id: 'status',
      header: tTrackingLocal.columns.status,
      size: 120,
      cell: ({ row }) => <StatusBadge speed={row.original.speed} />
    },
    {
      accessorKey: 'odometer',
      header: 'Odometer',
      size: 130,
      cell: ({ row }) => <span className="text-foreground-muted tabular-nums">{row.original.odometer}</span>,
    },
    {
      id: 'address',
      header: tTrackingLocal.columns.address,
      size: 300,
      cell: ({ row }) => {
        const p = row.original;
        const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
        return (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-foreground-muted hover:text-primary transition-colors cursor-pointer max-w-[280px] truncate"
            title={`${tTrackingLocal.columns.openMaps}: ${p.address}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin className="h-3 w-3 shrink-0 opacity-70" />
            <span className="truncate hover:underline">{p.address || `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`}</span>
          </a>
        );
      },
    },
  ], [tTracking, tTrackingLocal]);

  const toolbarActions = (
    <>
      {modeSelector}
      <TableFilterPopover locale={locale} onReset={handleReset}>
        {/* Vehicle Select */}
        <div>
          <label className="text-[11px] font-medium text-foreground-muted mb-1 block">
            {tTrackingLocal.messages.selectVehicle}
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
            {tTrackingLocal.filters.startDate}
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
            {tTrackingLocal.filters.endDate}
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
          data={filteredPoints}
          searchable
          columnVisibility
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={tTrackingLocal.messages.searchAddress}
          exportable
          exportFilename={`Playback_Summary_${new Date().toISOString().slice(0,10)}`}
          toolbarActions={toolbarActions}
          onRefresh={onLoad}
          isLoading={isLoading}
          emptyTitle={tTracking.playbackNoVehicle || 'Playback'}
          emptyDescription={
            !playbackData ? tTrackingLocal.messages.loadPlaybackFirst :
            searchQuery ? tTrackingLocal.messages.noPointsMatch : 
            tTrackingLocal.messages.noHistoryData
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
