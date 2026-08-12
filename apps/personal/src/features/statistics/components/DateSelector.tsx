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
      <button className="flex items-center gap-2 flex-1 justify-center md:flex-none bg-white border border-neutral-200 rounded-xl px-4 py-2 md:py-2 min-h-[44px] hover:bg-neutral-50 transition-colors">
        <Calendar className="w-4 h-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-900 truncate">{label}</span>
      </button>
      <div className="flex bg-white border border-neutral-200 rounded-xl overflow-hidden shrink-0">
        <button 
          onClick={onPrev}
          className="p-3 md:p-2 min-h-[44px] hover:bg-neutral-50 transition-colors border-r border-neutral-200 flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 text-neutral-600" />
        </button>
        <button 
          onClick={onNext}
          className="p-3 md:p-2 min-h-[44px] hover:bg-neutral-50 transition-colors flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4 text-neutral-600" />
        </button>
      </div>
    </div>
  );
}
