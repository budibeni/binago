import React from 'react';
import { DetailShell } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { CreditCard, FileText, UserCircle, Tag, Hash } from 'lucide-react';
import { Badge } from '@adatrack/ui';
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
function CompactField({ label, value, highlight, colSpan = 1 }: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  colSpan?: 1 | 2;
}) {
  return (
    <div className={cn('flex flex-col gap-1', colSpan === 2 && 'col-span-2')}>
      <span className="text-[10px] text-foreground-muted font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className={cn(
        'text-[12px] text-foreground leading-tight',
        highlight && 'text-danger font-semibold'
      )}>
        {value ?? '-'}
      </span>
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
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0 bg-neutral-50/50 dark:bg-neutral-900">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[15px] font-bold text-foreground tracking-widest uppercase truncate">
                {card.name}
              </h2>
              <Badge variant={card.status === 'ACTIVE' ? 'success' : 'danger'} dot>
                {t.status[card.status as keyof typeof t.status] ?? card.status}
              </Badge>
            </div>
            <p className="text-[12px] text-foreground-muted flex items-center gap-1.5 mt-0.5 truncate">
              <Hash className="w-3.5 h-3.5" />
              {card.uid}
            </p>
          </div>
        </div>

        <div className="px-4 pt-4 pb-4">
          <div className="flex flex-col gap-4">
            <SectionHeader icon={CreditCard} title="Informasi Kartu" />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-3">
              <CompactField label={t.table.colType} value={card.type} />
              <CompactField label={t.form.labelHolderType} value={card.holderType === 'DRIVER' ? t.form.valDriver : card.holderType === 'PERSONEL' ? t.form.valPersonel : t.form.valNone} />
              <CompactField label={t.table.colHolder} value={card.holderName || '-'} colSpan={2} />
              <CompactField 
                label={t.table.colPurpose}
                colSpan={2}
                value={
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(!card.purposes || card.purposes.length === 0) && '-'}
                    {card.purposes?.map(p => (
                      <span key={p} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-foreground-muted border border-border/60 uppercase tracking-wider">
                        {t.purpose[p as keyof typeof t.purpose] ?? p}
                      </span>
                    ))}
                  </div>
                } 
              />
            </div>

            {card.notes && (
              <>
                <SectionHeader icon={FileText} title="Catatan" />
                <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-3">
                  <CompactField label="Catatan" value={card.notes} colSpan={2} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="h-4" />
      </div>
    </DetailShell>
  );
}
