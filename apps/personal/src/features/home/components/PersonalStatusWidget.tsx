'use client';

import React from 'react';
import { Panel, PanelHeader, PanelBody, EmptyState, Badge } from '@binago/ui';
import { Car, Gauge, Clock } from 'lucide-react';
import { mockPersonalVehicleStatus } from '../data/mockHomeData';
import { usePersonalLocale } from '../../../components/PersonalShellLayout';
import { getTranslation } from '../../../i18n';
import type { PersonalVehicleStatus } from '../data/mockHomeData';

const STATUS_VARIANT: Record<PersonalVehicleStatus['status'], 'success' | 'info' | 'warning'> = {
  Bergerak: 'success',
  Parkir: 'info',
  Offline: 'warning',
};

export function PersonalStatusWidget() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);

  return (
    <Panel variant="bordered">
      <PanelHeader title={t.home.status} />
      <PanelBody className="divide-y divide-border">
        {mockPersonalVehicleStatus.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title={t.home.noStatus}
              description=""
            />
          </div>
        ) : (
          mockPersonalVehicleStatus.map((vehicle) => (
            <div key={vehicle.id} className="flex items-start gap-4 p-4">
              <div className="p-2 rounded-lg bg-surface border border-border text-foreground-muted shrink-0">
                <Car className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <span className="font-semibold text-sm text-foreground">{vehicle.name}</span>
                    <span className="ml-2 text-xs text-foreground-subtle font-mono">{vehicle.plate}</span>
                  </div>
                  <Badge variant={STATUS_VARIANT[vehicle.status]} className="text-[10px] px-1.5 py-0 shrink-0">
                    {vehicle.status}
                  </Badge>
                </div>
                <p className="text-xs text-foreground-muted mt-1 truncate">{vehicle.location}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-foreground-subtle">
                  {vehicle.speed > 0 && (
                    <span className="flex items-center gap-1">
                      <Gauge className="h-3 w-3" />
                      {vehicle.speed} km/j
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {vehicle.lastUpdate}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </PanelBody>
    </Panel>
  );
}
