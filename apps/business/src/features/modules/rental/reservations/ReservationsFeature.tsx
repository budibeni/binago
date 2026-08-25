"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, CheckCircle2, Car, XCircle, List, MapPin, ChevronRight } from 'lucide-react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { reservationService } from '@/data/modules/rental/services/reservationService';
import type { Reservation, ReservationStatusFilter } from './types/reservation';
import { ReservationList } from './components/ReservationList';
import { ReservationDetailDrawer } from './components/ReservationDetailDrawer';
import { cn } from '@adatrack/utils';

export function ReservationsFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = t.reservation;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatusFilter>('all');

  // Modals
  const [detailReservation, setDetailReservation] = useState<Reservation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await reservationService.getReservations();
        if (mounted) setReservations(data);
      } catch (error) {
        console.error('Failed to load reservations:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchReservations();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => ({
    all:       reservations.length,
    pending:   reservations.filter(r => r.status === 'PENDING').length,
    confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
    active:    reservations.filter(r => r.status === 'ACTIVE').length,
    completed: reservations.filter(r => r.status === 'COMPLETED').length,
    cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
  }), [reservations]);

  const filteredData = useMemo(() => {
    return reservations.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const noMatch   = r.reservationNumber.toLowerCase().includes(q);
        const nameMatch = r.customer?.name?.toLowerCase().includes(q);
        const plateMatch = r.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(q);
        if (!noMatch && !nameMatch && !plateMatch) return false;
      }
      return true;
    });
  }, [reservations, statusFilter, search]);

  // Buka tracking untuk satu kendaraan dari tombol Map per baris
  const handleOpenMap = (vehicleId: string) => {
    router.push(`/tracking?vehicles=${vehicleId}`);
  };

  const handleView = (reservation: Reservation) => {
    setDetailReservation(reservation);
    setDrawerOpen(true);
  };

  const handleEdit = (reservation: Reservation) => {
    console.log('Edit', reservation.id);
  };

  const handleDelete = (reservation: Reservation) => {
    console.log('Delete', reservation.id);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6 items-center overflow-hidden relative">
      <div className="w-full h-full flex flex-col min-h-0 space-y-4">

        {/* Summary Cards — identik dengan Armada Rental */}
        <div className="grid grid-cols-6 gap-3">

          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'all'
                ? "border-b-4 border-b-neutral-800 dark:border-b-neutral-200 border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 shrink-0">
              <List className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.summaryTotal}</p>
              <p className="text-lg font-bold leading-none my-0.5">{stats.all}</p>
              <p className="text-[9px] text-muted-foreground truncate">Total Reservasi</p>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('PENDING')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'PENDING'
                ? "border-b-4 border-b-amber-500 border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusPending}</p>
              <p className="text-lg font-bold leading-none my-0.5">{stats.pending}</p>
              <p className="text-[9px] text-muted-foreground truncate">Menunggu konfirmasi</p>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'CONFIRMED'
                ? "border-b-4 border-b-blue-500 border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusConfirmed}</p>
              <p className="text-lg font-bold leading-none my-0.5">{stats.confirmed}</p>
              <p className="text-[9px] text-muted-foreground truncate">Sudah dikonfirmasi</p>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'ACTIVE'
                ? "border-b-4 border-b-success border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusActive}</p>
              <p className="text-lg font-bold leading-none my-0.5">{stats.active}</p>
              <p className="text-[9px] text-muted-foreground truncate">Sedang berjalan</p>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'COMPLETED'
                ? "border-b-4 border-b-neutral-500 border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusCompleted}</p>
              <p className="text-lg font-bold leading-none my-0.5">{stats.completed}</p>
              <p className="text-[9px] text-muted-foreground truncate">Selesai</p>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'CANCELLED'
                ? "border-b-4 border-b-danger border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusCancelled}</p>
              <p className="text-lg font-bold leading-none my-0.5">{stats.cancelled}</p>
              <p className="text-[9px] text-muted-foreground truncate">Dibatalkan</p>
            </div>
          </button>

        </div>

        {/* Main Table */}
        <div className="flex-1 min-h-0 w-full relative">
          <ReservationList
            data={filteredData}
            labels={labels}
            searchValue={search}
            onSearchChange={setSearch}
            onAdd={() => router.push('/rental/reservations/create')}
            onView={handleView}
            onEdit={handleEdit}
            onOpenMap={handleOpenMap}
          />
        </div>

      </div>

      <ReservationDetailDrawer
        reservation={detailReservation}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        labels={labels}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
