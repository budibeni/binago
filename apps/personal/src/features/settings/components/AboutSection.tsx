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
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col items-center text-center gap-6 py-12">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-neutral-100 text-neutral-500 shrink-0">
        <Info className="w-10 h-10" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-neutral-900">BINAGO Personal</h3>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed">
          {s.description}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-neutral-50 rounded-full border border-neutral-100">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{s.version}</span>
        <span className="text-sm font-bold text-neutral-900">v1.0.0</span>
      </div>
    </div>
  );
}
