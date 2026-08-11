'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@binago/utils';
import { Badge } from '../Badge';
import type { NavGroup, NavItem } from '@binago/types';

export interface SidebarProps {
  brandName?: string;
  brandLogo?: React.ReactNode;
  navigation: NavGroup[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Sidebar({
  brandName = 'BINAGO',
  brandLogo,
  navigation,
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
    // Close mobile drawer on navigation
    if (mobileOpen) {
      onMobileOpenChange?.(false);
    }
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
      const Icon = item.icon;

      return (
        <a
          key={item.id}
          href={item.href}
          onClick={(e) => handleItemClick(e, item)}
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-fast',
            'focus:outline-none focus:ring-2 focus:ring-neutral-400',
            isActive
              ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
              : 'text-foreground-muted hover:bg-neutral-100 hover:text-foreground',
            item.disabled && 'pointer-events-none opacity-50',
            collapsed && 'justify-center px-2',
          )}
          title={collapsed ? item.label : undefined}
          aria-current={isActive ? 'page' : undefined}
        >
          {Icon && (
            <Icon
              className={cn(
                'h-5 w-5 shrink-0 transition-colors',
                isActive ? 'text-primary-foreground' : 'text-foreground-muted group-hover:text-foreground',
              )}
            />
          )}

          {!collapsed && (
            <span className="flex-1 truncate">{item.label}</span>
          )}

          {!collapsed && item.badge !== undefined && (
            <Badge
              variant={item.badgeVariant || 'default'}
              className={cn(
                'ml-auto text-[10px] px-1.5 py-0',
                isActive && 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30',
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
    <div className="flex h-full flex-col justify-between">
      {/* Brand Header */}
      <div>
        <div
          className={cn(
            'flex h-14 items-center border-b border-border px-4',
            collapsed ? 'justify-center px-2' : 'justify-between',
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {brandLogo || (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-xs shadow-sm">
                B
              </div>
            )}
            {!collapsed && (
              <span className="text-base font-bold text-foreground truncate tracking-tight">
                {brandName}
              </span>
            )}
          </div>

          {/* Close button inside mobile drawer */}
          <button
            type="button"
            onClick={() => onMobileOpenChange?.(false)}
            className="lg:hidden rounded-md p-1 text-foreground-muted hover:bg-neutral-100 transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-4 p-3 overflow-y-auto max-h-[calc(100vh-7.5rem)]">
          {navigation.map((group, idx) => (
            <div key={group.id || idx} className="space-y-1">
              {group.title && !collapsed && (
                <div className="px-3 text-[11px] font-semibold text-foreground-subtle uppercase tracking-wider mb-1">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5">{renderNavItems(group.items)}</div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Collapse Toggle (Desktop only) */}
      {onCollapsedChange && (
        <div className="hidden lg:flex border-t border-border p-2">
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg p-2 text-xs font-medium text-foreground-muted hover:bg-neutral-100 hover:text-foreground transition-colors',
              collapsed && 'justify-center',
            )}
            aria-label={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span>Ciutkan Navigasi</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky/Fixed) */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border bg-background transition-all duration-base shrink-0 z-20',
          collapsed ? 'w-16' : 'w-60',
          className,
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-over + Backdrop Overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-base"
            onClick={() => onMobileOpenChange?.(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-background shadow-xl transition-transform duration-base z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
