'use client';

import React from 'react';
import { cn } from '@adatrack/utils';
import { StatisticPeriod } from '../types';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';

export interface PeriodSelectorProps {
  selectedPeriod: StatisticPeriod;
  onPeriodChange: (period: StatisticPeriod) => void;
}

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  
  const periods: { id: StatisticPeriod; label: string }[] = [
    { id: 'daily', label: t.statistics?.periods?.daily || 'Harian' },
    { id: 'weekly', label: t.statistics?.periods?.weekly || 'Mingguan' },
    { id: 'monthly', label: t.statistics?.periods?.monthly || 'Bulanan' },
  ];

  return (
    <div className="flex p-1 bg-surface-elevated rounded-xl">
      {periods.map(period => (
        <button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all text-center",
            selectedPeriod === period.id 
              ? "bg-surface text-red-600 shadow-sm" 
              : "text-foreground-subtle hover:text-foreground-muted"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
