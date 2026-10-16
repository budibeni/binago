'use client';

import React, { useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  HelpCircle,
  ChevronDown,
  Compass,
  Wrench,
  Search,
  PlayCircle,
  RotateCcw,
  Map,
  Flame,
  Table,
  Bell,
  Clock,
  Truck,
  ListFilter,
  Scissors,
  CircleParking,
  Route,
  Gauge,
  UserCheck,
  MessageSquareText,
  ShieldAlert,
} from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@adatrack/ui';
import type { Locale } from '@adatrack/types';
import {
  useTour,
  useTrackingTour,
  getLiveTourSteps,
  getMapToolbarTourSteps,
  getSearchToolTourSteps,
  getVehicleOverviewTourSteps,
  getVehicleStatusFilterTourSteps,
  getPlaybackTourSteps,
  getPlaybackPlayerTourSteps,
  getPlaybackRouteCropTourSteps,
  getHeatmapTourSteps,
  getTableTourSteps,
  getTableModeSelectorTourSteps,
  getParkingTableTourSteps,
  getMileageTableTourSteps,
  getSpeedTableTourSteps,
  getActivityTourSteps,
  getDriverPortalOverviewTourSteps,
  getDriverPortalVehicleTourSteps,
  getDriverPortalAttendanceTourSteps,
  getDriverPortalHistoryTourSteps,
  getDriverPortalMessagesTourSteps,
  getEmergencyReportsOverviewTourSteps,
  getEmergencyReportsListTourSteps,
  getEmergencyReportsDetailTourSteps,
  getVehiclesOverviewTourSteps,
  getVehiclesFilterTourSteps,
  getVehiclesDetailTourSteps,
  getVehiclesFormTourSteps,
} from '@/components/tour';
import type { DriveStep } from 'driver.js';

export interface HeaderTourButtonProps {
  locale?: Locale;
  className?: string;
}

