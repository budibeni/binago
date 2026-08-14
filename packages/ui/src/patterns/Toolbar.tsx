import React from 'react';
import { cn } from '@adatrack/utils';
import { Button, type ButtonProps } from '../Button';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="toolbar"
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-surface border border-border',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Toolbar.displayName = 'Toolbar';

export interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1.5', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ToolbarGroup.displayName = 'ToolbarGroup';

export interface ToolbarButtonProps extends ButtonProps {}

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ variant = 'ghost', size = 'sm', className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('h-8 px-2.5 text-xs', className)}
        {...props}
      />
    );
  },
);
ToolbarButton.displayName = 'ToolbarButton';
