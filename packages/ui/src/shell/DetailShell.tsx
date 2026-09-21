import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X, Pencil, Trash2, MoreHorizontal, Layout, PanelRight, AppWindow, Maximize } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import { useUIConfig } from '../providers/UIProvider';
import { Dialog } from '../Dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../Dropdown';

export const DetailShellContext = React.createContext<{ layout: string }>({ layout: 'drawer' });

export function useDetailShell() {
  return React.useContext(DetailShellContext);
}

export interface DetailShellProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Title of the detail shell. Defaults to "Detail" */
  title?: React.ReactNode;
  /** Content of the detail shell */
  children?: React.ReactNode;
  /** Additional class name for the content container */
  className?: string;
  
  /** Edit action handler. If provided, the Edit button will be rendered. */
  onEdit?: () => void;
  /** Label for the Edit button */
  editLabel?: string;
  
  /** Delete action handler. If provided, the Delete button will be rendered. */
  onDelete?: () => void;
  /** Label for the Delete button */
  deleteLabel?: string;

  /** Presentation layout */
  layout?: 'default' | 'dialog' | 'drawer' | 'fullscreen';
}

export function DetailShell({
  open,
  onOpenChange,
  title,
  children,
  className,
  onEdit,
  editLabel,
  onDelete,
  deleteLabel,
  layout = 'drawer',
}: DetailShellProps) {
  const uiConfig = useUIConfig();
  
  const finalTitle = title ?? uiConfig.detailTitle;
  const finalEditLabel = editLabel ?? uiConfig.editText;
  const finalDeleteLabel = deleteLabel ?? uiConfig.deleteText;

  const [internalLayout, setInternalLayout] = React.useState(layout);
  const [internalOpen, setInternalOpen] = React.useState(open);

  React.useEffect(() => {
    if (layout) setInternalLayout(layout);
  }, [layout]);

  React.useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setInternalOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const LayoutToggleBtn = ({ className }: { className?: string }) => (
    <div className={cn("z-[9999]", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-foreground transition-colors"
            title="Ubah Layout"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 z-[9999]">
          <DropdownMenuItem
            onClick={() => { setInternalLayout('drawer'); setInternalOpen(true); }}
            className={cn("flex items-center gap-2 text-xs", internalLayout === 'drawer' ? 'font-bold text-danger' : 'text-muted-foreground')}
          >
            <PanelRight className="w-3.5 h-3.5" />
            Drawer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => { setInternalLayout('dialog'); setInternalOpen(true); }}
            className={cn("flex items-center gap-2 text-xs", internalLayout === 'dialog' ? 'font-bold text-danger' : 'text-muted-foreground')}
          >
            <AppWindow className="w-3.5 h-3.5" />
            Dialog
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => { setInternalLayout('fullscreen'); setInternalOpen(true); }}
            className={cn("flex items-center gap-2 text-xs", internalLayout === 'fullscreen' ? 'font-bold text-danger' : 'text-muted-foreground')}
          >
            <Maximize className="w-3.5 h-3.5" />
            Fullscreen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const CloseBtn = () => (
    <button
      type="button"
      onClick={() => handleOpenChange(false)}
      className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-foreground transition-colors"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Tutup</span>
    </button>
  );

  const renderFooter = () => {
    if (!onEdit && !onDelete) return null;
    return (
      <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-background border-t border-border shadow-sm shrink-0">
        {onEdit ? (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onEdit} 
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            className="h-7 text-xs px-3 bg-background"
          >
            {finalEditLabel}
          </Button>
        ) : <div />}

        {onDelete && (
          <Button 
            size="sm"
            variant="outline" 
            onClick={onDelete} 
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            className="h-7 text-xs px-3 text-danger border-danger/30 hover:bg-danger/10 hover:text-danger focus-visible:ring-danger"
          >
            {finalDeleteLabel}
          </Button>
        )}
      </div>
    );
  };

  const renderContent = () => (
    <DetailShellContext.Provider value={{ layout: internalLayout }}>
      {children}
    </DetailShellContext.Provider>
  );

  if (internalLayout === 'dialog') {
    return (
      <Dialog 
        open={internalOpen} 
        onOpenChange={handleOpenChange}
        hideCloseButton={true}
        className="max-w-3xl p-0 overflow-hidden"
      >
        <div className={cn("flex flex-col max-h-[85vh] w-full group/detail", className)} data-layout={internalLayout}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-neutral-100 dark:bg-neutral-800 shrink-0 min-h-[40px]">
            <RadixDialog.Title className="text-[13px] font-bold text-foreground leading-none truncate flex-1 pr-2">
              {finalTitle}
            </RadixDialog.Title>
            <div className="flex items-center shrink-0 gap-1">
              <LayoutToggleBtn />
              <CloseBtn />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 flex flex-col">
            {renderContent()}
          </div>
          {renderFooter()}
        </div>
      </Dialog>
    );
  }

  if (internalLayout === 'fullscreen' || internalLayout === 'default') {
    if (!internalOpen) return null;
    return (
      <div
        data-layout={internalLayout}
        className={cn(
          "flex flex-col w-full bg-neutral-50 dark:bg-neutral-950 duration-200 animate-in fade-in group/detail",
          internalLayout === 'fullscreen'
            ? "fixed inset-0 z-[9999] h-[100dvh]"
            : "absolute inset-0 z-[999] h-full",
          className
        )}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-neutral-100 dark:bg-neutral-800 shrink-0 min-h-[40px]">
          <h2 className="text-[13px] font-bold text-foreground leading-none truncate flex-1 pr-2">
            {finalTitle}
          </h2>
          <div className="flex items-center shrink-0 gap-1">
            <LayoutToggleBtn />
            <CloseBtn />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50 dark:bg-neutral-950">
          <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
            {renderContent()}
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  }

  // drawer
  return (
    <RadixDialog.Root open={internalOpen} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-[999] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          data-layout={internalLayout}
          className={cn(
            'fixed right-0 top-0 bottom-0 z-[999] bg-neutral-50 dark:bg-neutral-950 shadow-xl flex flex-col group/detail',
            'focus:outline-none w-full max-w-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right',
            className
          )}
        >
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 md:px-4 md:py-2 border-b border-border bg-neutral-100 dark:bg-neutral-800 shrink-0 min-h-[40px]">
            <RadixDialog.Title className="text-[13px] font-bold text-foreground leading-none truncate flex-1 pr-2">
              {finalTitle}
            </RadixDialog.Title>
            <div className="flex items-center shrink-0 gap-1">
              <LayoutToggleBtn />
              <CloseBtn />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col">
            {renderContent()}
          </div>
          {renderFooter()}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

export interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

export function InfoRow({ icon: Icon, label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <div className={cn(
          'text-[13px] font-medium text-foreground truncate',
          highlight && 'text-warning-600 dark:text-warning-400 font-semibold',
        )}>
          {value ?? '-'}
        </div>
      </div>
    </div>
  );
}

export interface SectionHeaderProps {
  icon: React.ElementType;
  title: React.ReactNode;
}

export function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-1 mt-4 first:mt-0">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{title}</h3>
    </div>
  );
}
