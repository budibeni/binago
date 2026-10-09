'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@adatrack/ui/src/DataTable';
import { Badge } from '@adatrack/ui/src/Badge';
import { PanelShell, type DataTableFilterConfig, Button, DetailShell, PhoneLink, Checkbox } from '@adatrack/ui';
import { Clock, AlertTriangle, CheckCircle2, MapPin, List, Eye, Navigation, ChevronDown } from 'lucide-react';
import { cn, formatDateTime } from '@adatrack/utils';
import type { DataTableColumnDef } from '@adatrack/ui/src/DataTable/types';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { bookingService } from '@/data/modules/rental/services/bookingService';
import type { Booking, BookingItem } from '@/features/modules/rental/bookings/types/booking';
import Link from 'next/link';

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

// Helper for time remaining
function getTimeStatus(endDate: string) {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) return 'OVERDUE';
  if (diffHours <= 24) return 'WARNING';
  return 'SAFE';
}


function formatTimeRemaining(endDate: string) {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();

  const isOverdue = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const diffHours = Math.floor(absMs / (1000 * 60 * 60));
  const diffMins = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours >= 24) {
    const days = Math.floor(diffHours / 24);
    const remHours = diffHours % 24;
    const text = `${days} Hari ${remHours} Jam`;
    return isOverdue ? `- ${text}` : text;
  }
  const text = `${diffHours} Jam ${diffMins} Menit`;
  return isOverdue ? `- ${text}` : text;
}

export interface MonitoredItem extends BookingItem {
  booking: Booking;
}

