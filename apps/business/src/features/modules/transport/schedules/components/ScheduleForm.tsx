'use client';

import React from 'react';
import { Button, Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Checkbox } from '@adatrack/ui';
import { Clock, Plus, Trash2 } from 'lucide-react';
import type { OperationalSchedule, ScheduleStatus, DayOfWeek, ScheduleTime } from '../types/schedule';
import type { Route } from '@/features/core/routes/types';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';

interface ScheduleFormProps {
  initialData?: OperationalSchedule;
  availableRoutes: Route[];
  availableVehicles: Vehicle[];
  onCancel: () => void;
  onSave: (data: Omit<OperationalSchedule, 'id' | 'route'>) => void;
  error?: string;
}

const WEEKDAYS: { id: DayOfWeek; label: string }[] = [
  { id: 'MONDAY', label: 'Senin' },
  { id: 'TUESDAY', label: 'Selasa' },
  { id: 'WEDNESDAY', label: 'Rabu' },
  { id: 'THURSDAY', label: 'Kamis' },
  { id: 'FRIDAY', label: 'Jumat' },
  { id: 'SATURDAY', label: 'Sabtu' },
  { id: 'SUNDAY', label: 'Minggu' },
];

export function ScheduleForm({
  initialData,
  availableRoutes,
  availableVehicles,
  onCancel,
  onSave,
  error
}: ScheduleFormProps) {
  const isEdit = !!initialData;
  const [name, setName] = React.useState(initialData?.name || '');
  const [routeId, setRouteId] = React.useState(initialData?.routeId || '');
  const [status, setStatus] = React.useState<ScheduleStatus>(initialData?.status || 'ACTIVE');
  const [activeDays, setActiveDays] = React.useState<DayOfWeek[]>(initialData?.activeDays || []);
  
  // Manage schedule times
  const [times, setTimes] = React.useState<ScheduleTime[]>(initialData?.times || [
    { id: `st-${Date.now()}`, departureTime: '06:00', vehicleIds: [] }
  ]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const toggleDay = (dayId: DayOfWeek) => {
    setActiveDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const handleAddTime = () => {
    setTimes(prev => [...prev, { id: `st-${Date.now()}`, departureTime: '08:00', vehicleIds: [] }]);
  };

  const handleRemoveTime = (id: string) => {
    if (times.length <= 1) return;
    setTimes(prev => prev.filter(t => t.id !== id));
  };

  const handleTimeChange = (id: string, newTime: string) => {
    setTimes(prev => prev.map(t => t.id === id ? { ...t, departureTime: newTime } : t));
  };

  const toggleVehicleInTime = (timeId: string, vehicleId: string) => {
    setTimes(prev => prev.map(t => {
      if (t.id === timeId) {
        const hasVehicle = t.vehicleIds.includes(vehicleId);
        return {
          ...t,
          vehicleIds: hasVehicle ? t.vehicleIds.filter(v => v !== vehicleId) : [...t.vehicleIds, vehicleId]
        };
      }
      return t;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !routeId || activeDays.length === 0 || times.length === 0) return;
    
    // Validate each time has at least one vehicle (optional based on business rule, but good practice)
    for (const time of times) {
      if (!time.departureTime) return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSave({
        name,
        routeId,
        times,
        activeDays,
        status,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full relative">
      <div className="w-full max-w-2xl mx-auto p-4 lg:p-6 pb-24 flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-danger/10 text-danger rounded-xl text-sm border border-danger/20 font-medium">
            {error}
          </div>
        )}
        
        <div className="bg-background border border-border/60 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-foreground-subtle">Nama Jadwal <span className="text-danger">*</span></Label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Cth: Pagi Bekasi-Jakarta" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-foreground-subtle">Rute (CORE) <span className="text-danger">*</span></Label>
              <Select value={routeId} onValueChange={setRouteId} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Rute" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoutes.map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} ({r.origin?.address || '-'} - {r.destination?.address || '-'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-foreground-subtle">Status <span className="text-danger">*</span></Label>
              <Select value={status} onValueChange={(v: ScheduleStatus) => setStatus(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-foreground-subtle">Hari Operasional <span className="text-danger">*</span></Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(day => {
                const isSelected = activeDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-neutral-50 dark:bg-neutral-900 border-border/60 text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            {activeDays.length === 0 && (
              <p className="text-[10px] text-danger">Pilih minimal 1 hari operasional</p>
            )}
          </div>
        </div>

        <div className="bg-background border border-border/60 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-bold">Waktu & Armada Keberangkatan</h3>
              <p className="text-xs text-muted-foreground">Tentukan jam keberangkatan dan tugaskan kendaraan.</p>
            </div>
            <Button variant="outline" size="sm" type="button" onClick={handleAddTime} className="h-8">
              <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Jam
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {times.map((time, idx) => (
              <div key={time.id} className="p-4 border border-border/60 rounded-xl bg-neutral-50/30 dark:bg-neutral-900/30 relative group">
                <div className="flex items-start gap-4 flex-col sm:flex-row">
                  <div className="flex flex-col gap-1.5 w-full sm:w-48 shrink-0">
                    <Label className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">Jam Keberangkatan</Label>
                    <div className="relative">
                      <Input 
                        type="time" 
                        value={time.departureTime} 
                        onChange={e => handleTimeChange(time.id, e.target.value)} 
                        required 
                        className="pl-8"
                      />
                      <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <Label className="text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider">Penugasan Armada (Pilih lebih dari satu)</Label>
                    <div className="bg-white dark:bg-neutral-950 border border-border rounded-lg p-2 max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableVehicles.map(vehicle => {
                        const isSelected = time.vehicleIds.includes(vehicle.id);
                        return (
                          <div 
                            key={vehicle.id} 
                            onClick={() => toggleVehicleInTime(time.id, vehicle.id)}
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-colors border ${
                              isSelected 
                                ? 'bg-primary/5 border-primary/20 text-primary-600 dark:text-primary-400 font-medium' 
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 border-transparent text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            <Checkbox 
                              checked={isSelected}
                              // Checked event is handled by parent div onClick
                              onCheckedChange={() => {}}
                            />
                            <div className="flex flex-col">
                              <span>{vehicle.plateNumber}</span>
                              <span className="text-[10px] text-muted-foreground -mt-0.5">{vehicle.vehicleName || vehicle.vehicleCategory}</span>
                            </div>
                          </div>
                        )
                      })}
                      {availableVehicles.length === 0 && (
                        <div className="col-span-full p-2 text-xs text-muted-foreground text-center">
                          Tidak ada armada aktif (CORE Vehicle).
                        </div>
                      )}
                    </div>
                    {time.vehicleIds.length === 0 && (
                      <p className="text-[10px] text-warning text-amber-600">Jam ini tidak memiliki penugasan kendaraan.</p>
                    )}
                  </div>
                </div>

                {times.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => handleRemoveTime(time.id)}
                    className="absolute top-2 right-2 p-1.5 text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                    title="Hapus Waktu Keberangkatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-end gap-3 z-50 md:pl-[256px]">
        <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>Batal</Button>
        <Button variant="primary" type="submit" disabled={isSubmitting || activeDays.length === 0 || times.length === 0}>
          {isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Buat Jadwal')}
        </Button>
      </div>
    </form>
  );
}
