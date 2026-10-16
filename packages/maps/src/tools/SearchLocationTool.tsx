'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  Shield,
  Route as RouteIcon,
  ChevronDown,
  Check,
  X,
  Loader2,
  Link2,
  LocateFixed,
  RefreshCw,
  User,
} from 'lucide-react';
import { useMapActions, useInternalMap } from '../core/MapContext';
import maplibregl from 'maplibre-gl';
import { cn } from '@adatrack/utils';
import { Locale, getMapTranslation } from '../i18n';
import { isGoogleMapsShortLink, parseCoordinateInput } from './coordinateParser';
import type {
  LocationSearchResult,
  SearchGeofenceOption,
  SearchRouteOption,
  SearchAreaVehicleResult,
  ActiveSearchAreaHighlight,
} from './types';

export interface SearchLocationToolProps {
  /**
   * Mode live tracking: jika true, tampilkan 5 tab dan fitur pemindaian armada di sekitar titik/radius.
   * Jika false, tampilkan mode navigasi lokasi standar (3 tab: Alamat, Koordinat, Saya) tanpa pemindaian armada.
   * Jika undefined, otomatis bernilai true jika callback pencarian armada disediakan.
   */
  isLiveTracking?: boolean;

  /**
   * Callback abstraction untuk pencarian alamat.
   * Consumer (apps/personal) menyediakan implementasi provider geocoding.
   * Jika tidak disediakan, gunakan mock result untuk development.
   */
  onSearchAddress?: (query: string) => Promise<LocationSearchResult[]>;
  className?: string;
  locale?: Locale;

  /** Opsi geofence untuk pencarian unit */
  geofenceOptions?: SearchGeofenceOption[];
  /** Opsi rute untuk pencarian unit */
  routeOptions?: SearchRouteOption[];
  /** Callback untuk mencari unit di dalam geofence tertentu */
  onFindVehiclesInGeofence?: (geofenceId: string) => SearchAreaVehicleResult[];
  /** Callback untuk mencari unit di sepanjang rute tertentu */
  onFindVehiclesOnRoute?: (routeId: string) => SearchAreaVehicleResult[];
  /** Callback untuk mencari unit di dalam radius koordinat tertentu */
  onFindVehiclesInRadius?: (center: { lat: number; lng: number }, radiusMeters: number) => SearchAreaVehicleResult[];
  /** Callback ketika nopol unit diklik (fokus dan buka overview) */
  onSelectVehicle?: (vehicleId: string) => void;
  /** Callback untuk menyorot area geofence / garis rute di kanvas peta */
  onHighlightArea?: (highlight: ActiveSearchAreaHighlight | null) => void;
  /** Callback opsional untuk mengurai link Google Maps (maps.app.goo.gl) ke koordinat */
  onResolveMapsUrl?: (url: string) => Promise<{ lat: number; lng: number } | null>;
}

/** Mock result untuk development - tidak bergantung pada provider geocoding */
async function mockSearchAddress(query: string): Promise<LocationSearchResult[]> {
  await new Promise((r) => setTimeout(r, 400));
  const lower = query.toLowerCase();
  const results: LocationSearchResult[] = [
    { lat: -6.2088, lng: 106.8456, label: 'Jl. Sudirman, Jakarta Pusat' },
    { lat: -6.1944, lng: 106.8229, label: 'Monumen Nasional (Monas), Jakarta' },
    { lat: -6.2500, lng: 106.8000, label: 'Kebayoran Baru, Jakarta Selatan' },
    { lat: -6.9147, lng: 107.6098, label: 'Jl. Asia Afrika, Bandung' },
    { lat: -7.2575, lng: 112.7521, label: 'Jl. Tunjungan, Surabaya' },
  ].filter((r) => r.label.toLowerCase().includes(lower));

  return results.slice(0, 5);
}

/** Default resolver via backend Next.js API route */
async function defaultResolveMapsUrl(url: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('/api/resolve-maps-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await res.json();
    if (data.success && typeof data.lat === 'number' && typeof data.lng === 'number') {
      return { lat: data.lat, lng: data.lng };
    }
  } catch (err) {
    console.error('Failed to resolve maps url', err);
  }
  return null;
}

type Tab = 'address' | 'coordinate' | 'my_location' | 'geofence' | 'route';

// Subkomponen Dropdown Sleek & Modern dengan Filter Pencarian Cepat
function SelectorDropdown({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = 'Cari...',
  noResultText = 'Tidak ada hasil',
  icon: Icon,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
  searchPlaceholder?: string;
  noResultText?: string;
  icon?: React.FC<{ className?: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const updatePlacement = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 220 && spaceAbove > spaceBelow) {
        setPlacement('top');
      } else {
        setPlacement('bottom');
      }
    };
    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    return () => window.removeEventListener('resize', updatePlacement);
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase().trim();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedOption = options.find((o) => o.id === value);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setQuery('');
          }}
          className={cn(
            'flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left',
            'border bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800',
            isOpen
              ? 'border-red-500 ring-2 ring-red-500/15 dark:ring-red-500/20'
              : 'border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600',
            'shadow-2xs focus:outline-none'
          )}
        >
          <div className="flex items-center gap-2 min-w-0 pr-1">
            {Icon && (
              <Icon
                className={cn(
                  'w-3.5 h-3.5 shrink-0 transition-colors',
                  selectedOption ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'
                )}
              />
            )}
            <span
              className={cn(
                'truncate font-medium',
                selectedOption
                  ? 'font-semibold text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-400 dark:text-neutral-500 font-normal'
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-neutral-400 ml-1.5 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180 text-red-600 dark:text-red-400'
            )}
          />
        </button>

        {selectedOption && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            title="Reset Pilihan"
            className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors shadow-2xs shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-700/90 rounded-2xl shadow-xl p-2 flex flex-col gap-1.5 animate-in fade-in-0 zoom-in-95 duration-150 backdrop-blur-md',
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          )}
        >
          {/* Input pencarian internal */}
          <div className="relative flex items-center">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none z-10" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 z-10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* List opsi */}
          <div className="max-h-40 overflow-y-auto space-y-0.5 pr-0.5 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="text-center py-4 px-2">
                <p className="text-xs text-neutral-400 italic">
                  {noResultText}
                </p>
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = value === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left',
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold'
                        : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 text-neutral-800 dark:text-neutral-200'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      {Icon && (
                        <Icon className={cn('w-3.5 h-3.5 shrink-0', isSelected ? 'text-red-600 dark:text-red-400' : 'text-neutral-400')} />
                      )}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface CompactVehicleResultListProps {
  vehicles: SearchAreaVehicleResult[];
  onSelectVehicle?: (id: string) => void;
  panTo: (coords: { lat: number; lng: number }) => void;
  title?: string;
  unitLabel?: string;
}

