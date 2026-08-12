'use client';

import React from 'react';
import { cn } from '@binago/utils';
import { LucideIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { MetricValue } from '../types';

export interface StatCardProps {
  title: string;
  data: MetricValue;
  unit?: string;
  icon?: LucideIcon;
  iconBgColor?: string; // Tailwind class like 'bg-red-100 text-red-600'
  labelLeft?: string;
  className?: string;
}

export function StatCard({
  title,
  data,
  unit,
  icon: Icon,
  iconBgColor = 'bg-neutral-100 text-neutral-600',
  labelLeft,
  className
}: StatCardProps) {
  return (
    <div className={cn("rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-sm border bg-white border-neutral-200", className)}>
      
      {/* Top: Icon */}
      {Icon && (
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", iconBgColor)}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      
      <div className="flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-1">{title}</h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900">{data.value}</span>
            {unit && <span className="text-sm font-medium text-neutral-500">{unit}</span>}
          </div>
        </div>
        
        {/* Bottom row: label and diff */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-neutral-100">
          <span className="text-xs font-medium text-neutral-400">{labelLeft || title}</span>
          
          {data.diff && (
            <span className={cn(
              "text-xs font-semibold flex items-center gap-0.5",
              data.diff.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {data.diff.isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {data.diff.value} {data.diff.unit || ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
