'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Button } from '@adatrack/ui';
import { Hexagon, MapPin, ArrowRight, Compass, Shield, X } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { TrackingVehicle } from '../../types/tracking';
import type { Locale } from '@adatrack/types';
import { createCirclePolygon } from '../../utils/playbackLayerMatcher';

export interface CreateGeofenceFromVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: TrackingVehicle;
  locale?: Locale;
}

const RADIUS_PRESETS = [50, 100, 200, 500, 1000, 2000];

export function CreateGeofenceFromVehicleModal({
  isOpen,
  onClose,
  vehicle,
  locale = 'id',
}: CreateGeofenceFromVehicleModalProps) {
  const router = useRouter();

  const [radius, setRadius] = useState<number>(100);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Reset form whenever modal opens with a vehicle
  useEffect(() => {
    if (isOpen && vehicle) {
      setRadius(100);
      setName(`Geofence ${vehicle.plateNumber}`);
      setDescription('');
    }
  }, [isOpen, vehicle]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!vehicle) return;

    const currentRadius = Math.max(10, Number(radius) || 100);
    const circleCoords = createCirclePolygon(
      { lat: vehicle.location.lat, lng: vehicle.location.lng },
      currentRadius,
      36
    );

    const draftGeofence = {
      name: name.trim() || `Geofence ${vehicle.plateNumber}`,
      description: description.trim() || (locale === 'en'
        ? `Circle geofence for ${vehicle.plateNumber} at ${vehicle.location.address || `${vehicle.location.lat.toFixed(5)}, ${vehicle.location.lng.toFixed(5)}`} (Radius ${currentRadius}m)`
        : `Geofence lingkaran untuk ${vehicle.plateNumber} di ${vehicle.location.address || `${vehicle.location.lat.toFixed(5)}, ${vehicle.location.lng.toFixed(5)}`} (Radius ${currentRadius}m)`),
      status: 'active',
      geometry: {
        type: 'polygon' as const,
        coordinates: circleCoords,
      },
    };

    try {
      sessionStorage.setItem('adatrack_draft_geofence', JSON.stringify(draftGeofence));
    } catch (err) {
      console.error('Failed to save draft geofence to sessionStorage:', err);
    }

    onClose();
    router.push('/geofences');
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      hideCloseButton
      className="max-w-[420px] p-3.5 sm:p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Header sejajar dengan tombol close */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
              <Hexagon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground leading-tight">
                {locale === 'id' ? 'Buat Geofence Baru' : 'Create New Geofence'}
              </h3>
              <p className="text-[11px] text-foreground-muted mt-0.5 truncate">
                {locale === 'id'
                  ? 'Zona lingkaran di sekitar kendaraan saat ini'
                  : 'Circle zone around the current vehicle'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 -mr-1 -mt-1 rounded-md p-1.5 text-foreground-muted hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
            aria-label={locale === 'id' ? 'Tutup dialog' : 'Close dialog'}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Vehicle Location Summary Card (Consistent fixed height) */}
        <div className="h-[58px] p-2.5 rounded-lg bg-surface/70 border border-border flex flex-col justify-between text-xs">
          <div className="flex items-center justify-between font-semibold text-foreground leading-none">
            <span className="flex items-center gap-1.5 text-xs truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
              {vehicle.plateNumber}
            </span>
            <span className="text-foreground-muted text-[11px] font-normal truncate max-w-[150px]">
              {vehicle.driverName || '-'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-foreground-muted text-[11px] pt-1 border-t border-border/40 leading-none">
            <MapPin className="w-3 h-3 text-red-600 dark:text-red-400 shrink-0" />
            <p className="truncate text-foreground font-medium flex-1">
              {vehicle.location.address || (locale === 'id' ? 'Lokasi saat ini' : 'Current location')}
            </p>
            <span className="font-mono text-[10px] text-foreground-muted shrink-0">
              {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-2.5">
          {/* Geofence Name */}
          <div>
            <label className="block text-[11px] font-semibold text-foreground mb-1 leading-none">
              {locale === 'id' ? 'Nama Geofence' : 'Geofence Name'}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={locale === 'id' ? 'Contoh: Area Parkir Slipi' : 'e.g. Slipi Parking Area'}
              className="w-full h-8 px-2.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Radius Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-0.5 leading-none">
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-semibold text-foreground">
                  {locale === 'id' ? 'Radius Area' : 'Area Radius'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <span className="text-[10px] text-foreground-muted font-mono">
                  (Ø ~{radius * 2 >= 1000 ? `${((radius * 2) / 1000).toFixed(1)} km` : `${radius * 2} m`})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={10}
                  max={50000}
                  value={radius}
                  onChange={(e) => setRadius(Math.max(10, Number(e.target.value) || 0))}
                  className="w-16 h-7 px-2 text-right text-xs font-mono font-bold text-red-600 dark:text-red-400 rounded-md border border-border bg-background focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">m</span>
              </div>
            </div>

            {/* Slider with vertical breathing room */}
            <div className="py-1">
              <input
                type="range"
                min={10}
                max={2000}
                step={10}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-red-600 dark:accent-red-500 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer block"
              />
            </div>

            {/* Presets Chips: Fixed 6-column grid to guarantee consistent single-line height without wrap */}
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {RADIUS_PRESETS.map((p) => {
                const isSelected = radius === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setRadius(p)}
                    className={cn(
                      'h-7 px-1 text-[11px] rounded-md font-medium border transition-colors flex items-center justify-center truncate',
                      isSelected
                        ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 dark:border-red-500 font-bold shadow-sm'
                        : 'border-border bg-background text-foreground-muted hover:border-foreground-muted hover:text-foreground'
                    )}
                  >
                    {p >= 1000 ? `${p / 1000} km` : `${p} m`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs h-8 px-3.5"
          >
            {locale === 'id' ? 'Batal' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            size="sm"
            className="text-xs h-8 px-4 gap-1.5 font-medium bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-0 shadow-sm transition-colors"
          >
            <Hexagon className="w-3.5 h-3.5" />
            <span>{locale === 'id' ? 'Lanjutkan ke Geofence' : 'Continue to Geofence'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