function CompactVehicleResultList({
  vehicles,
  onSelectVehicle,
  panTo,
  title = 'Ditemukan',
  unitLabel = 'Unit',
}: CompactVehicleResultListProps) {
  const drivingCount = useMemo(
    () => vehicles.filter((v) => v.status === 'driving').length,
    [vehicles]
  );
  const idleCount = useMemo(
    () => vehicles.filter((v) => v.status === 'idle').length,
    [vehicles]
  );
  const parkingCount = useMemo(
    () => vehicles.filter((v) => v.status === 'parking').length,
    [vehicles]
  );
  const otherCount = useMemo(
    () => vehicles.length - drivingCount - idleCount - parkingCount,
    [vehicles, drivingCount, idleCount, parkingCount]
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 justify-between gap-1">
      {/* Header (Satukan angka langsung di samping judul tanpa badge terpisah) */}
      <div className="flex items-center justify-between shrink-0 py-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {title}
          </span>
          <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 tabular-nums">
            ({vehicles.length})
          </span>
        </div>
      </div>

      {/* Results List: Lebih Compact */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-1 overflow-y-auto custom-scrollbar p-0.5">
        {vehicles.map((v) => {
          const isDriving = v.status === 'driving';
          const isIdle = v.status === 'idle';
          const isParking = v.status === 'parking';

          return (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                panTo({ lat: v.lat, lng: v.lng });
                onSelectVehicle?.(v.id);
              }}
              className={cn(
                'group flex items-center justify-between px-2 py-0.5 rounded-lg text-left h-7',
                'bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800',
                'border border-neutral-200/90 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600',
                'shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.97]'
              )}
              title={`Fokus ke ${v.plateNumber} (${v.status || 'Aktif'})`}
            >
              <div className="flex items-center gap-1.5 min-w-0 pr-1 flex-1">
                <span className="relative flex h-2 w-2 shrink-0">
                  {isDriving && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={cn(
                      'relative inline-flex rounded-full h-2 w-2',
                      isDriving
                        ? 'bg-emerald-500'
                        : isIdle
                        ? 'bg-amber-500'
                        : isParking
                        ? 'bg-blue-500'
                        : 'bg-neutral-400 dark:bg-neutral-500'
                    )}
                  />
                </span>
                <span className="text-[11px] font-mono font-bold tracking-tight text-neutral-800 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 truncate transition-colors">
                  {v.plateNumber}
                </span>
              </div>
              {typeof v.distance === 'number' && (
                <span className="text-[9.5px] font-mono text-neutral-400 dark:text-neutral-500 shrink-0 tabular-nums">
                  {v.distance < 1000 ? `${v.distance}m` : `${(v.distance / 1000).toFixed(1)}k`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Status Legend dengan Jumlah Kendaraan */}
      <div className="flex items-center justify-center gap-2.5 pt-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-medium shrink-0 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span>Jalan</span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-200 tabular-nums">
            ({drivingCount})
          </span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>Idle</span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-200 tabular-nums">
            ({idleCount})
          </span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span>Parkir</span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-200 tabular-nums">
            ({parkingCount})
          </span>
        </span>
        {otherCount > 0 && (
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0" />
            <span>Lainnya</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-200 tabular-nums">
              ({otherCount})
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

function createPersonMarkerElement(label: string = 'Saya') {
  const wrapper = document.createElement('div');
  wrapper.className = 'adatrack-user-person-marker';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.cursor = 'pointer';
  wrapper.style.userSelect = 'none';
  wrapper.innerHTML = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(37, 99, 235, 0.25); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background: rgba(59, 130, 246, 0.3);"></div>
      <div style="position: relative; width: 26px; height: 26px; border-radius: 9999px; background: #2563eb; border: 2px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25), 0 2px 4px -2px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; color: white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </div>
    <div style="margin-top: -2px; padding: 1.5px 6px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1; background: #1d4ed8; color: #ffffff; border: 1px solid #93c5fd; border-radius: 9999px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); white-space: nowrap;">
      ${label}
    </div>
  `;
  return wrapper;
}

export function SearchLocationTool({
  isLiveTracking,
  onSearchAddress,
  className,
  locale = 'id',
  geofenceOptions = [],
  routeOptions = [],
  onFindVehiclesInGeofence,
  onFindVehiclesOnRoute,
  onFindVehiclesInRadius,
  onSelectVehicle,
  onHighlightArea,
  onResolveMapsUrl,
}: SearchLocationToolProps) {
  const t = getMapTranslation(locale).search;
  const { panTo, fitBounds } = useMapActions();
  const map = useInternalMap();
  const [tab, setTab] = useState<Tab>('address');
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const isLive = isLiveTracking !== undefined
    ? isLiveTracking
    : Boolean(onFindVehiclesInRadius || onFindVehiclesInGeofence || onFindVehiclesOnRoute);

  // Address tab state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<LocationSearchResult | null>(null);
  const [addressRadius, setAddressRadius] = useState<number>(500);
  const [addressVehicles, setAddressVehicles] = useState<SearchAreaVehicleResult[] | null>(null);

  // Coordinate & Radius tab state
  const [coordInput, setCoordInput] = useState('');
  const [activeCenter, setActiveCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(500);
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);
  const [smartParseNotice, setSmartParseNotice] = useState<string | null>(null);
  const [coordError, setCoordError] = useState<string | null>(null);
  const [radiusVehicles, setRadiusVehicles] = useState<SearchAreaVehicleResult[] | null>(null);

  // Geofence tab state
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string>('');
  const [geofenceVehicles, setGeofenceVehicles] = useState<SearchAreaVehicleResult[] | null>(null);

  // Route tab state
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [routeVehicles, setRouteVehicles] = useState<SearchAreaVehicleResult[] | null>(null);

  // My Location tab state
  const [myLocationCoord, setMyLocationCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [myLocationRadius, setMyLocationRadius] = useState<number>(500);
  const [myLocationVehicles, setMyLocationVehicles] = useState<SearchAreaVehicleResult[] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Jika bukan mode live tracking, pastikan tab Geofence dan Rute otomatis kembali ke tab Alamat
  useEffect(() => {
    if (!isLive && (tab === 'geofence' || tab === 'route')) {
      setTab('address');
    }
  }, [isLive, tab]);

  // Bersihkan marker sementara dan highlight saat unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      onHighlightArea?.(null);
    };
  }, [onHighlightArea]);

  // Bersihkan highlight saat berganti tab
  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    onHighlightArea?.(null);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    // Refresh hasil pencarian jika tab geofence/rute/koordinat/alamat/lokasi saya sudah ada yang dipilih sebelumnya
    if (newTab === 'geofence' && selectedGeofenceId && isLive) {
      const gf = geofenceOptions.find((g) => g.id === selectedGeofenceId);
      if (gf) {
        onHighlightArea?.({
          type: 'geofence',
          coordinates: gf.coordinates || [],
          geofenceType: gf.type,
          radius: gf.radius,
        });
      }
    } else if (newTab === 'route' && selectedRouteId && isLive) {
      const rt = routeOptions.find((r) => r.id === selectedRouteId);
      if (rt) {
        onHighlightArea?.({
          type: 'route',
          coordinates: rt.coordinates || [],
        });
      }
    } else if (newTab === 'coordinate' && activeCenter) {
      if (isLive) {
        onHighlightArea?.({
          type: 'geofence',
          geofenceType: 'circle',
          coordinates: [activeCenter],
          radius: radius,
        });
      } else {
        onHighlightArea?.(null);
      }
      placeTemporaryMarker(activeCenter.lat, activeCenter.lng);
    } else if (newTab === 'address' && selectedAddress) {
      if (isLive) {
        onHighlightArea?.({
          type: 'geofence',
          geofenceType: 'circle',
          coordinates: [{ lat: selectedAddress.lat, lng: selectedAddress.lng }],
          radius: addressRadius,
        });
      } else {
        onHighlightArea?.(null);
      }
      placeTemporaryMarker(selectedAddress.lat, selectedAddress.lng);
    } else if (newTab === 'my_location') {
      if (myLocationCoord) {
        applyMyLocationCenter(myLocationCoord, myLocationRadius);
      } else if (!isLocating) {
        requestUserLocation(myLocationRadius);
      }
    }
  };

  const placeTemporaryMarker = (markerLat: number, markerLng: number, isPerson = false) => {
    if (!map) return;
    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (isPerson) {
      const el = createPersonMarkerElement(locale === 'id' ? 'Saya' : 'Me');
      markerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([markerLng, markerLat])
        .addTo(map);
    } else {
      markerRef.current = new maplibregl.Marker({ color: '#dc2626' })
        .setLngLat([markerLng, markerLat])
        .addTo(map);
    }
  };

  const fitRadiusBounds = (center: { lat: number; lng: number }, radiusMeters: number) => {
    const latDelta = (radiusMeters * 1.4) / 111320;
    const lngDelta = (radiusMeters * 1.4) / (111320 * Math.cos((center.lat * Math.PI) / 180));
    fitBounds(
      [
        [center.lng - lngDelta, center.lat - latDelta],
        [center.lng + lngDelta, center.lat + latDelta],
      ],
      { padding: 45, duration: 800 } as any
    );
  };

  const applyCoordinateCenter = (center: { lat: number; lng: number }, r: number) => {
    setActiveCenter(center);
    placeTemporaryMarker(center.lat, center.lng);
    if (isLive) {
      onHighlightArea?.({
        type: 'geofence',
        geofenceType: 'circle',
        coordinates: [center],
        radius: r,
      });
      fitRadiusBounds(center, r);
      const found = onFindVehiclesInRadius?.(center, r) ?? [];
      setRadiusVehicles(found);
    } else {
      onHighlightArea?.(null);
      panTo(center);
      setRadiusVehicles(null);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (activeCenter && isLive) {
      onHighlightArea?.({
        type: 'geofence',
        geofenceType: 'circle',
        coordinates: [activeCenter],
        radius: newRadius,
      });
      fitRadiusBounds(activeCenter, newRadius);
      const found = onFindVehiclesInRadius?.(activeCenter, newRadius) ?? [];
      setRadiusVehicles(found);
    }
  };

  const applyAddressCenter = (center: { lat: number; lng: number }, r: number) => {
    placeTemporaryMarker(center.lat, center.lng);
    if (isLive) {
      onHighlightArea?.({
        type: 'geofence',
        geofenceType: 'circle',
        coordinates: [center],
        radius: r,
      });
      fitRadiusBounds(center, r);
      const found = onFindVehiclesInRadius?.(center, r) ?? [];
      setAddressVehicles(found);
    } else {
      onHighlightArea?.(null);
      panTo(center);
      setAddressVehicles(null);
    }
  };

  const handleAddressRadiusChange = (newRadius: number) => {
    setAddressRadius(newRadius);
    if (selectedAddress && isLive) {
      applyAddressCenter({ lat: selectedAddress.lat, lng: selectedAddress.lng }, newRadius);
    }
  };

  const applyMyLocationCenter = (center: { lat: number; lng: number }, r: number) => {
    placeTemporaryMarker(center.lat, center.lng, true);
    if (isLive) {
      onHighlightArea?.({
        type: 'geofence',
        geofenceType: 'circle',
        coordinates: [center],
        radius: r,
      });
      fitRadiusBounds(center, r);
      const found = onFindVehiclesInRadius?.(center, r) ?? [];
      setMyLocationVehicles(found);
    } else {
      onHighlightArea?.(null);
      panTo(center);
      setMyLocationVehicles(null);
    }
  };

  const handleMyLocationRadiusChange = (newRadius: number) => {
    setMyLocationRadius(newRadius);
    if (myLocationCoord && isLive) {
      applyMyLocationCenter(myLocationCoord, newRadius);
    }
  };

  const requestUserLocation = (currentRadius: number = myLocationRadius) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coord = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setMyLocationCoord(coord);
        applyMyLocationCenter(coord, currentRadius);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setLocationError('Izin akses lokasi ditolak oleh browser.');
        } else if (err.code === 2) {
          setLocationError('Posisi lokasi tidak tersedia.');
        } else if (err.code === 3) {
          setLocationError('Waktu deteksi lokasi habis (timeout).');
        } else {
          setLocationError('Gagal mendeteksi lokasi.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleSelectAddress = (result: LocationSearchResult) => {
    setSelectedAddress(result);
    setQuery(result.label);
    setResults([]);
    applyAddressCenter({ lat: result.lat, lng: result.lng }, addressRadius);
  };

  const handleClearAddress = () => {
    setSelectedAddress(null);
    setQuery('');
    setAddressVehicles(null);
    setResults([]);
    setSearchError(null);
    onHighlightArea?.(null);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  };

  const handleSearchAddress = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setResults([]);
    setSelectedAddress(null);
    setAddressVehicles(null);
    try {
      const fn = onSearchAddress ?? mockSearchAddress;
      const res = await fn(query.trim());
      if (res.length === 0) {
        setSearchError(t.noResult);
      } else {
        setResults(res);
      }
    } catch {
      setSearchError(t.error);
    } finally {
      setIsSearching(false);
    }
  };

  // Helper cerdas pemrosesan Input Link / Regex / Koordinat
  const handleProcessCoordinateInput = async (text: string, currentRadius: number = radius) => {
    setCoordInput(text);
    setCoordError(null);
    setSmartParseNotice(null);

    const trimmed = text.trim();
    if (!trimmed) {
      setActiveCenter(null);
      setRadiusVehicles(null);
      onHighlightArea?.(null);
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    // 1. Cek jika short link Google Maps (maps.app.goo.gl atau goo.gl/maps)
    const shortLinkMatch = trimmed.match(/https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps)\/[A-Za-z0-9_-]+/i);
    if (shortLinkMatch) {
      const shortUrl = shortLinkMatch[0];
      setIsResolvingUrl(true);
      try {
        const resolver = onResolveMapsUrl ?? defaultResolveMapsUrl;
        const res = await resolver(shortUrl);
        if (res) {
          applyCoordinateCenter({ lat: res.lat, lng: res.lng }, currentRadius);
          setSmartParseNotice('Tautan Google Maps berhasil diurai');
        } else {
          setCoordError('Gagal mengurai tautan Google Maps.');
        }
      } catch {
        setCoordError('Gagal memproses tautan.');
      } finally {
        setIsResolvingUrl(false);
      }
      return;
    }

    // 2. Cek jika format regex koordinat (Decimal, DMS, atau URL Google Maps lengkap)
    const parsed = parseCoordinateInput(trimmed);
    if (parsed) {
      applyCoordinateCenter({ lat: parsed.lat, lng: parsed.lng }, currentRadius);
      if (parsed.type === 'google_maps_url') {
        setSmartParseNotice('Koordinat Google Maps terdeteksi');
      } else if (parsed.type === 'dms') {
        setSmartParseNotice('Format derajat DMS dikonversi');
      }
      return;
    }
  };

  // Helper fitBounds ke area koordinat
  const fitAreaBounds = (coordinates?: { lat: number; lng: number }[]) => {
    if (!coordinates || coordinates.length === 0) return;
    let minLat = coordinates[0].lat, maxLat = coordinates[0].lat;
    let minLng = coordinates[0].lng, maxLng = coordinates[0].lng;
    for (const c of coordinates) {
      if (c.lat < minLat) minLat = c.lat;
      if (c.lat > maxLat) maxLat = c.lat;
      if (c.lng < minLng) minLng = c.lng;
      if (c.lng > maxLng) maxLng = c.lng;
    }
    if (minLat === maxLat && minLng === maxLng) {
      panTo({ lat: minLat, lng: minLng });
    } else {
      fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 60, duration: 800 } as any);
    }
  };

  // Handler memilih Geofence
  const handleSelectGeofence = (geofenceId: string) => {
    setSelectedGeofenceId(geofenceId);
    if (!geofenceId) {
      onHighlightArea?.(null);
      setGeofenceVehicles(null);
      return;
    }
    const gf = geofenceOptions.find((g) => g.id === geofenceId);
    if (gf) {
      onHighlightArea?.({
        type: 'geofence',
        coordinates: gf.coordinates || [],
        geofenceType: gf.type,
        radius: gf.radius,
      });
      fitAreaBounds(gf.coordinates);
    }
    const found = onFindVehiclesInGeofence?.(geofenceId) ?? [];
    setGeofenceVehicles(found);
  };

  // Handler memilih Rute
  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    if (!routeId) {
      onHighlightArea?.(null);
      setRouteVehicles(null);
      return;
    }
    const rt = routeOptions.find((r) => r.id === routeId);
    if (rt) {
      onHighlightArea?.({
        type: 'route',
        coordinates: rt.coordinates || [],
      });
      fitAreaBounds(rt.coordinates);
    }
    const found = onFindVehiclesOnRoute?.(routeId) ?? [];
    setRouteVehicles(found);
  };

  // Definisi tab navigasi dengan micro-icon modern
  const allTabs: { id: Tab; icon: React.FC<{ className?: string }>; label: string }[] = [
    { id: 'address', icon: MapPin, label: t.addressTab },
    { id: 'coordinate', icon: Navigation, label: t.coordinateTab },
    { id: 'my_location', icon: User, label: t.myLocationTab },
    { id: 'geofence', icon: Shield, label: t.geofenceTab },
    { id: 'route', icon: RouteIcon, label: t.routeTab },
  ];

  const visibleTabs = isLive
    ? allTabs
    : allTabs.filter((item) => item.id === 'address' || item.id === 'coordinate' || item.id === 'my_location');

  return (
    <div id="search-location-card" className={cn('w-[316px] text-sm select-none flex flex-col', className)}>
      {/* ── Segmented Control Bar (Modern with Icons) ── */}
      <div
        id="search-mode-tabs"
        className={cn(
          isLive ? 'grid-cols-5' : 'grid-cols-3',
          'grid p-1 bg-neutral-100/90 dark:bg-neutral-800/90 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 gap-0.5 mb-3 shrink-0'
        )}
      >
        {visibleTabs.map((item) => {
          const isSelected = tab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`search-tab-${item.id}`}
              type="button"
              onClick={() => handleTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-xl text-[10.5px] transition-all duration-150',
                isSelected
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-xs font-semibold ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-750 font-medium'
              )}
            >
              <Icon
                className={cn(
                  'w-3.5 h-3.5 shrink-0 transition-colors',
                  isSelected ? 'text-red-600 dark:text-red-500' : 'text-neutral-400 dark:text-neutral-500'
                )}
              />
              <span className="truncate leading-none w-full text-center">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Fixed-Height Tab Content Container (Tinggi Card Selalu Konsisten) ── */}
      <div className="h-[290px] flex flex-col overflow-hidden">
        {/* ── 1. Tab Alamat (Pencarian Alamat) ── */}
        {tab === 'address' && (
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            {/* Input Bar: Alamat & Radius (Radius hanya di Live Tracking) */}
            <div id="search-input-section" className="shrink-0 space-y-1.5">
              {/* 1. Baris Input Alamat & Tombol Cari */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="search-address-input"
                    className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider"
                  >
                    Nama Lokasi / Alamat
                  </label>
                  {selectedAddress && (
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                      <Check className="w-3 h-3" /> Lokasi dipilih
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1 flex items-center min-w-0">
                    <input
                      id="search-address-input"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress()}
                      placeholder="Contoh: Monas, Sudirman..."
                      className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/15 dark:focus:ring-red-500/20 focus:border-red-500 font-medium transition-all shadow-2xs"
                    />
                    <MapPin
                      className={cn(
                        'w-3.5 h-3.5 absolute left-3 pointer-events-none z-10 transition-colors',
                        selectedAddress
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-neutral-400 dark:text-neutral-500'
                      )}
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={handleClearAddress}
                        title="Bersihkan"
                        className="absolute right-2.5 z-10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchAddress}
                    disabled={isSearching || !query.trim()}
                    title="Cari Alamat"
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-2xs shrink-0 active:scale-[0.96]',
                      isSearching || !query.trim()
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border border-neutral-200/80 dark:border-neutral-700/80 cursor-not-allowed shadow-none'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer'
                    )}
                  >
                    {isSearching ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Radius Input & Preset Chips (HANYA tampil di Live Tracking) */}
              {isLive && (
                <div id="search-radius-section" className="flex items-center justify-between gap-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                      Radius:
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min={50}
                        max={50000}
                        step={50}
                        value={addressRadius}
                        onChange={(e) => {
                          const val = Math.max(10, parseInt(e.target.value) || 0);
                          handleAddressRadiusChange(val);
                        }}
                        className="w-[84px] px-2.5 py-1.5 text-xs text-right pr-6 font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/15 dark:focus:ring-red-500/20 focus:border-red-500 shadow-2xs transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-2.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold pointer-events-none">
                        m
                      </span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {[250, 500, 1000, 2000].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleAddressRadiusChange(r)}
                        className={cn(
                          'px-2 py-1 text-[10px] font-semibold rounded-xl border transition-all duration-150 shadow-2xs',
                          addressRadius === r
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                            : 'bg-white dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        )}
                      >
                        {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchError && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center py-0.5 animate-in fade-in-0 duration-150">
                  {searchError}
                </p>
              )}
            </div>

            {/* Content Area: Hasil Alamat / Kendaraan di Radius (Live) / Card Lokasi Terpilih (Non-Live) / Placeholder */}
            <div id="search-results-section" className="flex-1 min-h-0 flex flex-col pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
              {isSearching ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-red-600 dark:text-red-500" />
                  <p className="text-xs font-medium">{t.searching}</p>
                </div>
              ) : results.length > 0 ? (
                /* List Hasil Pencarian Alamat untuk Dipilih */
                <div className="flex-1 min-h-0 flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 px-0.5">
                    {isLive ? 'Pilih lokasi untuk dipindai:' : 'Pilih lokasi:'}
                  </span>
                  <div className="flex-1 min-h-0 rounded-xl border border-neutral-200 dark:border-neutral-700/80 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800 overflow-y-auto custom-scrollbar bg-white dark:bg-neutral-850 shadow-2xs">
                    {results.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAddress(r)}
                        className="w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-500 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-neutral-800 dark:text-neutral-200 font-medium leading-tight mb-0.5 truncate">
                            {r.label}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono tabular-nums">
                            {r.lat.toFixed(5)}, {r.lng.toFixed(5)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : selectedAddress ? (
                /* Alamat Terpilih */
                isLive ? (
                  /* Mode Live: List Armada di Sekitar Alamat Terpilih */
                  addressVehicles !== null && (
                    addressVehicles.length > 0 ? (
                      <CompactVehicleResultList
                        vehicles={addressVehicles}
                        onSelectVehicle={onSelectVehicle}
                        panTo={panTo}
                        title={t.foundVehicles}
                        unitLabel={t.unitVehicles}
                      />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                          Tidak ada kendaraan di radius {addressRadius >= 1000 ? `${addressRadius / 1000} km` : `${addressRadius} m`}
                        </p>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                          Coba perbesar radius di atas
                        </p>
                      </div>
                    )
                  )
                ) : (
                  /* Mode Non-Live: Ringkasan Lokasi Terpilih (Murni Navigasi Peta) */
                  <div className="flex-1 min-h-0 flex flex-col justify-between p-3 rounded-2xl bg-neutral-50/90 dark:bg-neutral-850/70 border border-neutral-200/80 dark:border-neutral-700/80 animate-in fade-in-0 duration-150">
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            {locale === 'id' ? 'Lokasi Terpilih' : 'Selected Location'}
                          </span>
                          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-snug line-clamp-2 mt-0.5">
                            {selectedAddress.label}
                          </p>
                          <p className="text-[10.5px] font-mono text-neutral-400 dark:text-neutral-500 mt-1">
                            {selectedAddress.lat.toFixed(5)}, {selectedAddress.lng.toFixed(5)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-750 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          panTo({ lat: selectedAddress.lat, lng: selectedAddress.lng });
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-500" />
                        <span>{locale === 'id' ? 'Fokus Peta' : 'Center Map'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAddress}
                        className="py-1.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-xs font-semibold text-neutral-600 dark:text-neutral-300 transition-colors"
                      >
                        {locale === 'id' ? 'Cari Lain' : 'Search Other'}
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* Placeholder Awal */
                <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-2">
                    <MapPin className="w-4 h-4 text-red-500/80" />
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed max-w-[220px]">
                    {locale === 'id' ? 'Ketik nama jalan atau landmark lalu klik Cari' : 'Type a street or landmark name then click Search'}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {isLive
                      ? (locale === 'id' ? 'Armada di sekitar radius akan otomatis dipindai' : 'Fleet vehicles in radius will be scanned')
                      : (locale === 'id' ? 'Peta akan langsung menuju lokasi terpilih' : 'Map will navigate to the selected location')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 2. Tab Koordinat ── */}
        {tab === 'coordinate' && (
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            {/* Input Bar: Koordinat Tunggal & Radius (Radius hanya di Live Tracking) */}
            <div className="shrink-0 space-y-1.5">
              {/* 1. Single Input Koordinat / Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="smart-coord-input"
                    className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider"
                  >
                    Koordinat / Tautan Google Maps
                  </label>
                  {smartParseNotice && (
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                      <Check className="w-3 h-3" /> Berhasil diurai
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1 flex items-center min-w-0">
                    <input
                      id="smart-coord-input"
                      type="text"
                      value={coordInput}
                      onChange={(e) => handleProcessCoordinateInput(e.target.value)}
                      onPaste={(e) => {
                        const text = e.clipboardData.getData('text');
                        if (text) {
                          e.preventDefault();
                          handleProcessCoordinateInput(text);
                        }
                      }}
                      placeholder="Contoh: -6.2088, 106.8456 atau link Maps"
                      className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/15 dark:focus:ring-red-500/20 focus:border-red-500 font-medium transition-all shadow-2xs"
                    />
                    <Link2
                      className={cn(
                        'w-3.5 h-3.5 absolute left-3 pointer-events-none z-10 transition-colors',
                        activeCenter || coordInput
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-neutral-400 dark:text-neutral-500'
                      )}
                    />
                    {isResolvingUrl && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600 dark:text-red-400 absolute right-2.5 z-10" />
                    )}
                  </div>
                  {coordInput && !isResolvingUrl && (
                    <button
                      type="button"
                      onClick={() => handleProcessCoordinateInput('')}
                      title="Reset Koordinat"
                      className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors shadow-2xs shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Radius Input & Preset Chips (HANYA tampil di Live Tracking) */}
              {isLive && (
                <div className="flex items-center justify-between gap-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                      Radius:
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min={50}
                        max={50000}
                        step={50}
                        value={radius}
                        onChange={(e) => {
                          const val = Math.max(10, parseInt(e.target.value) || 0);
                          handleRadiusChange(val);
                        }}
                        className="w-[84px] px-2.5 py-1.5 text-xs text-right pr-6 font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/15 dark:focus:ring-red-500/20 focus:border-red-500 shadow-2xs transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-2.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold pointer-events-none">
                        m
                      </span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {[250, 500, 1000, 2000].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRadiusChange(r)}
                        className={cn(
                          'px-2 py-1 text-[10px] font-semibold rounded-xl border transition-all duration-150 shadow-2xs',
                          radius === r
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                            : 'bg-white dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        )}
                      >
                        {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {coordError && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center py-0.5 animate-in fade-in-0 duration-150">
                  {coordError}
                </p>
              )}
            </div>

            {/* Content Area: Daftar Kendaraan di Radius (Live) / Card Koordinat Terpilih (Non-Live) / Placeholder */}
            <div className="flex-1 min-h-0 flex flex-col pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
              {activeCenter ? (
                isLive ? (
                  radiusVehicles !== null && (
                    radiusVehicles.length > 0 ? (
                      <CompactVehicleResultList
                        vehicles={radiusVehicles}
                        onSelectVehicle={onSelectVehicle}
                        panTo={panTo}
                        title={t.foundVehicles}
                        unitLabel={t.unitVehicles}
                      />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                          Tidak ada armada di dalam radius {radius >= 1000 ? `${radius / 1000} km` : `${radius} m`}.
                        </p>
                      </div>
                    )
                  )
                ) : (
                  /* Mode Non-Live: Ringkasan Koordinat Terpilih (Murni Navigasi Peta) */
                  <div className="flex-1 min-h-0 flex flex-col justify-between p-3 rounded-2xl bg-neutral-50/90 dark:bg-neutral-850/70 border border-neutral-200/80 dark:border-neutral-700/80 animate-in fade-in-0 duration-150">
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            {locale === 'id' ? 'Koordinat Terdeteksi' : 'Coordinate Detected'}
                          </span>
                          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 font-mono mt-0.5">
                            {activeCenter.lat.toFixed(6)}, {activeCenter.lng.toFixed(6)}
                          </p>
                          {smartParseNotice && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                              <Check className="w-3 h-3" /> {smartParseNotice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-750 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          panTo({ lat: activeCenter.lat, lng: activeCenter.lng });
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-500" />
                        <span>{locale === 'id' ? 'Fokus Peta' : 'Center Map'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProcessCoordinateInput('')}
                        className="py-1.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-xs font-semibold text-neutral-600 dark:text-neutral-300 transition-colors"
                      >
                        {locale === 'id' ? 'Reset' : 'Clear'}
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-2">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-[220px]">
                    {isLive
                      ? (locale === 'id' ? 'Ketik koordinat atau paste tautan Google Maps untuk memindai armada di sekitar radius.' : 'Enter coordinates or paste Google Maps link to scan fleet in radius.')
                      : (locale === 'id' ? 'Ketik koordinat atau paste tautan Google Maps untuk menuju lokasi di peta.' : 'Enter coordinates or paste Google Maps link to navigate on map.')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 3. Tab Lokasi Saya ── */}
        {tab === 'my_location' && (
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            {/* Input Bar: Lokasi GPS & Radius (Radius hanya di Live Tracking) */}
            <div className="shrink-0 space-y-1.5">
              {/* 1. Baris Posisi GPS & Tombol Refresh */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Posisi Saya (GPS)
                  </label>
                  {myLocationCoord && (
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                      <Check className="w-3 h-3" /> Lokasi terdeteksi
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1 flex items-center min-w-0">
                    <div
                      className={cn(
                        'w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white dark:bg-neutral-850 font-medium transition-all shadow-2xs truncate select-text',
                        myLocationCoord
                          ? 'border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100'
                          : 'border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500'
                      )}
                    >
                      {isLocating
                        ? 'Mendeteksi lokasi GPS...'
                        : myLocationCoord
                        ? `${myLocationCoord.lat.toFixed(5)}, ${myLocationCoord.lng.toFixed(5)}`
                        : 'Lokasi belum terdeteksi'}
                    </div>
                    <User
                      className={cn(
                        'w-3.5 h-3.5 absolute left-3 pointer-events-none z-10 transition-colors',
                        myLocationCoord
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-neutral-400 dark:text-neutral-500'
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => requestUserLocation(myLocationRadius)}
                    disabled={isLocating}
                    title="Deteksi Ulang Posisi GPS"
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-2xs shrink-0 active:scale-[0.96]',
                      isLocating
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border border-neutral-200/80 dark:border-neutral-700/80 cursor-not-allowed shadow-none'
                        : 'bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400'
                    )}
                  >
                    <RefreshCw className={cn('w-3.5 h-3.5', isLocating && 'animate-spin text-red-600')} />
                  </button>
                </div>
              </div>

              {/* 2. Radius Input & Preset Chips (HANYA tampil di Live Tracking) */}
              {isLive && (
                <div className="flex items-center justify-between gap-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                      Radius:
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min={50}
                        max={50000}
                        step={50}
                        value={myLocationRadius}
                        onChange={(e) => {
                          const val = Math.max(10, parseInt(e.target.value) || 0);
                          handleMyLocationRadiusChange(val);
                        }}
                        className="w-[84px] px-2.5 py-1.5 text-xs text-right pr-6 font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/15 dark:focus:ring-red-500/20 focus:border-red-500 shadow-2xs transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-2.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold pointer-events-none">
                        m
                      </span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {[250, 500, 1000, 2000].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleMyLocationRadiusChange(r)}
                        className={cn(
                          'px-2 py-1 text-[10px] font-semibold rounded-xl border transition-all duration-150 shadow-2xs',
                          myLocationRadius === r
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                            : 'bg-white dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        )}
                      >
                        {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {locationError && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center py-0.5 animate-in fade-in-0 duration-150">
                  {locationError}
                </p>
              )}
            </div>

            {/* Content Area: Daftar Kendaraan di Radius (Live) / Card Lokasi Saya Terpilih (Non-Live) / State Deteksi */}
            <div className="flex-1 min-h-0 flex flex-col pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
              {isLocating ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-red-600 dark:text-red-500" />
                  <p className="text-xs font-medium">Mendeteksi lokasi GPS Anda...</p>
                </div>
              ) : locationError ? (
                <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-red-200 dark:border-red-900/50 text-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
                    <User className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium mb-1.5">
                    {locationError}
                  </p>
                  <button
                    type="button"
                    onClick={() => requestUserLocation(myLocationRadius)}
                    className="px-3 py-1 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : myLocationCoord ? (
                isLive ? (
                  myLocationVehicles !== null && (
                    myLocationVehicles.length > 0 ? (
                      <CompactVehicleResultList
                        vehicles={myLocationVehicles}
                        onSelectVehicle={onSelectVehicle}
                        panTo={panTo}
                        title={t.foundVehicles}
                        unitLabel={t.unitVehicles}
                      />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                          Tidak ada armada di dalam radius {myLocationRadius >= 1000 ? `${myLocationRadius / 1000} km` : `${myLocationRadius} m`}.
                        </p>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                          Coba perbesar radius di atas
                        </p>
                      </div>
                    )
                  )
                ) : (
                  /* Mode Non-Live: Ringkasan Lokasi Saya (Murni Navigasi Peta) */
                  <div className="flex-1 min-h-0 flex flex-col justify-between p-3 rounded-2xl bg-neutral-50/90 dark:bg-neutral-850/70 border border-neutral-200/80 dark:border-neutral-700/80 animate-in fade-in-0 duration-150">
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              {locale === 'id' ? 'GPS Terdeteksi' : 'GPS Detected'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 font-mono mt-1">
                            {myLocationCoord.lat.toFixed(6)}, {myLocationCoord.lng.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-750 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          panTo({ lat: myLocationCoord.lat, lng: myLocationCoord.lng });
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-500" />
                        <span>{locale === 'id' ? 'Fokus Peta' : 'Center Map'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => requestUserLocation(myLocationRadius)}
                        title={locale === 'id' ? 'Perbarui Lokasi GPS' : 'Refresh GPS'}
                        className="py-1.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-xs font-semibold text-neutral-600 dark:text-neutral-300 transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{locale === 'id' ? 'Perbarui' : 'Refresh'}</span>
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                    <User className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed max-w-[220px]">
                    {isLive
                      ? 'Izinkan akses lokasi untuk mencari armada di sekitar Anda'
                      : (locale === 'id' ? 'Klik tombol deteksi di atas untuk menemukan posisi GPS Anda.' : 'Click detect button above to find your GPS location.')}
                  </p>
                  <button
                    type="button"
                    onClick={() => requestUserLocation(myLocationRadius)}
                    className="mt-2 px-3 py-1 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
                  >
                    Deteksi Posisi Saya
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 4. Tab Geofence (HANYA tampil di Live Tracking) ── */}
        {isLive && tab === 'geofence' && (
          <div className="flex-1 flex flex-col gap-2.5 min-h-0">
            {/* Dropdown Selector */}
            <div className="shrink-0 space-y-1">
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Pilih Geofence
              </label>
              <SelectorDropdown
                value={selectedGeofenceId}
                onChange={handleSelectGeofence}
                options={geofenceOptions}
                placeholder={t.selectGeofencePlaceholder}
                searchPlaceholder="Cari nama geofence..."
                noResultText="Geofence tidak ditemukan"
                icon={Shield}
              />
            </div>

            {/* Content Area (Vehicles or Placeholder) */}
            <div className="flex-1 min-h-0 flex flex-col pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
              {geofenceVehicles !== null ? (
                geofenceVehicles.length > 0 ? (
                  <CompactVehicleResultList
                    vehicles={geofenceVehicles}
                    onSelectVehicle={onSelectVehicle}
                    panTo={panTo}
                    title={t.foundVehicles}
                    unitLabel={t.unitVehicles}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-2">
                      <Shield className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {t.noVehiclesInGeofence}
                    </p>
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-2">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-[220px]">
                    Pilih geofence untuk memantau armada yang berada di area tersebut.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 5. Tab Rute (HANYA tampil di Live Tracking) ── */}
        {isLive && tab === 'route' && (
          <div className="flex-1 flex flex-col gap-2.5 min-h-0">
            {/* Dropdown Selector */}
            <div className="shrink-0 space-y-1">
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Pilih Rute
              </label>
              <SelectorDropdown
                value={selectedRouteId}
                onChange={handleSelectRoute}
                options={routeOptions}
                placeholder={t.selectRoutePlaceholder}
                searchPlaceholder="Cari nama rute..."
                noResultText="Rute tidak ditemukan"
                icon={RouteIcon}
              />
            </div>

            {/* Content Area (Vehicles or Placeholder) */}
            <div className="flex-1 min-h-0 flex flex-col pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
              {routeVehicles !== null ? (
                routeVehicles.length > 0 ? (
                  <CompactVehicleResultList
                    vehicles={routeVehicles}
                    onSelectVehicle={onSelectVehicle}
                    panTo={panTo}
                    title={t.foundVehicles}
                    unitLabel={t.unitVehicles}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-2">
                      <RouteIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {t.noVehiclesOnRoute}
                    </p>
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-850/50 border border-dashed border-neutral-200 dark:border-neutral-750 text-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-2">
                    <RouteIcon className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-[220px]">
                    Pilih rute untuk memantau armada yang sedang melintasi koridor jalur.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
