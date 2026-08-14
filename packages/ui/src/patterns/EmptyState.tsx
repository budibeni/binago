import React from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '@adatrack/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon: Icon = FileQuestion,
  title = 'Data Tidak Ditemukan',
  description = 'Belum ada data yang tersedia untuk ditampilkan.',
  action,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-border bg-surface/50 min-h-[220px]',
        className,
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-foreground-muted mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-foreground-muted max-w-sm mt-1 mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
      {children}
    </div>
  );
};
