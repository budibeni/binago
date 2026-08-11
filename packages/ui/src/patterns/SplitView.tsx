import React from 'react';
import { cn } from '@binago/utils';

export interface SplitViewProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
}

export const SplitView = React.forwardRef<HTMLDivElement, SplitViewProps>(
  ({ className, direction = 'horizontal', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full overflow-hidden border border-border rounded-lg bg-background',
          direction === 'vertical' ? 'flex-col' : 'flex-col md:flex-row',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SplitView.displayName = 'SplitView';

export interface SplitViewSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  collapsible?: boolean;
}

export const SplitViewSidebar = React.forwardRef<HTMLDivElement, SplitViewSidebarProps>(
  ({ className, width = 'w-full md:w-80', children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          'shrink-0 border-b md:border-b-0 md:border-r border-border bg-surface overflow-y-auto',
          width,
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
SplitViewSidebar.displayName = 'SplitViewSidebar';

export interface SplitViewContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SplitViewContent = React.forwardRef<HTMLDivElement, SplitViewContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn('flex-1 overflow-y-auto bg-background p-4', className)}
        {...props}
      >
        {children}
      </main>
    );
  },
);
SplitViewContent.displayName = 'SplitViewContent';
