'use client';

import React from 'react';
import { Button, Dialog } from '@adatrack/ui';
import type { Customer } from '../types/customer';

interface CustomerDeleteDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
  labels: {
    confirmDelete: string;
    confirmDeleteDesc: string;
    cancel: string;
    confirm: string;
  };
}

export function CustomerDeleteDialog({
  customer,
  open,
  onOpenChange,
  onConfirm,
  labels,
}: CustomerDeleteDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={labels.confirmDelete}>
      <div className="py-2">
        <p className="text-[13px] text-foreground-muted">
          {labels.confirmDeleteDesc} <br />
          <strong className="text-foreground">{customer.name}</strong> ({customer.code})
        </p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {labels.cancel}
        </Button>
        <Button variant="destructive" onClick={() => onConfirm(customer.id)}>
          {labels.confirm}
        </Button>
      </div>
    </Dialog>
  );
}
