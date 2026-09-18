'use client';

import React from 'react';
import { DetailShell } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { X, Pencil, Trash2, UserCircle, MapPin, Phone, Mail, CreditCard, FileText } from 'lucide-react';
import type { Personel } from '../types/personel';

interface PersonelViewLabels {
  title: string;
  close: string;
  tabInfo: string;
  actionEdit: string;
  actionDelete: string;
  name: string;
  type: string;
  nik: string;
  phone: string;
  email: string;
  address: string;
  card: string;
  status: string;
  notes: string;
  noCard: string;
  statusActive: string;
  statusInactive: string;
}

interface PersonelViewProps {
  personel: Personel | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  labels: PersonelViewLabels;
}

// â"€â"€â"€ Helper Components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function InfoRow({ icon: Icon, label, value, highlight }: {
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
        <p className={cn(
          'text-[13px] font-medium text-foreground truncate',
          highlight && 'text-warning-600 dark:text-warning-400 font-semibold',
        )}>
          {value ?? '-'}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1 mt-4 first:mt-0">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{title}</h3>
    </div>
  );
}

export function PersonelView({ personel, open, onClose, onEdit, onDelete, labels }: PersonelViewProps) {
  if (!personel) return null;

  const isActive = personel.status === 'ACTIVE';

  return (
    <DetailShell
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title={labels.title}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <SectionHeader icon={UserCircle} title="Informasi Personal" />
        <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
          <InfoRow icon={UserCircle} label={labels.name} value={personel.name} />
          <InfoRow icon={FileText} label={labels.type} value={personel.personelType} />
          <InfoRow icon={CreditCard} label={labels.nik} value={personel.nik} />
          <InfoRow icon={Phone} label={labels.phone} value={personel.phone} />
          <InfoRow icon={Mail} label={labels.email} value={personel.email} />
          <InfoRow icon={MapPin} label={labels.address} value={personel.address} />
          <InfoRow icon={CreditCard} label={labels.card} value={personel.cardId || labels.noCard} />
        </div>

        {personel.notes && (
          <>
            <SectionHeader icon={FileText} title={labels.notes} />
            <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3 py-2.5">
              <p className="text-[13px] text-foreground leading-relaxed">{personel.notes}</p>
            </div>
          </>
        )}
        <div className="h-4" />
      </div>
    </DetailShell>
  );
}