export function MonitoringFeature() {
  const router = useRouter();
  const [data, setData] = useState<MonitoredItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [showStats, setShowStats] = useState(true);
  const [panelSide, setPanelSide] = useState<'left' | 'right' | 'top' | 'bottom'>('top');

  const [selectedItem, setSelectedItem] = useState<MonitoredItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const bookings = await bookingService.getBookings();
      const monitored: MonitoredItem[] = [];

      bookings.forEach(b => {
        b.items.forEach(item => {
          if (item.itemStatus === 'IN_USE') {
            monitored.push({
              ...item,
              booking: b
            });
          }
        });
      });

      // Sort by end date ascending (closest to finish first)
      monitored.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

      setData(monitored);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Status filter
      if (statusFilter !== 'ALL') {
        const status = getTimeStatus(item.endDate);
        if (status !== statusFilter) return false;
      }

      // Search filter
      if (search) {
        const s = search.toLowerCase();
        const b = item.booking;
        const match =
          b.contractNumber?.toLowerCase().includes(s) ||
          item.handoverNumber?.toLowerCase().includes(s) ||
          b.customerSnapshot?.name?.toLowerCase().includes(s) ||
          item.vehicleSnapshot?.licensePlate.toLowerCase().includes(s);

        if (!match) return false;
      }
      return true;
    });
  }, [data, search, statusFilter]);

  const stats = useMemo(() => {
    return data.reduce((acc, item) => {
      const status = getTimeStatus(item.endDate);
      acc.total++;
      if (status === 'SAFE') acc.safe++;
      if (status === 'WARNING') acc.warning++;
      if (status === 'OVERDUE') acc.overdue++;
      return acc;
    }, { total: 0, safe: 0, warning: 0, overdue: 0 });
  }, [data]);

  const filterConfig: DataTableFilterConfig = useMemo(() => ({
    state: { status: statusFilter },
    onStateChange: (state) => setStatusFilter((state.status as string) || 'ALL'),
    onClearAll: () => setStatusFilter('ALL'),
    labels: {
      title: 'Filter Waktu',
      clearAll: 'Semua Status',
    },
    fields: [
      {
        id: 'status',
        label: 'Status Keterlambatan',
        type: 'pills-single',
        options: [
          { value: 'ALL', label: 'Semua', colorClass: 'bg-neutral-500', activeClass: 'bg-neutral-500/15 text-neutral-600' },
          { value: 'SAFE', label: 'Aman (> 24j)', colorClass: 'bg-success', activeClass: 'bg-success/15 text-success' },
          { value: 'WARNING', label: 'Segera Habis (< 24j)', colorClass: 'bg-warning', activeClass: 'bg-warning/15 text-warning' },
          { value: 'OVERDUE', label: 'Terlambat', colorClass: 'bg-danger', activeClass: 'bg-danger/15 text-danger' },
        ],
      },
    ],
  }), [statusFilter]);

  const columns: DataTableColumnDef<MonitoredItem>[] = [
    {
      id: 'actions',
      header: '',
      size: 50,
      meta: { fixedWidth: true, pin: 'left', className: 'w-[40px] px-1 max-w-[40px]', align: 'center' },
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          <Button
            variant="ghost-danger"
            size="icon"
            onClick={() => setSelectedItem(row.original)}
            title="Lihat Detail"
          >
            <Eye className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      )
    },
    {
      id: 'ref',
      header: 'No Ref',
      accessorKey: 'handoverNumber',
      cell: ({ row }) => {
        const item = row.original;
        const b = item.booking;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground">{item.handoverNumber || '-'}</span>
            <span className="text-[11px] text-muted-foreground">{b.contractNumber || b.bookingNumber}</span>
          </div>
        );
      }
    },
    {
      id: 'customer',
      header: 'Pelanggan',
      accessorKey: 'booking.customerSnapshot.name',
      cell: ({ row }) => {
        const b = row.original.booking;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground">{b.customerSnapshot?.name}</span>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{b.customerSnapshot?.type}</span>
          </div>
        );
      }
    },
    {
      id: 'contact',
      header: 'Kontak',
      accessorKey: 'booking.customerSnapshot.phone',
      cell: ({ row }) => {
        const b = row.original.booking;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <div className="-ml-1">
              <PhoneLink phone={b.customerSnapshot?.phone || ''} className="text-[13px] font-normal text-primary hover:underline ml-1 truncate" />
            </div>
            <span className="text-[11px] text-muted-foreground">{b.customerSnapshot?.city || ''} {b.customerSnapshot?.province ? `- ${b.customerSnapshot?.province}` : ''}</span>
          </div>
        );
      }
    },
    {
      id: 'vehicle',
      header: 'Kendaraan',
      accessorKey: 'vehicleSnapshot.licensePlate',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-0.5 items-start py-1">
            <button
              onClick={() => trackingNavigationService.navigateToTracking(router, { mode: 'live', vehicleIds: [item.vehicleId] })}
              className="group/link inline-flex items-center gap-1.5 text-[13px] font-normal text-foreground hover:text-red-600 dark:hover:text-red-400 hover:underline transition-colors text-left"
            >
              <Navigation className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{item.vehicleSnapshot?.licensePlate}</span>
            </button>
            <span className="text-[11px] text-muted-foreground pl-5">{item.vehicleSnapshot?.brand} {item.vehicleSnapshot?.model}</span>
          </div>
        );
      }
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'endDate',
      cell: ({ row }) => {
        const status = getTimeStatus(row.original.endDate);
        let dotClass = '';
        let label = '';

        if (status === 'SAFE') {
          dotClass = 'bg-success';
          label = 'Aman';
        } else if (status === 'WARNING') {
          dotClass = 'bg-warning';
          label = 'Segera Habis';
        } else {
          dotClass = 'bg-danger';
          label = 'Terlambat';
        }

        return (
          <div className="flex items-center gap-1.5 py-1">
            <div className={cn("w-2 h-2 rounded-full shrink-0", dotClass)} />
            <span className="text-[11px] text-foreground font-medium uppercase tracking-wider">{label}</span>
          </div>
        );
      }
    },
    {
      id: 'timeLeft',
      header: 'Sisa Waktu',
      accessorKey: 'endDate',
      cell: ({ row }) => {
        const status = getTimeStatus(row.original.endDate);
        const timeStr = formatTimeRemaining(row.original.endDate);

        return (
          <div className="py-1">
            <span className={cn("text-[13px] font-normal", status === 'OVERDUE' ? 'text-danger' : 'text-foreground')}>
              {timeStr}
            </span>
          </div>
        );
      }
    },
    {
      id: 'period',
      header: 'Periode Sewa',
      accessorKey: 'startDate',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground">{formatDateTime(item.startDate)}</span>
            <span className="text-[11px] text-muted-foreground">s/d {formatDateTime(item.endDate)}</span>
          </div>
        );
      }
    },
    {
      id: 'handover',
      header: 'Serah Terima',
      accessorKey: 'handoverDate',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-1.5 items-start py-1">
            <button
              onClick={() => trackingNavigationService.navigateToTracking(router, { mode: 'playback', vehicleIds: [item.vehicleId], start: item.handoverDate })}
              className="group/link inline-flex items-center gap-1.5 text-[13px] font-normal text-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-left"
              title="Lihat Playback dari waktu Serah Terima"
            >
              <span className="truncate">{item.handoverDate ? formatDateTime(item.handoverDate) : '-'}</span>
              <Clock className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
            </button>
            {item.handoverLocation && (
              <a
                href={`https://maps.google.com/?q=${item.handoverLocation.latitude},${item.handoverLocation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors text-left"
              >
                <span className="truncate max-w-[120px]">{item.handoverLocation.address || `${item.handoverLocation.latitude}, ${item.handoverLocation.longitude}`}</span>
                <MapPin className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
              </a>
            )}
          </div>
        );
      }
    }
  ];

  const renderStatsPanel = () => {
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
          top: 'Atas',
          right: 'Kanan',
          bottom: 'Bawah',
          left: 'Kiri',
          hide: 'Sembunyikan',
          layoutToggleTitle: 'Ubah Posisi Panel',
        }}
        className={cn(
          "shrink-0 bg-white dark:bg-background z-10",
          (panelSide === 'top' || panelSide === 'bottom') ? "w-full" : "w-80 min-w-80 h-full"
        )}
      >
        <div className={cn("gap-2.5 p-3", (panelSide === 'top' || panelSide === 'bottom') ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6" : "flex flex-col h-full")}>
          <StatCard label="Semua Kendaraan" value={stats.total} colorClass="bg-neutral-500" icon={List} />
          <StatCard label="Aman (> 24 Jam)" value={stats.safe} colorClass="bg-success" icon={CheckCircle2} />
          <StatCard label="Segera Habis (< 24 Jam)" value={stats.warning} colorClass="bg-warning" icon={Clock} />
          <StatCard label="Terlambat (Overdue)" value={stats.overdue} colorClass="bg-danger" icon={AlertTriangle} />
        </div>
      </PanelShell>
    );
  };

  const handleOpenTracking = () => {
    if (selectedIds.length === 0) return;
    const selectedItems = data.filter(d => selectedIds.includes(d.id));
    const vehicleIds = selectedItems.map(i => i.vehicleId);
    trackingNavigationService.navigateToTracking(router, { mode: 'live', vehicleIds });
  };

  return (
    <div className={cn("flex h-full w-full bg-background overflow-hidden relative", (panelSide === 'top' || panelSide === 'bottom') ? 'flex-col' : 'flex-row')}>

      {/* Render panel first if top or left */}
      {(panelSide === 'top' || panelSide === 'left') && renderStatsPanel()}

      <div className="flex-1 min-h-0 min-w-0 w-full relative flex flex-col">
        <div className="flex-1 min-h-0 w-full relative">
          <DataTable
            data={filteredData}
            columns={columns}
            isLoading={loading}
            searchValue={search}
            onSearchChange={setSearch}
            filterConfig={filterConfig}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={setIsFilterOpen}
            selectable={true}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            getRowId={(row) => row.id}
            exportable={true}
            exportFilename="Data_Monitoring"
            groupBy={(row) => row.booking.id}
            renderGroupHeader={(groupId, rows, isExpanded, toggleExpand) => {
              const firstRow = rows[0].original;
              const customerName = firstRow.booking.customerSnapshot?.name || 'Unknown';
              const contractNumber = firstRow.booking.contractNumber || firstRow.booking.bookingNumber;

              let safeCount = 0;
              let warningCount = 0;
              let overdueCount = 0;

              rows.forEach(r => {
                const status = getTimeStatus(r.original.endDate);
                if (status === 'SAFE') safeCount++;
                else if (status === 'WARNING') warningCount++;
                else overdueCount++;
              });

              return (
                <div
                  className="flex items-center gap-6 py-0.5 px-3 cursor-pointer w-full min-h-[28px]"
                  onClick={toggleExpand}
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform text-muted-foreground", !isExpanded && "-rotate-90")} />
                    <span className="font-semibold text-[12px] text-foreground/90">{customerName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-medium tracking-wide">
                    {safeCount > 0 && <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> ({safeCount})</span>}
                    {warningCount > 0 && <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> ({warningCount})</span>}
                    {overdueCount > 0 && <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> ({overdueCount})</span>}
                  </div>
                </div>
              );
            }}
          />
        </div>

        {/* Bottom Action Bar */}
        {selectedIds.length > 0 && (
          <div className="w-full flex-shrink-0 h-10 bg-card border-t border-border pl-4 md:pl-6 flex items-center justify-between shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] relative z-10 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedIds.length > 0}
                onCheckedChange={() => setSelectedIds([])}
                className="w-4 h-4 data-[state=checked]:bg-muted-foreground data-[state=checked]:border-muted-foreground"
              />
              <span className="text-[12px] font-medium text-muted-foreground">{selectedIds.length} Data Terpilih</span>
            </div>
            <Button
              variant="destructive"
              onClick={handleOpenTracking}
              disabled={selectedIds.length === 0}
              className="px-8 md:px-12 h-full rounded-none text-[12px] font-medium gap-1.5 shadow-none hover:bg-danger/90 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Buka Lokasi
            </Button>
          </div>
        )}
      </div>

      {/* Render panel last if bottom or right */}
      {(panelSide === 'bottom' || panelSide === 'right') && renderStatsPanel()}

      {/* Detail Drawer */}
      <DetailShell
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        title="Detail Monitoring"
        closeLabel="Tutup"
        layout="drawer"
        extraFooterActions={
          <Button
            className="h-8 text-xs font-semibold"
            variant="primary"
            onClick={() => router.push(`/rental/returns?contractId=${selectedItem?.booking.id}`)}
          >
            Tarik / Kembalikan Unit
          </Button>
        }
      >
        {selectedItem && (
          <div className="p-4 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-bold mb-3 border-b pb-2">Informasi Kendaraan & Pelanggan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">KENDARAAN</p>
                  <p className="text-sm font-bold font-mono">{selectedItem.vehicleSnapshot?.licensePlate}</p>
                  <p className="text-xs text-muted-foreground">{selectedItem.vehicleSnapshot?.brand} {selectedItem.vehicleSnapshot?.model}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">PELANGGAN</p>
                  <p className="text-sm font-bold">{selectedItem.booking.customerSnapshot?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedItem.booking.customerSnapshot?.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-3 border-b pb-2">Detail Serah Terima</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">NO. BAST</p>
                  <p className="text-xs font-semibold">{selectedItem.handoverNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">TGL SERAH TERIMA</p>
                  <p className="text-xs font-semibold">{selectedItem.handoverDate ? formatDateTime(selectedItem.handoverDate) : '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">ODOMETER AWAL</p>
                  <p className="text-xs font-semibold">{selectedItem.handoverOdometer?.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">LOKASI</p>
                  <p className="text-xs font-semibold truncate max-w-full" title={selectedItem.handoverLocation?.address}>
                    {selectedItem.handoverLocation?.address || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-3 border-b pb-2">Kondisi Kendaraan Saat Serah Terima</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">LEVEL BBM</p>
                  <p className="text-xs font-semibold">{selectedItem.handoverCondition?.fuelLevel || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">KONDISI FISIK</p>
                  <p className="text-xs font-semibold">{selectedItem.handoverCondition?.vehicleCondition || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">CATATAN</p>
                  <p className="text-xs">{selectedItem.handoverCondition?.notes || 'Tidak ada catatan.'}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </DetailShell>
    </div>
  );
}
