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
import type { DataTableFilterConfig } from '@adatrack/ui';

function StatCard({ label, value, colorClass }: { label: string, value: number, colorClass: string }) {
  return (
    <div className="flex flex-col p-2.5 rounded-md border border-border bg-card shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", colorClass)} />
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">{label}</span>
      <span className="text-xl font-bold mt-0.5 ml-1">{value}</span>
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
      alert(error instanceof Error ? error.message : 'Gagal mengonfirmasi reservasi');
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

  return (
    <div className="flex flex-col h-full w-full bg-background p-0 items-center overflow-hidden">
      <div className="w-full flex-1 flex flex-col min-h-0 space-y-0 pb-0">

        {/* Elegant Stats Ribbon (Dashboard Style) */}
        {showStats && (
          <div className="w-full px-4 pt-4 md:px-6 md:pt-6 bg-background animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <StatCard label={labels.summaryTotal || 'Total Booking'} value={stats.all} colorClass="bg-foreground" />
              <StatCard label={labels.statusPending || 'Menunggu'} value={stats.pending} colorClass="bg-amber-500" />
              <StatCard label={labels.statusConfirmed || 'Dikonfirmasi'} value={stats.confirmed} colorClass="bg-blue-500" />
              <StatCard label={labels.statusActive || 'Aktif'} value={stats.active} colorClass="bg-success" />
              <StatCard label={labels.statusCompleted || 'Selesai'} value={stats.completed} colorClass="bg-neutral-500" />
              <StatCard label={labels.statusCancelled || 'Batal'} value={stats.cancelled} colorClass="bg-danger" />
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="flex-1 min-h-0 w-full relative">
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

      </div>

      <BookingView
        booking={detailBooking}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        labels={labels}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onConfirm={handleConfirm}
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
