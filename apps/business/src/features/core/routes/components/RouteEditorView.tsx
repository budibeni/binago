import React, { useState, useEffect, useRef } from 'react';
import { Route, RouteStop, RouteLocation, MapInteractionMode, ActiveLocationTarget, getRouteFormSchema } from '../types';
import { Geofence } from '../../geofences/types';
import { Button, Input, Label, InputString, InputNumber, InputSelect, toast } from '@adatrack/ui';
import { getRouteTranslation, type RouteDictionary } from '../i18n';
import type { Locale } from '@adatrack/types';
import {
  MapGeometry,
  parseCoordinateInput,
  isGoogleMapsShortLink,
  defaultNominatimSearch,
  type LocationSearchResult,
} from '@adatrack/maps';
import {
  PenTool,
  Trash2,
  Plus,
  MapPin,
  ChevronUp,
  ChevronDown,
  Loader2,
  Check,
  X,
  Search,
  LocateFixed,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { RouteMap } from './RouteMap';
import { cn } from '@adatrack/utils';

const MOCK_FALLBACK_ADDRESSES: LocationSearchResult[] = [
  { lat: -6.2088, lng: 106.8456, label: 'Jl. Jenderal Sudirman, Jakarta Pusat' },
  { lat: -6.1944, lng: 106.8229, label: 'Monumen Nasional (Monas), Gambir, Jakarta Pusat' },
  { lat: -6.2500, lng: 106.8000, label: 'Kebayoran Baru, Jakarta Selatan' },
  { lat: -6.1264, lng: 106.8906, label: 'Pelabuhan Tanjung Priok, Jakarta Utara' },
  { lat: -6.1256, lng: 106.6559, label: 'Bandara Internasional Soekarno-Hatta (CGK), Tangerang' },
  { lat: -6.9147, lng: 107.6098, label: 'Jl. Asia Afrika, Bandung, Jawa Barat' },
  { lat: -7.2575, lng: 112.7521, label: 'Jl. Tunjungan, Surabaya, Jawa Timur' },
  { lat: -7.7956, lng: 110.3695, label: 'Jl. Malioboro, Yogyakarta' },
  { lat: -6.9932, lng: 110.4203, label: 'Simpang Lima, Semarang, Jawa Tengah' },
];

interface CoordinateLocationFieldProps {
  targetId?: ActiveLocationTarget;
  loc: RouteLocation;
  onChange: (val: RouteLocation) => void;
  isSelecting: boolean;
  onToggleSelect: () => void;
  error?: string;
  locale: Locale;
  t: RouteDictionary['editor'];
}

function CoordinateLocationField({
  targetId: _targetId,
  loc,
  onChange,
  isSelecting,
  onToggleSelect,
  error,
  locale,
  t,
}: CoordinateLocationFieldProps) {
  const [inputValue, setInputValue] = useState<string>(loc.address || '');
  const [resolving, setResolving] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Sinkronkan input jika loc.address atau loc.latitude/longitude berubah dari luar (misal klik peta)
  useEffect(() => {
    if (loc.address) {
      setInputValue(loc.address);
    } else if (loc.latitude !== undefined && loc.longitude !== undefined) {
      setInputValue(`${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`);
    }
  }, [loc.address, loc.latitude, loc.longitude]);

  const handleInputChange = async (rawText: string) => {
    setInputValue(rawText);
    const text = rawText.trim();

    if (!text) {
      setNotice(null);
      onChange({
        ...loc,
        type: 'coordinate',
        sourceMode: 'coordinate',
        address: '',
        latitude: undefined,
        longitude: undefined,
      });
      return;
    }

    // 1. Cek shortlink Google Maps (maps.app.goo.gl atau goo.gl/maps)
    if (isGoogleMapsShortLink(text)) {
      setResolving(true);
      setNotice(locale === 'id' ? 'Mengurai tautan Google Maps...' : 'Resolving Google Maps link...');
      try {
        const res = await fetch('/api/resolve-maps-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: text }),
        });
        const data = await res.json();
        if (data.success && typeof data.lat === 'number' && typeof data.lng === 'number') {
          onChange({
            ...loc,
            type: 'coordinate',
            sourceMode: 'coordinate',
            address: text,
            latitude: Number(data.lat.toFixed(6)),
            longitude: Number(data.lng.toFixed(6)),
            radius: loc.radius || 100,
          });
          setNotice(
            locale === 'id'
              ? `Tautan Google Maps terurai (${data.lat.toFixed(5)}, ${data.lng.toFixed(5)})`
              : `Google Maps link resolved (${data.lat.toFixed(5)}, ${data.lng.toFixed(5)})`
          );
        } else {
          setNotice(
            locale === 'id'
              ? 'Tautan tidak mengandung koordinat valid'
              : 'Link did not contain valid coordinates'
          );
        }
      } catch (err) {
        console.error('Failed to resolve maps link', err);
        setNotice(
          locale === 'id'
            ? 'Gagal memproses tautan Google Maps'
            : 'Failed to resolve Google Maps link'
        );
      } finally {
        setResolving(false);
      }
      return;
    }

    // 2. Parse menggunakan coordinateParser (mendukung full Google Maps URL, DMS, Decimal, Key-Value)
    const parsed = parseCoordinateInput(text);
    if (parsed) {
      onChange({
        ...loc,
        type: 'coordinate',
        sourceMode: 'coordinate',
        address: text,
        latitude: Number(parsed.lat.toFixed(6)),
        longitude: Number(parsed.lng.toFixed(6)),
        radius: loc.radius || 100,
      });

      let noticeType = locale === 'id' ? 'Koordinat terdeteksi' : 'Coordinate detected';
      if (parsed.type === 'google_maps_url') {
        noticeType = locale === 'id' ? 'Tautan Google Maps terdeteksi' : 'Google Maps URL detected';
      } else if (parsed.type === 'dms') {
        noticeType = locale === 'id' ? 'Format DMS terdeteksi' : 'DMS format detected';
      }
      setNotice(`${noticeType} (${parsed.lat.toFixed(5)}, ${parsed.lng.toFixed(5)})`);
      return;
    }

    // 3. Jika bukan format koordinat/link, simpan sebagai deskripsi/alamat teks
    setNotice(null);
    onChange({ ...loc, type: 'coordinate', sourceMode: 'coordinate', address: rawText });
  };

  const handleClear = () => {
    setInputValue('');
    setNotice(null);
    onChange({
      ...loc,
      type: 'coordinate',
      sourceMode: 'coordinate',
      address: '',
      latitude: undefined,
      longitude: undefined,
    });
  };

  return (
    <div className="space-y-2 border border-neutral-200 dark:border-neutral-800 rounded-md p-2.5 bg-white dark:bg-neutral-900 shadow-sm">
      {/* Smart Input Field: Link Google Maps, DMS, Decimal, atau Alamat */}
      <div>
        <div className="relative flex items-center">
          <Input
            placeholder={
              locale === 'id'
                ? 'Ketik koordinat, alamat, atau tempel link Google Maps...'
                : 'Enter coordinates, address, or paste Google Maps link...'
            }
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-8 text-xs pr-8"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {resolving && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            )}
            {!resolving && inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                title="Hapus"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notice Info Hasil Deteksi */}
        {notice && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            <Check className="w-3 h-3 shrink-0" />
            <span className="truncate">{notice}</span>
          </div>
        )}
      </div>

      {/* Baris Koordinat & Radius (Manual Edit / Review) */}
      <div className="flex gap-1.5 items-center">
        <Button
          type="button"
          variant={isSelecting ? 'primary' : 'outline'}
          size="sm"
          onClick={onToggleSelect}
          className={`h-7 w-7 p-0 shrink-0 ${isSelecting ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
          title={isSelecting ? (locale === 'id' ? 'Batal Pilih' : 'Cancel Selection') : (locale === 'id' ? 'Pilih dari Peta' : 'Pick from Map')}
        >
          <MapPin className="w-3.5 h-3.5" />
        </Button>

        <div className="flex gap-1.5 flex-1">
          <Input
            type="number"
            step="any"
            placeholder={t.latPlaceholder || 'Lat'}
            value={loc.latitude ?? ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'coordinate',
                latitude: e.target.value !== '' ? Number(e.target.value) : undefined,
                address: loc.address || (e.target.value !== '' && loc.longitude !== undefined ? `${e.target.value}, ${loc.longitude}` : loc.address),
              })
            }
            className={`h-7 text-xs w-full font-mono ${error ? 'border-red-500' : ''}`}
          />
          <Input
            type="number"
            step="any"
            placeholder={t.lngPlaceholder || 'Lng'}
            value={loc.longitude ?? ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'coordinate',
                longitude: e.target.value !== '' ? Number(e.target.value) : undefined,
                address: loc.address || (e.target.value !== '' && loc.latitude !== undefined ? `${loc.latitude}, ${e.target.value}` : loc.address),
              })
            }
            className={`h-7 text-xs w-full font-mono ${error ? 'border-red-500' : ''}`}
          />
          <Input
            type="number"
            min={10}
            max={50000}
            placeholder="Rad (m)"
            title={locale === 'id' ? 'Radius Toleransi (meter)' : 'Tolerance Radius (meters)'}
            value={loc.radius || ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'coordinate',
                radius: e.target.value !== '' ? Number(e.target.value) : undefined,
              })
            }
            className="h-7 text-xs w-[68px] shrink-0 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

interface AddressLocationFieldProps {
  targetId?: ActiveLocationTarget;
  loc: RouteLocation;
  onChange: (val: RouteLocation) => void;
  isSelecting: boolean;
  onToggleSelect: () => void;
  error?: string;
  locale: Locale;
  t: RouteDictionary['editor'];
}

function AddressLocationField({
  targetId: _targetId,
  loc,
  onChange,
  isSelecting,
  onToggleSelect,
  error,
  locale,
  t,
}: AddressLocationFieldProps) {
  const [query, setQuery] = useState<string>(loc.address || '');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sinkronkan text pencarian jika alamat atau koordinat diubah dari luar (misal klik peta)
  useEffect(() => {
    if (loc.address) {
      setQuery(loc.address);
    } else if (loc.latitude !== undefined && loc.longitude !== undefined) {
      setQuery(`${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`);
    }
  }, [loc.address, loc.latitude, loc.longitude]);

  // Close dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced address search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Jika query persis sama dengan address yang sudah terpilih, jangan otomatis buka dropdown
    if (trimmed === loc.address) {
      return;
    }

    let active = true;
    setSearching(true);

    const timer = setTimeout(async () => {
      try {
        let items = await defaultNominatimSearch(trimmed, { countryCode: 'id', limit: 5 });
        if (!items || items.length === 0) {
          // Fallback ke pencarian lokal
          const lower = trimmed.toLowerCase();
          items = MOCK_FALLBACK_ADDRESSES.filter((m) =>
            m.label.toLowerCase().includes(lower)
          );
        }
        if (active) {
          setResults(items);
          setShowDropdown(true);
        }
      } catch (err) {
        if (active) {
          const lower = trimmed.toLowerCase();
          const items = MOCK_FALLBACK_ADDRESSES.filter((m) =>
            m.label.toLowerCase().includes(lower)
          );
          setResults(items);
          setShowDropdown(true);
        }
      } finally {
        if (active) setSearching(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, loc.address]);

  const handleSelectResult = (item: LocationSearchResult) => {
    setShowDropdown(false);
    setQuery(item.label);
    onChange({
      ...loc,
      type: 'coordinate',
      sourceMode: 'address',
      address: item.label,
      latitude: Number(item.lat.toFixed(6)),
      longitude: Number(item.lng.toFixed(6)),
      radius: loc.radius || 100,
    });
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    onChange({
      ...loc,
      type: 'coordinate',
      sourceMode: 'address',
      address: '',
      latitude: undefined,
      longitude: undefined,
    });
  };

  return (
    <div ref={containerRef} className="space-y-2 border border-neutral-200 dark:border-neutral-800 rounded-md p-2.5 bg-white dark:bg-neutral-900 shadow-sm relative">
      {/* Input Pencarian Alamat */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
          <Input
            placeholder={t.searchAddressPlaceholder || 'Ketik nama jalan, tempat, gedung...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0 && query.trim() !== loc.address) {
                setShowDropdown(true);
              }
            }}
            className="h-8 text-xs pl-8 pr-8"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {searching && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            )}
            {!searching && query && (
              <button
                type="button"
                onClick={handleClear}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                title="Hapus"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Hasil Pencarian Alamat */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
            {results.length > 0 ? (
              results.map((item, idx) => (
                <button
                  key={`${item.lat}-${item.lng}-${idx}`}
                  type="button"
                  onClick={() => handleSelectResult(item)}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors flex items-start gap-2 group"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-800 dark:text-neutral-200 font-medium line-clamp-2">
                      {item.label}
                    </p>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {item.lat.toFixed(5)}, {item.lng.toFixed(5)}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-neutral-400 text-center">
                {t.searchAddressEmpty || 'Tidak ada hasil alamat ditemukan'}
              </div>
            )}
          </div>
        )}

        {/* Feedback Alamat Terpilih */}
        {loc.latitude !== undefined && loc.longitude !== undefined && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            <Check className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {locale === 'id' ? 'Alamat dipilih' : 'Address selected'} ({loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)})
            </span>
          </div>
        )}
      </div>

      {/* Baris Koordinat & Radius (Manual Edit / Review) */}
      <div className="flex gap-1.5 items-center">
        <Button
          type="button"
          variant={isSelecting ? 'primary' : 'outline'}
          size="sm"
          onClick={onToggleSelect}
          className={`h-7 w-7 p-0 shrink-0 ${isSelecting ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
          title={isSelecting ? (locale === 'id' ? 'Batal Pilih' : 'Cancel Selection') : (locale === 'id' ? 'Pilih dari Peta' : 'Pick from Map')}
        >
          <MapPin className="w-3.5 h-3.5" />
        </Button>

        <div className="flex gap-1.5 flex-1">
          <Input
            type="number"
            step="any"
            placeholder={t.latPlaceholder || 'Lat'}
            value={loc.latitude ?? ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'address',
                latitude: e.target.value !== '' ? Number(e.target.value) : undefined,
              })
            }
            className={`h-7 text-xs w-full font-mono ${error ? 'border-red-500' : ''}`}
          />
          <Input
            type="number"
            step="any"
            placeholder={t.lngPlaceholder || 'Lng'}
            value={loc.longitude ?? ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'address',
                longitude: e.target.value !== '' ? Number(e.target.value) : undefined,
              })
            }
            className={`h-7 text-xs w-full font-mono ${error ? 'border-red-500' : ''}`}
          />
          <Input
            type="number"
            min={10}
            max={50000}
            placeholder="Rad (m)"
            title={locale === 'id' ? 'Radius Toleransi (meter)' : 'Tolerance Radius (meters)'}
            value={loc.radius || ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'address',
                radius: e.target.value !== '' ? Number(e.target.value) : undefined,
              })
            }
            className="h-7 text-xs w-[68px] shrink-0 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

