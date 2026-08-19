'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { useMapActions, useInternalMap } from '../core/MapContext';
import maplibregl from 'maplibre-gl';
import { cn } from '@adatrack/utils';
import { Locale, getMapTranslation } from '../i18n';
import type { LocationSearchResult } from './types';

export interface SearchLocationToolProps {
  /**
   * Callback abstraction untuk pencarian alamat.
   * Consumer (apps/personal) menyediakan implementasi provider geocoding.
   * Jika tidak disediakan, gunakan mock result untuk development.
   */
  onSearchAddress?: (query: string) => Promise<LocationSearchResult[]>;
  className?: string;
  locale?: Locale;
}

/** Mock result untuk development — tidak bergantung pada provider geocoding */
async function mockSearchAddress(query: string): Promise<LocationSearchResult[]> {
  await new Promise((r) => setTimeout(r, 400)); // simulasi latency
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

type Tab = 'address' | 'coordinate';

export function SearchLocationTool({ onSearchAddress, className, locale = 'id' }: SearchLocationToolProps) {
  const t = getMapTranslation(locale).search;
  const { panTo } = useMapActions();
  const map = useInternalMap();
  const [tab, setTab] = useState<Tab>('address');
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Address tab state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Coordinate tab state
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [coordError, setCoordError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, []);

  const placeTemporaryMarker = (markerLat: number, markerLng: number) => {
    if (!map) return;
    if (markerRef.current) {
      markerRef.current.remove();
    }
    markerRef.current = new maplibregl.Marker({ color: 'var(--color-accent)' }) // Accent color marker
      .setLngLat([markerLng, markerLat])
      .addTo(map);
  };

  const handleSearchAddress = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setResults([]);
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

  const handleSelectResult = (result: LocationSearchResult) => {
    panTo({ lat: result.lat, lng: result.lng });
    placeTemporaryMarker(result.lat, result.lng);
    setResults([]);
    setQuery(result.label);
  };

  const handleGoToCoordinate = () => {
    setCoordError(null);
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setCoordError(t.invalidCoordinate);
      return;
    }
    panTo({ lat: latNum, lng: lngNum });
    placeTemporaryMarker(latNum, lngNum);
  };

  return (
    <div className={cn('w-72 text-sm', className)}>
      {/* Tabs */}
      <div className="flex bg-surface p-1 rounded-lg mb-4">
        {(['address', 'coordinate'] as Tab[]).map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => setTab(tabKey)}
            className={cn(
              'flex-1 py-1.5 text-xs font-medium transition-all rounded-md',
              tab === tabKey
                ? 'bg-background text-foreground shadow-sm'
                : 'text-foreground-muted hover:text-foreground hover:bg-background/50',
            )}
          >
            {tabKey === 'address' ? t.addressTab : t.coordinateTab}
          </button>
        ))}
      </div>

      {/* Address tab */}
      {tab === 'address' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              id="search-address-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchAddress()}
              placeholder={t.searchPlaceholder}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
            <button
              type="button"
              onClick={handleSearchAddress}
              disabled={isSearching || !query.trim()}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground transition-colors shrink-0"
              aria-label={t.searchBtn}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {isSearching && (
            <p className="text-xs text-foreground-muted text-center py-2">{t.searching}</p>
          )}

          {searchError && (
            <p className="text-xs text-danger">{searchError}</p>
          )}

          {results.length > 0 && (
            <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
              {results.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectResult(r)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-surface transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-foreground font-medium leading-tight mb-0.5">
                      {r.label}
                    </p>
                    <p className="text-[10px] text-foreground-muted tabular-nums">
                      {r.lat.toFixed(5)}, {r.lng.toFixed(5)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Coordinate tab */}
      {tab === 'coordinate' && (
        <div className="space-y-2">
          <div className="space-y-2">
            <div>
              <label
                htmlFor="coord-lat"
                className="block text-xs font-medium text-foreground-muted mb-1"
              >
                Latitude
              </label>
              <input
                id="coord-lat"
                type="number"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="-6.2088"
                step="any"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent tabular-nums"
              />
            </div>
            <div>
              <label
                htmlFor="coord-lng"
                className="block text-xs font-medium text-foreground-muted mb-1"
              >
                Longitude
              </label>
              <input
                id="coord-lng"
                type="number"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="106.8456"
                step="any"
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent tabular-nums"
              />
            </div>
          </div>

          {coordError && (
            <p className="text-xs text-danger">{coordError}</p>
          )}

          <button
            type="button"
            id="coord-go-button"
            onClick={handleGoToCoordinate}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-medium transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            {t.gotoBtn}
          </button>
        </div>
      )}
    </div>
  );
}
