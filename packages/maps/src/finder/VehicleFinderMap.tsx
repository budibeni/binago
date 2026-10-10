'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Crosshair, MapPin, LocateFixed } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { MapProvider } from '../core/MapContext';
import { MapContainer } from '../core/MapContainer';
import { EntityMarker } from '../tracking/EntityMarker';
import { BasemapSwitcher } from '../controls/BasemapSwitcher';
import { UserLocationMarker } from './UserLocationMarker';
import { useMapActions, useInternalMap } from '../core/MapContext';
import type { BasemapId } from '../basemaps/types';
import type { Locale } from '../i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VehicleFinderMapProps {
  /** Koordinat target (kendaraan/titik tujuan) */
  targetCoord: { lat: number; lng: number };
  /** Label pill pada marker target. Contoh: "B 1001 GHI" */
  targetLabel?: string;
  /** Warna marker target. Default: merah ADATRACK (#ef4444) */
  targetColor?: string;
  /** Heading (derajat) marker target untuk arah panah. Default: 0 */
  targetHeading?: number;

  /** Basemap aktif – controlled dari luar agar parent bisa simpan state */
  basemap?: BasemapId;
  onBasemapChange?: (id: BasemapId) => void;

  /**
   * Callback saat lokasi pengguna berhasil didapat/diperbarui.
   * Gunakan untuk menghitung jarak, menampilkan info, dll di parent.
   */
  onUserLocationChange?: (coord: { lat: number; lng: number }) => void;

  /** Label pill pada marker posisi pengguna. Default: "Saya" */
  userLabel?: string;

  /** Locale untuk BasemapSwitcher. Default: 'id' */
  locale?: Locale;

  className?: string;

  /**
   * Slot untuk overlay tambahan di atas peta (info card, SOS form, dll).
   * Dirender di dalam container map, di atas semua layer.
   */
  children?: React.ReactNode;
}

// ─── Inner Controls (needs MapProvider context) ───────────────────────────────

interface FinderControlsProps {
  targetCoord: { lat: number; lng: number };
  userCoord: { lat: number; lng: number } | null;
  setUserCoord: (c: { lat: number; lng: number }) => void;
  basemap: BasemapId;
  setBasemap: (b: BasemapId) => void;
  locale: Locale;
  onUserLocationChange?: (coord: { lat: number; lng: number }) => void;
}

function FinderControls({
  targetCoord,
  userCoord,
  setUserCoord,
  basemap,
  setBasemap,
  locale,
  onUserLocationChange,
}: FinderControlsProps) {
  const { panTo, fitBounds } = useMapActions();
  const fittedRef = useRef(false);

  // ── Helpers ──

  const computeBounds = useCallback(
    (u: { lat: number; lng: number }) =>
      [
        [Math.min(targetCoord.lng, u.lng), Math.min(targetCoord.lat, u.lat)],
        [Math.max(targetCoord.lng, u.lng), Math.max(targetCoord.lat, u.lat)],
      ] as [[number, number], [number, number]],
    [targetCoord]
  );

  // ── Auto-request geolocation on mount ──
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoord(coord);
        onUserLocationChange?.(coord);
      },
      (err) => console.warn('Geolocation denied:', err.message),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-fit bounds when user location first becomes available ──
  useEffect(() => {
    if (!userCoord || fittedRef.current) return;
    const timer = setTimeout(() => {
      fitBounds(computeBounds(userCoord), { padding: 100, maxZoom: 17, duration: 1500 } as Parameters<typeof fitBounds>[1]);
      fittedRef.current = true;
    }, 800);
    return () => clearTimeout(timer);
  }, [userCoord, computeBounds, fitBounds]);

  // ── Handlers ──

  const handleLocateMe = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      alert('Browser Anda tidak mendukung fitur lokasi.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoord(coord);
        onUserLocationChange?.(coord);
        panTo(coord);
      },
      () => alert('Gagal mendapatkan lokasi. Aktifkan izin GPS di browser Anda.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLocateTarget = () => panTo(targetCoord);

  const handleFitBoth = () => {
    if (userCoord) {
      fitBounds(computeBounds(userCoord), { padding: 80 });
      return;
    }
    // Belum ada lokasi user → minta dulu lalu fit
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoord(coord);
          onUserLocationChange?.(coord);
          fitBounds(computeBounds(coord), { padding: 80 });
        },
        () => panTo(targetCoord),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      panTo(targetCoord);
    }
  };

  // ── Render ──

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center bg-background rounded-xl border border-border shadow-lg p-0.5 gap-0.5 flex-row pointer-events-auto h-8">
      {/* Basemap switcher */}
      <div className="flex items-center justify-center h-full">
        <BasemapSwitcher
          value={basemap}
          onChange={setBasemap}
          compact
          locale={locale}
          className="flex items-center h-full text-foreground-muted"
        />
      </div>

      <Sep />

      <IconBtn icon={Crosshair} title="Tampilkan semua" onClick={handleFitBoth} />
      <Sep />
      <IconBtn icon={MapPin} title="Fokus ke target" onClick={handleLocateTarget} />
      <Sep />
      <IconBtn icon={LocateFixed} title="Fokus ke posisi saya" onClick={handleLocateMe} />
    </div>
  );
}

