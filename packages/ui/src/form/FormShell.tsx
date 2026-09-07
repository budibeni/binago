import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { MoreHorizontal, Layout, PanelRight, AppWindow, Maximize } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Dialog } from '../Dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../Dropdown';
import { FormFooter, type FormFooterProps } from './FormFooter';

export const FormShellContext = React.createContext<{ layout: string }>({ layout: 'default' });

export function useFormShell() {
  return React.useContext(FormShellContext);
}

export interface FormShellProps extends Omit<FormFooterProps, 'isSticky'> {
  /**
   * Presentation layout of the form.
   */
  layout?: 'default' | 'dialog' | 'drawer' | 'fullscreen';
  
  /**
   * Controlled open state (for dialog and drawer modes).
   */
  open?: boolean;
  
  /**
   * Callback when open state changes (for dialog and drawer modes).
   */
  onOpenChange?: (open: boolean) => void;
  
  /**
   * The form content.
   */
  children: React.ReactNode;
  
  /**
   * Optional onSubmit handler for the form wrapper.
   */
  onSubmit?: (e: React.FormEvent) => void;
  
  /**
   * Number of columns for the outer grid layout (1 or 2). Defaults to 1.
   */
  columns?: 1 | 2;
}

export function FormShell({
  layout = 'default',
  open,
  onOpenChange,
  children,
  title,
  subtitle,
  leftContent,
  isSubmitting,
  actions,
  className,
  onSubmit,
  columns = 1,
  onCancel,
  ...footerProps
}: FormShellProps) {
  
  const [internalLayout, setInternalLayout] = React.useState(layout);
  const [internalOpen, setInternalOpen] = React.useState(open ?? true);

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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleOpenChange(false);
    }
  };

  const LayoutToggleBtn = ({ className }: { className?: string }) => (
    <div className={cn("z-[9999]", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            type="button"
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-all focus:outline-none"
            title="Ubah Layout Form"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 z-[9999]">
          <DropdownMenuItem 
            onClick={() => { setInternalLayout('default'); setInternalOpen(true); }} 
            className={cn("flex items-center gap-2 text-xs", internalLayout === 'default' ? 'font-bold text-danger' : 'text-muted-foreground')}
          >
            <Layout className="w-3.5 h-3.5" />
            Default
          </DropdownMenuItem>
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

  const formFooterProps: FormFooterProps = {
    title,
    subtitle,
    leftContent,
    onCancel: handleCancel,
    isSubmitting,
    actions,
    ...footerProps,
  };

  const renderContent = () => {
    const gridClass = columns === 1 
      ? "flex flex-col gap-6" 
      : "grid grid-cols-1 gap-6 items-start group-data-[layout=default]/form:lg:grid-cols-2 group-data-[layout=fullscreen]/form:lg:grid-cols-2 group-data-[layout=dialog]/form:lg:grid-cols-2";

    const content = onSubmit ? (
      <form onSubmit={onSubmit} className={gridClass}>
        {children}
      </form>
    ) : (
      <div className={gridClass}>
        {children}
      </div>
    );

    return (
      <FormShellContext.Provider value={{ layout: internalLayout }}>
        {content}
      </FormShellContext.Provider>
    );
  };

  if (internalLayout === 'dialog') {
    return (
      <Dialog 
        open={internalOpen} 
        onOpenChange={handleOpenChange}
        title={typeof title === 'string' ? title : undefined}
        description={typeof subtitle === 'string' ? subtitle : undefined}
        hideCloseButton={true}
        className="max-w-2xl p-4 md:p-5"
      >
        <div className={cn("flex flex-col max-h-[80vh] relative group/form", className)} data-layout={internalLayout}>
          <LayoutToggleBtn className="absolute -top-10 md:-top-12 right-0" />
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 pb-4">
            {renderContent()}
          </div>
          <div className="-mx-4 md:-mx-5 -mb-4 md:-mb-5 mt-2">
            <FormFooter 
              {...formFooterProps}
              title={undefined}
              subtitle={undefined}
              isSticky={false} 
              className="border-t border-border/40 px-4 md:px-5"
            />
          </div>
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
        "flex flex-col w-full bg-neutral-50 dark:bg-neutral-950 duration-200 animate-in fade-in group/form",
        internalLayout === 'fullscreen' 
          ? "fixed inset-0 z-[9999] h-[100dvh]" 
          : "absolute inset-0 z-[999] h-full",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 py-1 md:px-4 md:py-1 border-b border-border bg-neutral-100 dark:bg-neutral-800 shrink-0 min-h-[32px]">
          {title ? (
            <h2 className="text-[13px] font-bold text-foreground leading-none truncate flex-1 pr-2">
              {title}
            </h2>
          ) : (
            <div className="flex-1" />
          )}
          {subtitle && (
            <p className="sr-only">
              {subtitle}
            </p>
          )}
          <div className="flex items-center shrink-0">
            <LayoutToggleBtn />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <div className="max-w-5xl mx-auto w-full">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <FormFooter 
          {...formFooterProps} 
          title={undefined}
          isSticky={false} 
          className="border-t border-border/40 px-5 md:px-6 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]"
        />
      </div>
    );
  }

  // 'drawer' layout uses slide-in panel via Radix Dialog portal.
  return (
    <RadixDialog.Root open={internalOpen} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-[999] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          data-layout={internalLayout}
          className={cn(
            'fixed right-0 top-0 bottom-0 z-[999] bg-neutral-50 dark:bg-neutral-950 shadow-xl flex flex-col group/form',
            'focus:outline-none w-full max-w-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 md:px-4 md:py-2 border-b border-border bg-neutral-100 dark:bg-neutral-800 shrink-0 min-h-[40px]">
            {title ? (
              <RadixDialog.Title className="text-[13px] font-bold text-foreground leading-none truncate flex-1 pr-2">
                {title}
              </RadixDialog.Title>
            ) : (
              <div className="flex-1" />
            )}
            {subtitle && (
              <RadixDialog.Description className="sr-only">
                {subtitle}
              </RadixDialog.Description>
            )}
            <div className="flex items-center shrink-0">
              <LayoutToggleBtn />
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5">
            {renderContent()}
          </div>

          {/* Footer */}
          <FormFooter 
            {...formFooterProps} 
            title={undefined}
            isSticky={false} 
            className="border-t border-border/40 px-4 md:px-5 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]"
          />
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
