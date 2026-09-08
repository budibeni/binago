'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import type { DataTableFilterConfig } from './types';

export interface DataTableActiveFiltersProps {
  config: DataTableFilterConfig;
  className?: string;
}

export function DataTableActiveFilters({ config, className }: DataTableActiveFiltersProps) {
  const { state, fields, onStateChange, onClearAll, labels } = config;

  // Derive active filters
  const activeFilters: { fieldId: string; fieldLabel: string; value: string; optionLabel: string }[] = [];

  fields.forEach((field) => {
    const val = state[field.id];
    if (val === undefined || val === null) return;
    
    // For single select pills where 'ALL' means no filter
    if (typeof val === 'string' && val !== 'ALL' && val !== '') {
      const option = field.options.find(o => o.value === val);
      if (option) {
        activeFilters.push({
          fieldId: field.id,
          fieldLabel: field.label,
          value: val,
          optionLabel: option.label,
        });
      }
    }
    
    // For multi select
    if (Array.isArray(val) && val.length > 0) {
      val.forEach(v => {
        if (v !== 'ALL' && v !== '') {
          const option = field.options.find(o => o.value === v);
          if (option) {
            activeFilters.push({
              fieldId: field.id,
              fieldLabel: field.label,
              value: v,
              optionLabel: option.label,
            });
          }
        }
      });
    }
  });

  if (activeFilters.length === 0) return null;

  const handleRemove = (fieldId: string, valueToRemove: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const currentVal = state[fieldId];
    if (typeof currentVal === 'string') {
      onStateChange({ ...state, [fieldId]: 'ALL' });
    } else if (Array.isArray(currentVal)) {
      const newVal = currentVal.filter(v => v !== valueToRemove);
      onStateChange({ ...state, [fieldId]: newVal });
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2 pt-1 pb-2", className)}>
      {activeFilters.map((af, i) => (
        <div
          key={`${af.fieldId}-${af.value}-${i}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[13px] font-medium text-foreground-muted shadow-sm"
        >
          <span>{af.fieldLabel}: <span className="text-foreground">{af.optionLabel}</span></span>
          <button
            onClick={() => handleRemove(af.fieldId, af.value)}
            className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 p-0.5 transition-colors focus:outline-none"
            aria-label={`Remove filter ${af.fieldLabel} ${af.optionLabel}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      
      {onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 text-[13px] text-danger hover:text-danger/80 hover:bg-danger/10 px-2 font-medium"
        >
          {labels?.clearAll || 'Reset Filter'}
        </Button>
      )}
    </div>
  );
}