// ─── Tiny UI primitives ───────────────────────────────────────────────────────

function Sep() {
  return <div className="w-px bg-border shrink-0 self-stretch my-0.5" />;
}

function IconBtn({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150 shrink-0 text-foreground-muted hover:bg-surface hover:text-foreground"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

// ─── VehicleFinderMap ─────────────────────────────────────────────────────────

/**
 * Composite map component untuk fitur "temukan kendaraan".
 *
 * Sudah include:
 * - MapProvider + MapContainer
 * - EntityMarker (target kendaraan)
 * - UserLocationMarker (posisi pengguna, auto-requested)
 * - Compact toolbar: BasemapSwitcher + Fit Both + Locate Target + Locate Me
 * - Auto-fit bounds saat lokasi pengguna pertama kali tersedia
 *
 * Info card, SOS form, dan overlay domain-specific diletakkan via `children`.
 *
 * @example
 * ```tsx
 * <VehicleFinderMap
 *   targetCoord={{ lat: -6.3012, lng: 106.3518 }}
 *   targetLabel="B 1001 GHI"
 *   basemap={basemap}
 *   onBasemapChange={setBasemap}
 *   onUserLocationChange={setDriverCoord}
 *   className="w-full h-full"
 * >
 *   {showInfoCard && <VehicleInfoCard ... />}
 * </VehicleFinderMap>
 * ```
 */
export function VehicleFinderMap({
  targetCoord,
  targetLabel,
  targetColor = '#ef4444',
  targetHeading = 0,
  basemap: externalBasemap,
  onBasemapChange,
  onUserLocationChange,
  userLabel = 'Saya',
  locale = 'id',
  className,
  children,
}: VehicleFinderMapProps) {
  // Basemap state: jika dicontrol dari luar, gunakan external; jika tidak, manage internal
  const [internalBasemap, setInternalBasemap] = useState<BasemapId>('standard');
  const basemap = externalBasemap ?? internalBasemap;
  const setBasemap = (id: BasemapId) => {
    setInternalBasemap(id);
    onBasemapChange?.(id);
  };

  const [userCoord, setUserCoord] = useState<{ lat: number; lng: number } | null>(null);

  const handleUserCoordChange = (coord: { lat: number; lng: number }) => {
    setUserCoord(coord);
    onUserLocationChange?.(coord);
  };

  return (
    <div className={cn('relative w-full h-full bg-slate-900', className)}>
      <MapProvider>
        <MapContainer
          viewport={{ center: targetCoord, zoom: 17 }}
          basemap={basemap}
          className="w-full h-full"
        >
          {/* Target marker (vehicle / destination) */}
          <EntityMarker
            id="finder-target"
            position={targetCoord}
            heading={targetHeading}
            label={targetLabel}
            color={targetColor}
          />

          {/* User location marker */}
          {userCoord && (
            <UserLocationMarker position={userCoord} label={userLabel} />
          )}
        </MapContainer>

        {/* Controls – inside MapProvider to access map context */}
        <FinderControls
          targetCoord={targetCoord}
          userCoord={userCoord}
          setUserCoord={handleUserCoordChange}
          basemap={basemap}
          setBasemap={setBasemap}
          locale={locale}
          onUserLocationChange={onUserLocationChange}
        />
      </MapProvider>

      {/* Domain-specific overlays (info card, SOS form, dll) */}
      {children}
    </div>
  );
}
