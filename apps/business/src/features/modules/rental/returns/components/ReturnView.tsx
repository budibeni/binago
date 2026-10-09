'use client';

import { getReturnTranslation } from '../i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import React from 'react';
import { Button, DetailShell, FormShell, FormCard } from '@adatrack/ui';
import { User, Car, MapPin, Key, CheckCircle, Navigation, Info, FileText, StickyNote, LogOut, LogIn } from 'lucide-react';

import type { BookingItem } from '../../bookings/types/booking';
export interface ReturnGroup {
  id: string;
  contractId: string;
  contract?: any;
  customer?: any;
  handoverAt: string;
  handoverLatitude?: number;
  handoverLongitude?: number;
  handoverAddress?: string;
  status: 'PARTIAL' | 'COMPLETED';
  items: any[];
}

import { cn, formatCurrency, formatDate, formatDateTime, formatNumber } from '@adatrack/utils';
import { Clock, Route } from 'lucide-react';

const getDuration = (start?: string, end?: string) => {
  if (!start || !end) return '-';
  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (diff < 0) return '-';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const parts = [];
  if (days > 0) parts.push(`${days} Hari`);
  if (hours > 0) parts.push(`${hours} Jam`);
  if (minutes > 0 && days === 0) parts.push(`${minutes} Menit`);
  return parts.join(' ') || '-';
};

const getDistance = (start?: number, end?: number) => {
  if (start == null || end == null) return '-';
  const diff = end - start;
  if (diff < 0) return '-';
  return `${formatNumber(diff)} km`;
};

interface ReturnViewProps {
  inline?: boolean;
  onProcessReturn?: () => void;
  returnGroup: ReturnGroup | null;
  open: boolean;
  onClose: () => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
}

