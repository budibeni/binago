import React from 'react';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@adatrack/ui';
import type { Departure, DepartureStatus } from '../types/departure';
import { X, Calendar, Bus, Map, MapPin } from 'lucide-react';
import { cn } from '@adatrack/utils';

interface DepartureDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Departure | null;
  onAction: (v: Departure, action: 'START' | 'COMPLETE' | 'CANCEL') => void;
  onTrack?: (v: Departure) => void;
  onPlayback?: (v: Departure) => void;
  onViewEvents?: (id: string) => void;
}

export function DepartureDetailDrawer({
  open,
  onOpenChange,
  data,
  onAction,
  onTrack,
  onPlayback,
  onViewEvents
}: DepartureDetailDrawerProps) {
  const isRtl = false;

  if (!data) return null;

  const renderStatus = () => {
    const s = data.status;
    let label = '';
    let colorClass = '';
    
    if (s === 'SCHEDULED') { 
      label = 'TERJADWAL';
      colorClass = 'bg-blue-500/10 text-blue-600';
    }
    else if (s === 'ONGOING') { 
      label = 'ONGOING';
      colorClass = 'bg-amber-500/10 text-amber-600';
    }
    else if (s === 'COMPLETED') { 
      label = 'SELESAI';
      colorClass = 'bg-emerald-500/10 text-emerald-600';
    }
    else if (s === 'CANCELLED') { 
      label = 'DIBATALKAN';
      colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    }
    
    return <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold", colorClass)}>{label}</div>;
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div 
        className={cn("fixed inset-0 bg-black/40 z-[90] transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none")} 
        onClick={() => onOpenChange(false)} 
      />
      <aside 
        className={cn(
          "fixed top-0 h-full w-[300px] sm:w-[360px] bg-white dark:bg-neutral-950 shadow-2xl z-[100] flex flex-col transition-transform duration-300", 
          isRtl ? "left-0" : "right-0",
          open ? "translate-x-0" : (isRtl ? "-translate-x-full" : "translate-x-full")
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold">Detail Keberangkatan</h2>
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-7 w-7 rounded-full p-0 flex items-center justify-center text-muted-foreground hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Main Title Area */}
          <div className="px-4 py-3.5 border-b border-border/40 flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[15px] font-bold">{formatDate(data.date)}</h2>
              <p className="text-xs text-muted-foreground">Jam Keberangkatan: {formatDate(data.scheduledDepartureAt)}</p>
            </div>
            {renderStatus()}
          </div>

          <div className="p-4 flex flex-col gap-4">
            
            {/* SCHEDULE INFO */}
            <div className="border border-border/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="p-3.5 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-violet-500" />
                <h3 className="text-[11px] font-bold text-violet-500 uppercase tracking-wide">JADWAL REFERENSI</h3>
              </div>
              <div className="px-3.5 pb-3.5 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground">Nama Jadwal</span>
                  <span className="text-xs font-semibold">{data.schedule?.name}</span>
                </div>
              </div>
            </div>

            {/* ROUTE INFO */}
            <div className="border border-border/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="p-3.5 flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-blue-500" />
                <h3 className="text-[11px] font-bold text-blue-500 uppercase tracking-wide">INFORMASI RUTE</h3>
              </div>
              <div className="px-3.5 pb-3.5 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground">Nama Rute (CORE)</span>
                  <span className="text-xs font-semibold">{data.route?.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Titik Awal</span>
                    <span className="text-xs font-semibold">{data.route?.origin?.address || '-'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Titik Akhir</span>
                    <span className="text-xs font-semibold">{data.route?.destination?.address || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VEHICLE INFO */}
            <div className="border border-border/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="p-3.5 flex items-center gap-2">
                <Bus className="w-3.5 h-3.5 text-orange-500" />
                <h3 className="text-[11px] font-bold text-orange-500 uppercase tracking-wide">INFORMASI ARMADA</h3>
              </div>
              <div className="px-3.5 pb-3.5 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Plat Nomor</span>
                    <span className="text-xs font-semibold font-mono">{data.vehicle?.plateNumber}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground">Model</span>
                    <span className="text-xs font-semibold">{data.vehicle?.brand} {data.vehicle?.vehicleName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2">
              {data.status === 'SCHEDULED' && (
                <>
                  <Button variant="primary" className="w-full text-xs h-9 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => onAction(data, 'START')}>
                    Mulai Keberangkatan
                  </Button>
                  <Button variant="ghost" className="w-full text-xs h-9 text-neutral-500 hover:text-neutral-700" onClick={() => onAction(data, 'CANCEL')}>
                    Batalkan
                  </Button>
                </>
              )}

              {(data.status === 'ONGOING') && (
                <Button variant="primary" className="w-full text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onAction(data, 'COMPLETE')}>
                  Selesaikan Perjalanan
                </Button>
              )}
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border/40 flex flex-col gap-2 bg-neutral-50/50 dark:bg-neutral-900/50">
          {onViewEvents && (
            <Button variant="outline" className="w-full text-xs h-9" onClick={() => onViewEvents(data.id)}>
              Lihat Checker Penumpang
            </Button>
          )}

          {onTrack && ['SCHEDULED', 'ONGOING'].includes(data.status) && (
            <Button variant="primary" className="w-full text-xs h-9" onClick={() => onTrack(data)}>
              <MapPin className="w-4 h-4 mr-2" /> Lihat Lokasi
            </Button>
          )}

          {onPlayback && ['COMPLETED'].includes(data.status) && data.actualDepartureAt && data.actualArrivalAt && (
            <Button variant="primary" className="w-full text-xs h-9" onClick={() => onPlayback(data)}>
              <MapPin className="w-4 h-4 mr-2" /> Lihat Perjalanan
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
