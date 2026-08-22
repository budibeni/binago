'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Locale, getMapTranslation } from '../i18n';
import type {
  MapEntityOption,
  MapGeofenceOption,
  GeofenceCheckRequest,
  GeofenceCheckResult,
} from './types';

export interface GeofenceCheckToolProps {
  /**
   * Daftar entitas yang tersedia. Disediakan oleh consumer (apps/personal).
   */
  entities?: MapEntityOption[];
  /**
   * Daftar geofence yang tersedia. Disediakan oleh consumer (apps/personal).
   */
  geofences?: MapGeofenceOption[];
  /**
   * Callback abstraction untuk pengecekan unit vs geofence.
   * Business logic tetap di apps/personal.
   * Jika tidak disediakan, gunakan mock result.
   */
  onCheckEntityGeofence?: (req: GeofenceCheckRequest) => Promise<GeofenceCheckResult>;
  /** Custom label untuk entitas, default menggunakan lokalisasi */
  entityLabel?: string;
  className?: string;
  locale?: Locale;
}

/** Mock checker untuk development */
async function mockCheckGeofence(req: GeofenceCheckRequest): Promise<GeofenceCheckResult> {
  await new Promise((r) => setTimeout(r, 600));
  // Simulasi: entity e-001 selalu Inside geofence g-001
  const inside = req.entityId === 'e-001' && req.geofenceId === 'g-001';
  return {
    inside,
    distance: inside ? 0 : Math.floor(Math.random() * 2000) + 100,
    label: inside ? 'Unit berada di dalam geofence.' : 'Unit berada di luar geofence.',
  };
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = 'Cari...',
  noResultText = 'Tidak ada hasil',
}: {
  value: string;
  onChange: (val: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
  searchPlaceholder?: string;
  noResultText?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedOption = options.find((o) => o.id === value);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setQuery(''); }}
        className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground hover:bg-surface transition-colors focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-left"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="w-3.5 h-3.5 text-foreground-subtle shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden flex flex-col p-1">
          <div className="p-1 border-b border-border mb-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-subtle" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                {noResultText}
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { onChange(opt.id); setIsOpen(false); }}
                  className={cn(
                    'w-full text-left px-3 py-2 text-xs rounded-md transition-colors',
                    value === opt.id
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-foreground-muted hover:bg-surface hover:text-foreground'
                  )}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function GeofenceCheckTool({
  entities = [],
  geofences = [],
  onCheckEntityGeofence,
  entityLabel,
  className,
  locale = 'id',
}: GeofenceCheckToolProps) {
  const t = getMapTranslation(locale).geofence;
  const [entityId, setEntityId] = useState('');
  const [geofenceId, setGeofenceId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<GeofenceCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!entityId || !geofenceId) {
      setError(t.errorEmpty);
      return;
    }
    setError(null);
    setResult(null);
    setIsChecking(true);

    try {
      const fn = onCheckEntityGeofence ?? mockCheckGeofence;
      const res = await fn({ entityId, geofenceId });
      setResult(res);
    } catch {
      setError(t.errorCheck);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={cn('w-72 text-sm space-y-3', className)}>
      {/* Entity select */}
      <div>
        <label
          htmlFor="geofence-check-entity"
          className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1"
        >
          {entityLabel ?? t.entityLabel}
        </label>
        <SearchableSelect
          value={entityId}
          onChange={(val) => {
            setEntityId(val);
            setResult(null);
          }}
          options={entities}
          placeholder={t.selectEntity}
          searchPlaceholder={t.searchEntity}
          noResultText={t.noResult}
        />
      </div>

      {/* Geofence select */}
      <div>
        <label
          htmlFor="geofence-check-geofence"
          className="block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1"
        >
          {t.geofenceLabel}
        </label>
        <SearchableSelect
          value={geofenceId}
          onChange={(val) => {
            setGeofenceId(val);
            setResult(null);
          }}
          options={geofences}
          placeholder={t.selectGeofence}
          searchPlaceholder={t.searchGeofence}
          noResultText={t.noResult}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}

      {/* Result */}
      {result && (
        <div
          className={cn(
            'rounded-lg p-3 border flex items-start gap-3 bg-surface',
            result.inside ? 'border-success' : 'border-danger',
          )}
        >
          {result.inside ? (
            <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          )}
          <div>
            <p
              className={cn(
                'text-xs font-semibold',
                result.inside ? 'text-success' : 'text-danger',
              )}
            >
              {result.inside ? t.inside : t.outside}
            </p>
            {result.label && (
              <p className="text-xs text-foreground-muted mt-0.5">{result.label}</p>
            )}
            {result.distance != null && result.distance > 0 && (
              <p className="text-xs text-foreground-subtle mt-0.5 tabular-nums">
                {t.distanceToBorder}: {result.distance >= 1000
                  ? `${(result.distance / 1000).toFixed(2)} km`
                  : `${result.distance} m`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Check button */}
      <button
        type="button"
        id="geofence-check-button"
        onClick={handleCheck}
        disabled={isChecking || !entityId || !geofenceId}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground text-xs font-medium transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        {isChecking ? t.checking : t.checkBtn}
      </button>
    </div>
  );
}
