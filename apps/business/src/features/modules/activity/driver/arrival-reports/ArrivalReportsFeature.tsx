'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  Badge,
  Button,
  Dialog,
} from '@adatrack/ui';
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Building,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { arrivalReportService } from '@/data/modules/activity';
import type { ArrivalReportRecord, DestinationType } from './types/arrivalReport';
import { getArrivalReportTranslation } from './i18n';
import { ArrivalReportTable } from './components/ArrivalReportTable';
import { ArrivalReportDetailModal } from './components/ArrivalReportDetailModal';

export function ArrivalReportsFeature() {
  const locale = useBusinessLocale();
  const t = getArrivalReportTranslation(locale);

  // Store data state
  const [records, setRecords] = useState<ArrivalReportRecord[]>([]);
  const [stats, setStats] = useState(arrivalReportService.getStats());

  // Filters & Search
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending_review'>('all');
  const [destinationTypeFilter, setDestinationTypeFilter] = useState('all');

  // Detail Modal State
  const [selectedRecord, setSelectedRecord] = useState<ArrivalReportRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Quick Photo Preview
  const [photoPreview, setPhotoPreview] = useState<{ src: string; title: string } | null>(null);

  // Load & subscribe to store
  const refresh = useCallback(() => {
    setRecords(arrivalReportService.getAll());
    setStats(arrivalReportService.getStats());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = arrivalReportService.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  // Unique list of destination types for filter dropdown
  const availableTypes = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.destinationType)));
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;

      // Destination type filter
      if (destinationTypeFilter !== 'all' && r.destinationType !== destinationTypeFilter) {
        return false;
      }

      // Search text
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchesDriver = r.driverName.toLowerCase().includes(query);
        const matchesPlate = r.vehiclePlate.toLowerCase().includes(query);
        const matchesDestination = r.destinationName.toLowerCase().includes(query);
        const matchesAddress = r.address.toLowerCase().includes(query);
        const matchesRecipient = r.recipientName?.toLowerCase().includes(query);
        return (
          matchesDriver ||
          matchesPlate ||
          matchesDestination ||
          matchesAddress ||
          matchesRecipient
        );
      }

      return true;
    });
  }, [records, statusFilter, destinationTypeFilter, searchValue]);

  const handleViewDetail = (record: ArrivalReportRecord) => {
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
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-none shadow-sm">
            <MapPin className="w-6 h-6" />
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
        {/* Total Laporan */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-emerald-500/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-none">
            <MapPin className="w-5 h-5" />
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

        {/* Kedatangan Hari Ini */}
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

        {/* Terverifikasi GPS */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-emerald-500/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-none">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.verified}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-emerald-600 tabular-nums">
                {stats.verified}
              </span>
              <span className="text-[10px] text-muted-foreground">{t.kpi.verifiedDesc}</span>
            </div>
          </div>
        </Card>

        {/* Lokasi Tujuan Unik */}
        <Card className="p-4 flex items-center gap-3.5 border border-border shadow-xs hover:border-primary/30 transition-colors">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-none">
            <Building className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-muted-foreground block truncate">
              {t.kpi.uniqueDestinations}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-extrabold text-foreground tabular-nums">
                {stats.uniqueDestinations}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t.kpi.uniqueDestinationsDesc}
              </span>
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
          onClick={() => setStatusFilter('verified')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === 'verified'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {t.status.verified} ({stats.verified})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('pending_review')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === 'pending_review'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          {t.status.pendingReview} ({stats.pendingReview})
        </button>
      </div>

      {/* Main DataTable Card */}
      <Card className="border border-border p-4 shadow-xs">
        <ArrivalReportTable
          data={filteredRecords}
          onViewDetail={handleViewDetail}
          onPreviewPhoto={handlePreviewPhoto}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => setStatusFilter(val as any)}
          destinationTypeFilter={destinationTypeFilter}
          onDestinationTypeFilterChange={setDestinationTypeFilter}
          availableTypes={availableTypes}
          locale={locale}
        />
      </Card>

      {/* Detail Modal */}
      <ArrivalReportDetailModal
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
