import React, { useState, useRef, useEffect } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { getTrackingTranslation } from '../../i18n';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@adatrack/ui';

interface TableFilterPopoverProps {
  children: React.ReactNode;
  locale: 'id' | 'en';
  triggerClassName?: string;
  badgeCount?: number;
  hideLabel?: boolean;
  onReset?: () => void;
}

export function TableFilterPopover({ children, locale = 'id', triggerClassName, badgeCount = 0, hideLabel = false, onReset }: TableFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const tTrackingLocal = getTrackingTranslation(locale);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "relative flex items-center justify-center h-8 w-8 px-0 rounded-md border transition-all focus:outline-none focus:ring-1 focus:ring-primary",
            isOpen
              ? "border-primary/50 text-primary bg-primary/5 dark:bg-primary/10"
              : "border-border text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800",
            triggerClassName
          )}
          title={tTrackingLocal.filters.parametersRequired}
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0" />
          
          {/* Denyut kecil (Small pulse indicator) */}
          {!isOpen && badgeCount === 0 && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary border-2 border-background"></span>
            </span>
          )}

          {badgeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {badgeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[300px] p-0 flex flex-col bg-background rounded-md overflow-hidden" sideOffset={8} ref={popoverRef}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-neutral-50/50 dark:bg-neutral-900/50 rounded-t-lg">
           <h3 className="font-semibold text-[12px] text-foreground flex items-center gap-2">
             <Filter className="h-3.5 w-3.5 text-primary" />
             {tTrackingLocal.filters.parameters}
           </h3>
           <div className="flex items-center gap-1">
             {onReset && (
               <button
                 type="button"
                 onClick={() => {
                   onReset();
                   setIsOpen(false);
                 }}
                 className="text-[11px] text-danger hover:text-danger/80 hover:bg-danger/10 px-2 py-1 rounded transition-colors font-medium"
               >
                 {tTrackingLocal.filters.resetParameters}
               </button>
             )}
             <button 
               type="button"
               onClick={() => setIsOpen(false)}
               className="text-foreground-muted hover:text-foreground p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
               title={tTrackingLocal.filters.close}
             >
               <X className="h-3.5 w-3.5" />
             </button>
           </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 max-h-[400px]">
           {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}
