import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@adatrack/utils';
import { History, MapPin, ChevronDown, CircleParking, Route, Gauge } from 'lucide-react';

interface TableModeSelectorProps {
  mode: 'live' | 'playback' | 'heatmap' | 'parking' | 'mileage' | 'speed';
  onModeChange: (mode: 'live' | 'playback' | 'heatmap' | 'parking' | 'mileage' | 'speed') => void;
  locale: 'en' | 'id';
}

export function TableModeSelector({ mode, onModeChange, locale }: TableModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    {
      value: 'live' as const,
      label: 'Live',
      icon: (
        <svg className={cn("h-4 w-4 shrink-0", mode === 'live' ? "text-danger" : "text-neutral-400")} viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="6" fill="currentColor" />
          <circle cx="8" cy="8" r="2" fill="white" />
        </svg>
      )
    },
    {
      value: 'playback' as const,
      label: 'Playback',
      icon: <History className={cn("h-4 w-4 shrink-0", mode === 'playback' ? "text-blue-500" : "text-neutral-400")} strokeWidth={2.5} />
    },
    {
      value: 'heatmap' as const,
      label: 'Heatmap',
      icon: <MapPin className={cn("h-4 w-4 shrink-0", mode === 'heatmap' ? "text-orange-500" : "text-neutral-400")} strokeWidth={2.5} />
    },
    {
      value: 'parking' as const,
      label: locale === 'en' ? 'Parking' : 'Parkir',
      icon: <CircleParking className={cn("h-4 w-4 shrink-0", mode === 'parking' ? "text-blue-500" : "text-neutral-400")} strokeWidth={2.5} />
    },
    {
      value: 'mileage' as const,
      label: locale === 'en' ? 'Mileage' : 'Jarak Tempuh',
      icon: <Route className={cn("h-4 w-4 shrink-0", mode === 'mileage' ? "text-emerald-500" : "text-neutral-400")} strokeWidth={2.5} />
    },
    {
      value: 'speed' as const,
      label: locale === 'en' ? 'Speed' : 'Kecepatan',
      icon: <Gauge className={cn("h-4 w-4 shrink-0", mode === 'speed' ? "text-purple-500" : "text-neutral-400")} strokeWidth={2.5} />
    }
  ];

  const currentOption = options.find(opt => opt.value === mode) || options[0];

  return (
    <div className="flex justify-start sm:justify-center shrink-0">
      <div className="relative min-w-[145px]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full px-2.5 h-8 bg-white dark:bg-neutral-900 border rounded-md transition-all focus:outline-none focus:ring-1 focus:ring-primary/50",
            isOpen ? "border-primary/50" : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
          )}
        >
          <div className="flex items-center gap-2">
            {currentOption.icon}
            <span className="text-[12px] font-semibold text-foreground whitespace-nowrap truncate">{currentOption.label}</span>
          </div>
          <ChevronDown className={cn("h-3.5 w-3.5 text-neutral-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full p-1 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-md border border-neutral-100 dark:border-neutral-800 z-50">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onModeChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 w-full px-2 py-1.5 text-[12px] font-medium rounded-sm transition-colors focus:outline-none group",
                  mode === opt.value
                    ? "bg-neutral-50 dark:bg-neutral-800 text-foreground"
                    : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-foreground"
                )}
              >
                {React.cloneElement(opt.icon as React.ReactElement, {
                  className: cn(
                    "h-4 w-4 shrink-0", 
                    opt.value === 'live' ? "text-danger" 
                      : opt.value === 'playback' ? "text-blue-500" 
                      : opt.value === 'heatmap' ? "text-orange-500"
                      : opt.value === 'parking' ? "text-blue-500"
                      : opt.value === 'mileage' ? "text-emerald-500"
                      : "text-purple-500"
                  )
                })}
                <span className={cn("truncate whitespace-nowrap", mode === opt.value ? "text-foreground" : "text-neutral-500 group-hover:text-foreground")}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