interface MyLocationLocationFieldProps {
  targetId?: ActiveLocationTarget;
  loc: RouteLocation;
  onChange: (val: RouteLocation) => void;
  isSelecting: boolean;
  onToggleSelect: () => void;
  error?: string;
  locale: Locale;
  t: RouteDictionary['editor'];
}

function MyLocationLocationField({
  targetId: _targetId,
  loc,
  onChange,
  isSelecting,
  onToggleSelect,
  error,
  locale,
  t,
}: MyLocationLocationFieldProps) {
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError(locale === 'id' ? 'Geolokasi tidak didukung oleh browser Anda.' : 'Geolocation not supported by browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const label = locale === 'id' ? `Lokasi GPS Saya (${lat}, ${lng})` : `My GPS Location (${lat}, ${lng})`;
        onChange({
          ...loc,
          type: 'coordinate',
          sourceMode: 'my_location',
          latitude: lat,
          longitude: lng,
          radius: loc.radius || 100,
          address: label,
        });
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setLocationError(locale === 'id' ? 'Izin lokasi ditolak browser.' : 'Location permission denied.');
        } else if (err.code === 2) {
          setLocationError(locale === 'id' ? 'Posisi lokasi tidak tersedia.' : 'Position unavailable.');
        } else if (err.code === 3) {
          setLocationError(locale === 'id' ? 'Waktu deteksi lokasi habis (timeout).' : 'Detection timed out.');
        } else {
          setLocationError(locale === 'id' ? 'Gagal mendeteksi lokasi.' : 'Failed to detect location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Otomatis minta izin lokasi jika koordinat belum terisi saat pertama kali memilih Lokasi Saya
  useEffect(() => {
    if (loc.latitude === undefined || loc.longitude === undefined) {
      requestLocation();
    }
  }, []);

  const hasCoords = loc.latitude !== undefined && loc.longitude !== undefined;

  return (
    <div className="space-y-2 border border-neutral-200 dark:border-neutral-800 rounded-md p-2.5 bg-white dark:bg-neutral-900 shadow-sm">
      {/* Status Bar Deteksi GPS */}
      <div>
        {isLocating ? (
          <div className="flex items-center gap-2 py-1.5 px-2.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{t.detectingLocation || 'Mendeteksi sinyal GPS...'}</span>
          </div>
        ) : locationError ? (
          <div className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{locationError}</span>
            </div>
            <button
              type="button"
              onClick={requestLocation}
              className="text-[11px] font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 underline shrink-0"
            >
              {locale === 'id' ? 'Coba Lagi' : 'Retry'}
            </button>
          </div>
        ) : hasCoords ? (
          <div className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium truncate">
                {t.gpsDetected || 'Lokasi GPS terdeteksi'} ({loc.latitude?.toFixed(5)}, {loc.longitude?.toFixed(5)})
              </span>
            </div>
            <button
              type="button"
              onClick={requestLocation}
              title={t.refreshLocation || 'Perbarui Lokasi GPS'}
              className="p-1 text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-white rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={requestLocation}
            className="w-full h-8 text-xs flex items-center justify-center gap-1.5 text-neutral-700 dark:text-neutral-300"
          >
            <LocateFixed className="w-3.5 h-3.5 text-primary-600" />
            <span>{t.detectLocationBtn || 'Deteksi Lokasi GPS'}</span>
          </Button>
        )}
      </div>

      {/* Baris Koordinat & Radius (Manual Edit / Review) */}
      <div className="flex gap-1.5 items-center">
        <Button
          type="button"
          variant={isSelecting ? 'primary' : 'outline'}
          size="sm"
          onClick={onToggleSelect}
          className={`h-7 w-7 p-0 shrink-0 ${isSelecting ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
          title={isSelecting ? (locale === 'id' ? 'Batal Pilih' : 'Cancel Selection') : (locale === 'id' ? 'Pilih dari Peta' : 'Pick from Map')}
        >
          <MapPin className="w-3.5 h-3.5" />
        </Button>

        <div className="flex gap-1.5 flex-1">
          <Input
            type="number"
            step="any"
            placeholder={t.latPlaceholder || 'Lat'}
            value={loc.latitude ?? ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'my_location',
                latitude: e.target.value !== '' ? Number(e.target.value) : undefined,
              })
            }
            className={`h-7 text-xs w-full font-mono ${error ? 'border-red-500' : ''}`}
          />
          <Input
            type="number"
            step="any"
            placeholder={t.lngPlaceholder || 'Lng'}
            value={loc.longitude ?? ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'my_location',
                longitude: e.target.value !== '' ? Number(e.target.value) : undefined,
              })
            }
            className={`h-7 text-xs w-full font-mono ${error ? 'border-red-500' : ''}`}
          />
          <Input
            type="number"
            min={10}
            max={50000}
            placeholder="Rad (m)"
            title={locale === 'id' ? 'Radius Toleransi (meter)' : 'Tolerance Radius (meters)'}
            value={loc.radius || ''}
            onChange={(e) =>
              onChange({
                ...loc,
                type: 'coordinate',
                sourceMode: 'my_location',
                radius: e.target.value !== '' ? Number(e.target.value) : undefined,
              })
            }
            className="h-7 text-xs w-[68px] shrink-0 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

interface RouteEditorViewProps {
  initialData?: Route;
  geofences: Geofence[];
  groups?: Array<{ id: string; name: string }>;
  onSave: (route: Partial<Route>) => void;
  onCancel: () => void;
  locale?: Locale;
}

export function RouteEditorView({
  initialData,
  geofences,
  groups = [],
  onSave,
  onCancel,
  locale = 'id'
}: RouteEditorViewProps) {
  const t = getRouteTranslation(locale).editor;
  
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [groupId, setGroupId] = useState(initialData?.groupId || '');
  
  const [origin, setOrigin] = useState<RouteLocation>(initialData?.origin || { type: 'geofence' });
  const [destination, setDestination] = useState<RouteLocation>(initialData?.destination || { type: 'geofence' });
  const [stops, setStops] = useState<RouteStop[]>(initialData?.stops || []);
  
  const [plannedDistance, setPlannedDistance] = useState<number | undefined>(initialData?.plannedDistance);
  const [estimatedDuration, setEstimatedDuration] = useState<number | undefined>(initialData?.estimatedDuration);
  const [status, setStatus] = useState<'active'|'inactive'>(initialData?.status || 'active');

  const [errors, setErrors] = useState<{name?: string; origin?: string; destination?: string}>({});

  const [editorMode, setEditorMode] = useState<MapInteractionMode>('idle');
  const [editorGeometry, setEditorGeometry] = useState<MapGeometry | null>(initialData?.plannedPath || null);
  
  const [activeLocationTarget, setActiveLocationTarget] = useState<ActiveLocationTarget>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddStop = () => {
    setStops([
      ...stops,
      { id: `stop-${Date.now()}`, sequence: stops.length + 1, location: { type: 'geofence' } }
    ]);
  };

  const handleUpdateStopLocation = (id: string, location: RouteLocation) => {
    setStops(stops.map(s => s.id === id ? { ...s, location } : s));
  };

  const handleRemoveStop = (id: string) => {
    const newStops = stops.filter(s => s.id !== id).map((s, index) => ({ ...s, sequence: index + 1 }));
    setStops(newStops);
  };

  const isLocationValid = (loc: RouteLocation) => {
    if (loc.type === 'geofence' && !loc.geofenceId) return false;
    if (loc.type === 'coordinate' && (loc.latitude === undefined || loc.longitude === undefined)) return false;
    return true;
  };

  const validate = () => {
    const schema = getRouteFormSchema({
      nameRequired: t.validation.nameRequired,
      locationRequired: t.validation.locationRequired,
      originRequired: t.validation.originRequired || t.validation.locationRequired,
      destinationRequired: t.validation.destinationRequired || t.validation.locationRequired,
    });

    const result = schema.safeParse({
      name,
      groupId: groupId || undefined,
      description: description || undefined,
      origin,
      destination,
      status,
      plannedDistance,
      estimatedDuration,
    });

    if (!result.success) {
      const newErrors: { name?: string; origin?: string; destination?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path === 'name' && !newErrors.name) newErrors.name = issue.message;
        if (path === 'origin' && !newErrors.origin) newErrors.origin = issue.message;
        if (path === 'destination' && !newErrors.destination) newErrors.destination = issue.message;
      });
      setErrors(newErrors);
      toast.error(
        newErrors.name ||
        newErrors.origin ||
        newErrors.destination ||
        (locale === 'en' ? 'Please complete the required route fields' : 'Mohon lengkapi data rute yang wajib diisi')
      );
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    // Filter out stops that have invalid locations
    const validStops = stops.filter(s => isLocationValid(s.location));

    onSave({
      id: initialData?.id,
      name,
      description,
      groupId: groupId || undefined,
      origin,
      destination,
      stops: validStops,
      plannedDistance,
      estimatedDuration,
      status,
      plannedPath: editorGeometry || undefined
    });
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!activeLocationTarget) return;

    const formattedCoord = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    if (activeLocationTarget === 'origin') {
      setOrigin({
        ...origin,
        type: 'coordinate',
        latitude: lat,
        longitude: lng,
        radius: origin.radius || 100,
        address: formattedCoord,
      });
    } else if (activeLocationTarget === 'destination') {
      setDestination({
        ...destination,
        type: 'coordinate',
        latitude: lat,
        longitude: lng,
        radius: destination.radius || 100,
        address: formattedCoord,
      });
    } else if (activeLocationTarget.startsWith('stop-')) {
      const stopId = activeLocationTarget;
      setStops(
        stops.map((s) =>
          s.id === stopId
            ? {
                ...s,
                location: {
                  ...s.location,
                  type: 'coordinate',
                  latitude: lat,
                  longitude: lng,
                  radius: s.location.radius || 100,
                  address: formattedCoord,
                },
              }
            : s
        )
      );
    }
    
    // Return to idle after selection
    setEditorMode('idle');
    setActiveLocationTarget(null);
  };

  const toggleLocationSelectMode = (targetId: ActiveLocationTarget) => {
    if (editorMode === 'select-location' && activeLocationTarget === targetId) {
      // Cancel
      setEditorMode('idle');
      setActiveLocationTarget(null);
    } else {
      // Activate
      setEditorMode('select-location');
      setActiveLocationTarget(targetId);
    }
  };

  const renderLocationPicker = (
    targetId: ActiveLocationTarget,
    loc: RouteLocation,
    onChange: (val: RouteLocation) => void,
    error?: string
  ) => {
    const isSelecting = editorMode === 'select-location' && activeLocationTarget === targetId;
    const currentMode: 'geofence' | 'coordinate' | 'address' | 'my_location' =
      loc.type === 'geofence' ? 'geofence' : loc.sourceMode || 'coordinate';

    const radioGroupKey = targetId || 'default-target';

    return (
      <div className="space-y-2 mt-1">
        {/* 4 Pilihan Radio Sejajar: Geofence, Koordinat, Alamat, Lokasi Saya */}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 mb-2 py-0.5">
          <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white select-none">
            <input 
              type="radio" 
              name={`loc-type-${radioGroupKey}`}
              checked={currentMode === 'geofence'} 
              onChange={() => onChange({ type: 'geofence', sourceMode: 'geofence', geofenceId: loc.geofenceId })}
              className="accent-primary-600"
            />
            {t.locationType.geofence}
          </label>
          <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white select-none">
            <input 
              type="radio" 
              name={`loc-type-${radioGroupKey}`}
              checked={currentMode === 'coordinate'} 
              onChange={() => onChange({ 
                type: 'coordinate', 
                sourceMode: 'coordinate',
                latitude: loc.latitude, 
                longitude: loc.longitude, 
                radius: loc.radius || 100, 
                address: loc.address 
              })}
              className="accent-primary-600"
            />
            {t.locationType.coordinate}
          </label>
          <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white select-none">
            <input 
              type="radio" 
              name={`loc-type-${radioGroupKey}`}
              checked={currentMode === 'address'} 
              onChange={() => onChange({ 
                type: 'coordinate', 
                sourceMode: 'address',
                latitude: loc.latitude, 
                longitude: loc.longitude, 
                radius: loc.radius || 100, 
                address: loc.address 
              })}
              className="accent-primary-600"
            />
            {t.locationType.address}
          </label>
          <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white select-none">
            <input 
              type="radio" 
              name={`loc-type-${radioGroupKey}`}
              checked={currentMode === 'my_location'} 
              onChange={() => onChange({ 
                type: 'coordinate', 
                sourceMode: 'my_location',
                latitude: loc.latitude, 
                longitude: loc.longitude, 
                radius: loc.radius || 100, 
                address: loc.address 
              })}
              className="accent-primary-600"
            />
            {t.locationType.my_location}
          </label>
        </div>

        {currentMode === 'geofence' && (
          <InputSelect
            value={loc.geofenceId || ''}
            onChange={(val) => onChange({ type: 'geofence', sourceMode: 'geofence', geofenceId: val })}
            options={geofences.map(gf => ({ value: gf.id, label: gf.name }))}
            placeholder={t.geofencePlaceholder}
            error={error}
          />
        )}

        {currentMode === 'coordinate' && (
          <CoordinateLocationField
            targetId={targetId}
            loc={loc}
            onChange={onChange}
            isSelecting={isSelecting}
            onToggleSelect={() => toggleLocationSelectMode(targetId)}
            error={error}
            locale={locale}
            t={t}
          />
        )}

        {currentMode === 'address' && (
          <AddressLocationField
            targetId={targetId}
            loc={loc}
            onChange={onChange}
            isSelecting={isSelecting}
            onToggleSelect={() => toggleLocationSelectMode(targetId)}
            error={error}
            locale={locale}
            t={t}
          />
        )}

        {currentMode === 'my_location' && (
          <MyLocationLocationField
            targetId={targetId}
            loc={loc}
            onChange={onChange}
            isSelecting={isSelecting}
            onToggleSelect={() => toggleLocationSelectMode(targetId)}
            error={error}
            locale={locale}
            t={t}
          />
        )}

        {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
      </div>
    );
  };

  // Create a temporary route object to pass to the Map so it can preview current state
  const tempRoute: Route = {
    id: initialData?.id || 'temp',
    name,
    groupId: groupId || undefined,
    origin,
    destination,
    stops,
    status,
    createdAt: '',
    updatedAt: '',
    plannedPath: editorGeometry || undefined
  };

  return (
    <div className="flex h-full w-full flex-col bg-background relative">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Panel: Map */}
        <div className="relative flex-1 bg-neutral-100 dark:bg-neutral-900">
          <RouteMap
            geofences={geofences}
            selectedRoute={tempRoute}
            editorMode={editorMode}
            editorGeometry={editorGeometry}
            onEditorGeometryChange={setEditorGeometry}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Floating Left Panel - Editor */}
        <div 
          data-layout="drawer"
          className={cn(
            "group/form absolute left-4 top-4 w-[380px] bg-background rounded-xl shadow-lg border border-border flex flex-col z-20 overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[calc(100%-80px)]" : "max-h-[44px]"
          )}
        >
          {/* Header */}
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface cursor-pointer hover:bg-surface-hover shrink-0"
          >
            <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              {initialData?.id ? t.editTitle : t.createTitle}
            </h3>
            <button className="text-foreground-muted hover:text-foreground">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Basic Info */}
            <div className="space-y-2.5">
              <InputString 
                label={t.name}
                required
                value={name}
                onChange={(val) => {
                  setName(val);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder={t.namePlaceholder}
                error={errors.name}
              />
              <InputString 
                label={t.description}
                value={description}
                onChange={setDescription}
                placeholder={t.descriptionPlaceholder}
              />
              <InputSelect
                label="Grup Rute (Opsional)"
                value={groupId}
                onChange={setGroupId}
                options={groups.map(g => ({ value: g.id, label: g.name }))}
                placeholder="Pilih Grup Rute"
              />
            </div>

            {/* Route Points */}
            <div className="relative pt-3 border-t border-border/50">
              <div className="absolute left-[11px] top-[24px] bottom-[24px] w-[2px] bg-neutral-200 dark:bg-neutral-800" />
              
              {/* Origin */}
              <div className="relative z-10 pl-6 pb-4">
                <div className="absolute left-[7px] top-1 h-2.5 w-2.5 rounded-full border-2 border-blue-500 bg-background" />
                <Label className="font-semibold text-xs text-blue-600 dark:text-blue-400">{t.origin}</Label>
                {renderLocationPicker('origin', origin, (loc) => {
                  setOrigin(loc);
                  if (errors.origin) setErrors((prev) => ({ ...prev, origin: undefined }));
                }, errors.origin)}
              </div>

              {/* Stops */}
              <div className="relative z-10 pl-6 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">{t.stops}</Label>
                </div>
                <div className="space-y-2.5">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="flex gap-2 items-start p-2 rounded-md border border-border bg-surface relative">
                      <div className="w-5 pt-1 text-[10px] font-bold text-neutral-400 text-center shrink-0">{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        {renderLocationPicker((stop.id.startsWith('stop-') ? stop.id : `stop-${stop.id}`) as ActiveLocationTarget, stop.location, (loc) => handleUpdateStopLocation(stop.id, loc))}
                      </div>
                      <Button variant="ghost" onClick={() => handleRemoveStop(stop.id)} className="h-6 w-6 p-0 text-neutral-400 hover:text-red-500 absolute top-1.5 right-1.5 shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddStop} className="mt-2 text-[10px] h-7 bg-background">
                    <Plus className="w-3 h-3 mr-1" />
                    {t.addStop}
                  </Button>
                </div>
              </div>

              {/* Destination */}
              <div className="relative z-10 pl-6">
                <div className="absolute left-[7px] top-1 h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-background" />
                <Label className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">{t.destination}</Label>
                {renderLocationPicker('destination', destination, (loc) => {
                  setDestination(loc);
                  if (errors.destination) setErrors((prev) => ({ ...prev, destination: undefined }));
                }, errors.destination)}
              </div>
            </div>

            {/* Path Drawing */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <Label className="text-[11px] font-semibold">{t.drawPath}</Label>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm"
                  variant={editorMode === 'draw_multiline' ? 'primary' : 'outline'} 
                  onClick={() => {
                    setEditorMode(editorMode === 'draw_multiline' ? 'idle' : 'draw_multiline');
                    setActiveLocationTarget(null);
                  }} 
                  className="w-full justify-center text-[11px] h-8"
                >
                  <PenTool className="w-3.5 h-3.5 mr-1.5" />
                  {editorMode === 'draw_multiline' ? 'Selesai Menggambar' : (editorGeometry ? 'Ubah Jalur' : 'Gambar Jalur (Multiline)')}
                </Button>
                {editorGeometry && (
                  <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 px-2.5 h-8" onClick={() => { setEditorGeometry(null); setEditorMode('idle'); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-neutral-500">{t.pathInstructions}</p>
            </div>

            {/* Estimations & Status */}
            <div className="space-y-2.5 pt-2 border-t border-border/50">
              <div className="grid grid-cols-2 gap-2.5">
                <InputNumber 
                  label={t.estimatedDistance}
                  value={plannedDistance || null}
                  onChange={(val) => setPlannedDistance(val || undefined)}
                />
                <InputNumber 
                  label={t.estimatedDuration}
                  value={estimatedDuration || null}
                  onChange={(val) => setEstimatedDuration(val || undefined)}
                />
              </div>
              
              <div className="pt-2">
                <InputSelect 
                  label="Status"
                  value={status}
                  onChange={(val) => setStatus(val as 'active'|'inactive')}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Full-Width Footer */}
      <div className="flex shrink-0 items-center justify-between px-6 py-4 bg-background border-t border-border/40 z-20">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {initialData?.id ? t.editTitle : t.createTitle}
          </span>
          <span className="text-xs text-foreground-muted mt-0.5">
            Mohon isi data dengan benar.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button id="route-form-cancel-btn" type="button" variant="outline" size="sm" onClick={onCancel} className="bg-background">
            {t.cancel}
          </Button>
          <Button 
            id="route-form-save-btn"
            type="button" 
            variant="primary" 
            size="sm" 
            onClick={handleSave} 
            disabled={!name.trim() || !isLocationValid(origin) || !isLocationValid(destination)}
            className="bg-danger hover:bg-danger/90 text-white min-w-[100px]"
          >
            {t.save}
          </Button>
        </div>
      </div>
    </div>
  );
}
