'use client';

import React from 'react';
import { Dialog } from '@adatrack/ui';
import { Search } from 'lucide-react';
import type { Reservation } from '@/features/modules/rental/reservations/types/reservation';

interface ReservationSelectModalProps {
  open: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onSelect: (r: Reservation) => void;
  labels: Record<string, string>;
}

export function ReservationSelectModal({
  open,
  onClose,
  reservations,
  onSelect,
  labels,
}: ReservationSelectModalProps) {
  const [search, setSearch] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!search) return reservations;
    const s = search.toLowerCase();
    return reservations.filter(r => 
      r.reservationNumber.toLowerCase().includes(s) ||
      r.customer?.name.toLowerCase().includes(s) ||
      r.vehicle?.coreVehicle?.plateNumber.toLowerCase().includes(s)
    );
  }, [reservations, search]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(val) => !val && onClose()}
      title={labels.selectReservation || 'Pilih Reservasi'}
      description={labels.selectReservationSubtitle || 'Pilih reservasi yang sudah dikonfirmasi untuk dibuatkan kontrak.'}
      className="max-w-4xl"
    >
      <div className="mt-4 relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Cari no reservasi, pelanggan, atau plat nomor..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <p className="text-sm font-medium">Reservasi tidak ditemukan</p>
            <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(r => (
              <div 
                key={r.id} 
                className="bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors flex items-center justify-between gap-4"
                onClick={() => {
                  onSelect(r);
                  onClose();
                }}
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">No. Reservasi</p>
                    <p className="text-sm font-bold truncate">{r.reservationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Pelanggan</p>
                    <p className="text-sm font-medium truncate">{r.customer?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Kendaraan</p>
                    <p className="text-sm font-medium truncate">{r.vehicle?.coreVehicle?.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">Periode & Total</p>
                    <p className="text-sm font-medium truncate">
                      {formatDate(r.startDate)} ({r.duration} hari) - {formatCurrency(r.totalAmount)}
                    </p>
                  </div>
                </div>
                <button className="shrink-0 px-4 py-1.5 bg-white dark:bg-neutral-800 border border-border rounded-md text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  Pilih
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          Batal
        </button>
      </div>
    </Dialog>
  );
}
