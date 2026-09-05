import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Search, Download, Maximize, Minimize, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
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
      'No',
      'Plat Nomor',
      locale === 'en' ? 'Driver' : 'Pengemudi',
      locale === 'en' ? 'Group' : 'Grup',
      'Tipe Kendaraan',
    ];

    const toCsvCell = (val: string | number | boolean) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const dataRows = filteredVehicles.map((v, idx) => {
      return [
        idx + 1,
        toCsvCell(v.plateNumber),
        toCsvCell(v.driverName || '-'),
        toCsvCell(v.groupName),
        toCsvCell(v.vehicleType || '-'),
      ].join(',');
    });

    const csvContent = [headers.map(toCsvCell).join(','), ...dataRows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Heatmap_Summary_${new Date().toISOString().slice(0,10)}.csv`;
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
                  placeholder={tTracking.searchPlaceholder || "Cari kendaraan..."}
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 h-8 text-[12px] font-semibold rounded-md border border-border bg-white dark:bg-neutral-900 text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
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
                  {locale === 'en' ? 'Vehicle' : 'Armada'}
                </th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Group' : 'Grup'}
                </th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">
                  {locale === 'en' ? 'Vehicle Type' : 'Tipe Kendaraan'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-foreground-muted text-sm">
                    {searchQuery
                      ? (locale === 'en' ? 'No vehicles match your search.' : 'Tidak ada kendaraan yang cocok dengan pencarian.')
                      : (tTracking.emptyDescription || 'Tidak ada kendaraan.')}
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v, idx) => (
                  <tr
                    key={v.id}
                    className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-2.5 py-1.5 text-[13px] text-foreground-muted">
                      {idx + 1}
                    </td>
                    <td className="px-2.5 py-1.5 text-[13px]">
                      <div className="font-semibold text-foreground">{v.plateNumber}</div>
                    </td>
                    <td className="px-2.5 py-1.5 text-[13px] text-foreground-muted">
                      {v.groupName}
                    </td>
                    <td className="px-2.5 py-1.5 text-[13px] text-foreground-muted">
                      {v.vehicleType || '-'}
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
