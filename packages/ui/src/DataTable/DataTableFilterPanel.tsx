'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import type { DataTableFilterConfig } from './types';

export interface DataTableFilterPanelProps {
  config: DataTableFilterConfig;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function DataTableFilterPanel({ config, isOpen, onClose, className }: DataTableFilterPanelProps) {
  const [localState, setLocalState] = useState(config.state);

  useEffect(() => {
    setLocalState(config.state);
  }, [config.state]);

  const handleToggleSingle = (fieldId: string, value: string) => {
    setLocalState((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleToggleMulti = (fieldId: string, value: string) => {
    setLocalState((prev) => {
      const current = (prev[fieldId] as string[]) || [];
      if (current.includes(value)) {
        return { ...prev, [fieldId]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [fieldId]: [...current, value] };
      }
    });
  };

  const handleApply = () => {
    config.onStateChange(localState);
    onClose?.();
  };

  const handleReset = () => {
    const resetState = { ...localState };
    Object.keys(resetState).forEach(key => {
      resetState[key] = Array.isArray(resetState[key]) ? [] : 'ALL';
    });
    setLocalState(resetState);
    config.onStateChange(resetState);
    if (config.onClearAll) {
      config.onClearAll();
    }
  };

  // Side panel mode (when rendered inline next to the table)
  const isSidePanel = isOpen !== undefined;

  if (isSidePanel && !isOpen) return null;

  return (
    <div className={cn(
      'flex flex-col bg-background',
      isSidePanel
        ? 'border border-border rounded-lg w-[220px] shrink-0 overflow-hidden'
        : 'rounded-md',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <span className="text-[13px] font-semibold text-foreground">
          {config.labels?.title ?? 'Filter Kendaraan'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-semibold text-danger hover:text-danger/80 transition-colors"
          >
            {config.labels?.clearAll ?? 'Reset'}
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="text-foreground-muted hover:text-foreground transition-colors ml-1">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Fields */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 max-h-[320px]">
        {config.fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <h4 className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">
              {field.label}
            </h4>

            {field.type === 'pills-single' && (
              <div className="flex flex-col gap-1">
                {field.options.map((opt) => {
                  const isActive = localState[field.id] === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleToggleSingle(field.id, opt.value)}
                        className="rounded-sm border-border accent-danger h-4 w-4 cursor-pointer"
                      />
                      <span className={cn(
                        'text-[13px] flex-1',
                        isActive ? 'text-foreground font-medium' : 'text-foreground-muted'
                      )}>
                        {opt.label}
                      </span>
                      {opt.count !== undefined && (
                        <span className="text-[11px] text-foreground-muted tabular-nums">{opt.count}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {(field.type === 'pills-multi' || field.type === 'checkbox-group') && (
              <div className="flex flex-col gap-1">
                {field.options.map((opt) => {
                  const currentValues = (localState[field.id] as string[]) || [];
                  const isActive = currentValues.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleToggleMulti(field.id, opt.value)}
                        className="rounded-sm border-border accent-danger h-4 w-4 cursor-pointer"
                      />
                      <span className={cn(
                        'text-[13px] flex-1',
                        isActive ? 'text-foreground font-medium' : 'text-foreground-muted'
                      )}>
                        {opt.label}
                      </span>
                      {opt.count !== undefined && (
                        <span className="text-[11px] text-foreground-muted tabular-nums">{opt.count}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-border flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1 h-8 text-[12px]" onClick={onClose}>
          Batal
        </Button>
        <Button variant="destructive" size="sm" className="flex-1 h-8 text-[12px]" onClick={handleApply}>
          Terapkan
        </Button>
      </div>
    </div>
  );
}
