'use client';

import React from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Avatar } from '../Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../Dropdown';
import type { UserInfo } from '@adatrack/types';

export interface UserMenuProps {
  user: UserInfo;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  labels?: {
    profile?: string;
    settings?: string;
    logout?: string;
  };
  className?: string;
}

export function UserMenu({
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  labels = {
    profile: 'Profil Saya',
    settings: 'Pengaturan',
    logout: 'Keluar',
  },
  className,
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-2 rounded-lg p-1.5 text-left text-sm transition-colors',
            'hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400',
            className,
          )}
          aria-label="Menu Pengguna"
        >
          <Avatar
            src={user.avatarUrl}
            initials={user.initials || user.name.slice(0, 2).toUpperCase()}
            alt={user.name}
            size="sm"
          />
          <div className="hidden md:flex flex-col min-w-0">
            <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
              {user.name}
            </span>
            {user.role && (
              <span className="text-[10px] text-foreground-muted truncate max-w-[120px]">
                {user.role}
              </span>
            )}
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-foreground-muted shrink-0 ml-0.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 p-2">
          <Avatar
            src={user.avatarUrl}
            initials={user.initials || user.name.slice(0, 2).toUpperCase()}
            alt={user.name}
            size="md"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-foreground truncate">{user.name}</span>
            {user.email && (
              <span className="text-[11px] text-foreground-muted truncate">{user.email}</span>
            )}
            {user.role && (
              <span className="text-[10px] text-primary font-medium mt-0.5">{user.role}</span>
            )}
          </div>
        </div>

        <div className="my-1 border-t border-border" />

        <DropdownMenuItem onClick={onProfileClick}>
          <User className="mr-2 h-4 w-4 text-foreground-muted" />
          <span>{labels.profile}</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onSettingsClick}>
          <Settings className="mr-2 h-4 w-4 text-foreground-muted" />
          <span>{labels.settings}</span>
        </DropdownMenuItem>

        <div className="my-1 border-t border-border" />

        <DropdownMenuItem onClick={onLogoutClick} destructive>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{labels.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
