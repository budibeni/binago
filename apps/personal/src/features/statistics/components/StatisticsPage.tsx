'use client';

import React, { useState, useMemo } from 'react';
import { Clock, Zap, Activity, Info, BarChart3 } from 'lucide-react';
import { mockVehicles } from '../../tracking/data/mockTrackingData';
import { mockStatisticsData } from '../data/mockStatisticsData';
import { StatisticPeriod } from '../types';
import { VehicleSelector } from './VehicleSelector';
import { PeriodSelector } from './PeriodSelector';
import { DateSelector } from './DateSelector';
import { StatCard } from './StatCard';
import { PrimaryStatCard } from './PrimaryStatCard';
import { StatisticsTrend } from './StatisticsTrend';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { EmptyState } from '@/components/EmptyState';

export function StatisticsPage() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(mockVehicles[0]?.id || '');
  const [selectedPeriod, setSelectedPeriod] = useState<StatisticPeriod>('daily');
  const [dateOffset, setDateOffset] = useState<number>(0);

  // Reset offset when vehicle or period changes
  React.useEffect(() => {
    setDateOffset(0);
  }, [selectedVehicleId, selectedPeriod]);

  const currentStats = useMemo(() => {
    // We only show mock data if offset is 0, otherwise it simulates empty data
    if (dateOffset !== 0) return undefined;
    
    return mockStatisticsData.find(
      (data) => data.vehicleId === selectedVehicleId && data.period === selectedPeriod
    );
  }, [selectedVehicleId, selectedPeriod, dateOffset]);

  // Mock date label
  const dateLabel = useMemo(() => {
    const baseDateStr = currentStats ? currentStats.dateStr : new Date().toISOString();
    const date = new Date(baseDateStr);
    const dateLocale = locale === 'en' ? 'en-US' : 'id-ID';
    
    // Apply offset based on period
    if (selectedPeriod === 'daily') {
      date.setDate(date.getDate() + dateOffset);
      return date.toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (selectedPeriod === 'weekly') {
      date.setDate(date.getDate() + (dateOffset * 7));
      const weekStr = locale === 'en' ? 'Week' : 'Minggu';
      return `${weekStr} (${date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })})`;
    }
    if (selectedPeriod === 'monthly') {
      date.setMonth(date.getMonth() + dateOffset);
      return date.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' });
    }
    return '-';
  }, [currentStats, selectedPeriod, dateOffset, locale]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hLabel = locale === 'en' ? 'h' : 'j';
    const mLabel = 'm';
    if (hours > 0) return `${hours}${hLabel} ${mins}${mLabel}`;
    return `${mins}${mLabel}`;
  };

  const speedUnit = locale === 'en' ? 'km/h' : 'km/j';

  // Inject translated diff labels and trend labels into currentStats
  const localizedStats = useMemo(() => {
    if (!currentStats) return null;
    const diffLabel = t.statistics?.diffs?.[selectedPeriod] || '';
    
    // Override diff labels
    const stats = { ...currentStats };
    if (stats.totalDistance.diff) stats.totalDistance.diff.label = diffLabel;
    if (stats.totalDuration.diff) stats.totalDuration.diff.label = diffLabel;
    if (stats.tripCount.diff) stats.tripCount.diff.label = diffLabel;
    if (stats.avgSpeed.diff) {
      stats.avgSpeed.diff.label = diffLabel;
      stats.avgSpeed.diff.unit = speedUnit;
    }
    if (stats.maxSpeed.diff) {
      stats.maxSpeed.diff.label = diffLabel;
      stats.maxSpeed.diff.unit = speedUnit;
    }

    // Override trend labels for weekly and monthly
    if ((selectedPeriod === 'weekly' || selectedPeriod === 'monthly') && stats.trendData) {
      const labels = t.statistics?.trendLabels?.[selectedPeriod] || [];
      stats.trendData = stats.trendData.map((data, index) => ({
        ...data,
        label: labels[index] || data.label
      }));
    }

    return stats;
  }, [currentStats, selectedPeriod, t, speedUnit]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6 pb-24">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <VehicleSelector 
          vehicles={mockVehicles}
          selectedVehicleId={selectedVehicleId}
          onSelect={setSelectedVehicleId}
        />
        
        <PeriodSelector 
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        <DateSelector 
          label={dateLabel} 
          onPrev={() => setDateOffset(prev => prev - 1)}
          onNext={() => setDateOffset(prev => prev + 1)}
        />
      </div>

      {localizedStats ? (
        <>
          {/* Primary Metric */}
          <PrimaryStatCard 
            title={t.statistics?.totalDistance || "Total Jarak"}
            data={localizedStats.totalDistance}
            trendData={localizedStats.trendData || []}
          />

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-2">
            <StatCard 
              title={t.statistics?.totalDuration || "Waktu Berkendara"} 
              data={{...localizedStats.totalDuration, value: formatDuration(localizedStats.totalDuration.value as number)}} 
              icon={Clock} 
              iconBgColor="bg-red-50 text-red-500"
              labelLeft={t.statistics?.subLabels?.duration || "Total waktu"}
            />
            <StatCard 
              title={t.statistics?.tripCount || "Total Perjalanan"} 
              data={localizedStats.tripCount} 
              icon={Activity} 
              iconBgColor="bg-blue-50 text-blue-500"
              labelLeft={t.statistics?.subLabels?.trips || "Perjalanan"}
            />
            <StatCard 
              title={t.statistics?.avgSpeed || "Kecepatan Rata-rata"} 
              data={localizedStats.avgSpeed} 
              unit={speedUnit} 
              icon={Zap} 
              iconBgColor="bg-purple-50 text-purple-500"
              labelLeft={t.statistics?.subLabels?.avg || "Rata-rata"}
            />
            <StatCard 
              title={t.statistics?.maxSpeed || "Kecepatan Maksimum"} 
              data={localizedStats.maxSpeed} 
              unit={speedUnit} 
              icon={Zap} 
              iconBgColor="bg-orange-50 text-orange-500"
              labelLeft={t.statistics?.subLabels?.max || "Maksimum"}
            />
          </div>

          {/* Trend Chart */}
          {localizedStats.trendData && localizedStats.trendData.length > 0 && (
            <div className="mt-2">
              <StatisticsTrend 
                title={t.statistics?.trendTitle || "Tren Jarak Tempuh"} 
                data={localizedStats.trendData} 
                unit="km" 
              />
            </div>
          )}

          {/* Info Footer */}
          <div className="flex items-center gap-3 mt-4 text-xs font-medium text-foreground-muted bg-surface-elevated border border-border rounded-xl p-4">
            <Info className="w-4 h-4 text-red-500 shrink-0" />
            <p>{t.statistics?.footerInfo || "Data statistik dihitung berdasarkan riwayat perjalanan kendaraan."}</p>
          </div>
        </>
      ) : (
        <div className="bg-surface rounded-2xl border border-border">
          <EmptyState
            icon={BarChart3}
            title={t.statistics?.emptyState || 'Data statistik tidak tersedia untuk periode ini.'}
            description={locale === 'en' 
              ? 'Try selecting a different date or vehicle.'
              : 'Coba pilih tanggal atau kendaraan yang berbeda.'
            }
          />
        </div>
      )}
    </div>
  );
}
