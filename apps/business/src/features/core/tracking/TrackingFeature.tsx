'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Map, History, ChevronLeft, Filter, Activity, MapPin } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { VehicleList } from './components/shared/VehicleList';
import { LiveMap } from './components/live/LiveMap';
import { PlaybackMap } from './components/playback/PlaybackMap';
import { PlaybackPanel } from './components/playback/PlaybackPanel';
import { PlaybackMapLayerPanel } from './components/playback/PlaybackMapLayerPanel';
import { PlaybackTable } from './components/playback/PlaybackTable';
import { HeatmapMap } from './components/heatmap/HeatmapMap';
import { HeatmapPanel } from './components/heatmap/HeatmapPanel';
import { HeatmapTable } from './components/heatmap/HeatmapTable';
import { ParkingTable } from './components/parking/ParkingTable';
import { MileageTable } from './components/mileage/MileageTable';
import { SpeedTable } from './components/speed/SpeedTable';
import { VehicleOverviewPanel } from './components/shared/VehicleOverviewPanel';
import { TableModeSelector } from './components/shared/TableModeSelector';
import { LiveTable } from './components/live/LiveTable';
import { TrackingNotificationPanel } from './components/activity/TrackingNotificationPanel';
import { trackingService } from '@/data/services/trackingService';
import { geofenceService, routeService } from '@/data/services';
import {
  detectTraversedGeofenceIds,
  detectSimilarRoutes,
  isPointInGeofence,
  findGeofenceForCoordinate,
} from './utils/playbackLayerMatcher';
import { trackingNavigationService } from './services/trackingNavigationService';
import type { MockPlaybackData, MockPlaybackTrackPoint } from './data/mockTrackingData';
import type { Route, RouteLocation, RouteStop } from '@/features/core/routes/types';
import { getTranslation } from '../../../i18n';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getTrackingTranslation } from './i18n';
import type { StatusFilter, DateRange, PlaybackState, TrackingView } from './types/tracking';
import type { Locale } from '@adatrack/types';

function downsamplePoints(pts: MockPlaybackTrackPoint[], maxPoints = 120): MockPlaybackTrackPoint[] {
  if (pts.length <= maxPoints) return pts;
  const step = (pts.length - 1) / (maxPoints - 1);
  const result: MockPlaybackTrackPoint[] = [];
  for (let i = 0; i < maxPoints - 1; i++) {
    result.push(pts[Math.round(i * step)]);
  }
  result.push(pts[pts.length - 1]);
  return result;
}

// â"€â"€â"€ Mode â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

type TrackingMode = 'live' | 'playback' | 'heatmap' | 'parking' | 'mileage' | 'speed';

// â"€â"€â"€ TrackingFeature â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

interface TrackingFeatureProps {
  locale?: Locale;
}

