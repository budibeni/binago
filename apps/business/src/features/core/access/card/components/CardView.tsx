import React from 'react';
import { DetailShell } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { CreditCard, FileText, UserCircle, Tag } from 'lucide-react';
import type { CardModel } from '../types/card';
import type { getCardTranslation } from '../i18n';

type CardTranslation = ReturnType<typeof getCardTranslation>;

interface CardViewProps {
  card: CardModel | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (card: CardModel) => void;
  onDelete?: (card: CardModel) => void;
  t: CardTranslation;
}

// â"€â"€â"€ Helper Components â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function InfoRow({ icon: Icon, label, value, highlight }: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode | null | undefined;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
      <div className="mt-0.5 p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <div className={cn(
          'text-[13px] font-medium text-foreground',
          highlight && 'text-warning-600 dark:text-warning-400 font-semibold',
        )}>
          {value ?? '-'}
        </div>
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

export function CardView({ card, open, onClose, onEdit, onDelete, t }: CardViewProps) {
  if (!card) return null;

  return (
    <DetailShell
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title="Detail Kartu"
      onEdit={onEdit ? () => onEdit(card) : undefined}
    >
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <SectionHeader icon={CreditCard} title="Informasi Kartu" />
        <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
          <InfoRow icon={CreditCard} label={t.table.colCard} value={card.name} />
          <InfoRow icon={Tag} label={t.table.colType} value={card.type} />
          <InfoRow 
            icon={FileText} 
            label={t.table.colStatus} 
            value={t.status[card.status as keyof typeof t.status] ?? card.status} 
          />
          <InfoRow icon={UserCircle} label={t.table.colHolder} value={card.holderName || '-'} />
        </div>

        {card.notes && (
          <>
            <SectionHeader icon={FileText} title="Catatan" />
            <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3 py-2.5">
              <p className="text-[13px] text-foreground leading-relaxed">{card.notes}</p>
            </div>
          </>
        )}
        <div className="h-4" />
      </div>
    </DetailShell>
  );
}