export function ReturnView({
  returnGroup,
  open,
  onClose,
  layout = 'drawer',
  inline = false,
  onProcessReturn,
}: ReturnViewProps) {
  const locale = useBusinessLocale();
  const tReturn = getReturnTranslation(locale);
  const [activeTab, setActiveTab] = React.useState<string>('');

  React.useEffect(() => {
    if (returnGroup?.items && returnGroup.items.length > 0) {
      setActiveTab(returnGroup.items[0].id);
    }
  }, [returnGroup]);

  const totalAdditionalFees = React.useMemo(() => {
    if (!returnGroup?.items) return 0;
    return returnGroup.items.reduce((sum: number, item: any) => {
      return sum + (item.lateFee || 0) + (item.damageFee || 0) + (item.extraCharges || 0);
    }, 0);
  }, [returnGroup?.items]);

  if (!returnGroup) return null;

  
  
  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'GOOD': return 'Baik';
      case 'MINOR_DAMAGE': return 'Kerusakan Ringan';
      case 'NEEDS_REPAIR': return 'Perlu Perbaikan';
      default: return condition;
    }
  };

  const c = returnGroup;
  const contract = c.contract;
  const customer = c.customer;
  const isCompleted = c.status === 'COMPLETED';

  const grandTotalAmount = (contract?.totalAmount || 0) + totalAdditionalFees;

  const InfoItem = ({ label, value, highlight = false, valueClassName }: { label: string, value: React.ReactNode, highlight?: boolean, valueClassName?: string }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{label}</span>
      <span className={cn("text-[11px] font-medium", highlight ? "text-danger font-bold" : "text-neutral-900 dark:text-neutral-100", valueClassName)}>
        {value}
      </span>
    </div>
  );

  return (
    <FormShell
      open={open}
      onOpenChange={(isOpen: boolean) => !isOpen && onClose()}
      layout={layout}
      title={tReturn.detailTitle}
      isSubmitting={false}
      actions={
        <Button onClick={onClose} variant="outline">{tReturn.btnClose}</Button>
      }
    >
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-6 px-4 md:px-6">

        {/* INFORMASI KONTRAK */}
        <FormCard
          title={tReturn.contractInfo}
          description={tReturn.contractInfoDesc}
          icon={<FileText className="w-5 h-5 text-blue-500" />}
          iconWrapperClassName="bg-blue-100 dark:bg-blue-900/30 text-blue-500"
          action={
            contract?.status ? (
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                contract.status === 'COMPLETED' ? "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800" :
                contract.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" :
                contract.status === 'CONFIRMED' ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" :
                contract.status === 'CANCELLED' ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" :
                "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              )}>
                {contract.status}
              </span>
            ) : null
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">{tReturn.noContract}</span>
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200">{contract?.contractNumber || c.contractId}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {(contract?.contractDate || contract?.createdAt) ? new Date(contract.contractDate || contract.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">{tReturn.customerName}</span>
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1" title={customer?.name}>{customer?.name || '-'}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {customer?.type || '-'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">{tReturn.rentalPeriod}</span>
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200">
                {contract?.startDate ? new Date(contract.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Selesai: {contract?.endDate ? new Date(contract.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">{tReturn.service}</span>
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">{contract?.rentalType === 'SELF_DRIVE' ? tReturn.selfDrive : tReturn.withDriver}</span>
            </div>
          </div>
        </FormCard>

        {/* DETAIL KENDARAAN (TABS) */}
        <FormCard>
          <div className="space-y-3">
            {/* TABS */}
            {c.items.length > 1 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar p-1.5 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                  {c.items.map((item: any) => {
                    const id = item.id;
                    const isSelected = activeTab === id;
                    const cv = item.vehicleSnapshot;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={cn(
                          "px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 focus:outline-none",
                          isSelected
                            ? 'bg-white dark:bg-neutral-900 shadow-sm border border-slate-200/80 dark:border-slate-600 text-primary'
                            : 'border border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-white/60 dark:hover:bg-neutral-800/60'
                        )}
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className={isSelected ? "text-primary" : ""}>
                          {cv?.licensePlate || item.vehicleId}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT */}
            {activeTab && (() => {
              const item = c.items.find((i: any) => i.id === activeTab);
              if (!item) return null;
              const eq = item.returnCondition?.equipmentChecklist || {};
              const cv = item.vehicleSnapshot;

              return (
                <div className="flex flex-col gap-5 animate-in fade-in duration-300 pt-2">
                  
                  {/* IDENTITAS KENDARAAN (Khusus saat 1 kendaraan) */}
                  {c.items.length === 1 && (
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <Car className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">{cv?.licensePlate || item.vehicleId}</span>
                        <span className="text-[11px] font-semibold text-slate-500">{cv?.brand} {cv?.model}</span>
                      </div>
                    </div>
                  )}

                  {/* SUMMARY DURASI & TOTAL KM (GLOBAL) */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-800/10 border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-2">
                    <div className="flex items-center gap-3 px-2 border-r border-slate-200 dark:border-slate-700">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{tReturn.duration}</span>
                        <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{getDuration(item.handoverDate, item.returnDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                        <Route className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{tReturn.distance}</span>
                        <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{getDistance(item.handoverOdometer, item.returnOdometer)}</span>
                      </div>
                    </div>
                  </div>

                  {/* HEADER ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 border-b border-slate-200/60 dark:border-slate-700/50 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <LogOut className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
                      </div>
                      <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{tReturn.handoverData}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <LogIn className="w-3.5 h-3.5 text-primary mr-0.5" />
                      </div>
                      <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{tReturn.returnData}</h4>
                    </div>
                  </div>

                  {/* ROW 1: WAKTU & LOKASI */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Kiri */}
                    <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4 h-full">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Waktu Serah Terima</span>
                        <span className="text-[13px] font-semibold">{item.handoverDate ? formatDateTime(item.handoverDate) : '-'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lokasi Serah Terima</span>
                        <span className="text-[13px] font-semibold">{item.handoverLocation?.address || '-'}</span>
                        {item.handoverLocation?.latitude && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${item.handoverLocation.latitude},${item.handoverLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors w-fit"
                          >
                            <MapPin className="w-3 h-3" />
                            {item.handoverLocation.latitude}, {item.handoverLocation.longitude}
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Kanan */}
                    <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4 h-full">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Waktu Pengembalian</span>
                        <span className="text-[13px] font-semibold">{item.returnDate ? formatDateTime(item.returnDate) : '-'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lokasi Pengembalian</span>
                        <span className="text-[13px] font-semibold">{item.returnLocation?.address || '-'}</span>
                        {item.returnLocation?.latitude && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${item.returnLocation.latitude},${item.returnLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors w-fit"
                          >
                            <MapPin className="w-3 h-3" />
                            {item.returnLocation.latitude}, {item.returnLocation.longitude}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ROW 2: ODOMETER, BBM, KONDISI */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Kiri */}
                    <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4 h-full">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{tReturn.startOdometer}</span>
                          <span className="text-[13px] font-semibold">{item.handoverOdometer ? `${formatNumber(item.handoverOdometer)} km` : '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{tReturn.startFuel}</span>
                          <span className="text-[13px] font-semibold">
                            {({ EMPTY: 'Kosong', QUARTER: '1/4', HALF: '1/2', THREE_QUARTER: '3/4', FULL: 'Penuh' } as any)[item.handoverCondition?.fuelLevel || ''] || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{tReturn.startCondition}</span>
                        <span className={cn(
                          "text-[13px] font-semibold",
                          item.handoverCondition?.vehicleCondition === 'GOOD' ? 'text-emerald-600 dark:text-emerald-400' : 'text-warning'
                        )}>
                          {({ GOOD: 'Baik', MINOR_DAMAGE: 'Rusak Ringan', NEEDS_REPAIR: 'Rusak Berat' } as any)[item.handoverCondition?.vehicleCondition || ''] || '-'}
                        </span>
                      </div>
                    </div>
                    {/* Kanan */}
                    <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4 h-full">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{tReturn.endOdometer}</span>
                          <span className="text-[13px] font-semibold">{item.returnOdometer ? `${formatNumber(item.returnOdometer)} km` : '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{tReturn.endFuel}</span>
                          <span className="text-[13px] font-semibold">
                            {({ EMPTY: 'Kosong', QUARTER: '1/4', HALF: '1/2', THREE_QUARTER: '3/4', FULL: 'Penuh' } as any)[item.returnCondition?.fuelLevel || ''] || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{tReturn.endCondition}</span>
                        <span className={cn(
                          "text-[13px] font-semibold",
                          item.returnCondition?.vehicleCondition === 'GOOD' ? 'text-emerald-600 dark:text-emerald-400' : 'text-warning'
                        )}>
                          {({ GOOD: 'Baik', MINOR_DAMAGE: 'Rusak Ringan', NEEDS_REPAIR: 'Rusak Berat' } as any)[item.returnCondition?.vehicleCondition || ''] || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ROW 3: CATATAN KERUSAKAN (Hanya muncul jika ada) */}
                  {(item.handoverCondition?.notes || item.returnCondition?.notes || item.returnCondition?.damageNotes) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 items-start">
                      {/* Kiri */}
                      {item.handoverCondition?.notes ? (
                        <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl h-full">
                          <span className="text-[11px] font-semibold text-warning uppercase tracking-wider mb-1 block">{tReturn.startNotes}</span>
                          <span className="text-[13px] font-medium text-warning-foreground">{item.handoverCondition.notes}</span>
                        </div>
                      ) : <div />}
                      
                      {/* Kanan */}
                      {(item.returnCondition?.notes || item.returnCondition?.damageNotes) ? (
                        <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl h-full">
                          <span className="text-[11px] font-semibold text-warning uppercase tracking-wider mb-1 block">{tReturn.endNotes}</span>
                          <span className="text-[13px] font-medium text-warning-foreground">{item.returnCondition.damageNotes || item.returnCondition.notes}</span>
                        </div>
                      ) : <div />}
                    </div>
                  )}

                  {/* ROW 4: KELENGKAPAN KENDARAAN */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Kiri */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4 h-full">
                      <span className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-3 block tracking-wide">{tReturn.startEquipment}</span>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'stnkOriginal', label: 'STNK Original' },
                          { key: 'spareTire', label: 'Ban Cadangan' },
                          { key: 'jackAndTools', label: 'Dongkrak & Toolkit' },
                          { key: 'firstAidKit', label: 'P3K' }
                        ].map(({ key, label }) => {
                          const isChecked = (item.handoverCondition?.equipmentChecklist as any)?.[key] || false;
                          return (
                            <div key={key} className="flex items-center gap-2 h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-neutral-900/50 opacity-80 cursor-default">
                              {isChecked ? (
                                <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600 ml-0.5" />
                              )}
                              <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 ml-1">{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Kanan */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4 h-full">
                      <span className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-3 block tracking-wide">{tReturn.endEquipment}</span>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'stnk', label: 'STNK Original' },
                          { key: 'spareTire', label: 'Ban Cadangan' },
                          { key: 'jack', label: 'Dongkrak' },
                          { key: 'toolkit', label: 'Toolkit' },
                          { key: 'triangle', label: 'Segitiga Pengaman' }
                        ].map(({ key, label }) => {
                          const isChecked = eq[key] || false;
                          return (
                            <div key={key} className="flex items-center gap-2 h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-neutral-900/50 opacity-80 cursor-default">
                              {isChecked ? (
                                <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600 ml-0.5" />
                              )}
                              <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 ml-1">{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CATATAN UMUM */}
            <div className="p-5 border-t border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2"><StickyNote className="w-3.5 h-3.5 text-slate-400" /> Catatan Tambahan</h3>
              <div className="text-[12px] text-slate-600 dark:text-slate-400">
                {c.items.some((i: any) => i.returnCondition?.notes) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {c.items.filter((i: any) => i.returnCondition?.notes).map((item: any, idx: number) => (
                      <li key={idx}><span className="font-semibold text-slate-800 dark:text-slate-200 mr-1">{(item as any).vehicleSnapshot?.licensePlate}:</span> {item.returnCondition?.notes}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="italic">Tidak ada catatan khusus.</span>
                )}
              </div>
            </div>
          </div>
        </FormCard>
        </div>
      </div>
    </FormShell>
  );
}
