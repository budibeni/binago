'use client';

import React, { useState } from 'react';
import { ArrowLeft, Car, MapPin, Clock, Play, Route, WifiOff, ChevronLeft, ChevronRight, CalendarDays, Share2 } from 'lucide-react';
import { Vehicle, Trip, VehicleStatus } from '../types';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { EmptyState } from '@/components/EmptyState';
import { ShareLocationDialog } from '@/features/sharing/components/ShareLocationDialog';
import { useShareLocation } from '@/features/sharing/context/ShareLocationContext';

export interface VehicleDetailProps {
  vehicle: Vehicle;
  trips: Trip[];
  onBack: () => void;
  onTripSelect: (trip: Trip) => void;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export function VehicleDetail({
  vehicle,
  trips,
  selectedDate,
  onDateChange,
  onBack,
  onTripSelect,
}: VehicleDetailProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const ls = t.locationSharing;
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { getActiveSession } = useShareLocation();
  const activeShare = getActiveSession(vehicle.id);

  const getStatusDisplay = (status: VehicleStatus) => {
    switch(status) {
      case 'driving':
        return { text: t.tracking.statusDriving, color: 'text-green-600', dot: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-950/20' };
      case 'idle':
        return { text: t.tracking.statusIdle, color: 'text-amber-600', dot: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' };
      case 'parking':
        return { text: t.tracking.statusParking, color: 'text-neutral-500', dot: 'bg-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800/40' };
      case 'offline':
        return { text: t.tracking.statusOffline, color: 'text-foreground-muted', dot: 'bg-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800/40' };
      default:
        return { text: status, color: 'text-foreground-muted', dot: 'bg-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800/40' };
    }
  };

  const statusDisplay = getStatusDisplay(vehicle.status);
  const isOffline = vehicle.status === 'offline';

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatRelativeTime = (isoString: string) => {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diff = now - then;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return locale === 'en' ? `${days}d ago` : `${days} hari lalu`;
    if (hours > 0) return locale === 'en' ? `${hours}h ago` : `${hours} jam lalu`;
    if (minutes > 0) return locale === 'en' ? `${minutes}m ago` : `${minutes} menit lalu`;
    return locale === 'en' ? 'just now' : 'baru saja';
  };

  const dateObj = selectedDate 
    ? new Date(Number(selectedDate.split('-')[0]), Number(selectedDate.split('-')[1]) - 1, Number(selectedDate.split('-')[2])) 
    : new Date();
  
  const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', dateOptions);
  
  const today = new Date();
  const isToday = dateObj.getDate() === today.getDate() && dateObj.getMonth() === today.getMonth() && dateObj.getFullYear() === today.getFullYear();

  const handlePrevDay = () => {
    const prev = new Date(dateObj);
    prev.setDate(prev.getDate() - 1);
    onDateChange?.(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}`);
  };

  const handleNextDay = () => {
    const next = new Date(dateObj);
    next.setDate(next.getDate() + 1);
    onDateChange?.(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`);
  };

  const filteredTrips = trips.filter(trip => !selectedDate || trip.date === selectedDate);

  return (
    <div className="flex flex-col h-full bg-surface text-foreground border-r border-border">
      {/* Header */}
      <div className="flex items-center px-4 py-4 shrink-0 border-b border-border">
        <button 
          onClick={onBack}
          className="p-1 mr-2 text-foreground-muted hover:text-foreground transition-colors rounded-full hover:bg-surface-elevated"
          aria-label={t.tracking.back || t.settings?.back || 'Kembali'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-[15px]">{t.tracking?.vehicleDetail || 'Detail Kendaraan'}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Vehicle Info */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-start">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-xl bg-surface-elevated text-foreground-subtle mr-4 border border-border">
              <Car className="w-10 h-10" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate text-foreground">{vehicle.type}</h3>
              <p className="text-foreground-muted text-sm font-medium">{vehicle.plateNumber}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border border-border ${statusDisplay.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${statusDisplay.dot}`} />
                  <span className={`text-xs font-semibold ${statusDisplay.color}`}>
                    {statusDisplay.text}
                  </span>
                </div>
                {vehicle.speed !== undefined && vehicle.speed > 0 && (
                  <div className="flex items-center px-2 py-1 rounded-md bg-surface-elevated border border-border">
                    <span className="text-xs font-semibold text-foreground">{vehicle.speed} {t.tracking?.speedUnit || 'km/jam'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-surface-elevated rounded-xl p-3 space-y-2">
            {isOffline && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                <WifiOff className="w-3.5 h-3.5 text-foreground-subtle shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
                  {t.tracking?.offlineLastLocation || 'Lokasi terakhir'}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-foreground-subtle shrink-0 mt-0.5" />
              <span className="text-sm text-foreground leading-tight">
                {vehicle.location.address || `${vehicle.location.lat.toFixed(4)}, ${vehicle.location.lng.toFixed(4)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-foreground-subtle shrink-0" />
              <span className="text-xs text-foreground-muted">
                {isOffline 
                  ? `${t.tracking?.lastSeen || 'Terakhir terlihat'}: ${formatRelativeTime(vehicle.lastUpdate)}`
                  : `${t.tracking?.lastUpdate || 'Update terakhir'}: ${formatTime(vehicle.lastUpdate)}`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Share Location Action */}
        <div className="px-4 pb-4 pt-2 border-b border-border flex flex-col gap-2">
          {activeShare && (
            <button
              type="button"
              onClick={() => setShareDialogOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-left w-full"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-none">{ls.activeSharing}</p>
                <p className="text-[11px] mt-0.5 opacity-80">{ls.manageSharing}</p>
              </div>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShareDialogOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-border bg-surface-elevated hover:bg-surface text-sm font-medium text-foreground transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {activeShare ? ls.manageSharing : ls.shareLocation}
          </button>
          <ShareLocationDialog
            vehicle={vehicle}
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
          />
        </div>

        {/* Trip History */}
        <div className="p-4">
          <div className="flex items-center justify-between bg-surface-elevated rounded-xl p-1 mb-4 border border-border">
            <button
              onClick={handlePrevDay}
              className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors"
              aria-label={t.tracking?.prevDay || 'Hari sebelumnya'}
              title={t.tracking?.prevDay || 'Hari sebelumnya'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 relative">
              <span className="text-sm font-semibold text-foreground">
                {formattedDate} {isToday && <span className="text-foreground-muted font-normal">({t.tracking?.today || 'Hari ini'})</span>}
              </span>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-foreground-muted" />
                <input
                  type="date"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={selectedDate || ''}
                  onChange={(e) => {
                    if (e.target.value) onDateChange?.(e.target.value);
                  }}
                  title="Pilih Tanggal"
                />
              </div>
            </div>

            <button
              onClick={handleNextDay}
              className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors"
              aria-label={t.tracking?.nextDay || 'Hari berikutnya'}
              title={t.tracking?.nextDay || 'Hari berikutnya'}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {filteredTrips.length === 0 ? (
            <EmptyState
              icon={Route}
              title={t.tracking?.noTripsDate || 'Tidak ada perjalanan'}
              description={t.tracking?.noTripsDateDesc || 'Kendaraan tidak melakukan perjalanan pada tanggal ini.'}
              className="py-8 px-2"
            />
          ) : (
            <div className="space-y-3">
              {filteredTrips.map((trip) => (
                <div 
                  key={trip.id}
                  onClick={() => onTripSelect(trip)}
                  className="p-3 rounded-xl border border-border hover:border-red-500 transition-colors cursor-pointer group bg-surface hover:shadow-sm"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTripSelect(trip); } }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-semibold text-foreground mt-1">
                      {formatTime(trip.startTime)} - {formatTime(trip.endTime)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTripSelect(trip);
                      }}
                      className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 group-hover:border-red-500/50 hover:!bg-red-200 dark:hover:!bg-red-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface active:scale-95 ml-3"
                      aria-label={t.tracking?.playTrip || 'Putar perjalanan'}
                      title={t.tracking?.playTrip || 'Putar perjalanan'}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                    <span className="truncate max-w-[40%]">{trip.startAddress}</span>
                    <span className="text-foreground-subtle" aria-hidden="true">→</span>
                    <span className="truncate max-w-[40%]">{trip.endAddress}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-foreground-muted font-medium">
                    <span className="bg-surface-elevated px-2 py-1 rounded-md">{trip.distance} km</span>
                    <span className="bg-surface-elevated px-2 py-1 rounded-md">{trip.duration} {t.statistics?.subLabels?.duration || 'menit'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
