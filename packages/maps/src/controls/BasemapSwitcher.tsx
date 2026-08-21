'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Map as MapIcon, MapPinned, Satellite, Check, ChevronDown, Moon } from 'lucide-react';
import type { BasemapId } from '../basemaps/types';
import { cn } from '@adatrack/utils';
import { Locale, getMapTranslation } from '../i18n';

export interface BasemapSwitcherProps {
  value: BasemapId;
  onChange: (basemap: BasemapId) => void;
  className?: string;
  /**
   * Jika true, tampilkan sebagai compact button (tanpa label teks aktif).
   * Berguna saat diembed di dalam MapToolbar.
   */
  compact?: boolean;
  locale?: Locale;
}

const ICONS: Record<BasemapId, React.FC<{ className?: string }>> = {
  standard: MapIcon,
  dark: Moon,
  osm: MapPinned,
  satellite: Satellite,
};

export function BasemapSwitcher({ value, onChange, className, compact = false, locale = 'id' }: BasemapSwitcherProps) {
  const t = getMapTranslation(locale).basemap;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const OPTIONS: { id: BasemapId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'standard', label: t.standard, icon: ICONS.standard },
    { id: 'dark', label: t.dark, icon: ICONS.dark },
    { id: 'osm', label: t.osm, icon: ICONS.osm },
    { id: 'satellite', label: t.satellite, icon: ICONS.satellite },
  ];

  const activeOption = OPTIONS.find((o) => o.id === value) || OPTIONS[0];
  const ActiveIcon = activeOption.icon;

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block text-left', className)}
    >
      <button
        type="button"
        id="basemap-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 text-foreground bg-transparent',
          'hover:bg-surface',
          'transition-colors',
          compact ? 'px-2 py-1.5 rounded-lg' : 'px-3 py-2 border border-border rounded-xl shadow-sm bg-background',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.label}
      >
        <ActiveIcon className="w-4 h-4 text-foreground-muted shrink-0" />
        {!compact && (
          <span className="text-sm font-medium whitespace-nowrap hidden sm:inline-block">{activeOption.label}</span>
        )}
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-foreground-subtle transition-transform duration-150',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-48 bg-background rounded-xl shadow-lg border border-border overflow-hidden z-[70] origin-top-right p-1"
          role="listbox"
          aria-label={t.label}
          tabIndex={-1}
        >
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = option.id === value;

            return (
              <button
                key={option.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left rounded-lg',
                  isSelected
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-foreground-muted hover:bg-surface hover:text-foreground',
                )}
              >
                <div className="w-4 flex justify-center shrink-0">
                  {isSelected && <Check className="w-4 h-4 text-accent" />}
                </div>
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    isSelected ? 'text-accent' : 'text-foreground-subtle',
                  )}
                />
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
