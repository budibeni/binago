import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@adatrack/ui';

interface TableFilterPopoverProps {
  children: React.ReactNode;
  locale: 'id' | 'en';
  triggerClassName?: string;
  badgeCount?: number;
  hideLabel?: boolean;
  onReset?: () => void;
}

export function TableFilterPopover({ children, locale, triggerClassName, badgeCount = 0, hideLabel = false, onReset }: TableFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          title={locale === 'en' ? 'Parameters (Required)' : 'Parameter (Wajib)'}
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

      <PopoverContent align="start" className="w-[300px] p-0 flex flex-col bg-background rounded-md overflow-hidden" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
           <span className="text-[13px] font-semibold text-foreground">
             {locale === 'en' ? 'Parameters' : 'Parameter'}
           </span>
           <div className="flex items-center gap-2">
             {onReset && (
               <button
                 type="button"
                 onClick={onReset}
                 className="text-[11px] font-semibold text-danger hover:text-danger/80 transition-colors"
               >
                 {locale === 'en' ? 'Reset' : 'Hapus Parameter'}
               </button>
             )}
             <button 
               type="button"
               onClick={() => setIsOpen(false)}
               className="text-foreground-muted hover:text-foreground transition-colors focus:outline-none ml-1"
               title={locale === 'en' ? 'Close' : 'Tutup'}
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
