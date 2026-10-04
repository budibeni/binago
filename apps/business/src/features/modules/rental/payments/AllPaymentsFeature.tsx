'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { paymentService } from '@/data/modules/rental/services/paymentService';
import type { RentalPayment, PaymentStatusFilter, PaymentTypeFilter, PaymentType, PaymentStage, PaymentMethod } from './types/payment';
import { PAYMENT_TYPE_LABEL, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL, PAYMENT_STAGE_LABEL } from './types/payment';
import { DataTable, type DataTableColumnDef, type DataTableFilterConfig, Badge, Button, PanelShell } from '@adatrack/ui';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { CheckCircle, XCircle, Trash2, CalendarClock, Handshake, FileSignature, Undo2, CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';
import { cn } from '@adatrack/utils';

function StatCard({ label, value, colorClass, icon: Icon, desc }: { label: string, value: string | number, colorClass: string, icon?: React.ElementType, desc?: string }) {
  const textColorClass = colorClass.replace(/bg-/g, 'text-');
  
  return (
    <div className="flex items-center justify-between p-3 rounded-none border border-border/80 bg-background transition-colors hover:border-border">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <div className={cn("p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800", textColorClass)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className={cn("w-2 h-2 rounded-full", colorClass)} />
          )}
          <span className="text-[11px] font-semibold text-muted-foreground tracking-tight uppercase">{label}</span>
        </div>
        {desc && <span className="text-[9px] font-medium text-muted-foreground/80 pl-8 leading-none">{desc}</span>}
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

export function AllPaymentsFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const [payments, setPayments] = useState<RentalPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<PaymentTypeFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mainTab, setMainTab] = useState<'transactions' | 'report'>('transactions');
  const [panelSide, setPanelSide] = useState<'left' | 'right' | 'top' | 'bottom'>('top');
  const [showStats, setShowStats] = useState(true);

  const fetchPayments = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentService.getPayments();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const summaryByStage = useMemo(() => {
    const summary: Record<string, number> = {
      BOOKING: 0,
      HANDOVER: 0,
      CONTRACT: 0,
      RETURN: 0,
      MANUAL: 0,
    };
    payments.forEach(p => {
      if (p.status !== 'VERIFIED') return;
      const val = p.type === 'REFUND' ? -p.amount : p.amount;
      if (summary[p.stage] !== undefined) {
        summary[p.stage] += val;
      }
    });
    return summary;
  }, [payments]);

  const filteredData = useMemo(() => {
    return payments.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const matchNo = p.booking?.bookingNumber?.toLowerCase().includes(s) || false;
        const matchCust = p.customer?.name?.toLowerCase().includes(s) || false;
        const matchRef = p.referenceNumber?.toLowerCase().includes(s) || false;
        if (!matchNo && !matchCust && !matchRef) return false;
      }
      return true;
    });
  }, [payments, statusFilter, typeFilter, search]);

  const groupedByBooking = useMemo(() => {
    const map = new Map<string, any>();
    payments.forEach(p => {
      if (p.status !== 'VERIFIED') return;
      if (!map.has(p.bookingId)) {
        map.set(p.bookingId, {
          bookingId: p.bookingId,
          bookingNumber: p.booking?.bookingNumber || p.bookingId,
          customerName: p.customer?.name || '-',
          duration: p.booking?.duration || 0,
          totalVehicles: p.booking?.items?.length || 0,
          totalTagihan: p.booking?.totalAmount || 0, // Fallback if populated
          BOOKING_FEE: 0,
          DOWN_PAYMENT: 0,
          RENTAL_PAYMENT: 0,
          DEPOSIT: 0,
          ADDITIONAL_FEE: 0,
          REFUND: 0,
          totalNet: 0
        });
      }
      const entry = map.get(p.bookingId);
      if (p.type === 'REFUND') {
        entry.REFUND += p.amount;
        entry.totalNet -= p.amount;
      } else {
        entry[p.type] += p.amount;
        entry.totalNet += p.amount;
      }
      
      // Update totalTagihan and relations if it was 0 and we found it now
      if (!entry.totalTagihan && p.booking?.totalAmount) {
        entry.totalTagihan = p.booking.totalAmount;
        entry.duration = p.booking.duration || 0;
        entry.totalVehicles = p.booking.items?.length || 0;
      }
    });
    
    // Apply search filter and calculate sisa
    let list = Array.from(map.values()).map(item => {
      // Calculate outstanding: Tagihan + Denda - (Booking + DP + Pelunasan)
      const paidForTagihan = item.BOOKING_FEE + item.DOWN_PAYMENT + item.RENTAL_PAYMENT;
      const outstanding = Math.max(0, (item.totalTagihan + item.ADDITIONAL_FEE) - paidForTagihan);
      return {
        ...item,
        sisaTagihan: outstanding
      };
    });
    
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(item => 
        item.bookingNumber.toLowerCase().includes(s) || 
        item.customerName.toLowerCase().includes(s)
      );
    }
    return list;
  }, [payments, search]);

  const handleVerify = async (id: string) => {
    if (!confirm('Verifikasi pembayaran ini?')) return;
    try {
      await paymentService.verifyPayment(id);
      fetchPayments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Batalkan pembayaran ini?')) return;
    try {
      await paymentService.cancelPayment(id);
      fetchPayments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pembayaran ini?')) return;
    try {
      await paymentService.deletePayment(id);
      fetchPayments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns: DataTableColumnDef<RentalPayment>[] = [
    {
      id: 'paidAt',
      header: 'Waktu',
      accessorFn: (row: RentalPayment) => new Date(row.paidAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      enableSorting: true,
      size: 140,
    },
    {
      id: 'booking',
      header: 'Booking',
      accessorFn: (row: RentalPayment) => row.booking?.bookingNumber || '-',
      enableSorting: true,
      size: 160,
    },
    {
      id: 'customer',
      header: 'Pelanggan',
      accessorFn: (row: RentalPayment) => row.customer?.name || '-',
      enableSorting: true,
      size: 150,
    },
    {
      id: 'type',
      header: 'Jenis',
      accessorFn: (row: RentalPayment) => PAYMENT_TYPE_LABEL[row.type as PaymentType],
      enableSorting: true,
      size: 160,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{PAYMENT_TYPE_LABEL[row.original.type as PaymentType]}</span>
          <span className="text-xs text-muted-foreground">{PAYMENT_STAGE_LABEL[row.original.stage as PaymentStage]}</span>
        </div>
      ),
    },
    {
      id: 'method',
      header: 'Metode',
      accessorFn: (row: RentalPayment) => PAYMENT_METHOD_LABEL[row.method as PaymentMethod],
      size: 140,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{PAYMENT_METHOD_LABEL[row.original.method as PaymentMethod]}</span>
          {row.original.referenceNumber && (
            <span className="text-xs text-muted-foreground font-mono">{row.original.referenceNumber}</span>
          )}
        </div>
      )
    },
    {
      id: 'amount',
      header: 'Nominal',
      accessorFn: (row: RentalPayment) => row.amount,
      enableSorting: true,
      size: 140,
      meta: { align: 'right' },
      cell: ({ row, getValue }) => (
        <span className={row.original.type === 'REFUND' ? 'text-emerald-600 font-medium' : ''}>
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(getValue() as number)}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorFn: (row: RentalPayment) => row.status,
      size: 140,
      cell: ({ getValue }) => {
        const s = getValue() as PaymentStatusFilter;
        let variant: 'success' | 'warning' | 'danger' = 'warning';
        if (s === 'VERIFIED') variant = 'success';
        if (s === 'CANCELLED') variant = 'danger';
        return <Badge variant={variant} className="text-[10px]">{s === 'all' ? s : PAYMENT_STATUS_LABEL[s]}</Badge>;
      }
    },
    {
      id: 'actions',
      header: 'Aksi',
      size: 120,
      meta: { align: 'right' },
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            {p.status === 'PENDING' && (
              <>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 flex items-center justify-center text-emerald-600 hover:text-emerald-700" onClick={() => handleVerify(p.id)} title="Verifikasi">
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 flex items-center justify-center text-danger hover:text-danger" onClick={() => handleCancel(p.id)} title="Batalkan">
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}
            {p.status !== 'VERIFIED' && (
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 flex items-center justify-center text-muted-foreground hover:text-danger" onClick={() => handleDelete(p.id)} title="Hapus">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  const reportColumns: DataTableColumnDef<any>[] = [
    { id: 'bookingNumber', header: 'No. Booking', accessorFn: (row) => row.bookingNumber, size: 130, meta: { fixedWidth: true } },
    { id: 'customer', header: 'Pelanggan', accessorFn: (row) => row.customerName, size: 140, meta: { fixedWidth: true } },
    { id: 'duration', header: 'Durasi', accessorFn: (row) => row.duration, size: 70, meta: { align: 'center', fixedWidth: true }, cell: ({getValue}) => <span className="text-[11px]">{getValue() ? `${getValue()} Hari` : '-'}</span> },
    { id: 'totalVehicles', header: 'Jml Mobil', accessorFn: (row) => row.totalVehicles, size: 80, meta: { align: 'center', fixedWidth: true }, cell: ({getValue}) => <span className="text-[11px]">{getValue() ? `${getValue()} Unit` : '-'}</span> },
    { id: 'totalTagihan', header: 'Tagihan Sewa', accessorFn: (row) => row.totalTagihan, size: 110, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => <span className="font-semibold text-[11px]">{getValue() ? new Intl.NumberFormat('id-ID').format(getValue() as number) : '-'}</span> },
    { id: 'BOOKING_FEE', header: 'Booking Fee', accessorFn: (row) => row.BOOKING_FEE, size: 90, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => <span className="text-[11px]">{getValue() ? new Intl.NumberFormat('id-ID').format(getValue() as number) : '-'}</span> },
    { id: 'DOWN_PAYMENT', header: 'DP', accessorFn: (row) => row.DOWN_PAYMENT, size: 90, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => <span className="text-[11px]">{getValue() ? new Intl.NumberFormat('id-ID').format(getValue() as number) : '-'}</span> },
    { id: 'RENTAL_PAYMENT', header: 'Pelunasan', accessorFn: (row) => row.RENTAL_PAYMENT, size: 100, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => <span className="text-[11px]">{getValue() ? new Intl.NumberFormat('id-ID').format(getValue() as number) : '-'}</span> },
    { id: 'ADDITIONAL_FEE', header: 'Denda/Extra', accessorFn: (row) => row.ADDITIONAL_FEE, size: 100, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => <span className="text-[11px]">{getValue() ? new Intl.NumberFormat('id-ID').format(getValue() as number) : '-'}</span> },
    { id: 'DEPOSIT', header: 'Deposit', accessorFn: (row) => row.DEPOSIT, size: 100, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => <span className="text-[11px] text-amber-600">{getValue() ? new Intl.NumberFormat('id-ID').format(getValue() as number) : '-'}</span> },
    { id: 'REFUND', header: 'Refund', accessorFn: (row) => row.REFUND, size: 100, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => <span className="text-[11px] text-emerald-600 font-medium">{getValue() ? `-${new Intl.NumberFormat('id-ID').format(getValue() as number)}` : '-'}</span> },
    { id: 'totalNet', header: 'Total Net', accessorFn: (row) => row.totalNet, size: 130, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Rp {new Intl.NumberFormat('id-ID').format(getValue() as number)}</span> },
    { id: 'sisaTagihan', header: 'Sisa Tagihan', accessorFn: (row) => row.sisaTagihan, size: 110, meta: { align: 'right', fixedWidth: true }, cell: ({getValue}) => {
      const val = getValue() as number;
      return <span className={`text-[11px] font-bold ${val > 0 ? 'text-danger' : 'text-muted-foreground'}`}>{val > 0 ? new Intl.NumberFormat('id-ID').format(val) : 'Lunas'}</span>;
    } },
  ];

  const filterConfig: DataTableFilterConfig = {
    state: { status: statusFilter === 'all' ? '' : statusFilter, type: typeFilter === 'all' ? '' : typeFilter },
    onStateChange: (state) => {
      setStatusFilter((state.status as PaymentStatusFilter) || 'all');
      setTypeFilter((state.type as PaymentTypeFilter) || 'all');
    },
    onClearAll: () => {
      setStatusFilter('all');
      setTypeFilter('all');
    },
    labels: { title: 'Filter Pembayaran', clearAll: 'Reset Filter' },
    fields: [
      {
        id: 'status',
        label: 'Status',
        type: 'pills-single',
        options: [
          { value: 'PENDING', label: 'Menunggu Verifikasi', colorClass: 'bg-amber-500', activeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-600' },
          { value: 'VERIFIED', label: 'Terverifikasi', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'CANCELLED', label: 'Batal', colorClass: 'bg-danger', activeClass: 'bg-danger/15 border-danger/40 text-danger' },
        ]
      },
      {
        id: 'type',
        label: 'Jenis Pembayaran',
        type: 'pills-single',
        options: Object.entries(PAYMENT_TYPE_LABEL).map(([val, lbl]) => ({
          value: val, label: lbl, colorClass: 'bg-blue-500', activeClass: 'bg-blue-500/15 border-blue-500/40 text-blue-500'
        }))
      }
    ]
  };

  const renderStatsPanel = () => {
    return (
      <PanelShell
        title="Ringkasan Penerimaan"
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
          "shrink-0 bg-white dark:bg-background z-10 border-b border-border",
          (panelSide === 'top' || panelSide === 'bottom') ? "w-full" : "w-80 min-w-80 h-full"
        )}
      >
        <div className={cn("gap-2.5 p-3 bg-neutral-50/50 dark:bg-neutral-900/20", (panelSide === 'top' || panelSide === 'bottom') ? "grid grid-cols-2 md:grid-cols-4" : "flex flex-col h-full")}>
          <StatCard label="Booking" value={`Rp ${summaryByStage.BOOKING.toLocaleString('id-ID')}`} colorClass="bg-blue-500" icon={CalendarClock} desc="Saat Reservasi" />
          <StatCard label="Serah Terima" value={`Rp ${summaryByStage.HANDOVER.toLocaleString('id-ID')}`} colorClass="bg-amber-500" icon={Handshake} desc="DP / Awal Sewa" />
          <StatCard label="Masa Kontrak" value={`Rp ${summaryByStage.CONTRACT.toLocaleString('id-ID')}`} colorClass="bg-primary" icon={FileSignature} desc="Pelunasan Berkala" />
          <StatCard label="Pengembalian (Net)" value={`Rp ${summaryByStage.RETURN.toLocaleString('id-ID')}`} colorClass="bg-emerald-500" icon={Undo2} desc="Setelah Denda/Refund" />
        </div>
      </PanelShell>
    );
  };

  return (
    <div className={cn("flex h-full w-full bg-background overflow-hidden relative", (panelSide === 'top' || panelSide === 'bottom') ? 'flex-col' : 'flex-row')}>
      
      {/* Render panel first if top or left */}
      {(panelSide === 'top' || panelSide === 'left') && renderStatsPanel()}

      <div className="flex-1 min-h-0 min-w-0 w-full relative flex flex-col">
        {/* Main Tabs */}
        <div className="flex px-4 border-b border-border bg-white dark:bg-background shrink-0 gap-4">
          <button
            className={`py-2.5 text-xs font-bold whitespace-nowrap border-b-[3px] transition-colors ${mainTab === 'transactions' ? 'border-danger text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}
            onClick={() => setMainTab('transactions')}
          >
            Riwayat Transaksi
          </button>
          <button
            className={`py-2.5 text-xs font-bold whitespace-nowrap border-b-[3px] transition-colors ${mainTab === 'report' ? 'border-danger text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}
            onClick={() => setMainTab('report')}
          >
            Laporan per Sewa
          </button>
        </div>

        <div className="flex-1 min-h-0 relative">
          {mainTab === 'transactions' ? (
            <DataTable
              data={filteredData}
              columns={columns}
              isLoading={loading}
              pagination
              sortable
              columnVisibility
              searchValue={search}
              onSearchChange={setSearch}
              isFilterOpen={isFilterOpen}
              onFilterOpenChange={setIsFilterOpen}
              filterConfig={filterConfig}
              exportable
              exportFilename="Riwayat_Transaksi_Pembayaran.csv"
              className="border-none shadow-none h-full"
            />
          ) : (
            <DataTable
              data={groupedByBooking}
              columns={reportColumns}
              isLoading={loading}
              pagination
              sortable
              columnVisibility
              searchValue={search}
              onSearchChange={setSearch}
              isFilterOpen={isFilterOpen}
              onFilterOpenChange={setIsFilterOpen}
              filterConfig={filterConfig}
              exportable
              exportFilename="Laporan_Keuangan_Sewa.csv"
              className="border-none shadow-none h-full"
            />
          )}
        </div>
      </div>

      {/* Render panel last if bottom or right */}
      {(panelSide === 'bottom' || panelSide === 'right') && renderStatsPanel()}
    </div>
  );
}