export function HeaderTourButton({ locale = 'id', className }: HeaderTourButtonProps) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const isEn = locale === 'en';
  const isTrackingPage = pathname === '/tracking' || pathname.startsWith('/tracking');
  const isVehiclesPage = pathname === '/vehicles' || pathname.startsWith('/vehicles');
  const isDriverPortalPage = pathname === '/portal/driver' || pathname.startsWith('/portal/driver');
  const isEmergencyReportsPage = pathname === '/activity/emergency-reports' || pathname.startsWith('/activity/emergency-reports');

  // Tracking dynamic state from context
  const trackingTour = useTrackingTour();
  const activeView = trackingTour?.trackingState.view ?? 'map';
  const activeMode = trackingTour?.trackingState.mode ?? 'live';

  // Step definitions
  const liveTourSteps = useMemo(() => getLiveTourSteps(locale), [locale]);
  const mapToolbarTourSteps = useMemo(() => getMapToolbarTourSteps(locale), [locale]);
  const searchToolTourSteps = useMemo(() => getSearchToolTourSteps(locale), [locale]);
  const vehicleOverviewTourSteps = useMemo(() => getVehicleOverviewTourSteps(locale), [locale]);
  const vehicleStatusFilterTourSteps = useMemo(() => getVehicleStatusFilterTourSteps(locale), [locale]);
  const playbackTourSteps = useMemo(() => getPlaybackTourSteps(locale), [locale]);
  const playbackPlayerTourSteps = useMemo(() => getPlaybackPlayerTourSteps(locale), [locale]);
  const playbackRouteCropTourSteps = useMemo(() => getPlaybackRouteCropTourSteps(locale), [locale]);
  const heatmapTourSteps = useMemo(() => getHeatmapTourSteps(locale), [locale]);
  const tableTourSteps = useMemo(() => getTableTourSteps(locale), [locale]);
  const tableModeSelectorTourSteps = useMemo(() => getTableModeSelectorTourSteps(locale), [locale]);
  const parkingTableTourSteps = useMemo(() => getParkingTableTourSteps(locale), [locale]);
  const mileageTableTourSteps = useMemo(() => getMileageTableTourSteps(locale), [locale]);
  const speedTableTourSteps = useMemo(() => getSpeedTableTourSteps(locale), [locale]);
  const activityTourSteps = useMemo(() => getActivityTourSteps(locale), [locale]);

  // Vehicles Step definitions
  const vehiclesOverviewTourSteps = useMemo(() => getVehiclesOverviewTourSteps(locale), [locale]);
  const vehiclesFilterTourSteps = useMemo(() => getVehiclesFilterTourSteps(locale), [locale]);
  const vehiclesDetailTourSteps = useMemo(() => getVehiclesDetailTourSteps(locale), [locale]);
  const vehiclesFormTourSteps = useMemo(() => getVehiclesFormTourSteps(locale), [locale]);

  // Driver Portal Step definitions
  const driverPortalOverviewSteps = useMemo(() => getDriverPortalOverviewTourSteps(locale), [locale]);
  const driverPortalVehicleSteps = useMemo(() => getDriverPortalVehicleTourSteps(locale), [locale]);
  const driverPortalAttendanceSteps = useMemo(() => getDriverPortalAttendanceTourSteps(locale), [locale]);
  const driverPortalHistorySteps = useMemo(() => getDriverPortalHistoryTourSteps(locale), [locale]);
  const driverPortalMessagesSteps = useMemo(() => getDriverPortalMessagesTourSteps(locale), [locale]);

  // Emergency Reports Step definitions
  const emergencyReportsOverviewSteps = useMemo(() => getEmergencyReportsOverviewTourSteps(locale), [locale]);
  const emergencyReportsListSteps = useMemo(() => getEmergencyReportsListTourSteps(locale), [locale]);
  const emergencyReportsDetailSteps = useMemo(() => getEmergencyReportsDetailTourSteps(locale), [locale]);

  // Active tour steps based on currently visible tab
  const currentDefaultSteps = useMemo(() => {
    if (isVehiclesPage) {
      return vehiclesOverviewTourSteps;
    }
    if (isEmergencyReportsPage) {
      return emergencyReportsOverviewSteps;
    }
    if (isDriverPortalPage) {
      return driverPortalOverviewSteps;
    }
    if (activeView === 'table') {
      if (activeMode === 'parking') return parkingTableTourSteps;
      if (activeMode === 'mileage') return mileageTableTourSteps;
      if (activeMode === 'speed') return speedTableTourSteps;
      return tableModeSelectorTourSteps;
    }
    if (activeView === 'notification') return activityTourSteps;
    if (activeMode === 'playback') return playbackTourSteps;
    if (activeMode === 'heatmap') return heatmapTourSteps;
    return liveTourSteps;
  }, [
    isVehiclesPage,
    vehiclesOverviewTourSteps,
    isEmergencyReportsPage,
    emergencyReportsOverviewSteps,
    isDriverPortalPage,
    driverPortalOverviewSteps,
    activeView,
    activeMode,
    tableModeSelectorTourSteps,
    parkingTableTourSteps,
    mileageTableTourSteps,
    speedTableTourSteps,
    activityTourSteps,
    playbackTourSteps,
    heatmapTourSteps,
    liveTourSteps,
  ]);

  // Base tour hook
  const { startTour, resetTour } = useTour({
    tourId: isVehiclesPage
      ? 'vehicles_overview'
      : isEmergencyReportsPage
      ? 'emergency_reports_overview'
      : isDriverPortalPage
      ? 'driver_portal_overview'
      : `tracking_${activeView}_${activeMode}`,
    steps: currentDefaultSteps,
    locale,
    autoStart: false,
  });

  // Action: Search Card tour
  const handleStartSearchTour = useCallback(() => {
    const isCardOpen = document.querySelector('#search-location-card');
    if (!isCardOpen) {
      const searchBtn = document.querySelector('#ctrl-search') as HTMLElement | null;
      if (searchBtn) {
        searchBtn.click();
      }
    }
    setTimeout(() => {
      startTour(searchToolTourSteps);
    }, 350);
  }, [searchToolTourSteps, startTour]);

  // Action: Vehicle Overview Panel Tour
  const handleStartVehicleOverviewTour = useCallback(() => {
    // Ensure live map mode & view
    if (activeMode !== 'live' || activeView !== 'map') {
      trackingTour?.setTrackingState({ mode: 'live', view: 'map' });
    }
    // Dispatch custom event to select a vehicle and reveal the overview panel
    window.dispatchEvent(new CustomEvent('adatrack:tour-select-vehicle'));
    setTimeout(() => {
      startTour(vehicleOverviewTourSteps);
    }, 350);
  }, [activeMode, activeView, trackingTour, startTour, vehicleOverviewTourSteps]);

  // Action: Vehicle Status Filter tabs tour
  const handleStartStatusFilterTour = useCallback(() => {
    // Ensure live map mode & view
    if (activeMode !== 'live' || activeView !== 'map') {
      trackingTour?.setTrackingState({ mode: 'live', view: 'map' });
    }
    // Expand vehicle list panel if collapsed
    const expandBtn = document.querySelector('#tracking-vehicle-list-expand-btn') as HTMLElement | null;
    if (expandBtn) {
      expandBtn.click();
    }
    setTimeout(() => {
      startTour(vehicleStatusFilterTourSteps);
    }, 300);
  }, [activeMode, activeView, trackingTour, startTour, vehicleStatusFilterTourSteps]);

  // Action: Playback Route Crop & Geofence Layer tour
  const handleStartPlaybackRouteCropTour = useCallback(() => {
    // Ensure playback mode & map view
    if (activeMode !== 'playback' || activeView !== 'map') {
      trackingTour?.setTrackingState({ mode: 'playback', view: 'map' });
    }
    // Trigger custom event to open crop mode and layer panel
    window.dispatchEvent(new CustomEvent('adatrack:tour-playback-route-crop'));
    setTimeout(() => {
      startTour(playbackRouteCropTourSteps);
    }, 350);
  }, [activeMode, activeView, trackingTour, startTour, playbackRouteCropTourSteps]);

  // Action: Table Mode Selector Tour
  const handleStartTableModeSelectorTour = useCallback(() => {
    if (activeView !== 'table') {
      trackingTour?.setView('table');
    }
    window.dispatchEvent(new CustomEvent('adatrack:tour-open-table-modes'));
    setTimeout(() => {
      startTour(tableModeSelectorTourSteps);
    }, 350);
  }, [activeView, trackingTour, startTour, tableModeSelectorTourSteps]);

  // Action: Switch table mode & start tour
  const handleStartSpecificTableTour = useCallback((targetMode: 'live' | 'playback' | 'parking' | 'mileage' | 'speed' | 'heatmap', steps: DriveStep[]) => {
    if (activeView !== 'table' || activeMode !== targetMode) {
      trackingTour?.setTrackingState({ view: 'table', mode: targetMode });
    }
    window.dispatchEvent(new CustomEvent('adatrack:tour-switch-table-mode', { detail: { mode: targetMode } }));
    setTimeout(() => {
      startTour(steps);
    }, 350);
  }, [activeView, activeMode, trackingTour, startTour]);

  // Contextual page badge label
  const contextBadgeLabel = useMemo(() => {
    if (isEmergencyReportsPage) {
      return isEn ? 'Emergency Reports' : 'Laporan Darurat';
    }
    if (isDriverPortalPage) {
      return isEn ? 'Driver Portal' : 'Portal Pengemudi';
    }
    if (!isTrackingPage) {
      if (pathname.startsWith('/vehicles')) return isEn ? 'Vehicles Module' : 'Modul Kendaraan';
      if (pathname.startsWith('/geofences')) return isEn ? 'Geofence Module' : 'Modul Geofence';
      if (pathname.startsWith('/routes')) return isEn ? 'Routes Module' : 'Modul Rute';
      if (pathname.startsWith('/activity')) return isEn ? 'Activity Module' : 'Modul Aktivitas';
      if (pathname.startsWith('/reports') || pathname.startsWith('/analytics')) return isEn ? 'Analytics Module' : 'Modul Laporan';
      return isEn ? 'ADATRACK System' : 'Sistem ADATRACK';
    }

    if (activeView === 'table') {
      if (activeMode === 'parking') return isEn ? 'Parking Table' : 'Tabel Parkir';
      if (activeMode === 'mileage') return isEn ? 'Mileage Table' : 'Tabel Jarak Tempuh';
      if (activeMode === 'speed') return isEn ? 'Speed Table' : 'Tabel Kecepatan';
      if (activeMode === 'playback') return isEn ? 'Playback Table' : 'Tabel Playback';
      if (activeMode === 'heatmap') return isEn ? 'Heatmap Table' : 'Tabel Heatmap';
      return isEn ? 'Live Table' : 'Tabel Live';
    }
    if (activeView === 'notification') {
      return isEn ? 'Activity Log' : 'Pusat Aktivitas';
    }

    // activeView === 'map'
    if (activeMode === 'playback') return isEn ? 'Playback Route' : 'Riwayat Rute';
    if (activeMode === 'heatmap') return isEn ? 'Heatmap Density' : 'Peta Kepadatan';
    return isEn ? 'Live Tracking' : 'Peta Langsung';
  }, [pathname, isTrackingPage, activeView, activeMode, isEn]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          id="header-tour-guide-btn"
          className={className}
          aria-label={isEn ? 'Interactive Guide' : 'Panduan Interaktif'}
          title={isEn ? 'Interactive Feature Guide' : 'Panduan Fitur Interaktif'}
          leftIcon={<HelpCircle className="h-4 w-4 text-foreground-muted" />}
        >
          <span className="text-xs font-normal hidden md:inline">
            {isEn ? 'Guide' : 'Panduan'}
          </span>
          <ChevronDown className="h-3 w-3 text-foreground-muted opacity-70 ml-0.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 p-1.5 bg-background dark:bg-neutral-900 border border-border shadow-xl rounded-xl z-[9999]"
      >
        {/* Header context badge */}
        <div className="flex items-center justify-between px-2.5 py-1.5">
          <span className="text-[10px] font-bold text-foreground-muted tracking-wider uppercase">
            {isEn ? 'Active Context' : 'Konteks Tampilan Aktif'}
          </span>
          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
            {contextBadgeLabel}
          </span>
        </div>

        <DropdownMenuSeparator className="my-1 bg-border" />

        {/* ── CONTEXT 1: TRACKING - MAP VIEW ── */}
        {isTrackingPage && activeView === 'map' && (
          <>
            {/* 1.A. MODE: LIVE */}
            {activeMode === 'live' && (
              <>
                <DropdownMenuItem
                  onClick={() => startTour(liveTourSteps)}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <Compass className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Live Map Overview Tour' : 'Tur Keseluruhan Peta Langsung'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? 'Real-time vehicles, status filters, & panels' : 'Kendaraan real-time, filter status, & panel'}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => startTour(mapToolbarTourSteps)}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <Wrench className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Map Toolbar & Tools' : 'Toolbar & Kontrol Peta'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? 'Basemaps, zoom, ruler, & layer controls' : 'Basemap, zoom, alat ukur, & layer'}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleStartSearchTour}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <Search className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Search & Vehicle Scanner Card' : 'Kartu Pencarian & Pemindai Kendaraan'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? '5 search modes, coordinates, & radius filter' : '5 mode cari, koordinat, radius, & hasil kendaraan'}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleStartStatusFilterTour}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <ListFilter className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Vehicle Status Filters' : 'Filter Status Kendaraan'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? 'Semua, Berjalan, Berhenti, Parkir, & Offline' : 'Semua, Berjalan, Berhenti, Parkir, & Offline'}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleStartVehicleOverviewTour}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <Truck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Vehicle Details & Telemetry Panel' : 'Detail & Telemetri Kendaraan'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? 'Select vehicle, quick actions, & 4 KPI telemetry cards' : 'Pilih kendaraan, aksi cepat, & 4 kartu metrik telemetri'}
                    </span>
                  </div>
                </DropdownMenuItem>
              </>
            )}

            {/* 1.B. MODE: PLAYBACK */}
            {activeMode === 'playback' && (
              <>
                <DropdownMenuItem
                  onClick={() => startTour(playbackTourSteps)}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <PlayCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Playback Route Tour' : 'Tur Riwayat Rute Playback'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? 'Route trail, stops (P), & query filters' : 'Jalur rute, titik henti (P), & filter tanggal'}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => startTour(playbackPlayerTourSteps)}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <Clock className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Player Bar & Timeline Scrubber' : 'Kontrol Pemutar & Linimasa Waktu'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? 'Play, pause, simulation speed, & scrub' : 'Play, pause, kecepatan simulasi, & slider waktu'}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleStartPlaybackRouteCropTour}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <Scissors className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Create Route & Geofence Layers' : 'Buat Rute & Layer Geofence'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? 'Trim trip route, traversed geofences, & matched routes' : 'Potong rute perjalanan, geofence terlewati, & rute terkait'}
                    </span>
                  </div>
                </DropdownMenuItem>
              </>
            )}

            {/* 1.C. MODE: HEATMAP */}
            {activeMode === 'heatmap' && (
              <>
                <DropdownMenuItem
                  onClick={() => startTour(heatmapTourSteps)}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
                >
                  <Flame className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-foreground">
                      {isEn ? 'Heatmap Density Tour' : 'Tur Peta Kepadatan (Heatmap)'}
                    </span>
                    <span className="text-[11px] text-foreground-muted leading-tight">
                      {isEn ? 'Density gradient, dates, & movement status' : 'Gradien kepadatan, tanggal, & status pergerakan'}
                    </span>
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}

        {/* ── CONTEXT 2: TRACKING - TABLE VIEW ── */}
        {isTrackingPage && activeView === 'table' && (
          <>
            <DropdownMenuItem
              onClick={handleStartTableModeSelectorTour}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <ListFilter className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Table Mode Selector (6 Options)' : 'Pilihan Mode Tabel (6 Opsi)'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Live, Playback, Heatmap, Parkir, Jarak Tempuh, & Kecepatan' : 'Live, Playback, Heatmap, Parkir, Jarak Tempuh, & Kecepatan'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleStartSpecificTableTour('live', tableTourSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Table className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Live Vehicle Data Table' : 'Tabel Live (Telemetri Kendaraan)'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Telemetry columns, status, speed, ACC, & export' : 'Kolom telemetri, status, kecepatan, ACC, & ekspor'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleStartSpecificTableTour('parking', parkingTableTourSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <CircleParking className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Parking Table Tour' : 'Tur Tabel Parkir'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Parking duration, stop locations, & date filters' : 'Durasi parkir, lokasi henti, & filter tanggal'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleStartSpecificTableTour('mileage', mileageTableTourSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Route className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Mileage Table Tour' : 'Tur Tabel Jarak Tempuh'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Accumulated distance (km) & odometer summaries' : 'Akumulasi jarak tempuh (km) & rekap odometer'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleStartSpecificTableTour('speed', speedTableTourSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Gauge className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Speed Table Tour' : 'Tur Tabel Kecepatan'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Average speed, top speed, & overspeed violations' : 'Kecepatan rata-rata, puncak, & pelanggaran batas'}
                </span>
              </div>
            </DropdownMenuItem>
          </>
        )}

        {/* ── CONTEXT 3: TRACKING - ACTIVITY / NOTIFICATION VIEW ── */}
        {isTrackingPage && activeView === 'notification' && (
          <>
            <DropdownMenuItem
              onClick={() => startTour(activityTourSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Bell className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Activity & Alert Center Tour' : 'Tur Pusat Aktivitas & Notifikasi'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Alarm feeds, event categories, & severity' : 'Riwayat alarm, kategori event, & urgensi'}
                </span>
              </div>
            </DropdownMenuItem>
          </>
        )}

        {/* ── CONTEXT: DRIVER PORTAL ── */}
        {isDriverPortalPage && (
          <>
            <DropdownMenuItem
              onClick={() => startTour(driverPortalOverviewSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Compass className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Driver Portal Overview Tour' : 'Tur Keseluruhan Portal Pengemudi'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Navigation dock, vehicles, attendance, & history' : 'Navigasi tab, kendaraan, presensi, & riwayat'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => startTour(driverPortalVehicleSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Truck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Find Vehicle & Navigation' : 'Temukan Kendaraan & Navigasi'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Vehicle location map, distance, specs, & SOS report' : 'Peta posisi, jarak jalan kaki, spesifikasi, & lapor SOS'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => startTour(driverPortalAttendanceSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <UserCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Driver GPS Attendance' : 'Presensi GPS Pengemudi'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Duty check-in, geofence pool, & arrival proof' : 'Mulai/selesai tugas, geofence pool, & tiba di tujuan'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => startTour(driverPortalHistorySteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Trip History & Timeline' : 'Riwayat & Linimasa Perjalanan'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Daily distance (KM), engine ON/OFF, & parking points' : 'Jarak harian (KM), mesin ON/OFF, & titik parkir'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => startTour(driverPortalMessagesSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <MessageSquareText className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Operational Messages' : 'Pesan & Pengumuman Operasional'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Service schedule alerts, speed limit notices, & bulletins' : 'Jadwal servis berkala, batas kecepatan, & pengumuman'}
                </span>
              </div>
            </DropdownMenuItem>
          </>
        )}

        {/* ── CONTEXT: EMERGENCY REPORTS ── */}
        {isEmergencyReportsPage && (
          <>
            <DropdownMenuItem
              onClick={() => startTour(emergencyReportsOverviewSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Compass className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Emergency Reports Overview Tour' : 'Tur Keseluruhan Laporan Darurat'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Master-detail layout, status tabs, & resolution workflow' : 'Tata letak master-detail, tab status, & alur penanganan'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => startTour(emergencyReportsListSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <ListFilter className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Queue & Category Filters' : 'Antrean & Filter Kategori'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Status tabs (Baru counter), search, & category filter' : 'Tab status (counter Baru), pencarian, & filter kategori'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => startTour(emergencyReportsDetailSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <ShieldAlert className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Detail & Action Resolution' : 'Detail & Tindakan Penanganan'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'GPS map links, driver notes, status update, & audit timeline' : 'Link peta GPS, keterangan driver, update status, & timeline'}
                </span>
              </div>
            </DropdownMenuItem>
          </>
        )}

        {/* ── CONTEXT: VEHICLES MODULE ── */}
        {isVehiclesPage && (
          <>
            <DropdownMenuItem
              onClick={() => startTour(vehiclesOverviewTourSteps)}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Compass className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Vehicles Overview Tour' : 'Tur Keseluruhan Kendaraan'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Master table, metrics, quick search, & pagination' : 'Tabel data master, metrik, pencarian cepat, & paginasi'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(new CustomEvent('adatrack:tour-open-filter'));
                setTimeout(() => startTour(vehiclesFilterTourSteps), 200);
              }}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <ListFilter className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Filter & Table Tools' : 'Filter & Alat Tabel'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Multi-status pills, group filters, column visibility, & export' : 'Pills multi-status, filter grup, visibilitas kolom, & ekspor'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(new CustomEvent('adatrack:tour-open-vehicle-detail'));
                setTimeout(() => startTour(vehiclesDetailTourSteps), 300);
              }}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Truck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Vehicle Detail & Remote Actions' : 'Detail Kendaraan & Aksi Remote'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Telemetry specs, efficiency score, GPS reboot, & immobilizer' : 'Spesifikasi telemetri, skor efisiensi, reboot GPS, & immobilizer'}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(new CustomEvent('adatrack:tour-open-vehicle-form'));
                setTimeout(() => startTour(vehiclesFormTourSteps), 300);
              }}
              className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <Wrench className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[12.5px] font-semibold text-foreground">
                  {isEn ? 'Add Vehicle Form' : 'Formulir Tambah Kendaraan'}
                </span>
                <span className="text-[11px] text-foreground-muted leading-tight">
                  {isEn ? 'Registration cards, engine specs, legal docs, & baseline data' : 'Kartu registrasi, spesifikasi mesin, dokumen legal, & data dasar'}
                </span>
              </div>
            </DropdownMenuItem>
          </>
        )}

        {/* ── CONTEXT 4: OTHER MODULES / PAGES ── */}
        {!isTrackingPage && !isDriverPortalPage && !isEmergencyReportsPage && !isVehiclesPage && (
          <>
            <div className="px-2.5 py-2 text-[12px] text-foreground-muted leading-relaxed">
              {isEn
                ? 'Interactive tours for this section are under preparation. You can explore the full interactive tour in the Vehicle Tracking module.'
                : 'Panduan interaktif mendalam untuk halaman ini sedang disiapkan. Anda dapat menjelajahi tur interaktif lengkap pada modul Pemantauan Kendaraan.'}
            </div>

            <DropdownMenuSeparator className="my-1 bg-border" />

            <DropdownMenuItem
              onClick={() => router.push('/tracking')}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface-elevated text-blue-600 dark:text-blue-400 font-semibold text-[12px] transition-colors"
            >
              <Map className="h-4 w-4 shrink-0" />
              <span>{isEn ? 'Go to Vehicle Tracking' : 'Buka Pemantauan Kendaraan'}</span>
            </DropdownMenuItem>
          </>
        )}

        {/* Restart Tour Option (Tracking views, Driver Portal, Emergency Reports, & Vehicles) */}
        {(isTrackingPage || isDriverPortalPage || isEmergencyReportsPage || isVehiclesPage) && (
          <>
            <DropdownMenuSeparator className="my-1 bg-border" />
            <DropdownMenuItem
              onClick={() => {
                resetTour();
                startTour(currentDefaultSteps);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-foreground-muted hover:text-foreground text-[11.5px] cursor-pointer hover:bg-surface transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 text-foreground-subtle" />
              <span>{isEn ? 'Restart Tour' : 'Mulai Ulang Panduan'}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
