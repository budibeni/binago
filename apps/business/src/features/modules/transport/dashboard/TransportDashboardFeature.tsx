'use client';

import React from 'react';
import { Card, Badge, Button } from '@adatrack/ui';
import { Bus, Clock, FileText, CheckSquare, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { analyticsService, type DateRange } from '@/data/modules/transport/services/analyticsService';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { useRouter } from 'next/navigation';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';

export function TransportDashboardFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale).transportDashboard;
  
  const [dateFilter, setDateFilter] = React.useState<'today' | '7days' | '30days'>('today');
  
  const range = React.useMemo<DateRange | undefined>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    
    if (dateFilter === 'today') {
      return { startDate: today, endDate: end };
    }
    if (dateFilter === '7days') {
      const start = new Date(today);
      start.setDate(today.getDate() - 7);
      return { startDate: start, endDate: end };
    }
    if (dateFilter === '30days') {
      const start = new Date(today);
      start.setDate(today.getDate() - 30);
      return { startDate: start, endDate: end };
    }
    return undefined;
  }, [dateFilter]);

  const summary = analyticsService.getDashboardSummary(range);
  const statusStats = analyticsService.getDepartureStatistics(range);
  const topVehicles = analyticsService.getVehicleUtilization(range).slice(0, 5);
  const topRoutes = analyticsService.getRoutePerformance(range).slice(0, 5);
  const recentDepartures = analyticsService.getRecentDepartures(5, range);

  return (
    <div className="flex h-full flex-col bg-surface overflow-hidden">
      <div className="shrink-0 p-4 lg:p-6 bg-white dark:bg-neutral-950 border-b border-border shadow-sm z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
              <Bus className="w-5 h-5 text-indigo-600" />
              {t.title}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg">
            <Button 
              variant={dateFilter === 'today' ? 'primary' : 'ghost'} 
              size="sm" 
              onClick={() => setDateFilter('today')}
            >
              {t.today}
            </Button>
            <Button 
              variant={dateFilter === '7days' ? 'primary' : 'ghost'} 
              size="sm" 
              onClick={() => setDateFilter('7days')}
            >
              {t.days7}
            </Button>
            <Button 
              variant={dateFilter === '30days' ? 'primary' : 'ghost'} 
              size="sm" 
              onClick={() => setDateFilter('30days')}
            >
              {t.days30}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#fafafa] dark:bg-neutral-950/50 space-y-6">
        {/* Row 1: Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-sm text-neutral-600 font-medium">{t.totalDepartures}</p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{summary.total}</p>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckSquare className="w-5 h-5" />
              </div>
              <p className="text-sm text-neutral-600 font-medium">{t.onTimeRate}</p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{summary.onTimeRate.toFixed(1)}%</p>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Bus className="w-5 h-5" />
              </div>
              <p className="text-sm text-neutral-600 font-medium">{t.totalPassengers}</p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{summary.totalBoarding}</p>
          </Card>
          <Card className="p-4 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Bus className="w-5 h-5" />
              </div>
              <p className="text-sm text-neutral-600 font-medium">{t.avgOccupancy}</p>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{summary.avgOccupancy.toFixed(1)}%</p>
          </Card>
        </div>

        {/* Row 2: Status & Utilization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 col-span-1 md:col-span-1 bg-white">
            <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-neutral-400" /> {t.departureStatus}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">{t.scheduled}</span>
                <Badge className="text-neutral-600 bg-neutral-50">{statusStats.SCHEDULED || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Sedang Berjalan</span>
                <Badge className="text-blue-600 bg-blue-50 border-blue-200">{statusStats.ONGOING || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Selesai</span>
                <Badge className="text-emerald-600 bg-emerald-50 border-emerald-200">{statusStats.COMPLETED || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">{t.cancelled}</span>
                <Badge className="text-red-600 bg-red-50 border-red-200">{statusStats.CANCELLED || 0}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5 col-span-1 md:col-span-2 bg-white">
            <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" /> {t.routePerformance}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-neutral-500">
                    <th className="pb-2 font-medium">{t.routeName}</th>
                    <th className="pb-2 font-medium text-center">{t.trips}</th>
                    <th className="pb-2 font-medium text-center">{t.onTime}</th>
                    <th className="pb-2 font-medium text-center">{t.passengers}</th>
                  </tr>
                </thead>
                <tbody>
                  {topRoutes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-neutral-500 text-xs">{t.noRoutes}</td>
                    </tr>
                  ) : topRoutes.map(r => (
                    <tr key={r.routeId} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-neutral-900">{r.name}</td>
                      <td className="py-3 text-center text-neutral-600">{r.total}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${r.onTimeRate > 80 ? 'bg-emerald-100 text-emerald-700' : r.onTimeRate > 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {r.onTimeRate.toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-3 text-center text-neutral-600">{r.passengerCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Row 3: Top Vehicles & Recent Departures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 bg-white">
            <h3 className="font-bold text-neutral-900 mb-4">{t.topVehicleUtilization}</h3>
            <div className="space-y-4">
              {topVehicles.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">{t.noVehicles}</p>
              ) : topVehicles.map(v => (
                <div key={v.vehicleId} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{v.name}</p>
                      <p className="text-xs text-neutral-500">{v.vehicleId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-neutral-900">{v.total} {t.trips}</p>
                    <p className="text-xs text-neutral-500">{v.completed} {t.completed}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-white">
            <h3 className="font-bold text-neutral-900 mb-4">{t.recentDepartures}</h3>
            <div className="space-y-4">
              {recentDepartures.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">{t.noRecent}</p>
              ) : recentDepartures.map(d => (
                <div key={d.id} className="flex justify-between items-center border-b border-border last:border-0 pb-3 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-[10px] uppercase">{d.status}</Badge>
                      <span className="text-sm font-bold text-neutral-900">{d.scheduledDepartureAt}</span>
                    </div>
                    <p className="text-xs text-neutral-500">{t.date} {d.date}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => {
                      trackingNavigationService.navigateToTracking(router, {
                        mode: ['SCHEDULED', 'ONGOING'].includes(d.status) ? 'live' : 'playback',
                        vehicleId: d.vehicleId
                      });
                    }}
                  >
                    {t.viewMap}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
