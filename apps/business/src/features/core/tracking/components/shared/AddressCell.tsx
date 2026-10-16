'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@adatrack/utils';

// Global in-memory cache to ensure fast rendering across table rows
const addressCache = new Map<string, string>();
const inFlightRequests = new Map<string, Promise<string>>();

export async function reverseGeocodeCoord(lat: number, lng: number): Promise<string> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (addressCache.has(cacheKey)) {
    return addressCache.get(cacheKey)!;
  }
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const req = (async () => {
    // 1. Google Maps Geocoding API if key configured
    const googleKey = (process.env as any).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (googleKey) {
      try {
        const gUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleKey}&language=id`;
        const gRes = await fetch(gUrl);
        if (gRes.ok) {
          const gData = await gRes.json();
          if (gData.status === 'OK' && gData.results?.length > 0) {
            const addr = gData.results[0].formatted_address;
            if (addr) {
              addressCache.set(cacheKey, addr);
              return addr;
            }
          }
        }
      } catch {
        // fallback to Nominatim
      }
    }

    // 2. High-precision Reverse Geocoding via Nominatim (OpenStreetMap with accept-language: id)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'id-ID,id;q=0.9',
          'User-Agent': 'Adatrack-Web-Tracker/1.0',
        },
      });
      if (res.ok) {
        const data = await res.json();
        const displayName = data.display_name;
        if (displayName) {
          addressCache.set(cacheKey, displayName);
          return displayName;
        }
      }
    } catch {
      // ignore
    } finally {
      inFlightRequests.delete(cacheKey);
    }
    return '';
  })();

  inFlightRequests.set(cacheKey, req);
  return req;
}

function isValidAddress(addr?: string | null): addr is string {
  if (!addr) return false;
  const trimmed = addr.trim();
  if (trimmed === '' || trimmed === '-' || trimmed.toLowerCase() === 'unknown') return false;
  // If it's pure coordinate numbers (e.g. "-6.2088, 106.8456")
  if (/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(trimmed)) return false;
  // If it's just a generic province/country name alone (e.g. "Jawa Barat, Indonesia", "DKI Jakarta, Indonesia")
  if (/^(jawa\s+(barat|timur|tengah)|dki\s+jakarta|daerah\s+khusus\s+ibukota\s+jakarta|banten|bali|di\s+yogyakarta|yogyakarta|sumatera|kalimantan|sulawesi|papua|indonesia)(,\s*(indonesia))?$/i.test(trimmed)) {
    return false;
  }
  return true;
}

export interface AddressCellProps {
  lat?: number;
  lng?: number;
  address?: string | null;
  className?: string;
  placeholder?: string;
}

export function AddressCell({
  lat,
  lng,
  address: initialAddress,
  className,
  placeholder = '-',
}: AddressCellProps) {
  const [address, setAddress] = useState<string | null>(() => {
    if (isValidAddress(initialAddress)) return initialAddress;
    if (lat !== undefined && lng !== undefined && (lat !== 0 || lng !== 0)) {
      const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      return addressCache.get(cacheKey) || null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isValidAddress(initialAddress)) {
      setAddress(initialAddress);
      return;
    }

    if (lat === undefined || lng === undefined || (lat === 0 && lng === 0)) {
      setAddress(null);
      return;
    }

    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    if (addressCache.has(cacheKey)) {
      setAddress(addressCache.get(cacheKey)!);
      return;
    }

    let isMounted = true;
    setLoading(true);

    reverseGeocodeCoord(lat, lng)
      .then((resolved) => {
        if (isMounted) {
          if (resolved) setAddress(resolved);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lat, lng, initialAddress]);

  const display = address || (loading ? 'Memuat alamat...' : placeholder);

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-foreground-muted max-w-[280px] truncate select-text',
        className
      )}
      title={address || undefined}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 shrink-0 opacity-50 animate-spin text-foreground-muted" />
      ) : (
        <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60 text-foreground-muted" />
      )}
      <span className={cn('truncate', loading && 'text-foreground-subtle italic text-[11px]')}>
        {display}
      </span>
    </div>
  );
}

export interface CoordinateCellProps {
  lat?: number;
  lng?: number;
  className?: string;
  tooltipTitle?: string;
}

export function CoordinateCell({
  lat,
  lng,
  className,
  tooltipTitle = 'Buka di Google Maps',
}: CoordinateCellProps) {
  if (lat === undefined || lng === undefined || (lat === 0 && lng === 0)) {
    return <span className="text-foreground-muted font-mono text-[12px]">-</span>;
  }

  const coordStr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  const gmapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <a
      href={gmapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[12px] text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors tabular-nums select-all',
        className
      )}
      title={`${tooltipTitle}: ${coordStr}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
      <span>{coordStr}</span>
    </a>
  );
}
