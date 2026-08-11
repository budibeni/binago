'use client';

import React from 'react';
import { ContentHeader } from '@binago/ui';
import { PersonalMetricCards } from './PersonalMetricCards';
import { PersonalShortcutGrid } from './PersonalShortcutGrid';
import { PersonalStatusWidget } from './PersonalStatusWidget';
import { usePersonalLocale } from '../../../components/PersonalShellLayout';
import { getTranslation } from '../../../i18n';

export function PersonalHomePage() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 md:p-6 w-full">
      <ContentHeader
        title={`${t.home.greeting}, Budi Beni`}
        subtitle={t.home.subtitle}
      />

      <section aria-label={t.home.title}>
        <PersonalMetricCards />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <section className="lg:col-span-3 flex flex-col gap-4" aria-label={t.home.shortcuts}>
          <h2 className="text-lg font-semibold text-foreground">{t.home.shortcuts}</h2>
          <PersonalShortcutGrid />
        </section>

        <section className="lg:col-span-2 flex flex-col gap-4" aria-label={t.home.status}>
          <h2 className="text-lg font-semibold text-foreground">{t.home.status}</h2>
          <PersonalStatusWidget />
        </section>
      </div>
    </div>
  );
}
