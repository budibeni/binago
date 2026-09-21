import React from 'react';
import { GroupData } from '../data/mockGroupsData';
import { DetailShell } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { Users, Info, Hash } from 'lucide-react';

interface GroupViewProps {
  group: GroupData | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (group: GroupData) => void;
  onDelete?: (group: GroupData) => void;
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
          'text-[12px] font-medium text-foreground truncate',
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

export function GroupView({ group, open, onClose, onEdit, onDelete }: GroupViewProps) {
  if (!group) return null;

  return (
    <DetailShell
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title="Detail Grup"
      onEdit={onEdit ? () => onEdit(group) : undefined}
      onDelete={onDelete ? () => onDelete(group) : undefined}
    >
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <SectionHeader icon={Info} title="Informasi Grup" />
        <div className="rounded-lg border border-border/60 bg-neutral-50/30 dark:bg-neutral-900/20 px-3">
          <InfoRow icon={Hash} label="Nama Grup" value={group.name} />
          <InfoRow icon={Info} label="Deskripsi" value={group.description} />
          <InfoRow icon={Users} label="Jumlah Anggota" value={`${group.memberCount} unit`} />
        </div>
      </div>
    </DetailShell>
  );
}
