'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';
import { UserMenu } from './UserMenu';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import type { UserInfo, Locale } from '@adatrack/types';

export interface HeaderProps {
  breadcrumbItems?: BreadcrumbItem[];
  user?: UserInfo;
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  currentTheme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onMobileMenuToggle?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  userMenuLabels?: {
    profile?: string;
    settings?: string;
    logout?: string;
  };
  rightSlot?: React.ReactNode;
  className?: string;
}

export function Header({
  breadcrumbItems = [],
  user,
  currentLocale = 'id',
  onLocaleChange,
  currentTheme = 'light',
  onThemeChange,
  onMobileMenuToggle,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  userMenuLabels,
  rightSlot,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-[52px] w-full items-center justify-between border-b border-border bg-background px-4 shadow-sm',
        className,
      )}
    >
      {/* Left Area: Mobile hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {onMobileMenuToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="lg:hidden p-1.5 h-8 w-8"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        )}

        <div className="min-w-0">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Right Area: LanguageToggle + ThemeToggle + RightSlot + UserMenu (NO Global Search) */}
      <div className="flex items-center gap-1.5 shrink-0">
        {rightSlot}

        {onLocaleChange && (
          <LanguageToggle
            currentLocale={currentLocale}
            onLocaleChange={onLocaleChange}
          />
        )}

        {onThemeChange && (
          <ThemeToggle
            theme={currentTheme}
            onThemeChange={onThemeChange}
          />
        )}

        {user && (
          <div className="ml-1 pl-1 border-l border-border">
            <UserMenu
              user={user}
              onProfileClick={onProfileClick}
              onSettingsClick={onSettingsClick}
              onLogoutClick={onLogoutClick}
              labels={userMenuLabels}
            />
          </div>
        )}
      </div>
    </header>
  );
}
