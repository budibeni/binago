'use client';

import React from 'react';
import { cn } from '@binago/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { BreadcrumbItem } from './Breadcrumb';
import type { NavGroup, UserInfo, Locale } from '@binago/types';

export interface AppShellProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  navigation: NavGroup[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  breadcrumbItems?: BreadcrumbItem[];
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
  headerRightSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AppShell({
  brandName = 'BINAGO',
  brandLogo,
  navigation,
  currentPath = '/',
  onNavigate,
  breadcrumbItems = [],
  user,
  currentLocale = 'id',
  onLocaleChange,
  currentTheme = 'light',
  onThemeChange,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  userMenuLabels,
  headerRightSlot,
  footerSlot,
  children,
  className,
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className={cn('flex h-screen w-full overflow-hidden bg-surface text-foreground font-sans', className)}>
      {/* Sidebar Navigation */}
      <Sidebar
        brandName={brandName}
        brandLogo={brandLogo}
        navigation={navigation}
        currentPath={currentPath}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header
          breadcrumbItems={breadcrumbItems}
          user={user}
          currentLocale={currentLocale}
          onLocaleChange={onLocaleChange}
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          onMobileMenuToggle={() => setMobileOpen(true)}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onLogoutClick={onLogoutClick}
          userMenuLabels={userMenuLabels}
          rightSlot={headerRightSlot}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </main>

        {/* Optional Footer */}
        {footerSlot && (
          <footer className="shrink-0 border-t border-border bg-background px-4 py-2 text-xs text-foreground-muted">
            {footerSlot}
          </footer>
        )}
      </div>
    </div>
  );
}
