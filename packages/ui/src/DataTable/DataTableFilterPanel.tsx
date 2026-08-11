'use client';

import React from 'react';
import { cn } from '@binago/utils';
import type { DataTableFilterConfig } from './types';

export interface DataTableFilterPanelProps {
  config: DataTableFilterConfig;
  className?: string;
}

export function DataTableFilterPanel({ config, className }: DataTableFilterPanelProps) {
  const handleToggleSingle = (fieldId: string, value: string) => {
    config.onStateChange({ ...config.state, [fieldId]: value });
  };

  const handleToggleMulti = (fieldId: string, value: string) => {
    const current = (config.state[fieldId] as string[]) || [];
    if (current.includes(value)) {
      config.onStateChange({ ...config.state, [fieldId]: current.filter((v) => v !== value) });
    } else {
      config.onStateChange({ ...config.state, [fieldId]: [...current, value] });
    }
  };

  return (
    <div className={cn('bg-background border border-border rounded-lg p-3 space-y-4 overflow-y-auto', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{config.labels?.title ?? 'Filter'}</h3>
        {config.onClearAll && (
          <button
            type="button"
            onClick={config.onClearAll}
            className="text-[11px] font-medium text-foreground-muted hover:text-foreground underline underline-offset-2 transition-colors"
          >
            {config.labels?.clearAll ?? 'Reset'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <h4 className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
              {field.label}
            </h4>

            {field.type === 'pills-single' && (
              <div className="flex flex-col gap-1.5">
                {field.options.map((opt) => {
                  const isActive = config.state[field.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleToggleSingle(field.id, opt.value)}
                      className={cn(
                        'flex items-center justify-between w-full gap-1 px-2 py-1.5 rounded text-[12px] font-medium transition-all',
                        'border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        isActive
                          ? opt.activeClass ?? 'bg-primary/10 border-primary/30 text-primary'
                          : 'bg-background border-border text-foreground-muted hover:border-neutral-400 dark:hover:border-neutral-500',
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        {isActive && opt.colorClass && (
                          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', opt.colorClass)} />
                        )}
                        {opt.label}
                      </div>
                      {opt.count !== undefined && (
                        <span
                          className={cn(
                            'text-[10px] font-semibold tabular-nums px-1 rounded',
                            isActive
                              ? 'bg-white/30 dark:bg-black/20'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-foreground-muted',
                          )}
                        >
                          {opt.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {field.type === 'pills-multi' && (
              <div className="flex flex-col gap-1.5">
                {field.options.map((opt) => {
                  const currentValues = (config.state[field.id] as string[]) || [];
                  const isActive = currentValues.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleToggleMulti(field.id, opt.value)}
                      className={cn(
                        'flex items-center justify-between w-full gap-1 px-2 py-1.5 rounded text-[12px] font-medium transition-all',
                        'border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        isActive
                          ? opt.activeClass ?? 'bg-primary/10 border-primary/30 text-primary'
                          : 'bg-background border-border text-foreground-muted hover:border-neutral-400 dark:hover:border-neutral-500',
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        {isActive && opt.colorClass && (
                          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', opt.colorClass)} />
                        )}
                        {opt.label}
                      </div>
                      {opt.count !== undefined && (
                        <span
                          className={cn(
                            'text-[10px] font-semibold tabular-nums px-1 rounded',
                            isActive
                              ? 'bg-white/30 dark:bg-black/20'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-foreground-muted',
                          )}
                        >
                          {opt.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            
            {field.type === 'checkbox-group' && (
              <div className="flex flex-col gap-2">
                {field.options.map((opt) => {
                  const currentValues = (config.state[field.id] as string[]) || [];
                  const isActive = currentValues.includes(opt.value);
                  return (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                        checked={isActive}
                        onChange={() => handleToggleMulti(field.id, opt.value)}
                      />
                      <span className="text-[12px] text-foreground flex-1">{opt.label}</span>
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
    </div>
  );
}
