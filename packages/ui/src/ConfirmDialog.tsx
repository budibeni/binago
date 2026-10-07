'use client';

import React from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Trash2, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { cn } from '@adatrack/utils';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  variant = 'danger',
  isLoading = false,
  icon,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  const getIconColor = () => {
    if (variant === 'danger') return 'text-danger';
    if (variant === 'warning') return 'text-warning';
    return 'text-primary';
  };

  const getBgColor = () => {
    if (variant === 'danger') return 'bg-danger/10';
    if (variant === 'warning') return 'bg-warning/10';
    return 'bg-primary/10';
  };

  const getConfirmButtonClass = () => {
    if (variant === 'danger') return 'bg-danger text-white hover:bg-danger-600 border-transparent';
    if (variant === 'warning') return 'bg-warning text-white hover:bg-warning/90 border-transparent';
    return 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent';
  };

  const getIcon = () => {
    if (icon) return icon;
    if (variant === 'danger') return <Trash2 className="w-6 h-6" strokeWidth={1.5} />;
    if (variant === 'warning') return <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />;
    return <Check className="w-6 h-6" strokeWidth={1.5} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} hideCloseButton>
      <div className="flex flex-col items-center text-center px-2 pt-2 pb-1">
        
        {/* Compact Circular Icon Wrapper */}
        <div className="mb-3 flex flex-col items-center justify-center">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            getBgColor(),
            getIconColor()
          )}>
            {getIcon()}
          </div>
        </div>
        
        <h3 className="text-[17px] font-bold text-foreground mb-1.5">{title}</h3>
        
        {description && (
          <div className="text-[13px] text-foreground-muted leading-snug mb-5 max-w-[90%]">
            {description}
          </div>
        )}
        
        <div className="flex w-full gap-2 mt-1">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 h-9 text-[13px] font-medium text-foreground-muted border-border hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            {cancelLabel}
          </Button>
          
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className={cn(
              "flex-1 h-9 text-[13px] font-medium transition-all active:scale-[0.98]",
              getConfirmButtonClass()
            )}
            leftIcon={isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : undefined}
          >
            {isLoading ? 'Proses...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
