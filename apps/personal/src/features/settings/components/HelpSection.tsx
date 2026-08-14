'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { cn } from '@adatrack/utils';

export function HelpSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.help;
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 md:p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 text-orange-500 shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">{s.title}</h3>
        </div>
      </div>

      <div className="flex flex-col border-t border-border">
        {s.faq.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border-b border-border last:border-0">
              <button
                onClick={() => toggle(index)}
                className="flex items-center justify-between w-full py-4 text-left hover:text-red-600 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground pr-4">{item.q}</span>
                <ChevronDown className={cn(
                  "w-5 h-5 text-foreground-subtle shrink-0 transition-transform",
                  isOpen && "rotate-180"
                )} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"
              )}>
                <p className="text-sm text-foreground-muted leading-relaxed">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
