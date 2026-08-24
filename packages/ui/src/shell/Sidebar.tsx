'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
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
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('adatrack-sidebar-sections');
      if (stored) {
        setOpenSections(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, []);

  React.useEffect(() => {
    setOpenSections(prev => {
      let changed = false;
      const next = { ...prev };

      navigation.forEach(group => {
        if (group.id === 'main') return;
        const groupId = group.id || '';
        if (!groupId) return;

        const hasActive = group.items.some(
          item => currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))
        );
        if (hasActive && !next[groupId]) {
          next[groupId] = true;
          changed = true;
        }
      });

      if (changed) {
        try {
          localStorage.setItem('adatrack-sidebar-sections', JSON.stringify(next));
        } catch (e) { }
        return next;
      }
      return prev;
    });
  }, [currentPath, navigation]);

  const toggleSection = (groupId: string) => {
    if (!groupId || groupId === 'main') return;
    setOpenSections(prev => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      try {
        localStorage.setItem('adatrack-sidebar-sections', JSON.stringify(next));
      } catch (e) { }
      return next;
    });
  };

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
            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            isActive
              ? 'bg-black text-white dark:bg-black dark:text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 hover:bg-surface-elevated dark:hover:text-zinc-100 hover:shadow-sm',
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
                'h-4 w-4 shrink-0 transition-colors duration-300',
                isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300',
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
        {navigation.map((group, idx) => {
          const isMain = group.id === 'main';
          const groupId = group.id || idx.toString();
          const isOpen = isMain || !!openSections[groupId];

          return (
            <div key={groupId} className="space-y-0.5">
              {group.title && !collapsed && !isMain && (
                <div
                  className={cn(
                    "flex items-center justify-between px-2 pb-1.5 pt-1 select-none",
                    !isMain && "cursor-pointer group/section"
                  )}
                  onClick={() => {
                    if (!isMain) toggleSection(groupId);
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider",
                      !isMain ? "text-zinc-500/90 group-hover/section:text-zinc-900 dark:text-zinc-400/90 dark:group-hover/section:text-zinc-200 transition-colors duration-300" : "text-zinc-500/90"
                    )}
                  >
                    {group.icon && (
                      <group.icon className="h-4 w-4" />
                    )}
                    {group.title}
                  </div>
                  {!isMain && (
                    <div className="text-foreground-muted group-hover/section:text-foreground transition-colors duration-200">
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                  )}
                </div>
              )}
              {isOpen && (
                <div className={cn("space-y-0.5", !isMain && !collapsed && "mt-1")}>
                  {renderNavItems(group.items)}
                </div>
              )}
            </div>
          );
        })}
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
