'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';

export function AboutSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.about;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center text-center gap-6 py-12">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-elevated text-foreground-muted shrink-0">
        <Info className="w-10 h-10" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-foreground">BINAGO Personal</h3>
        <p className="text-sm text-foreground-muted mt-2 max-w-sm mx-auto leading-relaxed">
          {s.description}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-surface-elevated rounded-full border border-border">
        <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{s.version}</span>
        <span className="text-sm font-bold text-foreground">v1.0.0</span>
      </div>
    </div>
  );
}
