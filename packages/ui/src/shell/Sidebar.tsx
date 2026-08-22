'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge } from '../Badge';
import { AdatrackLogo } from '../patterns';
import type { NavGroup, NavItem } from '@adatrack/types';

export interface SidebarProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  navigation: NavGroup[];
  bottomNavigation?: NavItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Sidebar({
  brandName = 'ADATRACK',
  brandLogo,
  navigation,
  bottomNavigation = [],
  currentPath = '/',
  onNavigate,
  collapsed = false,
  onCollapsedChange,
  mobileOpen = false,
  onMobileOpenChange,
  className,
}: SidebarProps) {
  // Handle keyboard Escape to close mobile drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        onMobileOpenChange?.(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onMobileOpenChange]);

  const handleItemClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item.href);
    }
    if (mobileOpen) {
      onMobileOpenChange?.(false);
    }
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const isActive =
        currentPath === item.href ||
        (item.href !== '/' && currentPath.startsWith(item.href));
      const Icon = item.icon;

      return (
        <a
          key={item.id}
          href={item.href}
          onClick={(e) => handleItemClick(e, item)}
          className={cn(
            'group flex items-center gap-2.5 rounded-md px-3 py-[7px] text-[13px] font-medium transition-colors duration-100',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400',
            isActive
              ? 'bg-primary text-primary-foreground dark:bg-surface-elevated dark:text-foreground shadow-sm'
              : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground',
            item.disabled && 'pointer-events-none opacity-40',
            collapsed && 'justify-center px-2',
          )}
          title={item.label}
          aria-current={isActive ? 'page' : undefined}
          aria-label={item.label}
        >
          {Icon && (
            <Icon
              className={cn(
                'h-[17px] w-[17px] shrink-0 transition-colors',
                isActive ? 'text-red-500' : 'text-foreground-muted group-hover:text-foreground',
              )}
            />
          )}

          {!collapsed && (
            <span className="flex-1 truncate leading-tight">{item.label}</span>
          )}

          {!collapsed && item.badge !== undefined && (
            <Badge
              variant={item.badgeVariant || 'default'}
              className={cn(
                'ml-auto text-[10px] px-1.5 py-0 h-4',
                isActive && 'bg-white/20 text-white border-white/30',
              )}
            >
              {item.badge}
            </Badge>
          )}
        </a>
      );
    });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* â"€â"€ Brand Header â"€â"€ */}
      <div
        className={cn(
          'relative flex h-[52px] shrink-0 items-center border-b border-border',
          collapsed ? 'justify-center px-3' : 'justify-center px-4',
        )}
      >
        {/* Logo / Brand / Expand Button */}
        <div className="flex items-center gap-2 min-w-0">
          {collapsed && onCollapsedChange ? (
            <button
              type="button"
              onClick={() => onCollapsedChange(!collapsed)}
              className="flex items-center justify-center rounded-md p-2 text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors"
              aria-label="Perluas Sidebar"
              title="Perluas Sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : brandLogo ? (
            brandLogo
          ) : brandName === 'ADATRACK' ? (
            <AdatrackLogo className="text-[26px]" />
          ) : (
            <span className="font-extrabold tracking-tight text-3xl">
              <span className="text-foreground">{brandName}</span>
            </span>
          )}
        </div>

        {/* Close (mobile) */}
        <button
          type="button"
          onClick={() => onMobileOpenChange?.(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 lg:hidden rounded-md p-1 text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors"
          aria-label="Tutup Menu"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Collapse toggle (desktop) */}
        {!collapsed && onCollapsedChange && (
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center rounded-md p-1.5 text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors"
            aria-label="Ciutkan Sidebar"
            title="Ciutkan Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* â"€â"€ Navigation (scrollable) â"€â"€ */}
      <nav
        className="flex-1 min-h-0 overflow-y-auto py-3 px-2.5 space-y-3"
        aria-label="Navigasi utama"
      >
        {navigation.map((group, idx) => (
          <div key={group.id || idx} className="space-y-0.5">
            {group.title && !collapsed && (
              <div className="px-2.5 pb-1 pt-0.5 text-[10.5px] font-semibold uppercase tracking-widest text-foreground-muted select-none">
                {group.title}
              </div>
            )}
            <div className="space-y-0.5">{renderNavItems(group.items)}</div>
          </div>
        ))}
      </nav>

      {/* -- Footer (fixed, not scrollable) -- */}
      {bottomNavigation.length > 0 && (
        <div className="shrink-0 flex flex-col justify-center border-t border-border h-[38px]">
          <div className="px-2.5">
            {renderNavItems(bottomNavigation)}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border bg-background transition-all duration-200 shrink-0 z-20 h-full',
          collapsed ? 'w-[56px]' : 'w-64',
          className,
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => onMobileOpenChange?.(false)}
            aria-hidden="true"
          />
          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-background shadow-xl z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
