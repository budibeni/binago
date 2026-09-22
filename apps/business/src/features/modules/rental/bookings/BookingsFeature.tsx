"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, CheckCircle2, Car, XCircle, List, MapPin, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { bookingService } from '@/data/modules/rental/services/bookingService';
import type { Booking, BookingStatusFilter } from './types/booking';
import { BookingList } from './components/BookingList';
import { BookingView } from './components/BookingView';
import { BookingCreateFeature } from './BookingCreateFeature';
import { getBookingTranslation } from './i18n';
import { cn } from '@adatrack/utils';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { PanelShell, type DataTableFilterConfig } from '@adatrack/ui';

function StatCard({ label, value, colorClass, icon: Icon }: { label: string, value: number, colorClass: string, icon?: React.ElementType }) {
  const textColorClass = colorClass.replace(/bg-/g, 'text-');
  
  return (
    <div className="flex items-center justify-between p-3 rounded-none border border-border/80 bg-background transition-colors hover:border-border">
      <div className="flex items-center gap-2.5">
        {Icon ? (
          <div className={cn("p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800", textColorClass)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className={cn("w-2 h-2 rounded-full", colorClass)} />
        )}
        <span className="text-[11px] font-semibold text-foreground-muted tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

export function BookingsFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getBookingTranslation(locale);
  const labels = t;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [panelSide, setPanelSide] = useState<'left' | 'right' | 'top' | 'bottom'>('top');

  // Modals
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookings();
        if (mounted) setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBookings();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => ({
    all:       bookings.length,
    pending:   bookings.filter(r => r.status === 'PENDING').length,
    confirmed: bookings.filter(r => r.status === 'CONFIRMED').length,
    active:    bookings.filter(r => r.status === 'ACTIVE').length,
    completed: bookings.filter(r => r.status === 'COMPLETED').length,
    cancelled: bookings.filter(r => r.status === 'CANCELLED').length,
  }), [bookings]);

  const filteredData = useMemo(() => {
    return bookings.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const noMatch   = r.bookingNumber.toLowerCase().includes(q);
        const nameMatch = r.customer?.name?.toLowerCase().includes(q);
        const plateMatch = r.items?.some(item => item.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(q));
        if (!noMatch && !nameMatch && !plateMatch) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, search]);

  const handleOpenMapSingle = (vehicleId: string) => {
    trackingNavigationService.navigateToTracking(router, {
      mode: 'live',
      vehicleId: vehicleId
    });
  };

  const handleView = (booking: Booking) => {
    setDetailBooking(booking);
    setDrawerOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    console.log('Edit', booking.id);
  };

  const handleDelete = (booking: Booking) => {
    console.log('Delete', booking.id);
  };

  const handleConfirm = async (booking: Booking) => {
    try {
      await bookingService.updateBookingStatus(booking.id, 'CONFIRMED');
      const data = await bookingService.getBookings();
      setBookings(data);
      if (detailBooking?.id === booking.id) {
        setDetailBooking({ ...booking, status: 'CONFIRMED' });
      }
      alert('Booking berhasil dikonfirmasi');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal mengonfirmasi booking');
    }
  };

  const handleCancel = async (booking: Booking) => {
    try {
      await bookingService.updateBookingStatus(booking.id, 'CANCELLED');
      const data = await bookingService.getBookings();
      setBookings(data);
      if (detailBooking?.id === booking.id) {
        setDetailBooking({ ...booking, status: 'CANCELLED' });
      }
      alert('Booking berhasil dibatalkan');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal membatalkan booking');
    }
  };

  const dtLabels = useMemo(() => {
    const isEn = locale === 'en';
    return {
      paginationShowing: (from: number, to: number, total: number) => isEn ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items` : `Menampilkan ${from}-${to} dari ${total.toLocaleString('id-ID')} data`,
      paginationPerPage: isEn ? '/ page' : '/ halaman',
      toolbarRefresh: isEn ? 'Refresh' : 'Refresh',
      toolbarFilter: isEn ? 'Filter' : 'Filter',
      toolbarColumns: isEn ? 'Columns' : 'Kolom',
      toolbarExport: isEn ? 'Export' : 'Ekspor',
      activeFilterClear: isEn ? 'Clear Filters' : 'Reset Filter',
      columnPanelHideAll: isEn ? 'Hide all' : 'Sembunyikan semua',
      columnPanelShowAll: isEn ? 'Show all' : 'Tampilkan semua',
      errorLoadData: isEn ? 'Failed to load data.' : 'Gagal memuat data.',
      errorTryAgain: isEn ? 'Try Again' : 'Coba Lagi',
      errorTitle: isEn ? 'An error occurred' : 'Terjadi Kesalahan',
      noResultTitle: isEn ? 'No results found' : 'Hasil Tidak Ditemukan',
      noResultDesc: isEn ? 'No data matches your search or filters.' : 'Tidak ada data yang sesuai dengan pencarian atau filter Anda.',
    };
  }, [locale]);

  const filterConfig: DataTableFilterConfig = useMemo(() => ({
    state: { status: statusFilter === 'all' ? '' : statusFilter },
    onStateChange: (state) => setStatusFilter((state.status as BookingStatusFilter) || 'all'),
    onClearAll: () => setStatusFilter('all'),
    labels: {
      title: 'Filter',
      clearAll: 'Hapus Filter',
    },
    fields: [
      {
        id: 'status',
        label: labels.filterStatus || 'Status',
        type: 'pills-single',
        options: [
          { value: 'PENDING', label: labels.statusPending || 'Menunggu', colorClass: 'bg-amber-500', activeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-500' },
          { value: 'CONFIRMED', label: labels.statusConfirmed || 'Dikonfirmasi', colorClass: 'bg-blue-500', activeClass: 'bg-blue-500/15 border-blue-500/40 text-blue-500' },
          { value: 'ACTIVE', label: labels.statusActive || 'Aktif', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'COMPLETED', label: labels.statusCompleted || 'Selesai', colorClass: 'bg-neutral-500', activeClass: 'bg-neutral-500/15 border-neutral-500/40 text-neutral-500' },
          { value: 'CANCELLED', label: labels.statusCancelled || 'Batal', colorClass: 'bg-danger', activeClass: 'bg-danger/15 border-danger/40 text-danger' },
        ],
      },
    ],
  }), [statusFilter, labels]);

  const renderStatsPanel = () => {
    if (!showStats) return null;
    
    return (
      <PanelShell
        title="Ringkasan"
        side={panelSide}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        onOpen={() => setShowStats(true)}
        collapsedTitle="RINGKASAN"
        onSideChange={setPanelSide}
        labels={{
          top: labels.panelTop || 'Atas',
          right: labels.panelRight || 'Kanan',
          bottom: labels.panelBottom || 'Bawah',
          left: labels.panelLeft || 'Kiri',
          hide: labels.hidePanel || 'Sembunyikan',
          layoutToggleTitle: labels.layoutToggleTitle || 'Ubah Posisi Panel',
        }}
        className={cn(
          "shrink-0 bg-white dark:bg-background z-10",
          (panelSide === 'top' || panelSide === 'bottom') ? "w-full" : "w-80 min-w-80 h-full"
        )}
      >
        <div className={cn("gap-2.5 p-3", (panelSide === 'top' || panelSide === 'bottom') ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6" : "flex flex-col h-full")}>
          <StatCard label={labels.summaryTotal || 'Total Booking'} value={stats.all} colorClass="bg-foreground" icon={List} />
          <StatCard label={labels.statusPending || 'Menunggu'} value={stats.pending} colorClass="bg-amber-500" icon={Clock} />
          <StatCard label={labels.statusConfirmed || 'Dikonfirmasi'} value={stats.confirmed} colorClass="bg-blue-500" icon={CheckCircle2} />
          <StatCard label={labels.statusActive || 'Aktif'} value={stats.active} colorClass="bg-success" icon={Car} />
          <StatCard label={labels.statusCompleted || 'Selesai'} value={stats.completed} colorClass="bg-neutral-500" icon={CheckCircle2} />
          <StatCard label={labels.statusCancelled || 'Batal'} value={stats.cancelled} colorClass="bg-danger" icon={XCircle} />
        </div>
      </PanelShell>
    );
  };

  return (
    <div className={cn("flex h-full w-full bg-background overflow-hidden relative", (panelSide === 'top' || panelSide === 'bottom') ? 'flex-col' : 'flex-row')}>
      
      {/* Render panel first if top or left */}
      {(panelSide === 'top' || panelSide === 'left') && renderStatsPanel()}

      {/* Main Table */}
      <div className="flex-1 min-h-0 min-w-0 w-full relative border-none">
        <BookingList
          data={filteredData}
          labels={labels}
          searchValue={search}
          onSearchChange={setSearch}
          onAdd={() => setIsCreateOpen(true)}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOpenMap={handleOpenMapSingle}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          showStats={showStats}
          onToggleStats={() => setShowStats(!showStats)}
          dtLabels={dtLabels}
          className="border-none shadow-none"
        />
      </div>

      {/* Render panel last if bottom or right */}
      {(panelSide === 'bottom' || panelSide === 'right') && renderStatsPanel()}

      <BookingView
        booking={detailBooking}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        labels={labels}
        onEdit={(b) => { setDrawerOpen(false); handleEdit(b); }}
        onDelete={handleDelete}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <BookingCreateFeature
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={async () => {
          setIsCreateOpen(false);
          const newData = await bookingService.getBookings();
          setBookings(newData);
        }}
      />
    </div>
  );
}
