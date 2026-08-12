'use client';

import React from 'react';
import { Route, ChevronUp, ChevronDown } from 'lucide-react';
import { MetricValue } from '../types';

export interface PrimaryStatCardProps {
  title: string;
  data: MetricValue;
  trendData: { label: string; value: number }[];
}

export function PrimaryStatCard({ title, data, trendData }: PrimaryStatCardProps) {
  // Sparkline calculation
  const points = trendData.length > 0 ? trendData.map((d, i) => {
    const x = (i / (trendData.length - 1)) * 100;
    // rough scaling for y, smaller value = higher up (0 at top, 100 at bottom)
    const maxVal = Math.max(...trendData.map(t => t.value), 1);
    const y = 100 - ((d.value / maxVal) * 80 + 10);
    return `${x},${y}`;
  }).join(' ') : '';
  
  const lastPoint = trendData.length > 0 ? (() => {
    const i = trendData.length - 1;
    const x = 100;
    const maxVal = Math.max(...trendData.map(t => t.value), 1);
    const y = 100 - ((trendData[i].value / maxVal) * 80 + 10);
    return { x, y };
  })() : null;

  return (
    <div className="relative w-full rounded-2xl bg-[#1a1a1a] text-white p-6 md:p-8 overflow-hidden flex flex-col justify-between min-h-[220px]">
      {/* Background Map Graphic Placeholder */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at right, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        {/* We can use a faint SVG map pattern here, but a subtle dot pattern works well too */}
      </div>

      <div className="relative z-10 flex justify-between items-start">
        <h3 className="text-neutral-400 text-sm md:text-base font-medium">{title}</h3>
        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
          <Route className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-2 mt-8 md:mt-12">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl md:text-6xl font-bold tracking-tight">{data.value}</span>
          <span className="text-xl text-neutral-400 font-medium">km</span>
        </div>
        
        {data.diff && (
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className={data.diff.isPositive ? "text-green-500" : "text-red-500 flex items-center"}>
              {data.diff.isPositive ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
              {data.diff.value}{data.diff.unit || '%'}
            </span>
            <span className="text-neutral-400">{data.diff.label}</span>
          </div>
        )}
      </div>

      {/* Sparkline Graph */}
      <div className="absolute bottom-6 right-6 w-1/2 md:w-2/5 h-20 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(220 38 38)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(220 38 38)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d={`M 0,100 L ${points} L 100,100 Z`} 
            fill="url(#sparklineGrad)" 
          />
          <polyline 
            points={points} 
            fill="none" 
            stroke="rgb(220 38 38)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {lastPoint && (
            <circle cx={lastPoint.x} cy={lastPoint.y} r="3" fill="white" />
          )}
        </svg>
      </div>
    </div>
  );
}
