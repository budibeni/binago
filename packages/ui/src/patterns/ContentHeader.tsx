import React from 'react';
import { cn } from '@adatrack/utils';

export interface ContentHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  className,
  title,
  subtitle,
  actions,
  breadcrumb,
  children,
  ...props
}) => {
  return (
    <div className={cn('space-y-1 pb-4 border-b border-border mb-6', className)} {...props}>
      {breadcrumb && <div className="mb-2 text-xs text-foreground-muted">{breadcrumb}</div>}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-foreground-muted mt-1">{subtitle}</p>
          )}
          {children}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
