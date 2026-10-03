'use client';
import React from 'react';
import { Hammer } from 'lucide-react';

export default function PlaceholderPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-background">
      <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-800 mb-4">
        <Hammer className="h-8 w-8 text-neutral-500" />
      </div>
      <h1 className="text-xl font-bold text-foreground mb-2">Modul Sedang Dikembangkan</h1>
      <p className="text-sm text-foreground-muted max-w-md">
        Halaman ini masih dalam tahap pengembangan dan akan segera tersedia pada pembaruan berikutnya.
      </p>
    </div>
  );
}
