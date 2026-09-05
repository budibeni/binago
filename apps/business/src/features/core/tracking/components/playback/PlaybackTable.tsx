import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Search, Download, Maximize, Minimize, Calendar, ChevronDown, RefreshCw, MapPin } from 'lucide-react';
import type { MockPlaybackData } from '../../data/mockTrackingData';
import type { TrackingVehicle, DateRange } from '../../types/tracking';

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
      <div className={cn("h-2 w-2 rounded-full", isDriving ? "bg-emerald-500" : "bg-blue-500")} />
      <span className="text-sm font-medium">{isDriving ? 'Berjalan' : 'Parkir'}</span>
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

  const points = playbackData?.points || [];
  
  const filteredPoints = points.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const addressMatch = p.address?.toLowerCase().includes(q) || false;
    const speedMatch = p.speed.toString().includes(q);
    return addressMatch || speedMatch;
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
      'No',
      locale === 'en' ? 'Time' : 'Waktu',
      'Status',
      locale === 'en' ? 'Speed (km/h)' : 'Kecepatan (km/j)',
      'Odometer',
      locale === 'en' ? 'Location' : 'Lokasi'
    ];

    const toCsvCell = (val: string | number | boolean) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const dataRows = filteredPoints.map((p, idx) => {
      return [
        idx + 1,
        toCsvCell(formatDate(p.timestamp)),
        toCsvCell(p.speed > 0 ? 'Berjalan' : 'Parkir'),
        toCsvCell(p.speed),
        toCsvCell(p.odometer),
        toCsvCell(p.address || `${p.lat}, ${p.lng}`),
      ].join(',');
    });

    const csvContent = [headers.map(toCsvCell).join(','), ...dataRows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Playback_History_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={tableContainerRef} className="flex flex-col flex-1 min-h-0 w-full px-1.5 sm:px-2 pb-1.5 sm:pb-2 gap-2 mt-3">
      {/* Card 1: Mode Selector & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between p-2 shrink-0 bg-background border border-border rounded-lg gap-2">

          {/* Posisi Kiri: Mode Selector */}
          {modeSelector && (
            <div className="flex items-center shrink-0 w-full xl:w-auto">
              {modeSelector}
            </div>
          )}

          {/* Posisi Kanan: Search, Filters & Action Buttons */}
          <div className="flex flex-wrap items-center justify-start xl:justify-end gap-3 w-full xl:w-auto">
             {/* Vehicle Select */}
             <div className="relative w-[160px] shrink-0">
               <select
                 value={selectedVehicleId || ''}
                 onChange={(e) => onVehicleChange(e.target.value)}
                 disabled={isLoading}
                 className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all appearance-none cursor-pointer"
               >
                 <option value="" disabled>{tTracking.playbackSelectVehicle}</option>
                 {vehicles.map((v) => (
                   <option key={v.id} value={v.id}>{v.plateNumber}</option>
                 ))}
               </select>
               <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
             </div>

             {/* Start Date */}
             <div className="relative w-[120px] shrink-0">
               <input
                 type="date"
                 className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-2.5 pr-7 text-[12px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                 value={dateRange.startDate}
                 onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
                 disabled={isLoading}
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
                 disabled={isLoading}
               />
               <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
             </div>

             {/* Load Button */}
             <button
               type="button"
               onClick={onLoad}
               disabled={!selectedVehicleId || !dateRange.startDate || !dateRange.endDate || isLoading}
               className="flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
               title={tTracking.playbackLoading}
             >
               <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
             </button>

           </div>
        </div>

      {/* Card 2: Table, Search & Actions */}
      <div className="flex flex-col flex-1 min-h-0 bg-background border border-border rounded-lg overflow-hidden">
        {/* Toolbar for Table */}
        <div className="flex items-center justify-between p-2 shrink-0 bg-white dark:bg-neutral-900 border-b border-border">
          {/* Posisi Kiri: Search */}
          <div className="relative flex items-center gap-2">
             {/* Search */}
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <input
                  type="text"
                  placeholder={locale === 'en' ? 'Search address...' : 'Cari lokasi...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 sm:w-64 pl-9 pr-3 py-1 h-8 text-[13px] rounded-md border border-border bg-[#fafafa] dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
             </div>
          </div>

          {/* Posisi Kanan: Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={!playbackData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 h-8 text-[12px] font-semibold rounded-md border border-border bg-white dark:bg-neutral-900 text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              title={locale === 'en' ? 'Export Excel' : 'Ekspor Excel'}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-white dark:bg-neutral-900 text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              title={isFullscreen ? (locale === 'en' ? 'Exit Fullscreen' : 'Keluar Layar Penuh') : (locale === 'en' ? 'Fullscreen' : 'Layar Penuh')}
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
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap w-16">
                  No
                </th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Time' : 'Waktu'}
                </th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">
                  Status
                </th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Speed (km/h)' : 'Kecepatan (km/j)'}
                </th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">
                  Odometer
                </th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Location' : 'Lokasi'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {!playbackData ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground-muted text-sm">
                    {locale === 'en' ? 'Please load playback data first.' : 'Silakan muat data perjalanan terlebih dahulu.'}
                  </td>
                </tr>
              ) : filteredPoints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground-muted text-sm">
                    {searchQuery
                      ? (locale === 'en' ? 'No points match your search.' : 'Tidak ada titik yang cocok dengan pencarian.')
                      : (locale === 'en' ? 'No history data available.' : 'Data riwayat tidak tersedia.')}
                  </td>
                </tr>
              ) : (
                filteredPoints.map((p, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-2.5 py-1.5 text-[13px] text-foreground-muted">
                      {idx + 1}
                    </td>
                    <td className="px-2.5 py-1.5 text-[13px] font-medium text-foreground">
                      {formatDate(p.timestamp)}
                    </td>
                    <td className="px-2.5 py-1.5 text-[13px]">
                      <StatusBadge speed={p.speed} />
                    </td>
                    <td className="px-2.5 py-1.5 text-[13px]">
                      <div className="font-medium text-foreground">{p.speed}</div>
                    </td>
                    <td className="px-2.5 py-1.5 text-[13px] text-foreground-muted">
                      {p.odometer}
                    </td>
                    <td className="px-2.5 py-1.5 text-[13px] max-w-[300px] truncate" title={p.address}>
                      <div className="flex items-center gap-1.5 text-foreground-muted group-hover:text-foreground transition-colors">
                        <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{p.address || `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`}</span>
                      </div>
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
