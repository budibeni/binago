'use client';

import React from 'react';
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
import { trackingNavigationService } from './services/trackingNavigationService';
import { useLiveTracking } from './hooks/useLiveTracking';
import { api } from '@adatrack/utils';
import type { MockPlaybackData } from './data/mockTrackingData';
import { getTranslation } from '../../../i18n';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getTrackingTranslation } from './i18n';
import type { StatusFilter, DateRange, PlaybackState, TrackingView, TrackingVehicle } from './types/tracking';
import type { Locale } from '@adatrack/types';

// â"€â"€â"€ Mode â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

type TrackingMode = 'live' | 'playback' | 'heatmap' | 'parking' | 'mileage' | 'speed';

// â"€â"€â"€ TrackingFeature â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

interface TrackingFeatureProps {
  locale?: Locale;
}

export function TrackingFeature({ locale: localeProp }: TrackingFeatureProps) {
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
  const playbackPointIndexRef = React.useRef(0);

  // ─── Heatmap state ──────────────────────────────────────────────────────────
  const [heatmapStatusFilter, setHeatmapStatusFilter] = React.useState<'driving' | 'idle' | 'parking'>('driving');
  const [heatmapDateRange, setHeatmapDateRange] = React.useState<DateRange>({
    startDate: new Date().toISOString().slice(0, 10),
    startTime: '00:00',
    endDate: new Date().toISOString().slice(0, 10),
    endTime: '23:59',
  });
  const [isGeneratingHeatmap, setIsGeneratingHeatmap] = React.useState(false);
  const [heatmapData, setHeatmapData] = React.useState<{ lat: number, lng: number }[]>([]);

  const handleGenerateHeatmap = React.useCallback(async () => {
    setIsGeneratingHeatmap(true);
    setHeatmapData([]);
    
    try {
      const startDatetime = new Date(`${heatmapDateRange.startDate}T${heatmapDateRange.startTime}:00`);
      const endDatetime = new Date(`${heatmapDateRange.endDate}T${heatmapDateRange.endTime}:00`);
      
      const idsToFetch = selectedVehicleIds.slice(0, 5); // Avoid too many requests
      
      let allPoints: { lat: number, lng: number }[] = [];
      
      await Promise.all(idsToFetch.map(async (id) => {
        try {
          const res: any = await api.get(`/vehicles/${id}/history`, {
            params: { from: startDatetime.toISOString(), to: endDatetime.toISOString() }
          });
          const positions = res?.points || res?.data?.points || res?.data?.data?.points || [];
          
          const points = positions.map((p: any) => ({
            lat: p.lat,
            lng: p.lng || p.lon
          }));
          allPoints = [...allPoints, ...points];
        } catch (err) {
          console.error(`Failed to load history for heatmap for vehicle ${id}`, err);
        }
      }));
      
      setHeatmapData(allPoints);
    } catch (err) {
      console.error('Failed to generate heatmap', err);
    } finally {
      setIsGeneratingHeatmap(false);
    }
  }, [heatmapDateRange, selectedVehicleIds]);

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

  const { vehicles: liveVehicles, loading: liveLoading } = useLiveTracking();

  // -- Initialize from Navigation State (sessionStorage) --
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initializedRef.current) return;
    if (liveLoading) return; // Wait for initial load
    
    const navState = trackingNavigationService.getState();
    if (!navState) {
      // Default: no state, show all live vehicles
      if (selectedVehicleIds.length === 0) {
        setSelectedVehicleIds(liveVehicles.map((v) => v.id));
      }
      initializedRef.current = true;
      return;
    }

    initializedRef.current = true;

    setMode(navState.mode || 'live');

    if (navState.vehicleIds && navState.vehicleIds.length > 0) {
      setSelectedVehicleIds(navState.vehicleIds);
    } else {
      setSelectedVehicleIds(liveVehicles.map((v) => v.id));
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
  }, [liveLoading, liveVehicles]);

  // Keep refs in sync
  React.useEffect(() => { playbackDataRef.current = playbackData; }, [playbackData]);
  React.useEffect(() => { playbackSpeedRef.current = playbackSpeed; }, [playbackSpeed]);
  React.useEffect(() => { playbackPointIndexRef.current = playbackPointIndex; }, [playbackPointIndex]);

  // --- Computed ----------------------------------------------------------------
  const allVehiclesUnfiltered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return liveVehicles.filter((v) => {
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;
      const matchSearch =
        !q ||
        v.plateNumber.toLowerCase().includes(q) ||
        v.groupName.toLowerCase().includes(q) ||
        (v.driverName?.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  }, [liveVehicles, search, statusFilter]);

  const [allGroups, setAllGroups] = React.useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    import('@/data/services').then(({ groupService }) => {
      groupService.getVehicleGroups().then(groups => setAllGroups(groups)).catch(console.error);
    });
  }, []);

  const groupedVehicles = React.useMemo(() => {
    const groupsMap = new globalThis.Map<string, { id: string; name: string; vehicles: TrackingVehicle[] }>();
    
    // First, initialize all known groups from API (even if empty)
    allGroups.forEach(g => {
      groupsMap.set(g.id, { id: g.id, name: g.name, vehicles: [] });
    });

    // Then distribute vehicles into groups
    allVehiclesUnfiltered.forEach((v) => {
      const gId = v.groupId || 'all';
      if (!groupsMap.has(gId)) {
        groupsMap.set(gId, { id: gId, name: v.groupName || 'Tanpa Grup', vehicles: [] });
      }
      groupsMap.get(gId)!.vehicles.push(v);
    });

    return Array.from(groupsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allVehiclesUnfiltered, allGroups]);

  // -- Playback derived state --------------------------------------------------
  const playbackTrack = React.useMemo(() => {
    if (!playbackData) return undefined;
    return playbackData.points.map(p => ({ lat: p.lat, lng: p.lng }));
  }, [playbackData]);

  const playbackPassedTrack = React.useMemo(() => {
    if (!playbackTrack || playbackPointIndex < 0) return undefined;
    return playbackTrack.slice(0, playbackPointIndex + 1);
  }, [playbackTrack, playbackPointIndex]);

  const playbackParkingEvents = React.useMemo(() => {
    if (!playbackData) return undefined;
    const events: {
      lat: number;
      lng: number;
      address: string;
      startTimestamp: string;
      durationSecs: number;
      pointIndex: number;
      speed: number;
      odometer: number;
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
          events.push({
            lat: point.lat,
            lng: point.lng,
            address: point.address ?? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`,
            startTimestamp: parkingStartTimestamp,
            durationSecs,
            pointIndex: parkingStart,
            speed: 0,
            odometer: point.odometer,
          });
          parkingStart = null;
        }
      }
    });

    // Handle parking at end of route
    if (parkingStart !== null) {
      const durationSecs = (playbackData.points.length - parkingStart) * 15;
      const point = playbackData.points[parkingStart];
      events.push({
        lat: point.lat,
        lng: point.lng,
        address: point.address ?? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`,
        startTimestamp: parkingStartTimestamp,
        durationSecs,
        pointIndex: parkingStart,
        speed: 0,
        odometer: point.odometer,
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

  // Vehicle with position overridden for PlaybackMap
  const playbackVehicle = React.useMemo(() => {
    if (!playbackVehicleId) return null;
    const base = allVehiclesUnfiltered.find(v => v.id === playbackVehicleId) ?? null;
    if (!base || !playbackData) return base;
    const currentPoint = playbackData.points[playbackPointIndex];
    if (!currentPoint) return base;
    return {
      ...base,
      location: { lat: currentPoint.lat, lng: currentPoint.lng, address: base.location.address },
      speed: currentPoint.speed,
      heading: currentPoint.heading,
      status: currentPoint.speed > 0 ? 'driving' as const : 'parking' as const,
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
    setSelectedVehicleIds(checked ? liveVehicles.map((v) => v.id) : []);
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
    playbackPointIndexRef.current = 0;
    setPlaybackPointIndex(0);
    stopTimer();
  }, [stopTimer]);

  const handleLoadHistory = React.useCallback(async () => {
    if (!playbackVehicleId) return;
    stopTimer();
    setPlaybackState({ status: 'loading', totalDuration: 0, currentTime: 0 });
    setPlaybackData(null);
    playbackPointIndexRef.current = 0;
    setPlaybackPointIndex(0);
    
    try {
      const startDatetime = new Date(`${dateRange.startDate}T${dateRange.startTime}:00`);
      const endDatetime = new Date(`${dateRange.endDate}T${dateRange.endTime}:00`);
      const res: any = await api.get(`/vehicles/${playbackVehicleId}/history`, {
        params: { from: startDatetime.toISOString(), to: endDatetime.toISOString() }
      });
      const positions = res?.points || res?.data?.points || res?.data?.data?.points || res?.data || [];
      
      const points = positions.map((p: any) => ({
        lat: p.lat,
        lng: p.lng || p.lon,
        speed: p.speed,
        heading: p.heading || 0,
        timestamp: p.timestamp,
        odometer: p.odometer || 0,
      }));
      
      const totalDurationSecs = points.length > 0 ? (new Date(points[points.length-1].timestamp).getTime() - new Date(points[0].timestamp).getTime()) / 1000 : 0;
      
      const data: any = {
        vehicleId: playbackVehicleId,
        points,
        totalDurationSecs: totalDurationSecs || 0,
      };
      
      setPlaybackData(data);
      playbackDataRef.current = data;
      setPlaybackState({ status: 'ready', totalDuration: data.totalDurationSecs || 0, currentTime: 0 });
    } catch (err) {
      console.error('Failed to load playback data', err);
      setPlaybackState({ status: 'idle', totalDuration: 0, currentTime: 0 });
      alert('Failed to load history');
    }
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
    playbackPointIndexRef.current = 0;
    setPlaybackPointIndex(0);
    
    api.get<MockPlaybackData>(`/vehicles/${pending.vehicleId}/history`, {
      params: { start: pending.startDate.toISOString() }
    })
      .then(res => {
        const data = (res as any).data || res;
        setPlaybackData(data);
        playbackDataRef.current = data;
        setPlaybackState({ status: 'ready', totalDuration: data.totalDurationSecs || 0, currentTime: 0 });
      })
      .catch(err => {
        console.error('Failed to auto-load playback data', err);
        setPlaybackState({ status: 'idle', totalDuration: 0, currentTime: 0 });
      });
  }, [playbackVehicleId, stopTimer]);

  const handlePlay = React.useCallback(() => {
    stopTimer();
    const data = playbackDataRef.current;
    if (!data || data.points.length === 0) return;

    const isAtEnd = playbackPointIndexRef.current >= data.points.length - 1;
    if (isAtEnd) {
      playbackPointIndexRef.current = 0;
      setPlaybackPointIndex(0);
    }

    setPlaybackState((prev: PlaybackState) => {
      if (prev.status !== 'ready' && prev.status !== 'paused') return prev;
      const shouldResetTime = isAtEnd || (prev.totalDuration > 0 && prev.currentTime >= prev.totalDuration);
      return {
        ...prev,
        status: 'playing' as const,
        currentTime: shouldResetTime ? 0 : prev.currentTime,
      };
    });

    timerRef.current = setInterval(() => {
      const currentData = playbackDataRef.current;
      if (!currentData || currentData.points.length === 0) return;
      const speed = playbackSpeedRef.current;

      const prev = playbackPointIndexRef.current;
      const next = Math.min(prev + speed, currentData.points.length - 1);
      const isEnd = next >= currentData.points.length - 1;

      playbackPointIndexRef.current = next;
      setPlaybackPointIndex(next);

      setPlaybackState((ps: PlaybackState) => {
        if (ps.status !== 'playing') return ps;
        const currentTime = isEnd ? ps.totalDuration : next * 15;
        return {
          ...ps,
          status: isEnd ? 'ready' as const : 'playing' as const,
          currentTime,
        };
      });

      if (isEnd) {
        stopTimer();
      }
    }, 200);
  }, [stopTimer]);

  const handlePause = React.useCallback(() => {
    stopTimer();
    setPlaybackState((prev: PlaybackState) => ({ ...prev, status: 'paused' as const }));
  }, [stopTimer]);

  const handleStop = React.useCallback(() => {
    stopTimer();
    playbackPointIndexRef.current = 0;
    setPlaybackPointIndex(0);
    setPlaybackState((prev: PlaybackState) => ({ ...prev, status: 'ready' as const, currentTime: 0 }));
  }, [stopTimer]);

  const handleSeek = React.useCallback((progress: number) => {
    const data = playbackDataRef.current;
    if (!data) return;
    const targetTime = (progress / 100) * data.totalDurationSecs;
    const targetIndex = Math.round(targetTime / 15);
    const clampedIndex = Math.min(Math.max(0, targetIndex), data.points.length - 1);
    playbackPointIndexRef.current = clampedIndex;
    setPlaybackPointIndex(clampedIndex);
    setPlaybackState((prev: PlaybackState) => ({
      ...prev,
      currentTime: clampedIndex * 15,
    }));
  }, []);

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
                vehicles={liveVehicles}
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
                playbackTrack={playbackTrack}
                playbackPassedTrack={playbackPassedTrack}
                playbackParkingEvents={playbackParkingEvents}
                selectedGeofenceIds={selectedGeofenceIds}
                selectedRouteIds={selectedRouteIds}
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
                heatmapData={heatmapData}
              />
            </div>

          </div>

        </div>

        {/* Bottom Playback Panel (Footer) */}
        <div
          className={cn(
            'shrink-0 border-t border-border bg-background transition-all duration-300 ease-in-out relative z-[400]',
            (mode === 'playback' && view === 'map')
              ? 'h-[56px] opacity-100 translate-y-0'
              : 'h-0 opacity-0 translate-y-10 pointer-events-none overflow-hidden'
          )}
          aria-hidden={mode !== 'playback' || view !== 'map'}
        >
          <PlaybackPanel
            vehicles={liveVehicles}
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
            vehicle={liveVehicles.find(v => v.id === selectedVehicleId) || null}
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
              groups={groupedVehicles}
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
