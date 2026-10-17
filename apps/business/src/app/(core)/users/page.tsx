'use client';

import React, { useState } from 'react';
import { UsersFeature } from '../../../features/core/users/UsersFeature';
import { RolesFeature } from '../../../features/core/roles/RolesFeature';
import { Users, Shield } from 'lucide-react';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getRolesTranslation, RolesLocale } from '../../../features/core/roles/i18n';

export default function UsersAccessPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const locale = useBusinessLocale();
  const t = getRolesTranslation(locale as RolesLocale);

  return (
    <div className="flex flex-col h-[calc(100dvh-52px)] bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 pt-4">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Users className="w-4 h-4" />
            {t.usersManagement}
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            {t.rolesAccess}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'roles' ? (
          <RolesFeature locale={locale as RolesLocale} />
        ) : (
          <UsersFeature />
        )}
      </div>
    </div>
  );
}
