'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  Badge,
  Button,
  Dialog,
} from '@adatrack/ui';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Hourglass,
  Users,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { taskAttendanceService } from '@/data/modules/activity';
import type { TaskAttendanceRecord } from './types/taskAttendance';
import { getTaskAttendanceTranslation } from './i18n';
import { TaskAttendanceTable } from './components/TaskAttendanceTable';
import { TaskAttendanceDetailModal } from './components/TaskAttendanceDetailModal';

export function TaskAttendanceFeature() {
  const locale = useBusinessLocale();
  const t = getTaskAttendanceTranslation(locale);

  // Store data state
  const [records, setRecords] = useState<TaskAttendanceRecord[]>([]);
  const [stats, setStats] = useState(taskAttendanceService.getStats());

  // Filters & Search
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  // Detail Modal State
  const [selectedRecord, setSelectedRecord] = useState<TaskAttendanceRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Quick Photo Preview Dialog
  const [photoPreview, setPhotoPreview] = useState<{ src: string; title: string } | null>(null);

  // Load & subscribe to store
  const refresh = useCallback(() => {
    setRecords(taskAttendanceService.getAll());
    setStats(taskAttendanceService.getStats());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = taskAttendanceService.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false;
      }

      // Search text
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchesDriver = r.driverName.toLowerCase().includes(query);
        const matchesPlate = r.vehiclePlate.toLowerCase().includes(query);
        const matchesModel = r.vehicleModel.toLowerCase().includes(query);
        const matchesStartLoc = r.startLocation.address.toLowerCase().includes(query);
        const matchesEndLoc = r.endLocation?.address.toLowerCase().includes(query);
        return matchesDriver || matchesPlate || matchesModel || matchesStartLoc || matchesEndLoc;
      }

      return true;
    });
  }, [records, statusFilter, searchValue]);

  const handleViewDetail = (record: TaskAttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handlePreviewPhoto = (src: string, title: string) => {
    setPhotoPreview({ src, title });
  };

  const formatHours = (minutes: number) => {
    const hours = (minutes / 60).toFixed(1);
    return `${hours} Jam`;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-none shadow-sm">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {t.pageTitle}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
              {t.pageSubtitle}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          className="h-8 gap-1.5 text-xs self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Muat Ulang</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sesi */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-primary/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-none">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.total}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-foreground tabular-nums">
                {stats.total}
              </span>
              <span className="text-[10px] text-muted-foreground">{t.kpi.totalDesc}</span>
            </div>
          </div>
        </Card>

        {/* Tugas Selesai */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-emerald-500/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-none">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.completed}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-emerald-600 tabular-nums">
                {stats.completed}
              </span>
              <span className="text-[10px] text-muted-foreground">{t.kpi.completedDesc}</span>
            </div>
          </div>
        </Card>

        {/* Sedang Bertugas */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-amber-500/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-none">
            <Hourglass className="w-5 h-5 animate-spin" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.inProgress}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-amber-600 tabular-nums">
                {stats.inProgress}
              </span>
              <span className="text-[10px] text-muted-foreground">{t.kpi.inProgressDesc}</span>
            </div>
          </div>
        </Card>

        {/* Rata-Rata Durasi */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-primary/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-none">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.avgDuration}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-foreground tabular-nums">
                {stats.avgDurationMinutes ? formatHours(stats.avgDurationMinutes) : '-'}
              </span>
              <span className="text-[10px] text-muted-foreground">{t.kpi.avgDurationDesc}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            statusFilter === 'all'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          Semua ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {t.status.completed} ({stats.completed})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('in_progress')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === 'in_progress'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          {t.status.inProgress} ({stats.inProgress})
        </button>
      </div>

      {/* Main DataTable Card */}
      <Card className="border border-border p-4 shadow-xs">
        <TaskAttendanceTable
          data={filteredRecords}
          onViewDetail={handleViewDetail}
          onPreviewPhoto={handlePreviewPhoto}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => setStatusFilter(val as any)}
          locale={locale}
        />
      </Card>

      {/* Detail Modal */}
      <TaskAttendanceDetailModal
        record={selectedRecord}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        locale={locale}
      />

      {/* Quick Photo Preview Modal */}
      {photoPreview && (
        <Dialog
          open={!!photoPreview}
          onOpenChange={(open) => !open && setPhotoPreview(null)}
          title={photoPreview.title}
          className="max-w-xl p-4"
        >
          <div className="space-y-4 pt-2">
            <div className="bg-black rounded-lg overflow-hidden border border-border flex items-center justify-center">
              <img
                src={photoPreview.src}
                alt={photoPreview.title}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setPhotoPreview(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
