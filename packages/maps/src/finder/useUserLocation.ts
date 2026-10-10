import { useEffect, useRef, useCallback } from 'react';
import { useMapActions } from '../core/MapContext';

export interface UseUserLocationOptions {
  /** Koordinat target (kendaraan) untuk auto-fit bounds saat lokasi pengguna pertama kali didapat */
  targetCoord: { lat: number; lng: number };
  /** Padding untuk fitBounds. Default: 100 */
  fitPadding?: number;
  /** Max zoom saat fitBounds. Default: 17 */
  fitMaxZoom?: number;
  /** Delay sebelum fitBounds dijalankan (ms) untuk menunggu map render. Default: 800 */
  fitDelay?: number;
  /** Callback saat lokasi pengguna berhasil didapat atau diperbarui */
  onLocationChange?: (coord: { lat: number; lng: number }) => void;
  /** Callback saat geolocation error */
  onError?: (message: string) => void;
}

export interface UseUserLocationReturn {
  /** Minta ulang lokasi pengguna dan pan ke posisinya */
  locateUser: () => void;
  /** Fit bounds untuk menampilkan target + posisi pengguna */
  fitBothInView: (userCoord: { lat: number; lng: number }) => void;
}

/**
 * Hook geolocation terintegrasi dengan map actions.
 * - Auto-request lokasi on mount.
 * - Auto-fit bounds ke target + pengguna saat lokasi pertama kali didapat.
 * - Expose `locateUser()` dan `fitBothInView()` untuk kontrol manual.
 */
export function useUserLocation({
  targetCoord,
  fitPadding = 100,
  fitMaxZoom = 17,
  fitDelay = 800,
  onLocationChange,
  onError,
}: UseUserLocationOptions): UseUserLocationReturn {
  const { panTo, fitBounds } = useMapActions();
  const fittedRef = useRef(false);
  const onLocationChangeRef = useRef(onLocationChange);
  const onErrorRef = useRef(onError);

  onLocationChangeRef.current = onLocationChange;
  onErrorRef.current = onError;

  const fitBothInView = useCallback(
    (userCoord: { lat: number; lng: number }) => {
      fitBounds(
        [
          [Math.min(targetCoord.lng, userCoord.lng), Math.min(targetCoord.lat, userCoord.lat)],
          [Math.max(targetCoord.lng, userCoord.lng), Math.max(targetCoord.lat, userCoord.lat)],
        ],
        { padding: fitPadding, maxZoom: fitMaxZoom, duration: 1500 } as Parameters<typeof fitBounds>[1]
      );
    },
    [targetCoord, fitPadding, fitMaxZoom, fitBounds]
  );

  const locateUser = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      onErrorRef.current?.('Browser Anda tidak mendukung fitur lokasi.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onLocationChangeRef.current?.(coord);
        panTo(coord);
      },
      () => {
        onErrorRef.current?.('Gagal mendapatkan lokasi. Aktifkan izin GPS di browser Anda.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [panTo]);

  // Auto-request on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onLocationChangeRef.current?.(coord);
      },
      (err) => console.warn('Geolocation denied:', err.message),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fit bounds saat userCoord pertama kali tersedia
  // Dipanggil dari VehicleFinderMap setelah userCoord state berubah
  const scheduleFit = useCallback(
    (userCoord: { lat: number; lng: number }) => {
      if (fittedRef.current) return;
      const timer = setTimeout(() => {
        fitBothInView(userCoord);
        fittedRef.current = true;
      }, fitDelay);
      return () => clearTimeout(timer);
    },
    [fitBothInView, fitDelay]
  );

  return { locateUser, fitBothInView: scheduleFit as UseUserLocationReturn['fitBothInView'] };
}