export function TrackingFeature({ locale: localeProp }: TrackingFeatureProps) {
  const router = useRouter();
  const contextLocale = useBusinessLocale();
  const locale = localeProp ?? contextLocale ?? 'id';
  const t = getTranslation(locale);
  const tTracking = t.tracking;
  const tTrackingLocal = getTrackingTranslation(locale);

  // â"€â"€ Mode â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const [mode, setMode] = React.useState<TrackingMode>('live');
  const [view, setView] = React.useState<TrackingView>('map');

  // â"€â"€ VehicleList state â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = React.useState<string[]>([]);
  const [isVehicleListVisible, setIsVehicleListVisible] = React.useState(true);

  // -- Map Layer state --
  const [selectedGeofenceIds, setSelectedGeofenceIds] = React.useState<string[]>([]);
  const [selectedRouteIds, setSelectedRouteIds] = React.useState<string[]>([]);
  const [isMapLayerPanelVisible, setIsMapLayerPanelVisible] = React.useState(true);

  // -- Route Crop Mode state (Inline toolbar on top of playback player panel) --
  const [isRouteCropMode, setIsRouteCropMode] = React.useState(false);
  const [cropStartIndex, setCropStartIndex] = React.useState(0);
  const [cropEndIndex, setCropEndIndex] = React.useState(0);

  // â"€â"€ Playback state â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const [playbackVehicleId, setPlaybackVehicleId] = React.useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: new Date().toISOString().slice(0, 10),
    startTime: '06:00',
    endDate: new Date().toISOString().slice(0, 10),
    endTime: '18:00',
  });
  const [playbackState, setPlaybackState] = React.useState<PlaybackState>({
    status: 'idle',
    totalDuration: 0,
    currentTime: 0,
  });
  const [playbackData, setPlaybackData] = React.useState<MockPlaybackData | null>(null);
  const [playbackPointIndex, setPlaybackPointIndex] = React.useState(0);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1);

  // --- Timer ref ------------------------------------------------------------------------------
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const playbackDataRef = React.useRef<MockPlaybackData | null>(null);
  const playbackSpeedRef = React.useRef(1);

  // ─── Heatmap state ──────────────────────────────────────────────────────────
  const [heatmapStatusFilter, setHeatmapStatusFilter] = React.useState<'driving' | 'idle' | 'parking'>('driving');
  const [heatmapDateRange, setHeatmapDateRange] = React.useState<DateRange>({
    startDate: new Date().toISOString().slice(0, 10),
    startTime: '00:00',
    endDate: new Date().toISOString().slice(0, 10),
    endTime: '23:59',
  });
  const [isGeneratingHeatmap, setIsGeneratingHeatmap] = React.useState(false);

  const handleGenerateHeatmap = React.useCallback(() => {
    setIsGeneratingHeatmap(true);
    setTimeout(() => {
      setIsGeneratingHeatmap(false);
    }, 1200);
  }, []);

  // ─── Parking state ──────────────────────────────────────────────────────────
  const [parkingMinDuration, setParkingMinDuration] = React.useState<number>(15);
  const [parkingDateRange, setParkingDateRange] = React.useState<DateRange>({
    startDate: new Date().toISOString().slice(0, 10),
    startTime: '00:00',
    endDate: new Date().toISOString().slice(0, 10),
    endTime: '23:59',
  });
  const [isGeneratingParking, setIsGeneratingParking] = React.useState(false);

  const handleGenerateParking = React.useCallback(() => {
    setIsGeneratingParking(true);
    setTimeout(() => {
      setIsGeneratingParking(false);
    }, 1000);
  }, []);

  // ─── Mileage state ──────────────────────────────────────────────────────────
  const [mileageDateRange, setMileageDateRange] = React.useState<DateRange>({
    startDate: new Date().toISOString().slice(0, 10),
    startTime: '00:00',
    endDate: new Date().toISOString().slice(0, 10),
    endTime: '23:59',
  });
  const [isGeneratingMileage, setIsGeneratingMileage] = React.useState(false);

  const handleGenerateMileage = React.useCallback(() => {
    setIsGeneratingMileage(true);
    setTimeout(() => {
      setIsGeneratingMileage(false);
    }, 1000);
  }, []);

  // ─── Speed state ────────────────────────────────────────────────────────────
  const [speedDateRange, setSpeedDateRange] = React.useState<DateRange>({
    startDate: new Date().toISOString().slice(0, 10),
    startTime: '00:00',
    endDate: new Date().toISOString().slice(0, 10),
    endTime: '23:59',
  });
  const [isGeneratingSpeed, setIsGeneratingSpeed] = React.useState(false);

  const handleGenerateSpeed = React.useCallback(() => {
    setIsGeneratingSpeed(true);
    setTimeout(() => {
      setIsGeneratingSpeed(false);
    }, 1000);
  }, []);

  // -- Ref to track pending URL-param auto-load (vehicle id + start datetime) --
  const pendingAutoLoadRef = React.useRef<{ vehicleId: string; startDate: Date } | null>(null);
  const initializedRef = React.useRef(false);

  // -- Initialize from Navigation State (sessionStorage) --
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initializedRef.current) return;
    
    const navState = trackingNavigationService.getState();
    if (!navState) {
      // Default: no state, show all live vehicles
      if (selectedVehicleIds.length === 0) {
        setSelectedVehicleIds(trackingService.getLiveVehicles().map((v) => v.id));
      }
      return;
    }

    initializedRef.current = true;

    setMode(navState.mode || 'live');

    if (navState.vehicleIds && navState.vehicleIds.length > 0) {
      setSelectedVehicleIds(navState.vehicleIds);
    } else {
      setSelectedVehicleIds(trackingService.getLiveVehicles().map((v) => v.id));
    }

    const vId = navState.vehicleId;
    const startStr = navState.start;
    const endStr = navState.end;

    if (navState.mode === 'playback' && vId && startStr) {
      const startDate = new Date(startStr);
      const endDate = endStr ? new Date(endStr) : new Date();

      setPlaybackVehicleId(vId);
      setDateRange({
        startDate: startDate.toISOString().slice(0, 10),
        startTime: startDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        endDate: endDate.toISOString().slice(0, 10),
        endTime: endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      });

      // Store pending auto-load so handleLoadHistory can pick it up after vehicleId state is set
      pendingAutoLoadRef.current = { vehicleId: vId, startDate };
    } else if (navState.mode === 'live' && vId) {
      // Live mode single vehicle auto-select
      setSelectedVehicleIds([vId]);
      setSelectedVehicleId(vId);
    } else if (navState.mode === 'heatmap') {
      // Heatmap defaults if needed
    }

    // Clear state so hard reloads revert to default, but use timeout to avoid Strict Mode double-effect bugs
    setTimeout(() => {
      trackingNavigationService.clearState();
    }, 100);
  }, []);

  // Keep refs in sync
  React.useEffect(() => { playbackDataRef.current = playbackData; }, [playbackData]);
  React.useEffect(() => { playbackSpeedRef.current = playbackSpeed; }, [playbackSpeed]);

  // --- Computed ----------------------------------------------------------------
  const allVehiclesUnfiltered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return trackingService.getLiveVehicles().filter((v) => {
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;
      const matchSearch =
        !q ||
        v.plateNumber.toLowerCase().includes(q) ||
        v.groupName.toLowerCase().includes(q) ||
        (v.driverName?.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter]);

  // -- Playback derived state --------------------------------------------------
  const playbackTrack = React.useMemo(() => {
    if (!playbackData) return undefined;
    return playbackData.points.map(p => ({ lat: p.lat, lng: p.lng }));
  }, [playbackData]);

  const playbackPassedTrack = React.useMemo(() => {
    if (!playbackTrack || playbackPointIndex < 0) return undefined;
    return playbackTrack.slice(0, playbackPointIndex + 1);
  }, [playbackTrack, playbackPointIndex]);

  // -- Route Crop Track & Metrics (Segmen kuning yang sedang dipotong) ---------
  const cropTrack = React.useMemo(() => {
    if (!playbackData?.points || playbackData.points.length === 0) return undefined;
    const s = Math.max(0, Math.min(cropStartIndex, playbackData.points.length - 1));
    const e = Math.max(s, Math.min(cropEndIndex, playbackData.points.length - 1));
    const trackSlice = playbackData.points.slice(s, e + 1).map(p => ({ lat: p.lat, lng: p.lng }));
    console.log('[TrackingFeature] cropTrack calc:', {
      cropStartIndex,
      cropEndIndex,
      s,
      e,
      sliceLen: trackSlice.length,
      startPt: trackSlice[0],
      endPt: trackSlice[trackSlice.length - 1]
    });
    return trackSlice;
  }, [playbackData, cropStartIndex, cropEndIndex]);

  const { cropDistanceKm, cropDurationSecs, cropStartLabel, cropEndLabel, cropStartTimestamp, cropEndTimestamp } = React.useMemo(() => {
    if (!playbackData?.points || playbackData.points.length === 0) {
      return { cropDistanceKm: 0, cropDurationSecs: 0, cropStartLabel: '', cropEndLabel: '', cropStartTimestamp: '', cropEndTimestamp: '' };
    }
    const s = Math.max(0, Math.min(cropStartIndex, playbackData.points.length - 1));
    const e = Math.max(s, Math.min(cropEndIndex, playbackData.points.length - 1));
    const startPt = playbackData.points[s];
    const endPt = playbackData.points[e];
    if (!startPt || !endPt) {
      return { cropDistanceKm: 0, cropDurationSecs: 0, cropStartLabel: '', cropEndLabel: '', cropStartTimestamp: '', cropEndTimestamp: '' };
    }

    const dist = Math.max(0, Math.round((endPt.odometer - startPt.odometer) * 10) / 10);
    const dur = Math.max(0, (e - s) * 15);

    const allGeofences = geofenceService.getGeofences();
    const startGf = findGeofenceForCoordinate({ lat: startPt.lat, lng: startPt.lng }, allGeofences);
    const endGf = findGeofenceForCoordinate({ lat: endPt.lat, lng: endPt.lng }, allGeofences);

    const sLabel = startGf?.name || startPt.timestamp.slice(11, 16);
    const eLabel = endGf?.name || endPt.timestamp.slice(11, 16);

    return {
      cropDistanceKm: dist,
      cropDurationSecs: dur,
      cropStartLabel: sLabel,
      cropEndLabel: eLabel,
      cropStartTimestamp: startPt.timestamp,
      cropEndTimestamp: endPt.timestamp,
    };
  }, [playbackData, cropStartIndex, cropEndIndex]);

  const playbackParkingEvents = React.useMemo(() => {
    if (!playbackData) return undefined;
    const allGeofences = geofenceService.getGeofences();
    const events: {
      lat: number;
      lng: number;
      address: string;
      startTimestamp: string;
      durationSecs: number;
      pointIndex: number;
      speed: number;
      odometer: number;
      geofenceName?: string;
      geofenceId?: string;
    }[] = [];
    let parkingStart: number | null = null;
    let parkingStartTimestamp = '';

    playbackData.points.forEach((p, idx) => {
      if (p.speed === 0) {
        if (parkingStart === null) {
          parkingStart = idx;
          parkingStartTimestamp = p.timestamp;
        }
      } else {
        if (parkingStart !== null) {
          const durationSecs = (idx - parkingStart) * 15;
          const point = playbackData.points[parkingStart];
          const matchedGf = findGeofenceForCoordinate({ lat: point.lat, lng: point.lng }, allGeofences);
          events.push({
            lat: point.lat,
            lng: point.lng,
            address: point.address ?? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`,
            startTimestamp: parkingStartTimestamp,
            durationSecs,
            pointIndex: parkingStart,
            speed: 0,
            odometer: point.odometer,
            geofenceName: matchedGf?.name,
            geofenceId: matchedGf?.id,
          });
          parkingStart = null;
        }
      }
    });

    // Handle parking at end of route
    if (parkingStart !== null) {
      const durationSecs = (playbackData.points.length - parkingStart) * 15;
      const point = playbackData.points[parkingStart];
      const matchedGf = findGeofenceForCoordinate({ lat: point.lat, lng: point.lng }, allGeofences);
      events.push({
        lat: point.lat,
        lng: point.lng,
        address: point.address ?? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`,
        startTimestamp: parkingStartTimestamp,
        durationSecs,
        pointIndex: parkingStart,
        speed: 0,
        odometer: point.odometer,
        geofenceName: matchedGf?.name,
        geofenceId: matchedGf?.id,
      });
    }

    return events;
  }, [playbackData]);

  const vehiclesForMap = React.useMemo(() => {
    if (mode !== 'playback' || !playbackData || !playbackVehicleId) return allVehiclesUnfiltered;
    const currentPoint = playbackData.points[playbackPointIndex];
    if (!currentPoint) return allVehiclesUnfiltered;
    return allVehiclesUnfiltered.map(v => {
      if (v.id !== playbackVehicleId) return v;
      return {
        ...v,
        location: { lat: currentPoint.lat, lng: currentPoint.lng, address: v.location.address },
        speed: currentPoint.speed,
        heading: currentPoint.heading,
        status: currentPoint.speed > 0 ? 'driving' as const : 'parking' as const,
      };
    });
  }, [allVehiclesUnfiltered, mode, playbackData, playbackVehicleId, playbackPointIndex]);

  // Current point during playback simulation
  const currentPlaybackPoint = React.useMemo(() => {
    if (!playbackData || playbackPointIndex < 0 || playbackPointIndex >= playbackData.points.length) return null;
    return playbackData.points[playbackPointIndex] ?? null;
  }, [playbackData, playbackPointIndex]);

  // -- Auto-detect traversed geofences and similar routes from playback track (min 80% similarity) --
  const { detectedGeofenceIds, detectedRouteIds, eligibleRouteIds, routeSimilarityMap } = React.useMemo(() => {
    if (!playbackData?.points || playbackData.points.length === 0) {
      return { detectedGeofenceIds: [], detectedRouteIds: [], eligibleRouteIds: [], routeSimilarityMap: {} };
    }
    const allGeofences = geofenceService.getGeofences();
    const allRoutes = routeService.getRoutes();
    const traversed = detectTraversedGeofenceIds(allGeofences, playbackData.points);
    // Syarat minimal kemiripan 80% (0.80) & HANYA centang 1 rute paling mirip (top match)
    const { matchedRouteIds, eligibleRouteIds, routeSimilarityMap } = detectSimilarRoutes(
      allRoutes,
      playbackData.points,
      traversed,
      allGeofences,
      0.80
    );
    return { detectedGeofenceIds: traversed, detectedRouteIds: matchedRouteIds, eligibleRouteIds, routeSimilarityMap };
  }, [playbackData]);

  // Synchronize detected geofences and routes to selected state when playbackData changes
  React.useEffect(() => {
    if (playbackData) {
      setSelectedGeofenceIds(detectedGeofenceIds);
      setSelectedRouteIds(detectedRouteIds);
    } else {
      setSelectedGeofenceIds([]);
      setSelectedRouteIds([]);
    }
  }, [detectedGeofenceIds, detectedRouteIds, playbackData]);

  // Progressive check: dynamically auto-check geofences as vehicle passes through them during active playback
  React.useEffect(() => {
    if (!playbackData || playbackPointIndex <= 0 || playbackState.status !== 'playing') return;
    const currentPt = playbackData.points[playbackPointIndex];
    if (!currentPt) return;

    const allGeofences = geofenceService.getGeofences();
    const newlyHit = allGeofences.filter(
      (gf) => !selectedGeofenceIds.includes(gf.id) && isPointInGeofence(currentPt, gf)
    );

    if (newlyHit.length > 0) {
      setSelectedGeofenceIds((prev) => [
        ...prev,
        ...newlyHit.map((g) => g.id).filter((id) => !prev.includes(id)),
      ]);
    }
  }, [playbackPointIndex, playbackData, selectedGeofenceIds, playbackState.status]);

  // Vehicle with position overridden for PlaybackMap
  const playbackVehicle = React.useMemo(() => {
    if (!playbackVehicleId) return null;
    const base = allVehiclesUnfiltered.find(v => v.id === playbackVehicleId) ?? null;
    if (!base) return null;
    if (!playbackData || playbackData.points.length === 0) return base;
    const currentPoint = playbackData.points[playbackPointIndex] || playbackData.points[0];
    return {
      ...base,
      location: { lat: currentPoint.lat, lng: currentPoint.lng, address: base.location.address },
      speed: currentPoint.speed,
      heading: currentPoint.heading,
      status: currentPoint.speed > 0 ? 'driving' as const : 'parking' as const,
      lastUpdate: currentPoint.timestamp,
    };
  }, [allVehiclesUnfiltered, playbackVehicleId, playbackData, playbackPointIndex]);

  const stopTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Trigger map resize when switching between live/playback mode or map view to ensure MapLibre recalculates projections
  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    return () => clearTimeout(timer);
  }, [mode, view]);

  // --- VehicleList handlers ------------------------------------------------------------------

  const handleVehicleSelect = React.useCallback((vehicleId: string) => {
    setSelectedVehicleId((prev) => (prev === vehicleId ? null : vehicleId));
  }, []);

  const handleVehicleCheck = React.useCallback((idOrIds: string | string[], checked: boolean) => {
    setSelectedVehicleIds((prev: string[]) => {
      const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
      if (checked) {
        return Array.from(new Set([...prev, ...ids]));
      }
      return prev.filter(id => !ids.includes(id));
    });
  }, []);

  const handleSelectAll = React.useCallback((checked: boolean) => {
    setSelectedVehicleIds(checked ? trackingService.getLiveVehicles().map((v) => v.id) : []);
  }, []);

  // â"€â"€ Playback handlers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

  const handlePlaybackVehicleChange = React.useCallback((vehicleId: string) => {
    setPlaybackVehicleId(vehicleId);
    setPlaybackState({ status: 'idle', totalDuration: 0, currentTime: 0 });
    stopTimer();
  }, [stopTimer]);

  const handlePlaybackRequest = React.useCallback((vehicleId: string) => {
    setMode('playback');
    setPlaybackVehicleId(vehicleId);
    setPlaybackState({ status: 'idle', totalDuration: 0, currentTime: 0 });
    stopTimer();
  }, [stopTimer]);

  const handleClearPlayback = React.useCallback(() => {
    setPlaybackState({ status: 'idle', totalDuration: 0, currentTime: 0 });
    setPlaybackData(null);
    setPlaybackPointIndex(0);
    setSelectedGeofenceIds([]);
    setSelectedRouteIds([]);
    setIsRouteCropMode(false);
    stopTimer();
  }, [stopTimer]);

  const handleLoadHistory = React.useCallback(() => {
    if (!playbackVehicleId) return;
    stopTimer();
    setPlaybackState({ status: 'loading', totalDuration: 0, currentTime: 0 });
    setPlaybackData(null);
    setPlaybackPointIndex(0);
    setIsRouteCropMode(false);
    setTimeout(() => {
      const startDatetime = new Date(`${dateRange.startDate}T${dateRange.startTime}:00`);
      const data = trackingService.getPlaybackData(playbackVehicleId, startDatetime);
      setPlaybackData(data);
      playbackDataRef.current = data;
      setCropStartIndex(0);
      setCropEndIndex(data.points.length - 1);
      setPlaybackState({ status: 'ready', totalDuration: data.totalDurationSecs, currentTime: 0 });
    }, 1200);
  }, [playbackVehicleId, dateRange, stopTimer]);

  // -- Auto-load history when navigated from Handover Map button --
  React.useEffect(() => {
    const pending = pendingAutoLoadRef.current;
    if (!pending || !playbackVehicleId || playbackVehicleId !== pending.vehicleId) return;
    // Clear the pending ref so it only fires once
    pendingAutoLoadRef.current = null;
    // Trigger the proper loading sequence
    stopTimer();
    setPlaybackState({ status: 'loading', totalDuration: 0, currentTime: 0 });
    setPlaybackData(null);
    setPlaybackPointIndex(0);
    setIsRouteCropMode(false);
    setTimeout(() => {
      const data = trackingService.getPlaybackData(pending.vehicleId, pending.startDate);
      setPlaybackData(data);
      playbackDataRef.current = data;
      setCropStartIndex(0);
      setCropEndIndex(data.points.length - 1);
      setPlaybackState({ status: 'ready', totalDuration: data.totalDurationSecs, currentTime: 0 });
    }, 1200);
  }, [playbackVehicleId, stopTimer]);

  const handlePlay = React.useCallback(() => {
    setPlaybackState((prev: PlaybackState) => {
      if (prev.status !== 'ready' && prev.status !== 'paused') return prev;
      return { ...prev, status: 'playing' as const };
    });
    timerRef.current = setInterval(() => {
      const data = playbackDataRef.current;
      if (!data) return;
      const speed = playbackSpeedRef.current;
      setPlaybackPointIndex((prev) => {
        const next = Math.min(prev + speed, data.points.length - 1);
        setPlaybackState((ps: PlaybackState) => {
          if (ps.status !== 'playing') { stopTimer(); return ps; }
          const currentTime = next * 15; // 15s per point
          if (next >= data.points.length - 1) {
            stopTimer();
            return { ...ps, status: 'ready' as const, currentTime: ps.totalDuration };
          }
          return { ...ps, currentTime };
        });
        return next;
      });
    }, 200);
  }, [stopTimer]);

  const handlePause = React.useCallback(() => {
    stopTimer();
    setPlaybackState((prev: PlaybackState) => ({ ...prev, status: 'paused' as const }));
  }, [stopTimer]);

  const handleStop = React.useCallback(() => {
    stopTimer();
    setPlaybackState((prev: PlaybackState) => ({ ...prev, status: 'ready' as const, currentTime: 0 }));
  }, [stopTimer]);

  const handleSeek = React.useCallback((progress: number) => {
    const data = playbackDataRef.current;
    if (!data) return;
    const targetTime = (progress / 100) * data.totalDurationSecs;
    const targetIndex = Math.round(targetTime / 15);
    const clampedIndex = Math.min(Math.max(0, targetIndex), data.points.length - 1);
    setPlaybackPointIndex(clampedIndex);
    setPlaybackState((prev: PlaybackState) => ({
      ...prev,
      currentTime: clampedIndex * 15,
    }));
  }, []);

  // -- Route Crop Action Handlers --
  const handleToggleRouteCrop = React.useCallback(() => {
    if (!playbackData?.points || playbackData.points.length === 0) return;
    setIsRouteCropMode((prev) => {
      if (!prev) {
        setCropStartIndex(0);
        setCropEndIndex(playbackData.points.length - 1);
        return true;
      }
      return false;
    });
  }, [playbackData]);

  const handleSetCropStartToCurrent = React.useCallback(() => {
    if (!playbackData?.points || playbackData.points.length === 0) return;
    const cur = Math.max(0, Math.min(playbackPointIndex, playbackData.points.length - 1));
    if (cur <= cropEndIndex) {
      setCropStartIndex(cur);
    } else {
      setCropStartIndex(cur);
      setCropEndIndex(playbackData.points.length - 1);
    }
  }, [playbackData, playbackPointIndex, cropEndIndex]);

  const handleSetCropEndToCurrent = React.useCallback(() => {
    if (!playbackData?.points || playbackData.points.length === 0) return;
    const cur = Math.max(0, Math.min(playbackPointIndex, playbackData.points.length - 1));
    if (cur >= cropStartIndex) {
      setCropEndIndex(cur);
    } else {
      setCropStartIndex(0);
      setCropEndIndex(cur);
    }
  }, [playbackData, playbackPointIndex, cropStartIndex]);

  const handleResetCropRange = React.useCallback(() => {
    if (!playbackData?.points || playbackData.points.length === 0) return;
    setCropStartIndex(0);
    setCropEndIndex(playbackData.points.length - 1);
  }, [playbackData]);

  const handleCancelRouteCrop = React.useCallback(() => {
    setIsRouteCropMode(false);
  }, []);

  const handleConfirmRouteCrop = React.useCallback(() => {
    if (!playbackData?.points || playbackData.points.length === 0) return;
    const s = Math.max(0, Math.min(cropStartIndex, playbackData.points.length - 1));
    const e = Math.max(s, Math.min(cropEndIndex, playbackData.points.length - 1));
    const trimmed = playbackData.points.slice(s, e + 1);
    if (trimmed.length === 0) return;

    const startPt = trimmed[0];
    const endPt = trimmed[trimmed.length - 1];

    const allGeofences = geofenceService.getGeofences();
    const startGf = findGeofenceForCoordinate({ lat: startPt.lat, lng: startPt.lng }, allGeofences);
    const endGf = findGeofenceForCoordinate({ lat: endPt.lat, lng: endPt.lng }, allGeofences);

    const originLocation: RouteLocation = startGf
      ? {
          type: 'geofence',
          geofenceId: startGf.id,
          latitude: startPt.lat,
          longitude: startPt.lng,
          address: startGf.name,
        }
      : {
          type: 'coordinate',
          latitude: startPt.lat,
          longitude: startPt.lng,
          address: startPt.address ?? `${startPt.lat.toFixed(5)}, ${startPt.lng.toFixed(5)}`,
        };

    const destLocation: RouteLocation = endGf
      ? {
          type: 'geofence',
          geofenceId: endGf.id,
          latitude: endPt.lat,
          longitude: endPt.lng,
          address: endGf.name,
        }
      : {
          type: 'coordinate',
          latitude: endPt.lat,
          longitude: endPt.lng,
          address: endPt.address ?? `${endPt.lat.toFixed(5)}, ${endPt.lng.toFixed(5)}`,
        };

    const stopsInRange = (playbackParkingEvents || []).filter(
      (p) => p.pointIndex >= s && p.pointIndex <= e
    );

    const stops: RouteStop[] = stopsInRange.map((p, i) => {
      const stopGf =
        p.geofenceId ||
        (p.geofenceName ? allGeofences.find((g) => g.name === p.geofenceName)?.id : undefined);
      return {
        id: `stop-${i + 1}`,
        sequence: i + 1,
        location: stopGf
          ? {
              type: 'geofence',
              geofenceId: stopGf,
              latitude: p.lat,
              longitude: p.lng,
              address: p.geofenceName,
            }
          : {
              type: 'coordinate',
              latitude: p.lat,
              longitude: p.lng,
              address: p.address,
            },
      };
    });

    const sampled = downsamplePoints(trimmed, 120);
    const odoDiff = Math.max(0, Math.round((endPt.odometer - startPt.odometer) * 10) / 10);
    const fromLabel = startGf?.name || tTracking.playbackRouteOriginDefault;
    const toLabel = endGf?.name || tTracking.playbackRouteDestDefault;

    const draftRoute: Partial<Route> = {
      name: tTracking.playbackDraftRouteName(playbackVehicle?.plateNumber ?? '', fromLabel, toLabel),
      description: tTracking.playbackDraftRouteDesc(playbackVehicle?.plateNumber ?? '', startPt.timestamp.slice(0, 10)),
      origin: originLocation,
      destination: destLocation,
      stops,
      plannedPath: {
        type: 'multiline',
        coordinates: sampled.map((p) => ({ lat: p.lat, lng: p.lng })),
      },
      plannedDistance: odoDiff,
      estimatedDuration: Math.round(((trimmed.length - 1) * 15) / 60),
      status: 'active',
    };

    sessionStorage.setItem('adatrack_draft_route', JSON.stringify(draftRoute));
    setIsRouteCropMode(false);
    router.push('/routes');
  }, [playbackData, cropStartIndex, cropEndIndex, playbackParkingEvents, playbackVehicle, router, tTracking]);

  // â"€â"€ VehicleList labels â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const vehicleListLabels = React.useMemo(() => ({
    title: tTracking.title,
    unitCount: tTracking.unitCount,
    searchPlaceholder: tTracking.searchPlaceholder,
    filterSettings: tTracking.filterSettings,
    allUnits: tTracking.allUnits,
    statusAll: tTracking.statusAll,
    statusDriving: tTracking.statusDriving,
    statusIdle: tTracking.statusIdle,
    statusParking: tTracking.statusParking,
    statusOffline: tTracking.statusOffline,
    noDriver: tTracking.noDriver,
    speedUnit: tTracking.speedUnit,
    groupSummary: tTracking.groupSummary,
    emptyTitle: tTracking.emptyTitle,
    emptyDescription: tTracking.emptyDescription,
    refreshData: tTracking.refreshData,
    hidePanel: tTracking.hidePanel,
    lastUpdated: tTracking.overviewLastUpdate,
    selectAllInGroup: (groupName: string) => `${tTracking.selectAll} - ${groupName}`,
  }), [tTracking]);

  // â"€â"€ Render â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">

      {/* Main Area: Map & Playback */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-background">



        {/* View: Table */}
        {view === 'table' && (
          <div className="flex flex-col flex-1 min-h-0 w-full bg-surface">
            {mode === 'live' && (
              <LiveTable
                modeSelector={<TableModeSelector mode={mode} onModeChange={setMode} locale={locale} />}
                vehicles={allVehiclesUnfiltered.filter(v => selectedVehicleIds.includes(v.id))}
                onVehicleSelect={(id) => setSelectedVehicleId(id)}
                locale={locale}
              />
            )}
            {mode === 'playback' && (
              <PlaybackTable
                modeSelector={<TableModeSelector mode={mode} onModeChange={setMode} locale={locale} />}
                playbackData={playbackData}
                locale={locale}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                selectedVehicleId={playbackVehicleId}
                onVehicleChange={handlePlaybackVehicleChange}
                vehicles={trackingService.getLiveVehicles()}
                onLoad={handleLoadHistory}
                isLoading={playbackState.status === 'loading'}
              />
            )}
            {mode === 'heatmap' && (
              <HeatmapTable
                modeSelector={<TableModeSelector mode={mode} onModeChange={setMode} locale={locale} />}
                vehicles={allVehiclesUnfiltered.filter(v => selectedVehicleIds.includes(v.id))}
                locale={locale}
                dateRange={heatmapDateRange}
                onDateRangeChange={setHeatmapDateRange}
                statusFilter={heatmapStatusFilter}
                onStatusFilterChange={setHeatmapStatusFilter}
                onGenerate={handleGenerateHeatmap}
                isGenerating={isGeneratingHeatmap}
              />
            )}
            {mode === 'parking' && (
              <ParkingTable
                modeSelector={<TableModeSelector mode={mode} onModeChange={setMode} locale={locale} />}
                vehicles={allVehiclesUnfiltered.filter(v => selectedVehicleIds.includes(v.id))}
                locale={locale}
                dateRange={parkingDateRange}
                onDateRangeChange={setParkingDateRange}
                minDuration={parkingMinDuration}
                onMinDurationChange={setParkingMinDuration}
                onGenerate={handleGenerateParking}
                isGenerating={isGeneratingParking}
              />
            )}
            {mode === 'mileage' && (
              <MileageTable
                modeSelector={<TableModeSelector mode={mode} onModeChange={setMode} locale={locale} />}
                vehicles={allVehiclesUnfiltered.filter(v => selectedVehicleIds.includes(v.id))}
                locale={locale}
                dateRange={mileageDateRange}
                onDateRangeChange={setMileageDateRange}
                onGenerate={handleGenerateMileage}
                isGenerating={isGeneratingMileage}
              />
            )}
            {mode === 'speed' && (
              <SpeedTable
                modeSelector={<TableModeSelector mode={mode} onModeChange={setMode} locale={locale} />}
                vehicles={allVehiclesUnfiltered.filter(v => selectedVehicleIds.includes(v.id))}
                locale={locale}
                dateRange={speedDateRange}
                onDateRangeChange={setSpeedDateRange}
                onGenerate={handleGenerateSpeed}
                isGenerating={isGeneratingSpeed}
              />
            )}
          </div>
        )}

        {/* View: Notification */}
        {view === 'notification' && (
          <TrackingNotificationPanel
            locale={locale}
            visibleVehicleIds={allVehiclesUnfiltered.filter(v => selectedVehicleIds.includes(v.id)).map(v => v.id)}
          />
        )}

        {/* Mode Toggle (hidden in non-map views) */}
        <div className={cn("absolute top-3 left-3 sm:top-4 sm:left-4 z-20 transition-all duration-500 ease-out", view !== 'map' && 'opacity-0 translate-y-[-10px] pointer-events-none')}>
          <div
            className="flex items-center bg-background rounded-lg border border-border shadow-lg p-0.5 gap-0.5"
            role="tablist"
            aria-label="Mode Pemantauan"
          >
            {/* Tab: Live */}
            <button
              role="tab"
              type="button"
              aria-selected={mode === 'live'}
              onClick={() => setMode('live')}
              className={cn(
                'flex items-center justify-center h-7 px-2.5 rounded-md text-[12px] font-medium transition-all gap-1.5',
                mode === 'live'
                  ? 'bg-accent/10 text-accent'
                  : 'text-foreground-muted hover:bg-surface hover:text-foreground'
              )}
            >
              {/* Live Dot Icon */}
              <svg className={cn("h-3.5 w-3.5 shrink-0", mode === 'live' ? "text-accent" : "text-foreground-muted")} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <circle cx="8" cy="8" r="6" fill="currentColor" />
                <circle cx="8" cy="8" r="2" fill="white" />
              </svg>
              {tTracking.modeLive}
            </button>

            {/* Tab: Playback */}
            <button
              role="tab"
              type="button"
              aria-selected={mode === 'playback'}
              onClick={() => setMode('playback')}
              className={cn(
                'flex items-center justify-center h-7 px-2.5 rounded-md text-[12px] font-medium transition-all gap-1.5',
                mode === 'playback'
                  ? 'bg-accent/10 text-accent'
                  : 'text-foreground-muted hover:bg-surface hover:text-foreground'
              )}
            >
              <History className={cn("h-3.5 w-3.5 shrink-0", mode === 'playback' ? "text-accent" : "text-foreground-muted")} aria-hidden="true" strokeWidth={2.5} />
              {tTracking.modePlayback}
            </button>

            {/* Tab: Heatmap */}
            <button
              role="tab"
              type="button"
              aria-selected={mode === 'heatmap'}
              onClick={() => setMode('heatmap')}
              className={cn(
                'flex items-center justify-center h-7 px-2.5 rounded-md text-[12px] font-medium transition-all gap-1.5',
                mode === 'heatmap'
                  ? 'bg-accent/10 text-accent'
                  : 'text-foreground-muted hover:bg-surface hover:text-foreground'
              )}
            >
              <MapPin className={cn("h-3.5 w-3.5 shrink-0", mode === 'heatmap' ? "text-accent" : "text-foreground-muted")} aria-hidden="true" strokeWidth={2.5} />
              {tTracking.modeHeatmap}
            </button>
          </div>
        </div>

        {/* Wrapper for Map and Playback Sidebar */}
        <div className={cn("flex-1 flex min-h-0 relative w-full", view !== 'map' && 'hidden')}>
          {/* Map Area Wrapper */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Map Area: Live (always mounted, hidden in playback mode or table view) */}
            <div className={cn('flex-1 relative', (mode !== 'live' || view !== 'map') && 'hidden')}>
              <LiveMap
                vehicles={allVehiclesUnfiltered}
                selectedVehicleId={selectedVehicleId || undefined}
                visibleVehicleIds={allVehiclesUnfiltered.map(v => v.id).filter(id => selectedVehicleIds.includes(id))}
                onPlaybackRequest={handlePlaybackRequest}
                initialFocusedVehicleId={selectedVehicleId || undefined}
              />
            </div>

            {/* Map Area: Playback (always mounted, hidden in live mode or table view) */}
            <div className={cn('flex-1 relative', (mode !== 'playback' || view !== 'map') && 'hidden')}>
              <PlaybackMap
                vehicle={playbackVehicle}
                currentPoint={currentPlaybackPoint || (playbackData?.points ? playbackData.points[0] : null)}
                playbackTrack={playbackTrack}
                playbackPassedTrack={playbackPassedTrack}
                playbackParkingEvents={playbackParkingEvents}
                selectedGeofenceIds={selectedGeofenceIds}
                selectedRouteIds={selectedRouteIds}
                cropTrack={isRouteCropMode ? cropTrack : undefined}
                isRouteCropMode={isRouteCropMode}
              />
            </div>

            {/* Map Area: Heatmap */}
            <div className={cn('flex-1 relative', (mode !== 'heatmap' || view !== 'map') && 'hidden')}>
              <HeatmapMap
                vehicles={allVehiclesUnfiltered}
                selectedVehicleId={selectedVehicleId}
                selectedVehicleIds={selectedVehicleIds}
                dateRange={heatmapDateRange}
                statusFilter={heatmapStatusFilter}
                isGenerating={isGeneratingHeatmap}
              />
            </div>

          </div>

        </div>

        {/* Bottom Playback Panel (Footer) */}
        <div
          className={cn(
            'shrink-0 border-t border-border bg-background transition-all duration-300 ease-in-out relative z-[400]',
            (mode === 'playback' && view === 'map')
              ? 'h-[56px] opacity-100 translate-y-0 overflow-visible'
              : 'h-0 opacity-0 translate-y-10 pointer-events-none overflow-hidden'
          )}
          aria-hidden={mode !== 'playback' || view !== 'map'}
        >
          <PlaybackPanel
            vehicles={trackingService.getLiveVehicles()}
            selectedVehicleId={playbackVehicleId}
            dateRange={dateRange}
            playbackState={playbackState}
            onVehicleChange={handlePlaybackVehicleChange}
            onDateRangeChange={setDateRange}
            onLoad={handleLoadHistory}
            onClear={handleClearPlayback}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onSeek={handleSeek}
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            currentPoint={currentPlaybackPoint}
            isRouteCropMode={isRouteCropMode}
            cropStartIndex={cropStartIndex}
            cropEndIndex={cropEndIndex}
            totalPoints={playbackData?.points?.length ?? 0}
            cropStartLabel={cropStartLabel}
            cropEndLabel={cropEndLabel}
            cropStartTimestamp={cropStartTimestamp}
            cropEndTimestamp={cropEndTimestamp}
            cropDistanceKm={cropDistanceKm}
            cropDurationSecs={cropDurationSecs}
            onCropStartChange={setCropStartIndex}
            onCropEndChange={setCropEndIndex}
            onSetCropStartToCurrent={handleSetCropStartToCurrent}
            onSetCropEndToCurrent={handleSetCropEndToCurrent}
            onResetCropRange={handleResetCropRange}
            onCancelRouteCrop={handleCancelRouteCrop}
            onConfirmRouteCrop={handleConfirmRouteCrop}
          />
        </div>

        {/* Bottom Heatmap Panel (Footer) */}
        <div
          className={cn(
            'shrink-0 border-t border-border bg-background transition-all duration-300 ease-in-out relative z-[400]',
            (mode === 'heatmap' && view === 'map')
              ? 'h-[56px] opacity-100 translate-y-0'
              : 'h-0 opacity-0 translate-y-10 pointer-events-none overflow-hidden'
          )}
          aria-hidden={mode !== 'heatmap' || view !== 'map'}
        >
          <HeatmapPanel
            dateRange={heatmapDateRange}
            statusFilter={heatmapStatusFilter}
            onDateRangeChange={setHeatmapDateRange}
            onStatusFilterChange={setHeatmapStatusFilter}
            onGenerate={handleGenerateHeatmap}
            isGenerating={isGeneratingHeatmap}
          />
        </div>


        {/* Bottom Overview Panel (Live Mode) */}
        <div
          className={cn(
            'shrink-0 bg-background transition-all duration-300 ease-in-out',
            (mode === 'live' && selectedVehicleId) ? 'h-[180px] border-t border-border opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-10 pointer-events-none overflow-hidden'
          )}
          aria-hidden={mode !== 'live' || !selectedVehicleId}
        >
          <VehicleOverviewPanel
            vehicle={trackingService.getLiveVehicles().find(v => v.id === selectedVehicleId) || null}
            onClose={() => setSelectedVehicleId(null)}
            locale={locale}
            onShareLocation={() => console.log('Share clicked', selectedVehicleId)}
          />
        </div>

        {/* Tab Navigation (Map | Table) - Classic Design at Bottom */}
        <div className="shrink-0 flex items-center justify-start border-t border-border bg-surface w-full px-4 h-[34px] z-10">
          <button
            type="button"
            onClick={() => {
              setView('map');
              if (mode === 'parking' || mode === 'mileage' || mode === 'speed') {
                setMode('live');
              }
            }}
            className={cn(
              'px-4 h-full text-xs font-semibold border-b-2 transition-colors focus:outline-none flex items-center gap-1.5 pt-[2px]',
              view === 'map' ? 'border-b-foreground text-foreground' : 'border-b-transparent text-foreground-muted hover:text-foreground'
            )}
          >
            <Map className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            {tTrackingLocal.modes.maps}
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            className={cn(
              'px-4 h-full text-xs font-semibold border-b-2 transition-colors focus:outline-none flex items-center gap-1.5 pt-[2px]',
              view === 'table' ? 'border-b-foreground text-foreground' : 'border-b-transparent text-foreground-muted hover:text-foreground'
            )}
          >
            <svg className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
            {tTrackingLocal.modes.table}
          </button>
          <button
            type="button"
            onClick={() => setView('notification')}
            className={cn(
              'px-4 h-full text-xs font-semibold border-b-2 transition-colors focus:outline-none flex items-center gap-1.5 pt-[2px]',
              view === 'notification' ? 'border-b-foreground text-foreground' : 'border-b-transparent text-foreground-muted hover:text-foreground'
            )}
          >
            <Activity className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            {tTrackingLocal.modes.activity}
          </button>
        </div>
      </div>

      {/* Right Sidebar for Live, Heatmap, Parking, Mileage & Speed */}
      {(mode === 'live' || mode === 'heatmap' || mode === 'parking' || mode === 'mileage' || mode === 'speed') && (
        <div
          className={cn(
            'shrink-0 h-full z-10 transition-all duration-300 ease-in-out flex flex-col',
            isVehicleListVisible
              ? 'w-[320px] border-l border-neutral-200 dark:border-neutral-800 bg-background'
              : 'w-[34px] py-2 items-center bg-transparent border-l border-neutral-200 dark:border-neutral-800'
          )}
        >
          {isVehicleListVisible ? (
            <VehicleList
              groups={trackingService.getLiveVehicleGroups()}
              selectedVehicleId={selectedVehicleId}
              selectedVehicleIds={selectedVehicleIds}
              search={search}
              statusFilter={statusFilter}
              onVehicleSelect={handleVehicleSelect}
              onSearchChange={setSearch}
              onStatusFilterChange={setStatusFilter}
              onVehicleCheck={handleVehicleCheck}
              onSelectAll={handleSelectAll}
              onClose={() => setIsVehicleListVisible(false)}
              labels={vehicleListLabels}
              hideStatusFilterTabs={mode === 'heatmap' || mode === 'parking' || mode === 'mileage' || mode === 'speed'}
              hideVehicleStatus={mode === 'heatmap' || mode === 'parking' || mode === 'mileage' || mode === 'speed'}
            />
          ) : (
            <div className="flex flex-col items-center gap-2.5 h-full w-full">
              {/* Expand button */}
              <button
                type="button"
                onClick={() => setIsVehicleListVisible(true)}
                className="flex h-6 w-6 items-center justify-center text-foreground-muted hover:text-foreground transition-colors focus:outline-none shrink-0"
                title="Buka Panel Pemantauan"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {/* Vertical Tab Button */}
              <button
                type="button"
                onClick={() => setIsVehicleListVisible(true)}
                className="flex flex-col items-center py-2 px-0.5 text-foreground group shrink-0 transition-opacity hover:opacity-80"
                title="Buka Pemantauan"
              >
                {/* Vertical Text */}
                <div className="font-bold text-[10px] tracking-[0.2em] text-foreground-muted group-hover:text-foreground uppercase select-none mb-4 mt-2 transition-colors [writing-mode:vertical-rl] rotate-180">
                  {tTracking.title}
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Right Sidebar for Playback (Geofence & Route) */}
      {mode === 'playback' && (
        <div
          className={cn(
            'shrink-0 h-full z-10 transition-all duration-300 ease-in-out flex flex-col',
            isMapLayerPanelVisible
              ? 'w-[320px] border-l border-neutral-200 dark:border-neutral-800 bg-background shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]'
              : 'w-[34px] py-2 items-center bg-background border-l border-neutral-200 dark:border-neutral-800'
          )}
        >
          {isMapLayerPanelVisible ? (
            <PlaybackMapLayerPanel
              selectedGeofenceIds={selectedGeofenceIds}
              selectedRouteIds={selectedRouteIds}
              onGeofenceChange={setSelectedGeofenceIds}
              onRouteChange={setSelectedRouteIds}
              onClose={() => setIsMapLayerPanelVisible(false)}
              traversedGeofenceIds={detectedGeofenceIds}
              similarRouteIds={eligibleRouteIds}
              routeSimilarityMap={routeSimilarityMap}
              onCreateRoute={handleToggleRouteCrop}
              hasPlaybackData={Boolean(playbackData && playbackData.points.length > 0)}
              isRouteCropMode={isRouteCropMode}
            />
          ) : (
            <div className="flex flex-col items-center gap-2.5 h-full w-full">
              <button
                type="button"
                onClick={() => setIsMapLayerPanelVisible(true)}
                className="flex h-6 w-6 items-center justify-center text-foreground-muted hover:text-foreground transition-colors focus:outline-none shrink-0"
                title={tTracking.playbackSelectLayer}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMapLayerPanelVisible(true)}
                className="flex flex-col items-center py-2 px-0.5 text-foreground group shrink-0 transition-opacity hover:opacity-80"
                title={tTracking.playbackSelectLayer}
              >
                <div className="font-bold text-[10px] tracking-[0.2em] text-foreground-muted group-hover:text-foreground uppercase select-none mb-4 mt-2 transition-colors [writing-mode:vertical-rl] rotate-180">
                  {tTracking.playbackGeofenceRoute}
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
