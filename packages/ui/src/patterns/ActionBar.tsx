import React from 'react';
import { cn } from '@binago/utils';

export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
}

export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({ className, leftActions, rightActions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2">{leftActions || children}</div>
        {rightActions && <div className="flex items-center gap-2">{rightActions}</div>}
      </div>
    );
  },
);
ActionBar.displayName = 'ActionBar';
