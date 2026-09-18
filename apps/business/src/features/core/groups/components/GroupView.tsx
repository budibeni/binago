import React from 'react';
import { GroupData } from '../data/mockGroupsData';
import { DetailShell, InfoRow, SectionHeader } from '@adatrack/ui';
import { Users, Info, Hash } from 'lucide-react';

interface GroupViewProps {
  group: GroupData | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (group: GroupData) => void;
  onDelete?: (group: GroupData) => void;
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
