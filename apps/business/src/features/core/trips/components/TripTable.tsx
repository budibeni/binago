'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Badge, Button } from '@adatrack/ui';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import type { Trip } from '../types/trips';
import { cn } from '@adatrack/utils';

export interface TripTableProps {
  data: Trip[];
  onViewDetail: (trip: Trip) => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
}

function formatDateRange(startISO: string, endISO: string | null): { date: string, time: string } {
  const dStart = new Date(startISO);
  const dateStr = dStart.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStart = dStart.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  
  if (!endISO) {
    return { date: dateStr, time: `${timeStart} - ...` };
  }
  const dEnd = new Date(endISO);
  const timeEnd = dEnd.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  
  return { date: dateStr, time: `${timeStart} - ${timeEnd}` };
}

export function TripTable({ data, onViewDetail }: TripTableProps) {
  const locale = useBusinessLocale() || 'id';
  const tTrips = getTranslation(locale).trips;

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, page, itemsPerPage]);

  return (
    <div className="flex flex-col bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-border">
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colTime}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colVehicle}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colDriver}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colOrigin}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colDestination}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colDistance}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colDuration}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colStop}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colRoute}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">{tTrips.colStatus}</th>
              <th className="px-4 py-3 text-[11px] font-bold text-foreground-muted uppercase tracking-wider text-right">{tTrips.colAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((trip) => {
                const { date, time } = formatDateRange(trip.startTime, trip.endTime);
                return (
                  <tr key={trip.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-foreground">{date}</div>
                      <div className="text-[11px] text-foreground-muted">{time}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-bold text-foreground">{trip.vehicleName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-foreground-muted">{trip.driverName || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">{trip.origin}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{trip.destination}</td>
                    <td className="px-4 py-3 text-xs text-foreground font-medium">{trip.distance.toFixed(1).replace('.', ',')} km</td>
                    <td className="px-4 py-3 text-xs text-foreground">{formatDuration(trip.duration)}</td>
                    <td className="px-4 py-3 text-xs text-foreground">{trip.stopCount} stop</td>
                    <td className="px-4 py-3 text-xs text-foreground-muted max-w-[150px] truncate" title={trip.routeName || ''}>
                      {trip.routeName || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {trip.status === 'ongoing' ? (
                        <Badge className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                          {tTrips.statusOngoing}
                        </Badge>
                      ) : (
                        <Badge className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                          {tTrips.statusCompleted}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 text-[11px] px-2 font-medium"
                        onClick={() => onViewDetail(trip)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        {tTrips.btnDetail}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center">
                  <div className="text-sm font-medium text-foreground-muted">{tTrips.noTrips}</div>
                  <div className="text-xs text-foreground-muted mt-1">{tTrips.noTripsDesc}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted">Tampilkan</span>
            <select 
              className="text-xs border border-input rounded px-1 py-0.5 bg-background focus:outline-none"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted mr-2">
              Halaman {page} dari {totalPages || 1} ({data.length} total)
            </span>
            <Button
              variant="outline"
              className="h-7 w-7 p-0"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-7 w-7 p-0"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
