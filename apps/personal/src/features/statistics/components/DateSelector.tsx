'use client';

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateSelectorProps {
  label: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export function DateSelector({ label, onPrev, onNext }: DateSelectorProps) {
  return (
    <div className="flex items-center justify-between md:justify-start gap-2 w-full md:w-auto">
      <button className="flex items-center gap-2 flex-1 justify-center md:flex-none bg-surface border border-border rounded-xl px-4 py-2 md:py-2 min-h-[44px] hover:bg-surface-elevated transition-colors">
        <Calendar className="w-4 h-4 text-foreground-muted" />
        <span className="text-sm font-medium text-foreground truncate">{label}</span>
      </button>
      <div className="flex bg-surface border border-border rounded-xl overflow-hidden shrink-0">
        <button 
          onClick={onPrev}
          className="p-3 md:p-2 min-h-[44px] hover:bg-surface-elevated transition-colors border-r border-border flex items-center justify-center"
          aria-label="Previous period"
        >
          <ChevronLeft className="w-4 h-4 text-foreground-subtle" />
        </button>
        <button 
          onClick={onNext}
          className="p-3 md:p-2 min-h-[44px] hover:bg-surface-elevated transition-colors flex items-center justify-center"
          aria-label="Next period"
        >
          <ChevronRight className="w-4 h-4 text-foreground-subtle" />
        </button>
      </div>
    </div>
  );
}
