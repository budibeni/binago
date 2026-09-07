'use client';

import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormShell, FormCard, InputString, InputSelect, InputTime, InputMultiCheckbox } from '@adatrack/ui';
import { Clock, Plus, Trash2, Calendar, Bus, Info, ExternalLink } from 'lucide-react';
import type { OperationalSchedule, ScheduleStatus, DayOfWeek, ScheduleTime } from '../types/schedule';
import type { Route } from '@/features/core/routes/types';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';
import { cn } from '@adatrack/utils';

interface ScheduleFormProps {
  initialData?: OperationalSchedule;
  availableRoutes: Route[];
  availableVehicles: Vehicle[];
  onCancel: () => void;
  onSave: (data: Omit<OperationalSchedule, 'id' | 'route'>) => void;
  error?: string;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  error,
  layout = 'default',
  open,
  onOpenChange,
}: ScheduleFormProps) {
  const isEdit = !!initialData;
  const [name, setName] = useState(initialData?.name || '');
  const [routeId, setRouteId] = useState(initialData?.routeId || '');
  const [status, setStatus] = useState<ScheduleStatus>(initialData?.status || 'ACTIVE');
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>(initialData?.activeDays || []);
  
  const [times, setTimes] = useState<ScheduleTime[]>(initialData?.times || [
    { id: `st-${Date.now()}`, departureTime: '06:00', vehicleIds: [] }
  ]);
  const [activeTimeId, setActiveTimeId] = useState<string>('');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeTime = times.find(t => t.id === activeTimeId);

  const openVehicleModal = (timeId: string) => {
    setActiveTimeId(timeId);
    setIsVehicleModalOpen(true);
  };

  const closeVehicleModal = () => {
    setIsVehicleModalOpen(false);
  };

  const toggleDay = (dayId: DayOfWeek) => {
    setActiveDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const handleAddTime = () => {
    const newId = `st-${Date.now()}`;
    setTimes(prev => [...prev, { id: newId, departureTime: '08:00', vehicleIds: [] }]);
  };

  const handleRemoveTime = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name || !routeId || activeDays.length === 0 || times.length === 0) return;
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
    <>
      <FormShell
        layout={layout}
        open={open}
        onOpenChange={onOpenChange}
        title={isEdit ? 'Simpan Perubahan Jadwal' : 'Simpan Jadwal Baru'}
        subtitle="Pastikan nama, rute, hari, dan penugasan armada sudah benar."
        onCancel={onCancel}
        cancelProps={{ disabled: isSubmitting }}
        onSave={() => handleSubmit()}
        onSubmit={handleSubmit}
        saveText={isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Buat Jadwal')}
        saveProps={{ disabled: isSubmitting || activeDays.length === 0 || times.length === 0 }}
        isSubmitting={isSubmitting}
        columns={2}
      >
        {error && (
          <div className="mb-6 p-3 bg-danger/10 text-danger rounded-xl text-sm border border-danger/20 font-medium lg:col-span-2">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <FormCard title="Informasi Jadwal" description="Lengkapi detail identitas jadwal dan rute perjalanan." icon={<Calendar className="w-5 h-5 text-muted-foreground" />}>
            <div className="flex flex-col gap-4">
              <InputString
                id="name"
                label="Nama Jadwal"
                value={name}
                onChange={setName}
                placeholder="Cth: Jadwal Pagi Bekasi-Jakarta"
                required
              />

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-xs font-bold text-foreground block">Rute Perjalanan <span className="text-danger">*</span></label>
                      {routeId ? (
                        <a href={`/core/routes?routeId=${routeId}`} className="text-[10px] font-bold text-danger hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                          Lihat Rute <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <a href="/core/routes" className="text-[10px] font-bold text-danger hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                          Kelola Rute <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <InputSelect
                      id="routeId"
                      value={routeId}
                      onChange={setRouteId}
                      placeholder="Pilih Rute"
                      options={availableRoutes.map(r => ({ value: r.id, label: r.name }))}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground mb-1 block">Status Operasional <span className="text-danger">*</span></label>
                    <InputSelect
                      id="status"
                      value={status}
                      onChange={(v) => setStatus(v as ScheduleStatus)}
                      options={[
                        { value: 'ACTIVE', label: 'Aktif (ACTIVE)' },
                        { value: 'INACTIVE', label: 'Nonaktif (INACTIVE)' },
                        { value: 'SUSPENDED', label: 'Ditangguhkan (SUSPENDED)' }
                      ]}
                      required
                    />
                  </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <InputMultiCheckbox
                  label="Hari Operasional *"
                  value={activeDays}
                  onChange={(val) => setActiveDays(val as DayOfWeek[])}
                  options={WEEKDAYS.map(day => ({ value: day.id, label: day.label }))}
                />
                {activeDays.length === 0 && (
                  <p className="text-[10px] text-danger mt-1 font-medium flex items-center gap-1">
                    <Info className="w-3 h-3" /> Pilih minimal 1 hari operasional
                  </p>
                )}
              </div>
            </div>
          </FormCard>
        </div>

        {/* KOLOM KANAN: Waktu Keberangkatan & Penugasan Armada */}
        <div className="flex flex-col gap-6">
          <FormCard title="Waktu Keberangkatan" description="Tentukan jam-jam keberangkatan dan tugaskan armada untuk setiap jamnya." icon={<Clock className="w-5 h-5 text-muted-foreground" />}>
                <div className="flex flex-col gap-4">
                  {times.map((time) => {
                    const hasVehicles = time.vehicleIds.length > 0;
                    const assignedVehicles = availableVehicles.filter(v => time.vehicleIds.includes(v.id));
                    
                    return (
                      <div 
                        key={time.id} 
                        className="p-4 rounded-xl border border-border bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col sm:flex-row sm:items-start gap-5 transition-colors hover:border-danger/20"
                      >
                        {/* Waktu Keberangkatan */}
                        <div className="w-[140px] shrink-0">
                          <InputTime
                            id={`time-${time.id}`}
                            label="Jam Berangkat"
                            value={time.departureTime}
                            onChange={(val) => handleTimeChange(time.id, val)}
                            required
                          />
                        </div>
                        
                        {/* Divider */}
                        <div className="hidden sm:block w-px bg-border/50 self-stretch my-1" />
                        
                        {/* Armada */}
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Armada Ditugaskan</span>
                            <div className="flex items-center gap-2">
                              <Button 
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] px-2.5 bg-white dark:bg-neutral-950 border-danger/30 text-danger hover:bg-danger hover:text-white transition-colors"
                                onClick={() => openVehicleModal(time.id)}
                              >
                                <Bus className="w-3 h-3 mr-1.5" /> Pilih Armada ({time.vehicleIds.length})
                              </Button>
                              
                              {times.length > 1 && (
                                <button 
                                  type="button"
                                  onClick={(e) => handleRemoveTime(time.id, e)}
                                  className="w-7 h-7 flex items-center justify-center text-neutral-400 border border-transparent hover:border-danger/30 hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
                                  title="Hapus Waktu"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {hasVehicles ? (
                            <div className="flex flex-wrap gap-1.5">
                              {assignedVehicles.map(v => (
                                <div key={v.id} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-neutral-950 border border-border text-[11px] font-medium text-foreground">
                                  <Bus className="w-3 h-3 text-muted-foreground" />
                                  {v.plateNumber}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-muted-foreground pt-1">
                              <Info className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-[11px] font-medium">Belum ada armada ditugaskan untuk jam ini.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={handleAddTime} 
                    className="w-full h-12 border-dashed border-2 hover:border-danger/50 hover:bg-danger/5 hover:text-danger mt-1"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Waktu Keberangkatan
                  </Button>
              </div>
            </FormCard>
          </div>
        </FormShell>

      {/* Vehicle Selection Modal */}
      {isVehicleModalOpen && activeTime && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeVehicleModal} />
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-xl flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 md:p-5 border-b border-border flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Bus className="w-4 h-4 text-danger" /> Penugasan Armada
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Pilih armada yang bertugas pada jam <b>{activeTime.departureTime}</b>.</p>
              </div>
            </div>
            
            <div className="p-4 md:p-5 max-h-[60vh] overflow-y-auto space-y-2 custom-scrollbar">
              {availableVehicles.map(vehicle => {
                const isSelected = activeTime.vehicleIds.includes(vehicle.id);
                return (
                  <div 
                    key={vehicle.id} 
                    onClick={() => toggleVehicleInTime(activeTime.id, vehicle.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                      isSelected 
                        ? "bg-danger/10 border-danger/50 shadow-sm" 
                        : "bg-white dark:bg-neutral-950 border-border hover:border-danger/30 hover:shadow-sm"
                    )}
                  >
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => {}}
                      className={isSelected ? "data-[state=checked]:bg-danger data-[state=checked]:border-danger" : ""}
                    />
                    <div className="flex flex-col flex-1">
                      <span className={cn("text-sm font-bold", isSelected ? "text-danger" : "text-foreground")}>
                        {vehicle.plateNumber}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {vehicle.brand} {vehicle.vehicleName || vehicle.vehicleCategory}
                      </span>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      isSelected ? "bg-danger/20 text-danger" : "bg-neutral-50 text-neutral-400 dark:bg-neutral-800"
                    )}>
                      <Bus className="w-4 h-4" />
                    </div>
                  </div>
                )
              })}
              {availableVehicles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bus className="w-8 h-8 text-neutral-300 mb-3" />
                  <p className="text-sm font-medium text-neutral-500">Belum ada armada terdaftar.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-neutral-50 dark:bg-neutral-950 flex items-center justify-end">
              <Button type="button" variant="primary" className="bg-danger hover:bg-danger/90 text-white w-full sm:w-auto" onClick={closeVehicleModal}>
                Selesai Memilih
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
