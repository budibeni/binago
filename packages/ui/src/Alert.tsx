import React from 'react';
import { cn } from '@binago/utils';
import type { SemanticVariant } from '@binago/types';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SemanticVariant;
  onDismiss?: () => void;
}

const icons: Record<SemanticVariant, React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
};

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  onDismiss,
  children,
  ...props
}) => {
  const variants = {
    info: 'bg-info/10 border-info/20 text-info',
    success: 'bg-success/10 border-success/20 text-success',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    danger: 'bg-danger/10 border-danger/20 text-danger',
  };

  const Icon = icons[variant];

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-lg border p-4 text-sm',
        variants[variant],
        className,
      )}
      {...props}
    >
      <Icon className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Tutup notifikasi"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
