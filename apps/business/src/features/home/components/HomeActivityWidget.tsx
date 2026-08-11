'use client';

import React from 'react';
import { Panel, PanelHeader, PanelBody, Alert, Badge } from '@binago/ui';
import { mockFleetAttention } from '../data/mockHomeData';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getTranslation } from '../../../i18n';

export function HomeActivityWidget() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);

  return (
    <Panel variant="bordered">
      <PanelHeader title={t.home.attention} />
      <PanelBody className="flex flex-col gap-3 p-4">
        {mockFleetAttention.map((item) => {
          let variant: 'danger' | 'warning' | 'info' = 'info';
          if (item.type === 'maintenance') variant = 'warning';
          if (item.type === 'offline' || item.type === 'alert') variant = 'danger';

          return (
            <Alert key={item.id} variant={variant} className="relative">
              <div className="flex justify-between items-start gap-4 w-full">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                  <p className="text-xs">{item.description}</p>
                </div>
                <Badge variant="default" className="shrink-0 text-[10px] bg-background/50 border-transparent">
                  {item.time}
                </Badge>
              </div>
            </Alert>
          );
        })}

        {mockFleetAttention.length === 0 && (
          <div className="text-center py-6 text-sm text-foreground-muted">
            {t.home.noAttention}
          </div>
        )}
      </PanelBody>
    </Panel>
  );
}
