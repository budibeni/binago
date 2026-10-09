import React, { ReactNode } from 'react';
import { cn } from '@adatrack/utils';

export function DataList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full md:w-[280px] lg:w-[320px] shrink-0 border-r border-border bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col h-full", className)}>
      {children}
    </div>
  );
}

export function DataListHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-3 pt-3 pb-0 flex flex-col gap-2.5", className)}>
      {children}
    </div>
  );
}

export function DataListContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex-1 overflow-y-auto scrollbar-hide bg-background border-t border-border mt-3", className)}>
      <div className="flex flex-col divide-y divide-border/60">
        {children}
      </div>
    </div>
  );
}

export interface DataListItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
}

export function DataListItem({ isSelected, children, className, ...props }: DataListItemProps) {
  return (
    <button
      className={cn(
        "w-full flex flex-col py-2.5 px-3 transition-all text-left outline-none",
        isSelected 
          ? "bg-neutral-100 dark:bg-neutral-800" 
          : "bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
