'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@binago/utils';
import { LanguageToggle, ThemeToggle, UserMenu } from '@binago/ui';
import { NotificationPopover } from '../features/notifications/components/NotificationPopover';
import type { NavItem, UserInfo, Locale } from '@binago/types';

export interface PersonalAppShellProps {
  navigation: NavItem[];
  user?: UserInfo;
  currentLocale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  currentTheme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  userMenuLabels?: {
    profile?: string;
    settings?: string;
    logout?: string;
  };
  children?: React.ReactNode;
  className?: string;
}

export function PersonalAppShell({
  navigation,
  user,
  currentLocale = 'id',
  onLocaleChange,
  currentTheme = 'light',
  onThemeChange,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  userMenuLabels,
  children,
  className,
}: PersonalAppShellProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex flex-col h-screen w-full overflow-hidden bg-surface text-foreground font-sans', className)}>
      {/* Top Header & Desktop Navigation */}
      <header className="shrink-0 sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <span className="text-black dark:text-white">BINA</span>
            <span className="text-red-600">GO</span>
          </Link>

          {/* Desktop Top Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                      : 'text-foreground-muted hover:bg-muted hover:text-foreground'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Tools (Notification, Language, Theme, User) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <NotificationPopover />

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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-surface pb-[60px] md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex h-[60px] items-center justify-around border-t border-border bg-background pb-safe pt-1 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              {Icon && (
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                    isActive ? 'bg-red-50 dark:bg-red-950/30' : 'bg-transparent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <span className="truncate px-1 max-w-full">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
