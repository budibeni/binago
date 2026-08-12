'use client';

import React from 'react';
import { ArrowLeft, Car, MapPin, Clock, PlayCircle } from 'lucide-react';
import { cn } from '@binago/utils';
import { Vehicle, Trip, VehicleStatus } from '../types';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';

export interface VehicleDetailProps {
  vehicle: Vehicle;
  trips: Trip[];
  onBack: () => void;
  onTripSelect: (trip: Trip) => void;
}

export function VehicleDetail({
  vehicle,
  trips,
  onBack,
  onTripSelect,
}: VehicleDetailProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);

  const getStatusDisplay = (status: VehicleStatus) => {
    switch(status) {
      case 'driving':
        return { text: t.tracking?.statusDriving || 'Berjalan', color: 'text-green-600', dot: 'bg-green-600' };
      case 'idle':
        return { text: t.tracking?.statusIdle || 'Berhenti', color: 'text-red-600', dot: 'bg-red-600' };
      case 'parking':
        return { text: t.tracking?.statusParking || 'Parkir', color: 'text-red-600', dot: 'bg-red-600' };
      case 'offline':
        return { text: t.tracking?.statusOffline || 'Offline', color: 'text-neutral-500', dot: 'bg-neutral-500' };
      default:
        return { text: status, color: 'text-neutral-500', dot: 'bg-neutral-500' };
    }
  };

  const statusDisplay = getStatusDisplay(vehicle.status);

  // Helper to format time (e.g. HH:mm) from ISO string
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white text-neutral-900">
      {/* Header */}
      <div className="flex items-center px-4 py-4 shrink-0 border-b border-neutral-100">
        <button 
          onClick={onBack}
          className="p-1 mr-2 text-neutral-500 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-[15px]">{t.tracking?.vehicleDetail || 'Detail Kendaraan'}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Vehicle Info */}
        <div className="p-4 border-b border-neutral-100 space-y-4">
          <div className="flex items-start">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 mr-4 border border-neutral-100">
              <Car className="w-10 h-10" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{vehicle.type}</h3>
              <p className="text-neutral-500 text-sm font-medium">{vehicle.plateNumber}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-50 border border-neutral-100">
                  <span className={cn('w-2 h-2 rounded-full', statusDisplay.dot)} />
                  <span className={cn('text-xs font-semibold', statusDisplay.color)}>
                    {statusDisplay.text}
                  </span>
                </div>
                {vehicle.speed !== undefined && vehicle.speed > 0 && (
                  <div className="flex items-center px-2 py-1 rounded-md bg-neutral-50 border border-neutral-100">
                    <span className="text-xs font-semibold text-neutral-700">{vehicle.speed} km/jam</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-3 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <span className="text-sm text-neutral-700 leading-tight">
                {vehicle.location.address || `${vehicle.location.lat.toFixed(4)}, ${vehicle.location.lng.toFixed(4)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
              <span className="text-xs text-neutral-500">
                {t.tracking?.lastUpdate || 'Update terakhir'}: {formatTime(vehicle.lastUpdate)}
              </span>
            </div>
          </div>
        </div>

        {/* Trip History */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-3">{t.tracking?.tripHistory || 'Riwayat Perjalanan'}</h3>
          
          {trips.length === 0 ? (
            <div className="text-center py-6 text-sm text-neutral-400">
              {t.tracking?.noTrips || 'Tidak ada perjalanan hari ini.'}
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map((trip) => (
                <div 
                  key={trip.id}
                  onClick={() => onTripSelect(trip)}
                  className="p-3 rounded-xl border border-neutral-200 hover:border-red-300 transition-colors cursor-pointer group bg-white hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-semibold text-neutral-900">
                      {formatTime(trip.startTime)} - {formatTime(trip.endTime)}
                    </div>
                    <PlayCircle className="w-5 h-5 text-neutral-300 group-hover:text-red-500 transition-colors" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                    <span className="truncate max-w-[40%]">{trip.startAddress}</span>
                    <span className="text-neutral-300">→</span>
                    <span className="truncate max-w-[40%]">{trip.endAddress}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                    <span className="bg-neutral-50 px-2 py-1 rounded-md">{trip.distance} km</span>
                    <span className="bg-neutral-50 px-2 py-1 rounded-md">{trip.duration} menit</span>
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
