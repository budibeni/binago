import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@adatrack/utils';
import { getTranslation } from '@/i18n';
import { Search, Download, Maximize, Minimize, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
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
    link.download = `Parking_Summary_${new Date().toISOString().slice(0,10)}.csv`;
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

      {/* Card 2: Table, Search & Actions */}
      <div className="flex flex-col flex-1 min-h-0 bg-background border border-border rounded-lg overflow-hidden">
        {/* Toolbar for Table */}
        <div className="flex items-center justify-between p-2 shrink-0 bg-white dark:bg-neutral-900 border-b border-border">
          {/* Posisi Kiri: Search */}
          <div className="relative w-full max-w-[200px] sm:max-w-[250px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              placeholder={locale === 'en' ? 'Search vehicle...' : 'Cari armada...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-[12px] bg-neutral-100 dark:bg-neutral-800 border-transparent rounded-md text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-neutral-900 transition-all"
            />
          </div>

          {/* Posisi Kanan: Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-2.5 py-1.5 h-8 text-[12px] font-semibold rounded-md border border-border bg-white dark:bg-neutral-900 text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              title={locale === 'en' ? 'Export Excel' : 'Ekspor Excel'}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Excel</span>
            </button>
            <button
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
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap w-16 text-center">No</th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">{locale === 'en' ? 'Vehicle' : 'Armada'}</th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">{locale === 'en' ? 'Address' : 'Alamat'}</th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap">{locale === 'en' ? 'Geofence' : 'Geofence'}</th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap text-right">{locale === 'en' ? 'Duration' : 'Durasi Parkir'}</th>
                <th className="px-2.5 py-2 text-[12px] font-semibold text-foreground-muted whitespace-nowrap w-[80px] text-center">{locale === 'en' ? 'Action' : 'Aksi'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-foreground-muted">
                    {searchQuery
                      ? (locale === 'en' ? 'No vehicle found matching your search.' : 'Tidak ada armada yang sesuai dengan pencarian.')
                      : (locale === 'en' ? 'No data available.' : 'Tidak ada data.')}
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v, idx) => {
                  const dummyDurationMinutes = minDuration + Math.floor(Math.random() * 120);
                  const hours = Math.floor(dummyDurationMinutes / 60);
                  const mins = dummyDurationMinutes % 60;
                  const address = "Jl. Sudirman No. 45, Jakarta Pusat";
                  const geofence = Math.random() > 0.5 ? "Kantor Pusat" : "-";
                    
                  return (
                    <tr key={v.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-2.5 py-1.5 text-[13px] text-center text-foreground-muted">{idx + 1}</td>
                      <td className="px-2.5 py-1.5 text-[13px] font-semibold text-foreground">{v.plateNumber}</td>
                      <td className="px-2.5 py-1.5 text-[13px] text-foreground-muted truncate max-w-[200px] xl:max-w-[300px]" title={address}>
                        {address}
                      </td>
                      <td className="px-2.5 py-1.5 text-[13px] text-foreground-muted">
                        {geofence !== '-' ? <span className="inline-flex px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[11px] font-medium border border-blue-200 dark:border-blue-800">{geofence}</span> : '-'}
                      </td>
                      <td className="px-2.5 py-1.5 text-[13px] text-right font-medium text-amber-600 dark:text-amber-500">
                        {hours > 0 ? `${hours}j ${mins}m` : `${mins}m`}
                      </td>
                      <td className="px-2.5 py-1.5 text-[13px] text-center">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=-6.200000,106.816666`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-blue-600 dark:text-blue-400 transition-colors"
                          title="Buka di Google Maps"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
