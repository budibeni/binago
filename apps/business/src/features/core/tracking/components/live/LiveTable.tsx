import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import type { TrackingVehicle, VehicleStatus } from '../../types/tracking';
import { getTrackingTranslation } from '../../i18n';
import { getTranslation } from '@/i18n';
import { MapPin, Link, Maximize, Minimize, RefreshCw } from 'lucide-react';
import { DataTable, type DataTableColumnDef } from '@adatrack/ui';

export interface LiveTableProps {
  modeSelector?: React.ReactNode;
  vehicles: TrackingVehicle[];
  onVehicleSelect: (vehicleId: string) => void;
  locale: 'id' | 'en';
}

function StatusBadge({ status, label }: { status: VehicleStatus; label: string }) {
  const colorClass =
    status === 'driving' ? 'bg-emerald-500' :
      status === 'parking' ? 'bg-blue-500' :
        status === 'idle' ? 'bg-amber-500' :
          'bg-neutral-400 dark:bg-neutral-500';

  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", colorClass)} />
      <span className="text-[13px] text-foreground-muted truncate">{label}</span>
    </div>
  );
}

export function LiveTable({ modeSelector, vehicles, onVehicleSelect, locale }: LiveTableProps) {
  const t = getTranslation(locale);
  const tTracking = t.tracking;
  const tTrackingLocal = getTrackingTranslation(locale);

  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getStatusLabel = (status: VehicleStatus) => {
    switch (status) {
      case 'driving': return tTracking.statusDriving;
      case 'idle': return tTracking.statusIdle;
      case 'parking': return tTracking.statusParking;
      case 'offline': return tTracking.statusOffline;
      default: return status;
    }
  };

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
      accessorKey: 'plateNumber',
      header: tTrackingLocal.columns.vehicle,
      size: 140,
      cell: ({ row }) => (
        <span 
          className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors whitespace-nowrap" 
          onClick={() => onVehicleSelect(row.original.id)}
        >
          {row.original.plateNumber}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: tTrackingLocal.columns.status,
      size: 120,
      cell: ({ row }) => (
        <div onClick={() => onVehicleSelect(row.original.id)} className="cursor-pointer">
          <StatusBadge status={row.original.status} label={getStatusLabel(row.original.status)} />
        </div>
      ),
    },
    {
      accessorKey: 'speed',
      header: tTrackingLocal.columns.speed,
      size: 140,
      cell: ({ row }) => (
        <div className="font-medium text-foreground cursor-pointer tabular-nums" onClick={() => onVehicleSelect(row.original.id)}>
          {row.original.speed > 0 ? `${row.original.speed}` : '0'}
        </div>
      ),
    },
    {
      accessorKey: 'location.address',
      id: 'location',
      header: tTrackingLocal.columns.location,
      size: 250,
      cell: ({ row }) => {
        const v = row.original;
        const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${v.location.lat},${v.location.lng}`;
        return (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-foreground-muted hover:text-primary transition-colors cursor-pointer max-w-[220px] truncate"
            title={`${tTrackingLocal.columns.openMaps}: ${v.location.address}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin className="h-3 w-3 shrink-0 opacity-70" />
            <span className="truncate hover:underline">{v.location.address || `${v.location.lat.toFixed(4)}, ${v.location.lng.toFixed(4)}`}</span>
          </a>
        );
      }
    },
    {
      accessorKey: 'groupName',
      header: tTrackingLocal.columns.group,
      size: 120,
      cell: ({ row }) => (
        <div className="text-foreground-muted cursor-pointer whitespace-nowrap" onClick={() => onVehicleSelect(row.original.id)}>
          {row.original.groupName}
        </div>
      )
    },
    {
      accessorKey: 'lastUpdate',
      header: tTrackingLocal.columns.lastUpdate,
      size: 160,
      cell: ({ row }) => (
        <div className="text-[12px] text-foreground-muted whitespace-nowrap cursor-pointer tabular-nums" onClick={() => onVehicleSelect(row.original.id)}>
          {formatDate(row.original.lastUpdate)}
        </div>
      )
    },
    {
      id: 'quickActions',
      header: '',
      size: 40,
      enableSorting: false,
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div className="flex items-center justify-center">
            {v.isLocationShared && (
              <div 
                className="text-primary" 
                title={tTrackingLocal.columns.locationShared}
              >
                <Link className="h-3 w-3" />
              </div>
            )}
          </div>
        );
      }
    },
  ], [tTrackingLocal, onVehicleSelect]);

  const toolbarActions = (
    <>
      {modeSelector}
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
          exportFilename={`Fleet_Summary_${new Date().toISOString().slice(0, 10)}`}
          toolbarActions={toolbarActions}
          emptyDescription={searchQuery ? tTrackingLocal.messages.noVehicleFound : tTrackingLocal.messages.noData}
          onRefresh={handleRefresh}
          isLoading={isRefreshing}
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
