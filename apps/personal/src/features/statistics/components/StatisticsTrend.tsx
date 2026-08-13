'use client';

import React from 'react';


export interface StatisticsTrendProps {
  title: string;
  data: { label: string; value: number }[];
  unit: string;
}

export function StatisticsTrend({ title, data, unit }: StatisticsTrendProps) {
  const chartHeight = 200; // px
  // Y-axis ticks
  const ticks = [120, 90, 60, 30, 0];

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="text-xs text-foreground-muted">({unit})</p>
        </div>
      </div>
      
      <div className="relative mt-4">
        {/* Y-axis grid */}
        <div className="absolute inset-0 flex flex-col justify-between" style={{ height: `${chartHeight}px` }}>
          {ticks.map((tick, i) => (
            <div key={i} className="flex items-center w-full">
              <span className="text-xs text-foreground-subtle w-8 shrink-0">{tick}</span>
              <div className="w-full border-b border-dashed border-border" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="relative flex items-end justify-between pl-8 pr-2" style={{ height: `${chartHeight}px` }}>
          {data.map((item, index) => {
            const isLast = index === data.length - 1;
            const heightPercent = (item.value / 120) * 100; // using 120 as max scale as in design
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 gap-3 relative group h-full justify-end">
                {/* Value on top of bar */}
                <div 
                  className={`text-xs font-bold mb-1 transition-opacity ${isLast ? 'text-red-600' : 'text-foreground'}`}
                >
                  {item.value}
                </div>
                
                {/* Bar */}
                <div 
                  className={`w-full max-w-[2.5rem] rounded-t-md transition-all duration-300 ${isLast ? 'bg-red-600' : 'bg-gradient-to-b from-red-400 to-red-50 dark:to-transparent'}`}
                  style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                />
              </div>
            );
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="flex items-center justify-between pl-8 pr-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex justify-center">
              <span className="text-xs font-medium text-foreground-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
