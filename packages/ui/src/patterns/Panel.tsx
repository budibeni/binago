import React from 'react';
import { cn } from '@adatrack/utils';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'flat';
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-background border border-border shadow-sm',
      bordered: 'bg-background border-2 border-border',
      flat: 'bg-surface border border-border-strong/40',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-lg overflow-hidden', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Panel.displayName = 'Panel';

export interface PanelHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  className,
  title,
  subtitle,
  action,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-border px-4 py-3 bg-background',
        className,
      )}
      {...props}
    >
      <div>
        {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
        {subtitle && <p className="text-xs text-foreground-muted mt-0.5">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
};

export interface PanelBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const PanelBody: React.FC<PanelBodyProps> = ({
  className,
  padding = 'md',
  children,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={cn(paddings[padding], className)} {...props}>
      {children}
    </div>
  );
};

export interface PanelFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PanelFooter: React.FC<PanelFooterProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-border px-4 py-3 bg-surface',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
