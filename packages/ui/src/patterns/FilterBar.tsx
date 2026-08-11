import React from 'react';
import { Filter, X } from 'lucide-react';
import { cn } from '@binago/utils';
import { Badge } from '../Badge';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClearAll?: () => void;
  clearLabel?: string;
}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ className, onClearAll, clearLabel = 'Hapus Semua', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center gap-2 p-2 rounded-lg bg-surface border border-border text-xs',
          className,
        )}
        {...props}
      >
        <span className="flex items-center gap-1 text-foreground-muted font-medium pr-1">
          <Filter className="h-3.5 w-3.5" />
          Filter:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 flex-1">{children}</div>
        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-foreground-muted hover:text-foreground font-medium underline underline-offset-2 transition-colors px-1"
          >
            {clearLabel}
          </button>
        )}
      </div>
    );
  },
);
FilterBar.displayName = 'FilterBar';

export interface FilterItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  value?: string;
  onRemove?: () => void;
}

export const FilterItem: React.FC<FilterItemProps> = ({
  className,
  label,
  value,
  onRemove,
  ...props
}) => {
  return (
    <Badge
      variant="default"
      className={cn('gap-1 pr-1 border-neutral-300 bg-background text-foreground', className)}
      {...props}
    >
      <span className="font-normal text-foreground-muted">{label}:</span>
      {value && <span className="font-semibold">{value}</span>}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 hover:bg-neutral-100 text-foreground-muted hover:text-foreground transition-colors"
          aria-label={`Hapus filter ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};
