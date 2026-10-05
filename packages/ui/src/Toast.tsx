'use client';

import React from 'react';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-neutral-900 group-[.toaster]:text-neutral-950 dark:group-[.toaster]:text-neutral-50 group-[.toaster]:border-neutral-200 dark:group-[.toaster]:border-neutral-800 group-[.toaster]:shadow-lg rounded-lg border font-sans',
          description: 'group-[.toast]:text-neutral-500 dark:group-[.toast]:text-neutral-400 group-data-[type=success]:text-success/80 group-data-[type=error]:text-danger/80',
          icon: 'group-data-[type=error]:text-danger group-data-[type=success]:text-success group-data-[type=warning]:text-warning-500 group-data-[type=info]:text-primary',
          success:
            'group-[.toaster]:bg-success/10 group-[.toaster]:border-success/20 group-[.toaster]:text-success',
          error:
            'group-[.toaster]:bg-danger/10 group-[.toaster]:border-danger/20 group-[.toaster]:text-danger',
          warning:
            'group-[.toaster]:bg-warning-500/10 group-[.toaster]:border-warning-500/20 group-[.toaster]:text-warning-500',
          info:
            'group-[.toaster]:bg-primary/10 group-[.toaster]:border-primary/20 group-[.toaster]:text-primary',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
