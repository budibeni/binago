'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  Badge,
  Button,
  Dialog,
} from '@adatrack/ui';
import {
  MapPinned,
  ShieldCheck,
  Calendar,
  Building2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { geofenceAttendanceService } from '@/data/modules/activity';
import type { GeofenceAttendanceRecord } from './types/geofenceAttendance';
import { getGeofenceAttendanceTranslation } from './i18n';
import { GeofenceAttendanceTable } from './components/GeofenceAttendanceTable';
import { GeofenceAttendanceDetailModal } from './components/GeofenceAttendanceDetailModal';

export function GeofenceAttendanceFeature() {
  const locale = useBusinessLocale();
  const t = getGeofenceAttendanceTranslation(locale);

  // Store data state
  const [records, setRecords] = useState<GeofenceAttendanceRecord[]>([]);
  const [stats, setStats] = useState(geofenceAttendanceService.getStats());

  // Filters & Search
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'inside' | 'warning'>('all');
  const [geofenceFilter, setGeofenceFilter] = useState('all');

  // Detail Modal State
  const [selectedRecord, setSelectedRecord] = useState<GeofenceAttendanceRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Quick Photo Preview
  const [photoPreview, setPhotoPreview] = useState<{ src: string; title: string } | null>(null);

  // Load & subscribe to store
  const refresh = useCallback(() => {
    setRecords(geofenceAttendanceService.getAll());
    setStats(geofenceAttendanceService.getStats());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = geofenceAttendanceService.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  // Unique list of geofence names for filter dropdown
  const availableGeofences = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.geofenceName)));
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Status filter
      if (statusFilter === 'inside' && !r.isWithinGeofence) return false;
      if (statusFilter === 'warning' && r.isWithinGeofence) return false;

      // Geofence filter
      if (geofenceFilter !== 'all' && r.geofenceName !== geofenceFilter) return false;

      // Search text
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchesDriver = r.driverName.toLowerCase().includes(query);
        const matchesPlate = r.vehiclePlate.toLowerCase().includes(query);
        const matchesGeofence = r.geofenceName.toLowerCase().includes(query);
        const matchesLoc = r.locationAddress.toLowerCase().includes(query);
        return matchesDriver || matchesPlate || matchesGeofence || matchesLoc;
      }

      return true;
    });
  }, [records, statusFilter, geofenceFilter, searchValue]);

  const handleViewDetail = (record: GeofenceAttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handlePreviewPhoto = (src: string, title: string) => {
    setPhotoPreview({ src, title });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-none shadow-sm">
            <MapPinned className="w-6 h-6" />
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
        {/* Total Absen */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-amber-500/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-none">
            <MapPinned className="w-5 h-5" />
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

        {/* Presensi Hari Ini */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-blue-500/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-none">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.today}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-blue-600 tabular-nums">
                {stats.today}
              </span>
              <span className="text-[10px] text-muted-foreground">{t.kpi.todayDesc}</span>
            </div>
          </div>
        </Card>

        {/* Di Dalam Area Valid */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-emerald-500/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-none">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.verifiedInside}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-emerald-600 tabular-nums">
                {stats.verifiedInside}
              </span>
              <span className="text-[10px] text-muted-foreground">{t.kpi.verifiedInsideDesc}</span>
            </div>
          </div>
        </Card>

        {/* Titik Geofence Aktif */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-primary/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-none">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.uniqueGeofences}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-foreground tabular-nums">
                {stats.uniqueGeofences}
              </span>
              <span className="text-[10px] text-muted-foreground">{t.kpi.uniqueGeofencesDesc}</span>
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
          onClick={() => setStatusFilter('inside')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === 'inside'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {t.status.inside} ({stats.verifiedInside})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('warning')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === 'warning'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          {t.status.warning} ({stats.outsideWarning})
        </button>
      </div>

      {/* Main DataTable Card */}
      <Card className="border border-border p-4 shadow-xs">
        <GeofenceAttendanceTable
          data={filteredRecords}
          onViewDetail={handleViewDetail}
          onPreviewPhoto={handlePreviewPhoto}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => setStatusFilter(val as any)}
          geofenceFilter={geofenceFilter}
          onGeofenceFilterChange={setGeofenceFilter}
          availableGeofences={availableGeofences}
          locale={locale}
        />
      </Card>

      {/* Detail Modal */}
      <GeofenceAttendanceDetailModal
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
