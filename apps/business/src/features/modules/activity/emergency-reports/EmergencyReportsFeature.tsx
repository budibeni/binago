'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, Wrench, ShieldAlert, CircleHelp, Clock,
  MapPin, User, Truck, Phone, CheckCircle2, RefreshCcw, Check,
  FileText, Eye, MessageSquare, Siren, ExternalLink,
  SlidersHorizontal, ChevronDown, X,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  DataList, DataListHeader, DataListContent, DataListItem,
  DataListPagination, DataTableSearch, FormShell, FormCard,
  RadioGroup, RadioGroupItem, PhoneLink,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@adatrack/ui';
import { emergencyReportService } from '@/data/modules/activity';
import type {
  EmergencyReport,
  EmergencyStatus,
  EmergencyCategory,
} from './types/emergencyReport';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG = {
  kerusakan: { label: 'Kerusakan', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  kehilangan: { label: 'Kehilangan', icon: ShieldAlert, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  kecelakaan: { label: 'Kecelakaan', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  lainnya: { label: 'Lainnya', icon: CircleHelp, color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
} as const;

const STATUS_CONFIG = {
  baru: { label: 'Baru', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500' },
  ditangani: { label: 'Ditangani', color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  selesai: { label: 'Selesai', color: 'text-green-600', bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-500' },
} as const;

const STATUS_TABS: { id: EmergencyStatus | 'semua'; label: string }[] = [
  { id: 'semua', label: 'Semua' },
  { id: 'baru', label: 'Baru' },
  { id: 'ditangani', label: 'Ditangani' },
  { id: 'selesai', label: 'Selesai' },
];

const CATEGORY_KEYS: EmergencyCategory[] = ['kerusakan', 'kecelakaan', 'kehilangan', 'lainnya'];

const CATEGORY_PILL_STYLES: Record<
  EmergencyCategory,
  { idle: string; active: string }
> = {
  kerusakan: {
    idle: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 hover:bg-orange-500/20',
    active: 'bg-orange-500 text-white border-orange-600 ring-2 ring-orange-400/40 shadow-xs font-bold',
  },
  kecelakaan: {
    idle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/20',
    active: 'bg-red-500 text-white border-red-600 ring-2 ring-red-400/40 shadow-xs font-bold',
  },
  kehilangan: {
    idle: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/20',
    active: 'bg-purple-500 text-white border-purple-600 ring-2 ring-purple-400/40 shadow-xs font-bold',
  },
  lainnya: {
    idle: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 hover:bg-slate-500/20',
    active: 'bg-slate-600 text-white border-slate-700 ring-2 ring-slate-400/40 shadow-xs font-bold',
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} mnt lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

// ─── INFO FIELD — label kecil uppercase + value (persis seperti ReturnForm) ──

function InfoField({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
        {label}
      </span>
      <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200">{value}</span>
      {sub && <div className="text-[11px] text-slate-500 dark:text-slate-400">{sub}</div>}
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EmergencyStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider whitespace-nowrap',
      cfg.color, cfg.bg, cfg.border
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-none', cfg.dot)} />
      {cfg.label.toUpperCase()}
    </span>
  );
}

// ─── RIGHT PANEL — Detail (menggunakan FormShell + FormCard) ──────────────────

function EmergencyDetailPanel({
  report,
  onClose,
  onStatusChange,
}: {
  report: EmergencyReport;
  onClose: () => void;
  onStatusChange: (id: string, status: EmergencyStatus, notes?: string) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<EmergencyStatus>(report.status);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedStatus(report.status);
    setNewNote('');
  }, [report.id, report.status]);

  const catCfg = CATEGORY_CONFIG[report.category];
  const CatIcon = catCfg.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    onStatusChange(report.id, selectedStatus, newNote || undefined);
    setNewNote('');
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200 w-full max-w-5xl mx-auto">
      {/* Mobile back */}
      <button
        onClick={onClose}
        className="md:hidden flex items-center gap-2 text-sm font-semibold text-primary mb-4"
      >
        ← Kembali ke Daftar
      </button>

      <FormShell
        layout="default"
        title={`Laporan Darurat — ${report.id}`}
        onSubmit={handleSubmit}
        onCancel={onClose}
        cancelText="Tutup"
        saveText={isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        isSubmitting={isSubmitting}
      >

        {/* ── CARD 1: Informasi Laporan ── */}
        <FormCard
          title="Informasi Laporan"
          description="Detail laporan darurat yang dikirim oleh pengemudi."
          icon={<CatIcon className="w-5 h-5" />}
          iconWrapperClassName={cn('text-white', catCfg.bg.replace('/10', '').replace('bg-', 'bg-'))}
        >
          {/* Status badge di atas grid */}
          <div className="flex items-center gap-2 mb-3">
            <StatusBadge status={report.status} />
            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold', catCfg.color, catCfg.bg, catCfg.border)}>
              <CatIcon className="w-3 h-3" />
              {catCfg.label}
            </span>
          </div>

          {/* Grid info — 4 kolom, persis seperti ReturnForm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <InfoField
              label="No. Laporan"
              value={report.id}
              sub={timeAgo(report.timestamp)}
            />
            <InfoField
              label="Waktu Laporan"
              value={formatTs(report.timestamp)}
            />
            <InfoField
              label="Pengemudi"
              value={report.driverName}
              sub={<PhoneLink phone={report.driverPhone} />}
            />
            <InfoField
              label="Kendaraan"
              value={report.vehiclePlate}
              sub={report.vehicleType}
            />
          </div>

          {/* Lokasi Kejadian & Buka di Google Maps / Street View */}
          <div className="mt-4 pt-3 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Lokasi Kejadian & Koordinat GPS
              </span>
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200">
                {report.location}
              </span>
              {report.coordinates && (
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-500 flex-none" />
                  {report.coordinates.lat.toFixed(6)}, {report.coordinates.lng.toFixed(6)}
                </span>
              )}
            </div>

            {report.coordinates && (
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${report.coordinates.lat},${report.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-background hover:bg-muted hover:border-slate-400 text-xs font-medium text-foreground transition-colors shadow-2xs"
                  title="Buka di Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>

                <a
                  href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${report.coordinates.lat},${report.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-background hover:bg-muted hover:border-slate-400 text-xs font-medium text-foreground transition-colors shadow-2xs"
                  title="Buka Google Maps Street View"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-amber-500 shrink-0">
                    <circle cx="12" cy="4.5" r="2.5" />
                    <path d="M15 8.5H9c-1.1 0-2 .9-2 2v4.5h2v6h1.5v-5.5h3v5.5H15v-6h2v-4.5c0-1.1-.9-2-2-2z" />
                  </svg>
                  <span>Street View</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>
              </div>
            )}
          </div>
        </FormCard>

        {/* ── CARD 2: Deskripsi Kejadian ── */}
        <FormCard
          title="Deskripsi Kejadian"
          description="Keterangan singkat yang disampaikan pengemudi."
          icon={<FileText className="w-5 h-5 text-blue-500" />}
          iconWrapperClassName="bg-blue-100 dark:bg-blue-900/30 text-blue-500"
        >
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-border p-3">
            {report.description || (
              <span className="text-muted-foreground italic">Tidak ada deskripsi kejadian.</span>
            )}
          </p>
        </FormCard>

        {/* ── CARD 3: Riwayat & Timeline Penanganan ── */}
        {(report.handledAt || report.resolvedAt || (report.activityLog && report.activityLog.length > 0) || report.notes) && (
          <FormCard
            title="Riwayat & Timeline Penanganan"
            description="Rekam jejak tindakan, status, dan riwayat catatan berkala."
            icon={<Eye className="w-5 h-5 text-slate-500" />}
            iconWrapperClassName="bg-slate-100 dark:bg-slate-800 text-slate-500"
          >
            <div className="space-y-3">
              {/* Status milestones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {report.handledAt && (
                  <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-none mt-0.5">
                      <RefreshCcw className="w-3 h-3 text-amber-600" />
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-amber-700 dark:text-amber-400">Mulai Ditangani</div>
                      <div className="text-muted-foreground text-[11px]">{formatTs(report.handledAt)} {report.handledBy ? `• ${report.handledBy}` : ''}</div>
                    </div>
                  </div>
                )}
                {report.resolvedAt && (
                  <div className="flex items-start gap-2.5 bg-green-500/5 border border-green-500/20 rounded-lg p-2.5">
                    <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-none mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-green-700 dark:text-green-400">Diselesaikan</div>
                      <div className="text-muted-foreground text-[11px]">{formatTs(report.resolvedAt)} {report.handledBy ? `• ${report.handledBy}` : ''}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Log / Timeline Notes */}
              {report.activityLog && report.activityLog.length > 0 ? (
                <div className="pt-2 border-t border-border space-y-2">
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase block">
                    Catatan Progres ({report.activityLog.length})
                  </span>
                  <div className="space-y-2">
                    {report.activityLog.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-border text-xs flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-bold text-foreground flex items-center gap-1.5">
                            <User className="w-3 h-3 text-primary" />
                            {log.author}
                          </span>
                          <span>{formatTs(log.timestamp)} ({timeAgo(log.timestamp)})</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
                          {log.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : report.notes ? (
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1">
                    Catatan Terakhir
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-border">
                    {report.notes}
                  </p>
                </div>
              ) : null}
            </div>
          </FormCard>
        )}

        {/* ── CARD 4: Tindakan & Catatan Admin ── */}
        <FormCard
          title="Tindakan & Catatan Admin"
          description="Pilih status penanganan laporan dan tambahkan catatan progres baru."
          icon={<MessageSquare className="w-5 h-5 text-primary" />}
          iconWrapperClassName="bg-primary/10 text-primary"
        >
          <div className="space-y-4">
            {/* Pilihan Status Radio */}
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-2">
                Pilih Status Penanganan
              </span>
              <RadioGroup
                value={selectedStatus}
                onValueChange={(val) => setSelectedStatus(val as EmergencyStatus)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {/* Opsi Baru */}
                <label
                  htmlFor="status-baru"
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                    selectedStatus === 'baru'
                      ? 'border-red-500 bg-red-500/5 ring-1 ring-red-500 shadow-sm'
                      : 'border-border bg-card hover:bg-muted/50'
                  )}
                >
                  <RadioGroupItem value="baru" id="status-baru" className="mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Baru
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 leading-snug">Menunggu respon tim</span>
                  </div>
                </label>

                {/* Opsi Ditangani */}
                <label
                  htmlFor="status-ditangani"
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                    selectedStatus === 'ditangani'
                      ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500 shadow-sm'
                      : 'border-border bg-card hover:bg-muted/50'
                  )}
                >
                  <RadioGroupItem value="ditangani" id="status-ditangani" className="mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Sedang Ditangani
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 leading-snug">Koordinasi tim / mekanik</span>
                  </div>
                </label>

                {/* Opsi Selesai */}
                <label
                  htmlFor="status-selesai"
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                    selectedStatus === 'selesai'
                      ? 'border-green-600 bg-green-500/5 ring-1 ring-green-600 shadow-sm'
                      : 'border-border bg-card hover:bg-muted/50'
                  )}
                >
                  <RadioGroupItem value="selesai" id="status-selesai" className="mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Selesai
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 leading-snug">Kendala telah tertangani</span>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Tambah Catatan Baru */}
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-2">
                Tambah Catatan Progres
              </span>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:bg-background outline-none resize-none placeholder:text-muted-foreground transition-all"
                placeholder="Tuliskan catatan progres terkini (misal: mekanik meluncur, hasil koordinasi asuransi, dll)..."
              />
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Setiap catatan yang Anda simpan akan masuk secara kronologis ke dalam timeline riwayat di atas.
              </p>
            </div>
          </div>
        </FormCard>

      </FormShell>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyDetailState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground opacity-50">
      <Siren className="w-16 h-16 mb-4" />
      <p className="text-lg font-bold">Pilih Laporan</p>
      <p className="text-sm">Pilih salah satu laporan darurat di panel kiri untuk melihat detail.</p>
    </div>
  );
}

// ─── MAIN FEATURE ─────────────────────────────────────────────────────────────

export function EmergencyReportsFeature() {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<EmergencyStatus | 'semua'>('semua');
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | 'semua'>('semua');
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 15;

  useEffect(() => { setPageIndex(0); }, [search, activeTab, selectedCategory]);

  const refresh = useCallback(() => {
    setReports(emergencyReportService.getAll());
  }, []);

  useEffect(() => {
    refresh();
    return emergencyReportService.subscribe(refresh);
  }, [refresh]);

  const handleStatusChange = useCallback(
    (id: string, status: EmergencyStatus, notes?: string) => {
      emergencyReportService.updateStatus(id, status, { handledBy: 'Super Admin', notes });
    },
    []
  );

  const filteredReports = reports.filter((r) => {
    if (activeTab !== 'semua' && r.status !== activeTab) return false;
    if (selectedCategory !== 'semua' && r.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.driverName.toLowerCase().includes(q) ||
        r.vehiclePlate.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRows = filteredReports.length;
  const pageCount = Math.ceil(totalRows / pageSize);
  const paginated = filteredReports.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const selectedReport = reports.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="flex flex-col md:flex-row h-full bg-background overflow-hidden border-t border-border">

      {/* ── LEFT PANEL ── */}
      <DataList className={cn(selectedId ? 'hidden md:flex' : 'flex')}>
        <DataListHeader className="gap-2.5">
          {/* Segmented Status Tabs */}
          <div className="flex w-full bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg border border-border/40">
            {STATUS_TABS.map((tab) => {
              const count = tab.id === 'semua'
                ? reports.length
                : reports.filter((r) => r.status === tab.id).length;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedId(null); }}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-1 px-1 rounded-md text-[11px] font-medium transition-all text-center',
                    isActive
                      ? 'bg-background text-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.id === 'baru' && count > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 1 Baris Terpadu: Search Box + Dropdown Filter Kategori */}
          <div className="flex items-center gap-1.5 w-full">
            <DataTableSearch
              value={search}
              onChange={setSearch}
              placeholder="Cari driver, plat, lokasi..."
              className="flex-1 max-w-none"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title={
                    selectedCategory === 'semua'
                      ? 'Filter Kategori Laporan'
                      : `Kategori: ${CATEGORY_CONFIG[selectedCategory].label}`
                  }
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-md border transition-all shrink-0 relative',
                    selectedCategory === 'semua'
                      ? 'bg-gray-50 dark:bg-gray-900/40 border-neutral-200 dark:border-neutral-800 text-muted-foreground hover:text-foreground hover:bg-muted'
                      : cn(
                          'shadow-2xs ring-1 ring-primary/40',
                          CATEGORY_CONFIG[selectedCategory].bg,
                          CATEGORY_CONFIG[selectedCategory].border
                        )
                  )}
                >
                  {selectedCategory === 'semua' ? (
                    <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    (() => {
                      const Cfg = CATEGORY_CONFIG[selectedCategory];
                      const Icon = Cfg.icon;
                      return (
                        <>
                          <Icon className={cn('w-4 h-4', Cfg.color)} />
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
                        </>
                      );
                    })()
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52 z-[9999]">
                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Filter Kategori
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => { setSelectedCategory('semua'); setSelectedId(null); }}
                  className="flex items-center justify-between text-xs cursor-pointer py-1.5"
                >
                  <span className={cn(selectedCategory === 'semua' && 'font-bold text-primary')}>
                    Semua Kategori
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {reports.filter((r) => activeTab === 'semua' || r.status === activeTab).length}
                    </span>
                    {selectedCategory === 'semua' && <Check className="w-3.5 h-3.5 text-primary" />}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {CATEGORY_KEYS.map((catKey) => {
                  const cfg = CATEGORY_CONFIG[catKey];
                  const Icon = cfg.icon;
                  const isSelected = selectedCategory === catKey;
                  const count = reports.filter((r) => {
                    const matchStatus = activeTab === 'semua' || r.status === activeTab;
                    return matchStatus && r.category === catKey;
                  }).length;

                  return (
                    <DropdownMenuItem
                      key={catKey}
                      onClick={() => { setSelectedCategory(catKey); setSelectedId(null); }}
                      className="flex items-center justify-between text-xs cursor-pointer py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn('w-5 h-5 rounded flex items-center justify-center', cfg.bg)}>
                          <Icon className={cn('w-3 h-3', cfg.color)} />
                        </div>
                        <span className={cn(isSelected && 'font-bold text-foreground')}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {count}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DataListHeader>

        <DataListContent>
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Siren className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada laporan</p>
              {(activeTab !== 'semua' || selectedCategory !== 'semua' || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('semua');
                    setSelectedCategory('semua');
                    setSearch('');
                  }}
                  className="text-xs text-primary hover:underline mt-2 font-medium"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            paginated.map((report) => {
              const catCfg = CATEGORY_CONFIG[report.category];
              const CatIcon = catCfg.icon;
              const isSelected = selectedId === report.id;
              const isNew = report.status === 'baru';

              return (
                <DataListItem
                  key={report.id}
                  isSelected={isSelected}
                  onClick={() => setSelectedId(report.id)}
                >
                  {/* Baris 1: ID + status */}
                  <div className="flex items-center justify-between w-full mb-0.5">
                    <span className="text-[10px] font-normal text-muted-foreground">{report.id}</span>
                    <StatusBadge status={report.status} />
                  </div>

                  {/* Baris 2: Nama + kategori */}
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5">
                      {isNew && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-none animate-pulse" />}
                      <span className="text-[13px] font-semibold text-foreground truncate">{report.driverName}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-none">
                      <CatIcon className={cn('w-3 h-3', catCfg.color)} />
                      <span className={cn('text-[10px] font-bold', catCfg.color)}>{catCfg.label}</span>
                    </div>
                  </div>

                  {/* Baris 3: Kendaraan */}
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-0.5">
                    <Truck className="w-3 h-3 flex-none" />
                    <span className="truncate">{report.vehiclePlate} — {report.vehicleType}</span>
                  </div>

                  {/* Baris 4: Waktu */}
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3 flex-none" />
                    <span>{timeAgo(report.timestamp)}</span>
                  </div>
                </DataListItem>
              );
            })
          )}
        </DataListContent>

        <DataListPagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalRows={totalRows}
          onNextPage={() => setPageIndex((p) => p + 1)}
          onPrevPage={() => setPageIndex((p) => p - 1)}
          canNextPage={pageIndex < pageCount - 1}
          canPrevPage={pageIndex > 0}
        />
      </DataList>

      {/* ── RIGHT PANEL ── */}
      <div className={cn(
        'flex-1 bg-neutral-50/50 dark:bg-neutral-950/20 overflow-y-auto relative',
        !selectedId ? 'hidden md:block' : 'block'
      )}>
        {selectedReport ? (
          <EmergencyDetailPanel
            report={selectedReport}
            onClose={() => setSelectedId(null)}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <EmptyDetailState />
        )}
      </div>
    </div>
  );
}
