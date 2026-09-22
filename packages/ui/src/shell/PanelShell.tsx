import React from 'react';
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, X, List, PanelLeft, PanelRight, PanelTop, PanelBottom, MoreHorizontal, EyeOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../Dropdown';
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
   * @default "right" for left side, "left" for right side, etc.
   */
  closeIcon?: 'right' | 'left' | 'up' | 'down' | 'x';

  /**
   * Optional toolbar rendered below the header (e.g. search, tabs)
   */
  toolbar?: React.ReactNode;

  /**
   * Optional footer rendered at the bottom of the panel
   */
  footer?: React.ReactNode;

  /**
   * Which side the panel is on. Determines where the border is placed and collapsed orientation.
   * @default "left"
   */
  side?: 'left' | 'right' | 'top' | 'bottom';

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
   * Title text shown when the panel is collapsed.
   */
  collapsedTitle?: string;

  /**
   * Icon to show on the collapsed button.
   */
  openIcon?: 'right' | 'left' | 'up' | 'down' | 'menu';
  /**
   * If provided, shows a layout toggler in the header to switch the panel's side
   */
  onSideChange?: (side: 'left' | 'right' | 'top' | 'bottom') => void;
  
  /**
   * Labels for i18n support
   */
  labels?: {
    layoutToggleTitle?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    hide?: string;
  };
}

export function PanelShell({
  title,
  badge,
  onClose,
  closeIcon,
  toolbar,
  footer,
  side = 'left',
  className,
  headerClassName,
  contentClassName,
  labels,
  isOpen = true,
  onOpen,
  collapsedTitle,
  openIcon,
  onSideChange,
  children,
  ...props
}: PanelShellProps) {

  const defaultCloseIcon = side === 'left' ? 'left' :
    side === 'right' ? 'right' :
      side === 'top' ? 'up' : 'down';
  const cIcon = closeIcon || defaultCloseIcon;
  const Icon = cIcon === 'right' ? ChevronRight :
    cIcon === 'left' ? ChevronLeft :
      cIcon === 'up' ? ChevronUp :
        cIcon === 'down' ? ChevronDown : X;

  if (!isOpen) {
    const defaultOpenIcon = side === 'left' ? 'right' :
      side === 'right' ? 'left' :
        side === 'top' ? 'down' : 'up';
    const oIcon = openIcon || defaultOpenIcon;
    const OpenIcon = oIcon === 'right' ? ChevronRight :
      oIcon === 'left' ? ChevronLeft :
        oIcon === 'up' ? ChevronUp :
          oIcon === 'down' ? ChevronDown :
            oIcon === 'menu' ? List : ChevronLeft;

    const defaultCollapsedTitle = typeof title === 'string' ? title.toUpperCase() : 'PANEL';
    const cTitle = collapsedTitle || defaultCollapsedTitle;

    return (
      <aside
        className={cn(
          'shrink-0 z-10 transition-all duration-300 ease-in-out flex bg-background',
          side === 'left' || side === 'right' ? 'flex-col w-[34px] h-full' : 'flex-row h-[34px] w-full',
          side === 'left' ? 'border-r border-border' :
            side === 'right' ? 'border-l border-border' :
              side === 'top' ? 'border-b border-border' : 'border-t border-border'
        )}
      >
        <button
          type="button"
          onClick={onOpen}
          className={cn(
            "w-full h-full flex items-center gap-4 text-foreground-muted hover:text-foreground transition-colors group cursor-pointer focus:outline-none",
            side === 'left' || side === 'right' ? 'flex-col justify-center py-2' : 'flex-row justify-between px-4'
          )}
        >
          {side === 'left' || side === 'right' ? (
            <>
              <div className="p-1 transition-all shrink-0">
                <OpenIcon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180">
                {cTitle}
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] font-bold tracking-widest uppercase">
                {cTitle}
              </span>
              <div className="p-1 transition-all shrink-0">
                <OpenIcon className="h-4 w-4" />
              </div>
            </>
          )}
        </button>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'flex flex-col bg-background overflow-hidden',
        side === 'left' || side === 'right' ? 'h-full' : 'w-full',
        side === 'left' ? 'border-r border-border' :
          side === 'right' ? 'border-l border-border' :
            side === 'top' ? 'border-b border-border' : 'border-t border-border',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className={cn("shrink-0 flex items-center justify-between px-3 h-[26px] bg-background relative z-10 -mb-2", headerClassName)}>
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

        <div className="flex items-center gap-1 shrink-0">
          {onSideChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-foreground-muted hover:bg-surface hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                  title={labels?.layoutToggleTitle || "Ubah Posisi Panel"}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 z-[9999]">
                <DropdownMenuItem onClick={() => onSideChange('top')} className={cn("text-xs", side === 'top' ? 'font-bold text-primary' : 'text-muted-foreground')}>
                  <PanelTop className="w-3.5 h-3.5 mr-2" /> {labels?.top || 'Atas'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSideChange('right')} className={cn("text-xs", side === 'right' ? 'font-bold text-primary' : 'text-muted-foreground')}>
                  <PanelRight className="w-3.5 h-3.5 mr-2" /> {labels?.right || 'Kanan'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSideChange('bottom')} className={cn("text-xs", side === 'bottom' ? 'font-bold text-primary' : 'text-muted-foreground')}>
                  <PanelBottom className="w-3.5 h-3.5 mr-2" /> {labels?.bottom || 'Bawah'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSideChange('left')} className={cn("text-xs", side === 'left' ? 'font-bold text-primary' : 'text-muted-foreground')}>
                  <PanelLeft className="w-3.5 h-3.5 mr-2" /> {labels?.left || 'Kiri'}
                </DropdownMenuItem>
                {onClose && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onClose} className="text-xs text-danger focus:text-danger focus:bg-danger/10">
                      <EyeOff className="w-3.5 h-3.5 mr-2" /> {labels?.hide || 'Sembunyikan'}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
      </div>

      {/* Toolbar */}
      {toolbar && (
        <div className="shrink-0 flex flex-col bg-background">
          {toolbar}
        </div>
      )}

      {/* Content */}
      <div className={cn(
        side === 'left' || side === 'right' ? "flex-1 min-h-0 overflow-y-auto" : "flex-none overflow-visible",
        contentClassName
      )}>
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
