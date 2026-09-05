'use client';

import React from 'react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { operationalScheduleService } from '@/data/modules/transport/services/scheduleService';
import type { OperationalSchedule, ScheduleFilterStatus } from './types/schedule';
import { Card, Input, Button } from '@adatrack/ui';
import { CalendarDays, Plus, Search } from 'lucide-react';
import { ScheduleForm } from './components/ScheduleForm';
import { ScheduleDetailDrawer } from './components/ScheduleDetailDrawer';
import { routeService, vehicleService } from '@/data/services';

import { useRouter } from 'next/navigation';

export function SchedulesFeature() {
  const locale = useBusinessLocale();
  const router = useRouter();

  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<ScheduleFilterStatus>('all');
  const [schedules, setSchedules] = React.useState<OperationalSchedule[]>([]);

  // Drawer states
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<OperationalSchedule | null>(null);

  const [availableRoutes, setAvailableRoutes] = React.useState(routeService.getRoutes());
  const [availableVehicles, setAvailableVehicles] = React.useState(vehicleService.getVehicles());

  React.useEffect(() => {
    const data = operationalScheduleService.getSchedules({ search, status: statusFilter });
    setSchedules(data);
    setAvailableRoutes(routeService.getRoutes());
    setAvailableVehicles(vehicleService.getVehicles());
  }, [search, statusFilter]);

  const baseData = operationalScheduleService.getSchedules();
  const stats = {
    all: baseData.length,
    active: baseData.filter(s => s.status === 'ACTIVE').length,
    inactive: baseData.filter(s => s.status === 'INACTIVE').length,
    suspended: baseData.filter(s => s.status === 'SUSPENDED').length,
  };

  const getDayAbbr = (day: string) => {
    const map: Record<string, string> = { MONDAY: 'Sn', TUESDAY: 'Sl', WEDNESDAY: 'Rb', THURSDAY: 'Km', FRIDAY: 'Jm', SATURDAY: 'Sb', SUNDAY: 'Mg' };
    return map[day] || '?';
  };

  const handleCreateNew = () => {
    router.push('/transport/schedules/create');
  };

  const handleEdit = (s: OperationalSchedule) => {
    setIsDetailOpen(false);
    router.push(`/transport/schedules/${s.id}/edit`);
  };

  const handleDetail = (s: OperationalSchedule) => {
    setSelectedSchedule(s);
    setIsDetailOpen(true);
  };



  return (
    <div className="flex h-full flex-col bg-surface overflow-hidden">
      <div className="shrink-0 p-4 lg:p-6 bg-white dark:bg-neutral-950 border-b border-border shadow-sm z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-violet-600" />
              Jadwal Operasional
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Kelola jadwal keberangkatan armada transport.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Jadwal
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#fafafa] dark:bg-neutral-950/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-white">
            <p className="text-sm text-neutral-500 font-medium">Total Jadwal</p>
            <p className="text-2xl font-bold mt-1">{stats.all}</p>
          </Card>
          <Card className="p-4 bg-white border-violet-200">
            <p className="text-sm text-violet-600 font-medium">Aktif</p>
            <p className="text-2xl font-bold mt-1 text-violet-700">{stats.active}</p>
          </Card>
          <Card className="p-4 bg-white border-neutral-200">
            <p className="text-sm text-neutral-600 font-medium">Nonaktif</p>
            <p className="text-2xl font-bold mt-1 text-neutral-700">{stats.inactive}</p>
          </Card>
          <Card className="p-4 bg-white border-red-200">
            <p className="text-sm text-red-600 font-medium">Suspended</p>
            <p className="text-2xl font-bold mt-1 text-red-700">{stats.suspended}</p>
          </Card>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-border shadow-sm flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari jadwal..." 
                className="pl-9"
              />
            </div>
            <select 
              className="border border-border rounded-md px-3 py-2 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as ScheduleFilterStatus)}
            >
              <option value="all">Semua Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nama Jadwal</th>
                  <th className="px-6 py-3 font-semibold">Route</th>
                  <th className="px-6 py-3 font-semibold">Hari Aktif</th>
                  <th className="px-6 py-3 font-semibold">Jumlah Jam</th>
                  <th className="px-6 py-3 font-semibold">Assignment Armada</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.id} onClick={() => handleDetail(s)} className="border-b border-border hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">{s.name}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]" title={s.route?.name}>
                      <span 
                        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (s.routeId) router.push(`/routes?routeId=${s.routeId}`);
                        }}
                      >
                        {s.route?.name || <span className="text-red-500 italic">Route tidak ditemukan</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {s.activeDays.map(d => (
                          <span key={d} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-semibold border border-neutral-200">
                            {getDayAbbr(d)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">{s.times.length}</td>
                    <td className="px-6 py-4 font-medium">{s.times.reduce((acc, t) => acc + t.vehicleIds.length, 0)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        s.status === 'ACTIVE' ? 'bg-violet-100 text-violet-700' :
                        s.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {schedules.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                      Tidak ada jadwal ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawers */}

      <ScheduleDetailDrawer 
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        data={selectedSchedule}
        onEdit={handleEdit}
      />
    </div>
  );
}
