import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Dialog } from '../Dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../Dropdown';
import { FormFooter, type FormFooterProps } from './FormFooter';

export interface FormShellProps extends Omit<FormFooterProps, 'isSticky'> {
  /**
   * Presentation mode of the form.
   */
  mode: 'page' | 'dialog' | 'drawer';
  
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
}

export function FormShell({
  mode,
  open,
  onOpenChange,
  children,
  title,
  subtitle,
  leftContent,
  onCancel,
  cancelText,
  cancelProps,
  onSave,
  saveText,
  saveProps,
  isSubmitting,
  actions,
  className,
  ...footerProps
}: FormShellProps) {
  
  const [internalMode, setInternalMode] = React.useState(mode);
  const [internalOpen, setInternalOpen] = React.useState(open ?? true);

  React.useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

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

  const ModeToggleBtn = ({ className }: { className?: string }) => (
    <div className={cn("z-[100]", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            type="button"
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-all focus:outline-none"
            title="Ubah Mode Form"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 z-[100]">
          <DropdownMenuItem onClick={() => { setInternalMode('page'); setInternalOpen(true); }} className={internalMode === 'page' ? 'font-bold' : ''}>
            Page Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setInternalMode('drawer'); setInternalOpen(true); }} className={internalMode === 'drawer' ? 'font-bold' : ''}>
            Drawer Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setInternalMode('dialog'); setInternalOpen(true); }} className={internalMode === 'dialog' ? 'font-bold' : ''}>
            Dialog Mode
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
    cancelText,
    cancelProps,
    onSave,
    saveText,
    saveProps,
    isSubmitting,
    actions,
    ...footerProps,
  };

  if (internalMode === 'dialog') {
    return (
      <Dialog 
        open={internalOpen} 
        onOpenChange={handleOpenChange}
        title={typeof title === 'string' ? title : undefined}
        description={typeof subtitle === 'string' ? subtitle : undefined}
        hideCloseButton={true}
      >
        <div className={cn("flex flex-col max-h-[75vh] relative", className)}>
          <ModeToggleBtn className="absolute -top-12 right-[50px]" />
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 pb-4">
            {children}
          </div>
          <div className="-mx-6 -mb-6 mt-2">
            <FormFooter 
              {...formFooterProps} 
              isSticky={false} 
              className="border-t border-border/40 px-6"
            />
          </div>
        </div>
      </Dialog>
    );
  }

  // Both 'drawer' and 'page' mode use the same slide-in panel via Radix Dialog portal.
  // 'page' = full-width panel; 'drawer' = narrow right-side panel.
  const isPage = internalMode === 'page';

  return (
    <RadixDialog.Root open={internalOpen} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          className={cn(
            'fixed right-0 top-0 bottom-0 z-50 bg-background shadow-xl flex flex-col',
            'focus:outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            isPage
              ? 'left-0 lg:left-64 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right'
              : 'w-full max-w-md data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-5 md:p-6 border-b border-border/40 bg-neutral-50/50 dark:bg-neutral-950/50 shrink-0">
            <div className="flex flex-col gap-1">
              {title && (
                <RadixDialog.Title className="text-base font-semibold text-foreground leading-none">
                  {title}
                </RadixDialog.Title>
              )}
              {subtitle && (
                <RadixDialog.Description className="text-sm text-muted-foreground leading-tight">
                  {subtitle}
                </RadixDialog.Description>
              )}
            </div>
            <div className="flex items-center gap-[1px]">
              <ModeToggleBtn />
            </div>
          </div>

          {/* Scrollable content */}
          <div className={cn(
            "flex-1 overflow-y-auto p-5 md:p-6",
            isPage && "max-w-5xl mx-auto w-full"
          )}>
            {children}
          </div>

          {/* Footer */}
          <FormFooter 
            {...formFooterProps} 
            title={undefined}
            subtitle={undefined}
            isSticky={false} 
            className="border-t border-border/40 px-5 md:px-6 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]"
          />
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
