'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@binago/utils';
import { Button } from '@binago/ui';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-12',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center mb-4 border border-border">
        <Icon className="w-7 h-7 text-foreground-subtle" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-foreground-muted max-w-xs leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-5 bg-red-600 hover:bg-red-700 text-white border-transparent"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
