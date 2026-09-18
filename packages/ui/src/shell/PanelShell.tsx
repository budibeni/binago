import React from 'react';
import { ChevronRight, ChevronLeft, X, List } from 'lucide-react';
import { cn } from '@adatrack/utils';

export interface PanelShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Panel title (rendered in header)
   */
  title: React.ReactNode;
  
  /**
   * Optional badge displayed next to the title
   */
  badge?: React.ReactNode;
  
  /**
   * If provided, renders a close button that calls this handler
   */
  onClose?: () => void;
  
  /**
   * Which icon to use for the close button
   * @default "right"
   */
  closeIcon?: 'right' | 'left' | 'x';
  
  /**
   * Optional toolbar rendered below the header (e.g. search, tabs)
   */
  toolbar?: React.ReactNode;
  
  /**
   * Optional footer rendered at the bottom of the panel
   */
  footer?: React.ReactNode;
  
  /**
   * Which side the panel is on. Determines where the border is placed.
   * @default "left"
   */
  side?: 'left' | 'right';
  
  /**
   * Custom class for the header container
   */
  headerClassName?: string;
  
  /**
   * Custom class for the scrollable content container
   */
  contentClassName?: string;
  
  /**
   * Whether the panel is currently open. Defaults to true.
   */
  isOpen?: boolean;
  
  /**
   * If provided, renders the collapsed view when isOpen is false, and calls this handler when clicked.
   */
  onOpen?: () => void;
  
  /**
   * Title text shown vertically when the panel is collapsed.
   */
  collapsedTitle?: string;
  
  /**
   * Icon to show on the collapsed button.
   * @default "left"
   */
  openIcon?: 'right' | 'left' | 'menu';
}

export function PanelShell({
  title,
  badge,
  onClose,
  closeIcon = 'right',
  toolbar,
  footer,
  side = 'left',
  className,
  headerClassName,
  contentClassName,
  isOpen = true,
  onOpen,
  collapsedTitle,
  openIcon,
  children,
  ...props
}: PanelShellProps) {
  
  const Icon = closeIcon === 'right' ? ChevronRight : closeIcon === 'left' ? ChevronLeft : X;
  
  if (!isOpen) {
    const oIcon = openIcon || (side === 'left' ? 'right' : 'left');
    const OpenIcon = oIcon === 'right' ? ChevronRight : oIcon === 'menu' ? List : ChevronLeft;
    const defaultCollapsedTitle = typeof title === 'string' ? title.toUpperCase() : 'PANEL';
    const cTitle = collapsedTitle || defaultCollapsedTitle;

    return (
      <aside
        className={cn(
          'shrink-0 h-full z-10 transition-all duration-300 ease-in-out flex flex-col w-[34px] bg-background',
          side === 'left' ? 'border-r border-border' : 'border-l border-border'
        )}
      >
        <button
          type="button"
          onClick={onOpen}
          className="w-full h-full flex flex-col items-center py-2 gap-4 text-foreground-muted hover:text-foreground transition-colors group cursor-pointer focus:outline-none"
        >
          <div className="p-1 transition-all">
            <OpenIcon className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 uppercase">
            {cTitle}
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-background overflow-hidden',
        side === 'left' ? 'border-r border-border' : 'border-l border-border',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className={cn("shrink-0 flex items-center justify-between px-3 h-[40px] bg-background border-b border-border", headerClassName)}>
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
          {typeof title === 'string' ? (
            <h2 className="text-[12px] font-bold text-foreground-muted tracking-tight truncate">
              {title}
            </h2>
          ) : (
            title
          )}
          {badge && (
            <span className="shrink-0 text-[10px] font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded-md leading-none">
              {badge}
            </span>
          )}
        </div>
        
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-foreground-muted hover:bg-surface hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-danger"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Toolbar */}
      {toolbar && (
        <div className="shrink-0 flex flex-col bg-background">
          {toolbar}
        </div>
      )}

      {/* Content */}
      <div className={cn("flex-1 min-h-0 overflow-y-auto", contentClassName)}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="shrink-0 bg-background border-t border-border">
          {footer}
        </div>
      )}
    </aside>
  );
}
