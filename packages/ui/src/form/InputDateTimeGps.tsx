import React, { useId, useEffect, useRef } from 'react';
import { cn } from '@adatrack/utils';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Input } from '../Input';
import { Label } from '../Label';
import { Button } from '../Button';
import { Textarea } from '../Textarea';
import { MapPin, CheckCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

// --- Types ---

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export interface InputDateTimeGpsProps extends BaseInputProps {
  /** ISO datetime-local format: "yyyy-MM-ddTHH:mm" */
  value: string;
  onChange: (value: string) => void;

  /** GPS state */
  latitude: number | null;
  longitude: number | null;
  onCoordinates: (lat: number, lng: number) => void;

  /** Address */
  address?: string;
  onAddressChange?: (value: string) => void;
  showAddress?: boolean;
  addressLabel?: string;
  addressPlaceholder?: string;

  min?: string;
  max?: string;
}

// --- Helpers ---

function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(5)}°${latDir}, ${Math.abs(lng).toFixed(5)}°${lngDir}`;
}

// --- Component ---

export function InputDateTimeGps({
  label,
  id: propId,
  name,
  value,
  onChange,
  latitude,
  longitude,
  onCoordinates,
  address = '',
  onAddressChange,
  showAddress = true,
  addressLabel = 'Alamat (Opsional)',
  addressPlaceholder = 'Masukkan keterangan lokasi...',
  error,
  helpText,
  required,
  disabled,
  className,
  min,
  max,
}: InputDateTimeGpsProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  const [gpsStatus, setGpsStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [gpsError, setGpsError] = React.useState<string>('');
  const hasMounted = useRef(false);

  const fetchLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsError('Geolocation tidak didukung oleh browser ini.');
      return;
    }
    setGpsStatus('loading');
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onCoordinates(pos.coords.latitude, pos.coords.longitude);
        setGpsStatus('success');
      },
      (err) => {
        setGpsStatus('error');
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Izin lokasi ditolak. Aktifkan akses lokasi di browser.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError('Lokasi tidak tersedia saat ini.');
        } else {
          setGpsError('Gagal mendapatkan lokasi. Coba lagi.');
        }
      },
      { timeout: 10000, maximumAge: 30000, enableHighAccuracy: true }
    );
  }, [onCoordinates]);

  // Auto-fetch on mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      fetchLocation();
    }
  }, [fetchLocation]);

  // Auto-fetch on datetime change (after mount)
  const prevValue = useRef(value);
  useEffect(() => {
    if (prevValue.current !== value && hasMounted.current) {
      prevValue.current = value;
      fetchLocation();
    }
  }, [value, fetchLocation]);

  const hasCoordinates = latitude !== null && longitude !== null;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      {/* Datetime + GPS Button Row */}
      <div className="flex items-stretch gap-2">
        <Input
          id={id}
          name={name}
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          error={!!error}
          min={min}
          max={max}
          className={cn(formInputClass, 'flex-1')}
        />
        <Button
          type="button"
          variant={hasCoordinates ? 'secondary' : 'outline'}
          size="sm"
          disabled={disabled || gpsStatus === 'loading'}
          onClick={fetchLocation}
          className={cn(
            'shrink-0 gap-1.5 transition-all px-3',
            hasCoordinates && 'bg-success/10 hover:bg-success/20 text-success border-success/30',
            gpsStatus === 'error' && !hasCoordinates && 'border-warning text-warning hover:bg-warning/5'
          )}
          title={hasCoordinates ? 'Perbarui lokasi' : 'Ambil lokasi saat ini'}
        >
          {gpsStatus === 'loading' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : hasCoordinates ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : gpsStatus === 'error' ? (
            <RefreshCw className="w-3.5 h-3.5" />
          ) : (
            <MapPin className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline text-xs">
            {gpsStatus === 'loading'
              ? 'Mengambil...'
              : hasCoordinates
              ? 'Perbarui'
              : gpsStatus === 'error'
              ? 'Coba Lagi'
              : 'Lokasi'}
          </span>
        </Button>
      </div>

      {/* GPS Status Row */}
      {gpsStatus !== 'idle' && (
        <div className="mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
          {gpsStatus === 'loading' && (
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Mengambil koordinat GPS...
            </p>
          )}
          {gpsStatus === 'success' && hasCoordinates && (
            <p className="text-[11px] text-success flex items-center gap-1 font-medium">
              <CheckCircle className="w-3 h-3" />
              {formatCoordinates(latitude!, longitude!)}
            </p>
          )}
          {gpsStatus === 'error' && (
            <p className="text-[11px] text-warning flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {gpsError}
            </p>
          )}
        </div>
      )}

      {/* Address textarea */}
      {showAddress && hasCoordinates && onAddressChange && (
        <div className="mt-3 animate-in fade-in duration-300">
          <Label
            className={cn(
              'mb-1 block text-xs text-muted-foreground',
              'group-data-[layout=drawer]/form:!text-[11px]',
              'group-data-[layout=dialog]/form:!text-[11px]',
              'group-data-[layout=default]/form:!text-[11px]'
            )}
          >
            {addressLabel}
          </Label>
          <Textarea
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder={addressPlaceholder}
            rows={2}
            className={cn(
              'resize-none text-sm',
              'group-data-[layout=drawer]/form:!text-[12px]',
              'group-data-[layout=dialog]/form:!text-[12px]',
              'group-data-[layout=default]/form:!text-[13px]'
            )}
          />
        </div>
      )}
    </BaseField>
  );
}
