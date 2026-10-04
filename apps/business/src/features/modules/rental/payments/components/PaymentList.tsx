'use client';

import React from 'react';
import { Button, Badge } from '@adatrack/ui';
import { Trash2, Plus, CreditCard, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalPayment } from '../types/payment';
import {
  PAYMENT_TYPE_LABEL,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STAGE_LABEL,
} from '../types/payment';

interface PaymentListProps {
  payments: RentalPayment[];
  isLoading?: boolean;
  totalAmount: number;       
  deposit: number;           
  remainingAmount: number;   
  activeStage?: import('../types/payment').PaymentStage;
  onAdd: () => void;
  onVerify: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeIcon: Record<string, React.ReactNode> = {
  REFUND: <CreditCard className="w-3.5 h-3.5 text-emerald-500" />,
  BOOKING_FEE: <CreditCard className="w-3.5 h-3.5 text-sky-500" />,
  DOWN_PAYMENT: <CreditCard className="w-3.5 h-3.5 text-blue-500" />,
  DEPOSIT: <CreditCard className="w-3.5 h-3.5 text-amber-500" />,
  RENTAL_PAYMENT: <CreditCard className="w-3.5 h-3.5 text-primary" />,
  ADDITIONAL_FEE: <CreditCard className="w-3.5 h-3.5 text-orange-500" />,
};

const formatIDR = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

export function PaymentList({
  payments,
  isLoading,
  totalAmount,
  deposit,
  remainingAmount,
  activeStage,
  onAdd,
  onVerify,
  onCancel,
  onDelete,
}: PaymentListProps) {
  const totalVerified = payments
    .filter((p) => p.status === 'VERIFIED' && p.type !== 'REFUND')
    .reduce((s, p) => s + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.status === 'VERIFIED' && p.type === 'REFUND')
    .reduce((s, p) => s + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((s, p) => s + p.amount, 0);

  const netPaid = totalVerified - totalRefunded;
  const outstanding = totalAmount - netPaid;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-2.5 rounded-lg border border-border bg-background flex flex-col gap-0.5">
          <p className="text-[9px] uppercase font-semibold text-muted-foreground tracking-wider">Total Tagihan</p>
          <p className="text-xs font-bold">{formatIDR(totalAmount)}</p>
        </div>
        <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/10 flex flex-col gap-0.5">
          <p className="text-[9px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider">Terbayar</p>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{formatIDR(netPaid)}</p>
        </div>
        <div className={cn(
          "p-2.5 rounded-lg border flex flex-col gap-0.5",
          outstanding > 0
            ? "border-danger/30 bg-danger/5"
            : "border-border bg-background"
        )}>
          <p className={cn("text-[9px] uppercase font-semibold tracking-wider", outstanding > 0 ? "text-danger" : "text-muted-foreground")}>Sisa Tagihan</p>
          <p className={cn("text-xs font-bold", outstanding > 0 ? "text-danger" : "text-foreground")}>{formatIDR(Math.max(0, outstanding))}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">Riwayat Transaksi</p>
        <Button type="button" size="sm" onClick={onAdd} className="gap-1.5 h-7 text-[11px] px-2.5">
          <Plus className="w-3 h-3" />
          Tambah Pembayaran
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-6 text-center text-muted-foreground text-xs">Memuat data pembayaran...</div>
      ) : payments.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-border rounded-lg">
          <CreditCard className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs font-medium text-muted-foreground">Belum ada transaksi pembayaran</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {payments.map((p) => (
            <div
              key={p.id}
              className={cn(
                "flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-colors group",
                p.status === 'CANCELLED'
                  ? "opacity-50 bg-neutral-50 dark:bg-neutral-900/30 border-border"
                  : "bg-background border-border hover:border-border/80"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  {typeIcon[p.type] ?? <CreditCard className="w-3 h-3 text-muted-foreground" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap leading-none">
                    <p className="text-xs font-semibold">{PAYMENT_TYPE_LABEL[p.type]}</p>
                    {p.status === 'CANCELLED' && (
                      <Badge variant="danger" className="text-[9px] px-1 py-0">Batal</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-x-1.5 gap-y-1 flex-wrap mt-1">
                    <p className="text-[10px] text-muted-foreground">{PAYMENT_STAGE_LABEL[p.stage]}</p>
                    <span className="text-muted-foreground text-[8px]">•</span>
                    <p className="text-[10px] text-muted-foreground">{PAYMENT_METHOD_LABEL[p.method]}</p>
                    <span className="text-muted-foreground text-[8px]">•</span>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(p.paidAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                    {p.referenceNumber && (
                      <>
                        <span className="text-muted-foreground text-[8px]">•</span>
                        <p className="text-[10px] text-muted-foreground font-mono">{p.referenceNumber}</p>
                      </>
                    )}
                  </div>
                  {p.notes && <p className="text-[10px] text-muted-foreground mt-0.5 italic">{p.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <p className={cn(
                  "text-xs font-bold text-right",
                  p.type === 'REFUND' ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                )}>
                  {p.type === 'REFUND' ? '- ' : ''}{formatIDR(p.amount)}
                </p>
                <div className="w-7 h-7 flex items-center justify-end shrink-0">
                  {(!activeStage || p.stage === activeStage) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(p.id)}
                      className="w-7 h-7 p-0 flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
