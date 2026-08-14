'use client';

import React, { useState } from 'react';
import { ArrowLeft, CarFront, MapPin, Clock, Play, Route, WifiOff, ChevronLeft, ChevronRight, CalendarDays, Share2, ChevronDown, ChevronUp, Motorbike } from 'lucide-react';
import { Vehicle, Trip, VehicleStatus } from '../types';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { EmptyState } from '@/components/EmptyState';
import { ShareLocationDialog } from '@/features/sharing/components/ShareLocationDialog';
import { useShareLocation } from '@/features/sharing/context/ShareLocationContext';
import { cn } from '@adatrack/utils';

export interface VehicleDetailProps {
  vehicle: Vehicle;
  trips: Trip[];
  onBack: () => void;
  onTripSelect: (trip: Trip) => void;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  showBackButton?: boolean;
  isDetailVisible?: boolean;
  onToggleDetail?: () => void;
}

export function VehicleDetail({
  vehicle,
  trips,
  selectedDate,
  onDateChange,
  onBack,
  onTripSelect,
  showBackButton = true,
  isDetailVisible = true,
  onToggleDetail,
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
      <div 
        className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-border bg-surface cursor-pointer md:cursor-default"
        onClick={(e) => {
          if (onToggleDetail && (e.target as HTMLElement).closest('button') === null) {
            onToggleDetail();
          }
        }}
      >
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={onBack}
              className="p-1 mr-2 text-foreground-muted hover:text-foreground transition-colors rounded-full hover:bg-surface-elevated"
              aria-label={t.tracking.back || t.settings?.back || 'Kembali'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="font-semibold text-[15px]">{t.tracking?.vehicleDetail || 'Detail Kendaraan'}</h2>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Toggle Button for mobile/desktop to hide/show details */}
          {onToggleDetail && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleDetail();
              }}
              className="p-1.5 text-foreground-muted hover:text-foreground transition-colors rounded-full hover:bg-surface-elevated flex items-center justify-center md:hidden"
              aria-label={isDetailVisible ? "Sembunyikan detail" : "Tampilkan detail"}
            >
              {isDetailVisible ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {isDetailVisible && (
        <div className="flex-1 overflow-y-auto">
          {/* Vehicle & Location Info Combined */}
          <div className="p-4 border-b border-border">
            <div className="flex items-start gap-3">
              <div className={cn("w-12 h-12 shrink-0 flex items-center justify-center rounded-xl", statusDisplay.bg, statusDisplay.color)}>
                {vehicle.category === 'motorcycle' ? (
                  <Motorbike className="w-7 h-7" strokeWidth={1.5} />
                ) : (
                  <CarFront className="w-7 h-7" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-[16px] truncate text-foreground leading-none">{vehicle.type}</h3>
                  {vehicle.speed !== undefined && vehicle.speed > 0 && (
                    <span className="text-[13px] font-bold text-foreground shrink-0 leading-none">{vehicle.speed} <span className="text-foreground-muted font-medium">{t.tracking?.speedUnit || 'km/jam'}</span></span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1.5 mb-2">
                  <span className="text-foreground-muted text-[13px] font-medium leading-none">{vehicle.plateNumber}</span>
                  <span className="text-border text-[10px] leading-none">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDisplay.dot}`} />
                    <span className={`text-xs font-semibold leading-none ${statusDisplay.color}`}>
                      {statusDisplay.text}
                    </span>
                  </div>
                </div>

                {/* Location inline */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                  <div className="flex flex-col gap-1.5 flex-1 pr-3">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-foreground-subtle shrink-0 mt-0.5" />
                      <span className="text-[13px] text-foreground leading-snug">
                        {vehicle.location.address || `${vehicle.location.lat.toFixed(4)}, ${vehicle.location.lng.toFixed(4)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isOffline ? <WifiOff className="w-3.5 h-3.5 text-foreground-subtle shrink-0" /> : <Clock className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />}
                      <span className="text-[11px] text-foreground-muted">
                        {isOffline 
                          ? `${t.tracking?.lastSeen || 'Terakhir terlihat'} ${formatRelativeTime(vehicle.lastUpdate)}`
                          : `${t.tracking?.lastUpdate || 'Update'} ${formatTime(vehicle.lastUpdate)}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  {/* Share Action */}
                  {activeShare ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareDialogOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shrink-0 -mr-1 border border-blue-100 dark:border-blue-800/50 shadow-sm"
                      title={ls.manageSharing}
                    >
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{locale === 'id' ? 'DIBAGIKAN' : 'SHARED'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareDialogOpen(true);
                      }}
                      className="p-1.5 transition-colors rounded-full flex items-center justify-center shrink-0 -mr-1 text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
                      title={ls.shareLocation}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <ShareLocationDialog
            vehicle={vehicle}
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
          />
          {/* Trip History */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
              <span className="font-semibold text-sm text-foreground">Riwayat Perjalanan</span>
              <div className="flex items-center gap-1 bg-surface-elevated rounded-lg p-0.5 border border-border">
                <button
                  onClick={handlePrevDay}
                  className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface rounded-md transition-colors"
                  aria-label={t.tracking?.prevDay || 'Hari sebelumnya'}
                  title={t.tracking?.prevDay || 'Hari sebelumnya'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1.5 px-2 relative">
                  <span className="text-[13px] font-medium text-foreground">
                    {isToday ? (t.tracking?.today || 'Hari ini') : formattedDate}
                  </span>
                  <div className="relative w-4 h-4 flex items-center justify-center">
                    <CalendarDays className="w-3.5 h-3.5 text-foreground-muted" />
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
                  disabled={isToday}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isToday 
                      ? "text-neutral-300 dark:text-neutral-700 cursor-not-allowed" 
                      : "text-foreground-muted hover:text-foreground hover:bg-surface"
                  )}
                  aria-label={t.tracking?.nextDay || 'Hari berikutnya'}
                  title={t.tracking?.nextDay || 'Hari berikutnya'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
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
                    className="p-3.5 rounded-[14px] border border-border hover:border-red-400 hover:shadow-md transition-all cursor-pointer group bg-surface flex flex-col gap-3 relative"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTripSelect(trip); } }}
                  >
                    {/* Top Row: Time & Metrics */}
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                      <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
                        <span>{formatTime(trip.startTime)} - {formatTime(trip.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground-muted">
                        <span>{trip.distance} km</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{trip.duration} Jam</span>
                      </div>
                    </div>
                    
                    {/* Body: Timeline & Play Button */}
                    <div className="flex items-center gap-3">
                      {/* Firm Timeline */}
                      <div className="flex flex-col items-center shrink-0 w-4">
                        <div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-blue-500 bg-surface z-10" />
                        <div className="w-[3px] h-6 bg-neutral-300 dark:bg-neutral-600 my-0.5 rounded-full" />
                        <div className="w-2.5 h-2.5 rounded-full border-[2.5px] border-red-500 bg-surface z-10" />
                      </div>
                      
                      {/* Addresses */}
                      <div className="flex-1 min-w-0 flex flex-col gap-3 py-0.5">
                        <p className="text-[13px] text-foreground font-medium leading-tight truncate" title={trip.startAddress}>
                          {trip.startAddress}
                        </p>
                        <p className="text-[13px] text-foreground font-medium leading-tight truncate" title={trip.endAddress}>
                          {trip.endAddress}
                        </p>
                      </div>

                      {/* Play Button - Pill */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTripSelect(trip);
                        }}
                        className="h-8 px-3 shrink-0 rounded-full flex items-center justify-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 text-red-600 dark:text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 active:scale-95"
                        aria-label={t.tracking?.playTrip || 'Putar perjalanan'}
                        title={t.tracking?.playTrip || 'Putar perjalanan'}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                        <span className="text-[11px] font-bold tracking-wide uppercase">Putar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
