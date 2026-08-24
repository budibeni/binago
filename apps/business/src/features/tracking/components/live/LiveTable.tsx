import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@adatrack/utils';
import type { TrackingVehicle, VehicleStatus } from '../../types/tracking';
import { getTranslation } from '@/i18n';
import { MapPin, Search, Link, Download, Maximize, Minimize } from 'lucide-react';

export interface LiveTableProps {
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
      <div className={cn("h-2 w-2 rounded-full", colorClass)} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function LiveTable({ vehicles, onVehicleSelect, locale }: LiveTableProps) {
  const t = getTranslation(locale);
  const tTracking = t.tracking;

  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredVehicles = vehicles.filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.plateNumber.toLowerCase().includes(q) ||
      (v.driverName || '').toLowerCase().includes(q) ||
      v.groupName.toLowerCase().includes(q)
    );
  });

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

  const handleExportExcel = () => {
    const headers = [
      'ID',
      locale === 'en' ? 'Driver' : 'Pengemudi',
      'Status',
      locale === 'en' ? 'Share Location' : 'Bagikan Lokasi',
      locale === 'en' ? 'Group' : 'Grup',
      locale === 'en' ? 'Speed (km/h)' : 'Kecepatan (km/j)',
      locale === 'en' ? 'Location' : 'Lokasi',
      tTracking.overviewLastUpdate || (locale === 'en' ? 'Last Update' : 'Update Terakhir')
    ];

    const toCsvCell = (val: string | number | boolean) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const dataRows = filteredVehicles.map(v => {
      return [
        toCsvCell(v.plateNumber),
        toCsvCell(v.driverName || '-'),
        toCsvCell(getStatusLabel(v.status)),
        toCsvCell(v.isLocationShared ? (locale === 'en' ? 'Active' : 'Aktif') : '-'),
        toCsvCell(v.groupName),
        toCsvCell(v.speed),
        toCsvCell(v.location.address || `${v.location.lat}, ${v.location.lng}`),
        toCsvCell(formatDate(v.lastUpdate))
      ].join(',');
    });

    const csvContent = [headers.map(toCsvCell).join(','), ...dataRows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Realtime_Tracking_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={tableContainerRef} className="flex flex-col flex-1 min-h-0 w-full bg-surface p-3 sm:p-4">
      <div className="flex flex-col flex-1 min-h-0 bg-background border border-border rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 shrink-0 bg-white dark:bg-neutral-900 border-b border-border">
          {/* Posisi Kiri: Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <input
              type="text"
              placeholder={tTracking.searchPlaceholder || "Cari kendaraan..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-4 py-1.5 text-sm rounded-md border border-border bg-[#fafafa] dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Posisi Kanan: Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-border bg-white dark:bg-neutral-900 text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              title="Download Excel / CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-white dark:bg-neutral-900 text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-800/80 backdrop-blur-sm border-b border-border z-10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-foreground-muted whitespace-nowrap">
                  ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground-muted whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Share Location' : 'Bagikan Lokasi'}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Group' : 'Grup'}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Speed (km/h)' : 'Kecepatan (km/j)'}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Location' : 'Lokasi'}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-foreground-muted whitespace-nowrap">
                  {tTracking.overviewLastUpdate || (locale === 'en' ? 'Last Update' : 'Update Terakhir')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-foreground-muted text-sm">
                    {searchQuery
                      ? (locale === 'en' ? 'No vehicles match your search.' : 'Tidak ada kendaraan yang cocok dengan pencarian.')
                      : (tTracking.emptyDescription || 'Tidak ada kendaraan.')}
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => onVehicleSelect(v.id)}
                    className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="font-semibold text-foreground">{v.plateNumber}</div>
                      <div className="text-xs text-foreground-muted">{v.driverName || tTracking.noDriver}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <StatusBadge status={v.status} label={getStatusLabel(v.status)} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {v.isLocationShared ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                          <Link className="h-3 w-3" />
                          <span>{locale === 'en' ? 'Active' : 'Aktif'}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-foreground-muted/50">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground-muted">
                      {v.groupName}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-foreground">{v.speed}</div>
                    </td>
                    <td className="px-4 py-3 text-sm max-w-[200px] truncate" title={v.location.address}>
                      <div className="flex items-center gap-1.5 text-foreground-muted group-hover:text-foreground transition-colors">
                        <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{v.location.address || `${v.location.lat.toFixed(4)}, ${v.location.lng.toFixed(4)}`}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground-muted whitespace-nowrap">
                      {formatDate(v.lastUpdate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
