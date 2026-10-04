'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { paymentService } from '@/data/modules/rental/services/paymentService';
import type { RentalPayment, PaymentStatusFilter, PaymentTypeFilter, PaymentType, PaymentStage, PaymentMethod } from './types/payment';
import { PAYMENT_TYPE_LABEL, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL, PAYMENT_STAGE_LABEL } from './types/payment';
import { DataTable, type DataTableColumnDef, type DataTableFilterConfig, Badge, Button } from '@adatrack/ui';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

export function AllPaymentsFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const [payments, setPayments] = useState<RentalPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<PaymentTypeFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      <div className="flex-1 min-h-0 min-w-0 w-full relative">
        <DataTable
          data={filteredData}
          columns={columns}
          isLoading={loading}
          searchValue={search}
          onSearchChange={setSearch}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          filterConfig={filterConfig}
        />
      </div>
    </div>
  );
}
