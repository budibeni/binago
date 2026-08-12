'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Car } from 'lucide-react';
import { cn } from '@binago/utils';
import { Vehicle, VehicleStatus } from '../types';

export interface VehicleListProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: VehicleStatus | 'all';
  onStatusFilterChange: (status: VehicleStatus | 'all') => void;
  isListVisible: boolean;
  onToggleList: () => void;
}

export function VehicleList({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  isListVisible,
  onToggleList,
}: VehicleListProps) {
  
  const getStatusDisplay = (status: VehicleStatus) => {
    switch(status) {
      case 'driving':
        return { text: 'Bergerak', color: 'text-green-600', dot: 'bg-green-600' };
      case 'idle':
        return { text: 'Berhenti', color: 'text-red-600', dot: 'bg-red-600' };
      case 'parking':
        return { text: 'Parkir', color: 'text-red-600', dot: 'bg-red-600' };
      case 'offline':
        return { text: 'Offline', color: 'text-neutral-500', dot: 'bg-neutral-500' };
      default:
        return { text: status, color: 'text-neutral-500', dot: 'bg-neutral-500' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-neutral-900">
      {/* Header */}
      <div 
        className={cn(
          "flex items-center justify-between px-5 py-4 shrink-0 cursor-pointer select-none transition-colors",
          !isListVisible && "hover:bg-neutral-50"
        )}
        onClick={onToggleList}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[15px]">Kendaraan Saya</h2>
          <span className="bg-neutral-100 text-neutral-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
            {vehicles.length}
          </span>
        </div>
        <button className="p-1 -mr-1 text-neutral-400 hover:text-neutral-600 transition-colors">
          {isListVisible ? (
            <>
              <ChevronLeft className="h-5 w-5 hidden md:block" />
              <ChevronDown className="h-5 w-5 md:hidden" />
            </>
          ) : (
            <>
              <ChevronRight className="h-5 w-5 hidden md:block" />
              <ChevronUp className="h-5 w-5 md:hidden" />
            </>
          )}
        </button>
      </div>

      {/* List - Rendered conditionally but with stable flex behavior when visible */}
      {isListVisible && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-neutral-400">
              <Car className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">Tidak ada kendaraan.</p>
            </div>
          ) : (
            vehicles.map((vehicle) => {
              const isSelected = vehicle.id === selectedVehicleId;
              const statusDisplay = getStatusDisplay(vehicle.status);
              const speed = vehicle.speed || 0;
              
              return (
                <div
                  key={vehicle.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVehicleSelect(vehicle.id);
                  }}
                  className={cn(
                    'flex items-center p-3 rounded-xl border transition-all cursor-pointer bg-white group',
                    isSelected 
                      ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,1)]' 
                      : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                  )}
                >
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-lg bg-neutral-50 text-neutral-400 mr-3">
                    <Car className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div className="flex flex-col truncate pr-2">
                      <span className="font-semibold text-sm truncate">{vehicle.type}</span>
                      <span className="text-xs text-neutral-500 mt-0.5">{vehicle.plateNumber}</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pr-2">
                      <span className="font-semibold text-xs text-neutral-900">
                        {speed} km/jam
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusDisplay.dot)} />
                        <span className={cn('text-[11px] font-medium', statusDisplay.color)}>
                          {statusDisplay.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 group-hover:text-neutral-600 transition-colors" />
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bottom Button - only shown when visible */}
      {isListVisible && (
        <div className="p-4 pt-2 shrink-0 border-t border-neutral-100 bg-white">
          <button 
            onClick={onToggleList}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <ChevronDown className="w-4 h-4 md:hidden" />
            <ChevronLeft className="w-4 h-4 hidden md:block" />
            Sembunyikan Daftar
          </button>
        </div>
      )}
    </div>
  );
}
