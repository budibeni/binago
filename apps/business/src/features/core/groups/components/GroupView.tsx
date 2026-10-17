'use client';

import React from 'react';
import type { Group } from '../types';
import type { Locale } from '@adatrack/types';
import { DetailShell } from '@adatrack/ui';
import { cn, formatNumber } from '@adatrack/utils';
import { Users, Info, Hash, Layers } from 'lucide-react';
import { getGroupTranslation } from '../i18n';

interface GroupViewProps {
  group: Group | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (group: Group) => void;
  onDelete?: (group: Group) => void;
  locale?: Locale;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <p
          className={cn(
            'text-[12px] font-medium text-foreground truncate',
            highlight && 'text-primary font-semibold',
          )}
        >
          {value ?? '-'}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1.5 mt-4 first:mt-0">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{title}</h3>
    </div>
  );
}

export function GroupView({ group, open, onClose, onEdit, onDelete, locale = 'id' }: GroupViewProps) {
  if (!group) return null;

  const t = getGroupTranslation(locale);
  const viewT = t.view;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vehicle':
        return t.tabs.vehicles;
      case 'driver':
        return t.tabs.drivers;
      case 'geofence':
        return t.tabs.geofences;
      case 'route':
        return t.tabs.routes;
      default:
        return type;
    }
  };

  return (
    <DetailShell
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={viewT.title}
      onEdit={onEdit ? () => onEdit(group) : undefined}
      onDelete={onDelete ? () => onDelete(group) : undefined}
    >
      <div id="group-view-header" className="flex-1 overflow-y-auto px-4 py-3">
        <div id="group-view-quick-actions" className="mb-2" />
        <SectionHeader icon={Info} title={viewT.sectionInfo} />
        <div
          id="group-view-card-info"
          className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3"
        >
          <InfoRow icon={Hash} label={viewT.name} value={group.name} highlight />
          <InfoRow icon={Layers} label={viewT.type} value={getTypeLabel(group.type)} />
          <InfoRow icon={Info} label={viewT.description} value={group.description} />
          <InfoRow
            icon={Users}
            label={viewT.memberCount}
            value={`${formatNumber(group.memberCount)} ${t.table.unit}`}
          />
        </div>
      </div>
    </DetailShell>
  );
}
