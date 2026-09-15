import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import type { TrackingVehicle, VehicleStatus } from '../../types/tracking';
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
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full shrink-0", colorClass)} />
      <span className="text-sm font-medium truncate">{label}</span>
    </div>
  );
}

export function LiveTable({ modeSelector, vehicles, onVehicleSelect, locale }: LiveTableProps) {
  const t = getTranslation(locale);
  const tTracking = t.tracking;

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
      header: locale === 'en' ? 'Vehicle' : 'Armada',
      cell: ({ row }) => (
        <div className="font-semibold text-foreground cursor-pointer" onClick={() => onVehicleSelect(row.original.id)}>
          {row.original.plateNumber}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div onClick={() => onVehicleSelect(row.original.id)} className="cursor-pointer">
          <StatusBadge status={row.original.status} label={getStatusLabel(row.original.status)} />
        </div>
      ),
    },
    {
      accessorKey: 'isLocationShared',
      header: locale === 'en' ? 'Share Location' : 'Bagikan Lokasi',
      cell: ({ row }) => (
        <div onClick={() => onVehicleSelect(row.original.id)} className="cursor-pointer">
          {row.original.isLocationShared ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium border border-primary/20">
              <Link className="h-3 w-3 shrink-0" />
              <span>{locale === 'en' ? 'Active' : 'Aktif'}</span>
            </div>
          ) : (
            <span className="text-[11px] text-foreground-muted/50">-</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'groupName',
      header: locale === 'en' ? 'Group' : 'Grup',
      cell: ({ row }) => (
        <div className="text-foreground-muted cursor-pointer" onClick={() => onVehicleSelect(row.original.id)}>
          {row.original.groupName}
        </div>
      )
    },
    {
      accessorKey: 'speed',
      header: locale === 'en' ? 'Speed (km/h)' : 'Kecepatan (km/j)',
      cell: ({ row }) => (
        <div className="font-medium text-foreground cursor-pointer" onClick={() => onVehicleSelect(row.original.id)}>
          {row.original.speed}
        </div>
      )
    },
    {
      accessorKey: 'location.address',
      id: 'location',
      header: locale === 'en' ? 'Location' : 'Lokasi',
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div
            className="flex items-center gap-1.5 text-foreground-muted group-hover:text-foreground transition-colors cursor-pointer max-w-[200px] truncate"
            title={v.location.address}
            onClick={() => onVehicleSelect(v.id)}
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate">{v.location.address || `${v.location.lat.toFixed(4)}, ${v.location.lng.toFixed(4)}`}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'lastUpdate',
      header: tTracking.overviewLastUpdate || (locale === 'en' ? 'Last Update' : 'Update Terakhir'),
      cell: ({ row }) => (
        <div className="text-[12px] text-foreground-muted whitespace-nowrap cursor-pointer" onClick={() => onVehicleSelect(row.original.id)}>
          {formatDate(row.original.lastUpdate)}
        </div>
      )
    },
  ], [locale, tTracking, onVehicleSelect]);

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
          searchPlaceholder={tTracking.searchPlaceholder || "Cari kendaraan..."}
          exportable
          exportFilename={`Realtime_Tracking_${new Date().toISOString().slice(0, 10)}`}
          toolbarActions={toolbarActions}
          emptyDescription={searchQuery ? (locale === 'en' ? 'No vehicle found matching your search.' : 'Tidak ada armada yang sesuai dengan pencarian.') : (locale === 'en' ? 'No data available.' : 'Tidak ada data.')}
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
