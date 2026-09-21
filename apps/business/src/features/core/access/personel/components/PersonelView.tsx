'use client';

import React from 'react';
import { DetailShell } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { X, Pencil, Trash2, UserCircle, MapPin, Phone, Mail, CreditCard, FileText } from 'lucide-react';
import { Badge } from '@adatrack/ui';
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
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0 bg-neutral-50/50 dark:bg-neutral-900">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[15px] font-bold text-foreground tracking-widest uppercase truncate">
                {personel.name}
              </h2>
              <Badge variant={isActive ? 'success' : 'danger'} dot>
                {isActive ? labels.statusActive : labels.statusInactive}
              </Badge>
            </div>
            <p className="text-[12px] text-foreground-muted flex items-center gap-1.5 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5" />
              {personel.address || '-'}
            </p>
          </div>
        </div>

        <div className="px-4 pt-4 pb-4">
          <div className="flex flex-col gap-4">
            <SectionHeader icon={UserCircle} title="Informasi Personal" />
            <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-3">
              <CompactField label={labels.type} value={personel.personelType} />
              <CompactField label={labels.nik} value={personel.nik} />
              <CompactField 
                label={labels.phone} 
                value={
                  <a 
                    href={`https://wa.me/${personel.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline decoration-border underline-offset-4 text-foreground"
                    title="Chat via WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#25D366] fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    {personel.phone}
                  </a>
                } 
              />
              <CompactField label={labels.card} value={personel.cardId || labels.noCard} />
              <CompactField label={labels.email} value={personel.email} colSpan={2} />
              <CompactField label={labels.address} value={personel.address} colSpan={2} />
            </div>

            {personel.notes && (
              <>
                <SectionHeader icon={FileText} title={labels.notes} />
                <div className="rounded-lg border border-border bg-neutral-50/30 dark:bg-neutral-900 px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-3">
                  <CompactField label={labels.notes} value={personel.notes} colSpan={2} />
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
