'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { groupService } from '@/data/services';
import { GroupForm } from './components/GroupForm';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { toast } from '@adatrack/ui';
import type { Group } from './types';
import { getGroupTranslation } from './i18n';

export function GroupEditFeature({ id }: { id: string }) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getGroupTranslation(locale);

  const group = React.useMemo(() => groupService.getGroupById(id), [id]);

  const handleCancel = () => {
    router.push('/groups');
  };

  const handleSave = (data: Partial<Group>) => {
    groupService.updateGroup(id, data);
    toast.success(t.toast.updateSuccess);
    router.push('/groups');
  };

  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50/80 dark:bg-neutral-900/40 text-muted-foreground">
        {locale === 'en' ? 'Group not found.' : 'Grup tidak ditemukan.'}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col p-4 sm:p-6">
      <GroupForm
        group={group}
        open={true}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleCancel();
        }}
        layout="default"
        onCancel={handleCancel}
        onSave={handleSave}
        locale={locale}
        defaultType={group.type}
      />
    </div>
  );
}
