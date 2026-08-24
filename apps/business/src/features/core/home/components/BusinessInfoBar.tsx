'use client';

import React from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';
import { getTranslation } from '../../../../i18n';

export function BusinessInfoBar() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const h = t.home;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <Info className="h-4 w-4 text-neutral-400 shrink-0" />
        <span className="text-[12.5px] text-neutral-500 leading-snug">{h.infoBarText}</span>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-red-600 hover:text-red-700 shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
      >
        {h.learnMore}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
