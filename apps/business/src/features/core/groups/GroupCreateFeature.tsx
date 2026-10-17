'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { groupService } from '@/data/services';
import { GroupForm } from './components/GroupForm';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { toast } from '@adatrack/ui';
import type { Group } from './types';
import { getGroupTranslation } from './i18n';

export function GroupCreateFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getGroupTranslation(locale);

  const handleCancel = () => {
    router.push('/groups');
  };

  const handleSave = (data: Partial<Group>) => {
    groupService.createGroup(data);
    toast.success(t.toast.createSuccess);
    router.push('/groups');
  };

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col p-4 sm:p-6">
      <GroupForm
        group={null}
        open={true}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleCancel();
        }}
        layout="default"
        onCancel={handleCancel}
        onSave={handleSave}
        locale={locale}
      />
    </div>
  );
}
