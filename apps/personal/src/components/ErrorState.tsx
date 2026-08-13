'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@binago/utils';
import { Button } from '@binago/ui';

export interface ErrorStateProps {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-12',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4 border border-red-100 dark:border-red-900/30">
        <AlertCircle className="w-7 h-7 text-red-500" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-foreground-muted max-w-xs leading-relaxed">{description}</p>
      )}
      {retryLabel && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-5 border-border"
          size="sm"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

