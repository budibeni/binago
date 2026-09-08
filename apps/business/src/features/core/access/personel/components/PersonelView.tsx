'use client';

import React from 'react';
import { Dialog } from '@adatrack/ui';
import { X, Pencil, Trash2, UserCircle, MapPin, Phone, Mail, CreditCard, FileText } from 'lucide-react';
import { Button } from '@adatrack/ui';
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

export function PersonelView({ personel, open, onClose, onEdit, onDelete, labels }: PersonelViewProps) {
  if (!personel) return null;

  const isActive = personel.status === 'ACTIVE';

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()} title={labels.title}>
      <div className="flex-1 overflow-y-auto bg-slate-50/50 -mx-6 -mb-6 mt-4">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UserCircle className="w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-foreground">{personel.name}</h3>
              <span className="text-sm text-muted-foreground">{personel.personelType}</span>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isActive ? labels.statusActive : labels.statusInactive}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-danger" /> {labels.tabInfo}
              </h4>
              <div className="bg-surface border border-border/50 rounded-xl px-3.5 py-2.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-foreground-muted flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5"/> {labels.nik}</span>
                  <span className="font-medium text-foreground">{personel.nik || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {labels.phone}</span>
                  <span className="font-medium text-foreground">{personel.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {labels.email}</span>
                  <span className="font-medium text-foreground">{personel.email || '-'}</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1.5 border-t border-border/50 mt-1.5">
                  <span className="text-foreground-muted flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {labels.address}</span>
                  <span className="font-medium text-foreground leading-relaxed">{personel.address || '-'}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-border/50 mt-1.5">
                  <span className="text-foreground-muted flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5"/> {labels.card}</span>
                  <span className="font-medium text-foreground">{personel.cardId || labels.noCard}</span>
                </div>
                {personel.notes && (
                  <div className="flex flex-col gap-0.5 pt-1.5 border-t border-border/50 mt-1.5">
                    <span className="text-foreground-muted">{labels.notes}</span>
                    <span className="font-medium text-foreground leading-relaxed">{personel.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-background sticky bottom-0 z-10 flex gap-3 -mx-6 -mb-6 mt-auto">
        <Button variant="outline" className="flex-1 text-danger hover:text-danger hover:bg-danger/10 border-danger/20" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          {labels.actionDelete}
        </Button>
        <Button variant="primary" className="flex-1" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" />
          {labels.actionEdit}
        </Button>
      </div>
    </Dialog>
  );
}
