import React from 'react';
import { Button, Badge } from '@adatrack/ui';
import type { OperationalSchedule } from '../types/schedule';
import { X, Calendar, Bus, Map, Clock } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { vehicleService } from '@/data/services';

interface ScheduleDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: OperationalSchedule | null;
  onEdit: (v: OperationalSchedule) => void;
}

const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function ScheduleDetailDrawer({
  open,
  onOpenChange,
  data,
  onEdit,
}: ScheduleDetailDrawerProps) {
  const isRtl = false;

  if (!data) return null;

  const renderStatus = () => {
    const s = data.status;
    let label = '';
    let colorClass = '';
    
    if (s === 'ACTIVE') { 
      label = 'AKTIF';
      colorClass = 'bg-success/10 text-success';
    }
    else if (s === 'INACTIVE') { 
      label = 'NONAKTIF';
      colorClass = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    }
    else if (s === 'SUSPENDED') { 
      label = 'DITANGGUHKAN';
      colorClass = 'bg-warning/10 text-warning';
    }
    
    return <div className={cn("px-2.5 py-0.5 rounded text-[11px] font-semibold", colorClass)}>{label}</div>;
  };

  const getDaysLabel = () => {
    if (data.activeDays.length === 7) return 'Setiap Hari';
    return data.activeDays.map(d => {
      const map: Record<string, string> = { MONDAY: 'Senin', TUESDAY: 'Selasa', WEDNESDAY: 'Rabu', THURSDAY: 'Kamis', FRIDAY: 'Jumat', SATURDAY: 'Sabtu', SUNDAY: 'Minggu' };
      return map[d] || d;
    }).join(', ');
  };

  return (
    <>
      <div 
        className={cn("fixed inset-0 bg-black/40 z-[90] transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none")} 
        onClick={() => onOpenChange(false)} 
      />
      <aside 
        className={cn(
          "fixed top-0 h-full w-[300px] sm:w-[380px] bg-white dark:bg-neutral-950 shadow-2xl z-[100] flex flex-col transition-transform duration-300", 
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
            <h2 className="text-sm font-bold">Detail Jadwal</h2>
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-7 w-7 rounded-full p-0 flex items-center justify-center text-muted-foreground hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Main Title Area */}
          <div className="px-4 py-3.5 border-b border-border/40 flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[15px] font-bold">{data.name}</h2>
              <p className="text-xs text-muted-foreground">{getDaysLabel()}</p>
            </div>
            {renderStatus()}
          </div>

          <div className="p-4 flex flex-col gap-4">
            
            {/* ROUTE INFO */}
            <div className="border border-border/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="p-3.5 flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-blue-500" />
                <h3 className="text-[11px] font-bold text-blue-500 uppercase tracking-wide">INFORMASI RUTE</h3>
              </div>
              <div className="px-3.5 pb-3.5 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground">Nama Rute (CORE)</span>
                  <span className="text-xs font-semibold">{data.route?.name || '-'}</span>
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

            {/* VEHICLE ASSIGNMENTS */}
            <div className="border border-border/60 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="p-3.5 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <h3 className="text-[11px] font-bold text-orange-500 uppercase tracking-wide">JAM & ARMADA (CORE)</h3>
              </div>
              <div className="px-3.5 pb-3.5 flex flex-col gap-3">
                {data.times.map((time, idx) => (
                  <div key={time.id} className="flex flex-col gap-1.5 pb-2 border-b border-border/40 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-mono font-bold">{time.departureTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {time.vehicleIds.map(vId => {
                        const v = vehicleService.getVehicleById(vId);
                        return (
                          <div key={vId} className="flex items-center gap-1 bg-white dark:bg-neutral-950 border border-border px-2 py-1 rounded text-xs">
                            <Bus className="w-3 h-3 text-muted-foreground" />
                            <span className="font-semibold">{v?.plateNumber || vId}</span>
                            {v?.vehicleName && <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">({v.vehicleName})</span>}
                          </div>
                        );
                      })}
                      {time.vehicleIds.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">Tidak ada armada</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border/40 flex flex-col gap-2 bg-neutral-50/50 dark:bg-neutral-900/50">
          <Button variant="outline" className="w-full text-xs h-9" onClick={() => onEdit(data)}>
            Edit Jadwal
          </Button>
        </div>
      </aside>
    </>
  );
}
