'use client';

import React from 'react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { departureService } from '@/data/modules/transport/services/departureService';
import type { Departure, DepartureFilterStatus } from './types/departure';
import { Card, Input, Button } from '@adatrack/ui';
import { PlaneTakeoff, Search, FileText, Plus, MapPin, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DepartureForm } from './components/DepartureForm';
import { DepartureDetailDrawer } from './components/DepartureDetailDrawer';
import { operationalScheduleService } from '@/data/modules/transport/services/scheduleService';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { buildTransportVehicleContext } from '@/data/modules/transport/services/vehicleContextBuilder';

export function DeparturesFeature() {
  const locale = useBusinessLocale();
  const router = useRouter();

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<DepartureFilterStatus>('all');
  const [departures, setDepartures] = React.useState<Departure[]>([]);

  // Drawer states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedDeparture, setSelectedDeparture] = React.useState<Departure | null>(null);
  const [formError, setFormError] = React.useState('');

  const [availableSchedules, setAvailableSchedules] = React.useState(operationalScheduleService.getSchedules());

  React.useEffect(() => {
    const data = departureService.getDepartures({ search, status: statusFilter });
    // Sort by date descending, then scheduled departure time
    data.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      // scheduledDepartureAt is string like "08:00"
      return (b.scheduledDepartureAt || '').localeCompare(a.scheduledDepartureAt || '');
    });
    setDepartures(data);
    setAvailableSchedules(operationalScheduleService.getSchedules());
  }, [search, statusFilter]);

  const baseData = departureService.getDepartures();
  const stats = {
    scheduled: baseData.filter(d => d.status === 'SCHEDULED').length,
    ongoing: baseData.filter(d => d.status === 'ONGOING').length,
    completed: baseData.filter(d => d.status === 'COMPLETED').length,
    cancelled: baseData.filter(d => d.status === 'CANCELLED').length,
  };

  const handleViewEvents = (id: string) => {
    router.push(`/modules/transport/checker`);
  };

  const formatTime = (isoStr?: string) => {
    if (!isoStr) return '-';
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isoStr; // Fallback to raw string if not ISO
      return date.toLocaleTimeString(locale === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  const handleCreateNew = () => {
    setFormError('');
    setIsFormOpen(true);
  };

  const handleDetail = (d: Departure) => {
    setSelectedDeparture(d);
    setIsDetailOpen(true);
  };

  const handleGenerate = (date: string) => {
    try {
      const result = departureService.generateDeparturesForDate(date);
      setIsFormOpen(false);
      setDepartures(departureService.getDepartures({ search, status: statusFilter }));
      
      if (result.created > 0 || result.skipped > 0) {
        alert(`${result.created} keberangkatan baru dibuat. ${result.skipped} jadwal dilewati (duplikat/tidak aktif).`);
      } else {
        alert('Tidak ada keberangkatan baru. Pastikan ada jadwal aktif pada tanggal tersebut.');
      }
    } catch (e: any) {
      setFormError(e.message || 'Terjadi kesalahan saat menggenerate keberangkatan');
    }
  };

  const handleAction = (d: Departure, action: 'START' | 'COMPLETE' | 'CANCEL') => {
    try {
      if (action === 'START') {
        departureService.startDeparture(d.id);
      } else if (action === 'COMPLETE') {
        departureService.completeDeparture(d.id);
      } else if (action === 'CANCEL') {
        departureService.cancelDeparture(d.id);
      }

      // Refresh selected departure and list
      setSelectedDeparture(departureService.getDepartureById(d.id) || null);
      setDepartures(departureService.getDepartures({ search, status: statusFilter }));
    } catch (e: any) {
      alert(e.message || 'Gagal mengubah status');
    }
  };

  const handleOpenMap = async (d: Departure) => {
    if (!d.vehicleId) return;
    
    const context = await buildTransportVehicleContext(d.vehicleId, 'id');
    if (context) {
      sessionStorage.setItem(`adatrack_vehicle_context_id_${d.vehicleId}`, JSON.stringify(context));
    }

    trackingNavigationService.navigateToTracking(router, {
      mode: 'live',
      vehicleId: d.vehicleId
    });
  };

  const handlePlayback = async (d: Departure) => {
    if (!d.vehicleId || !d.actualDepartureAt || !d.actualArrivalAt) return;
    
    const context = await buildTransportVehicleContext(d.vehicleId, 'id');
    if (context) {
      sessionStorage.setItem(`adatrack_vehicle_context_id_${d.vehicleId}`, JSON.stringify(context));
    }

    trackingNavigationService.navigateToTracking(router, {
      mode: 'playback',
      vehicleId: d.vehicleId,
      start: d.actualDepartureAt,
      end: d.actualArrivalAt
    });
  };

  return (
    <div className="flex h-full flex-col bg-surface overflow-hidden">
      <div className="shrink-0 p-4 lg:p-6 bg-white dark:bg-neutral-950 border-b border-border shadow-sm z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
              <PlaneTakeoff className="w-5 h-5 text-amber-600" />
              Keberangkatan
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Pantau status perjalanan aktual dari jadwal operasional.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Keberangkatan Harian
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#fafafa] dark:bg-neutral-950/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-white border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Terjadwal</p>
            <p className="text-2xl font-bold mt-1 text-blue-700">{stats.scheduled}</p>
          </Card>
          <Card className="p-4 bg-white border-amber-200">
            <p className="text-sm text-amber-600 font-medium">Ongoing</p>
            <p className="text-2xl font-bold mt-1 text-amber-700">{stats.ongoing}</p>
          </Card>
          <Card className="p-4 bg-white border-emerald-200">
            <p className="text-sm text-emerald-600 font-medium">Completed</p>
            <p className="text-2xl font-bold mt-1 text-emerald-700">{stats.completed}</p>
          </Card>
          <Card className="p-4 bg-white border-red-200">
            <p className="text-sm text-red-600 font-medium">Dibatalkan</p>
            <p className="text-2xl font-bold mt-1 text-red-700">{stats.cancelled}</p>
          </Card>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-border shadow-sm flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari kendaraan atau rute..." 
                className="pl-9"
              />
            </div>
            <select 
              className="border border-border rounded-md px-3 py-2 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as DepartureFilterStatus)}
            >
              <option value="all">Semua Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold">Tanggal</th>
                  <th className="px-6 py-3 font-semibold">Jadwal / Rute</th>
                  <th className="px-6 py-3 font-semibold">Waktu (Sch / Act)</th>
                  <th className="px-6 py-3 font-semibold">Kendaraan</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {departures.map(d => (
                  <tr key={d.id} onClick={() => handleDetail(d)} className="border-b border-border hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{d.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{d.schedule?.name || '-'}</div>
                      <div className="text-xs text-neutral-500 truncate max-w-[200px]" title={d.route?.name}>{d.route?.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs">{formatTime(d.scheduledDepartureAt)}</div>
                      <div className="font-mono text-xs text-amber-600 mt-0.5">{formatTime(d.actualDepartureAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {d.vehicle ? (
                        <>
                          <div className="font-medium">{d.vehicle.plateNumber}</div>
                          <div className="text-xs text-neutral-500">{d.driver ? d.driver.name : 'Driver tidak di-set'}</div>
                        </>
                      ) : (
                        <span className="text-neutral-400 italic">Kendaraan kosong</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        d.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                        d.status === 'ONGOING' ? 'bg-amber-100 text-amber-700' :
                        d.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" className="h-8 px-3 text-xs" onClick={(e) => { e.stopPropagation(); handleViewEvents(d.id); }}>
                          <Users className="w-3.5 h-3.5 mr-1.5" />
                          Checker
                        </Button>
                        <Button variant="outline" className="h-8 px-3 text-xs" onClick={(e) => { e.stopPropagation(); handleDetail(d); }}>
                          Detail
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {departures.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                      Tidak ada data keberangkatan ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawers */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl flex flex-col">
            <div className="p-4 border-b border-border sticky top-0 bg-white dark:bg-neutral-900 z-10 flex justify-between items-center">
              <h2 className="text-lg font-bold">Generate Keberangkatan Harian</h2>
            </div>
            <DepartureForm 
              onCancel={() => setIsFormOpen(false)}
              onSave={handleGenerate}
              error={formError}
            />
          </div>
        </div>
      )}

      <DepartureDetailDrawer 
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        data={selectedDeparture}
        onAction={handleAction}
        onTrack={handleOpenMap}
        onPlayback={handlePlayback}
        onViewEvents={handleViewEvents}
      />
    </div>
  );
}
