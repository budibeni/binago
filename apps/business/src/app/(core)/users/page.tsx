'use client';

import React, { useState } from 'react';
import { RolesFeature } from '../../../features/core/roles/RolesFeature';
import { Users, Shield } from 'lucide-react';

export default function UsersAccessPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('roles');

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900">
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
            Manajemen Pengguna
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
            Hak Akses (Roles)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'roles' ? (
          <RolesFeature />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-800 mb-4">
              <Users className="h-8 w-8 text-neutral-500" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Modul Pengguna</h2>
            <p className="text-neutral-500 max-w-md">
              Daftar pengguna aplikasi akan ditampilkan di sini. Anda dapat mengatur pengguna mana yang mendapat role spesifik.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
