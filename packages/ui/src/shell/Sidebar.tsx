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
  const normalizePath = (p: string) => p.split('?')[0].replace(/\/+$/, '') || '/';

  const flattenItems = (items: NavItem[]): NavItem[] => {
    return items.flatMap((item) => [item, ...(item.items ? flattenItems(item.items) : [])]);
  };

  const activeItem = React.useMemo(() => {
    const allItems: NavItem[] = [
      ...navigation.flatMap((group) => flattenItems(group.items)),
      ...bottomNavigation,
    ];

    const normCurrent = normalizePath(currentPath);

    // 1. Exact match (only items that have href)
    const exact = allItems.find((item) => item.href && normalizePath(item.href) === normCurrent);
    if (exact) return exact;

    // 2. Prefix match (with path segment boundary, longest matching href first)
    const prefixMatches = allItems
      .filter((item) => {
        if (!item.href) return false;
        const normItem = normalizePath(item.href);
        if (!normItem || normItem === '/') return false;
        return (normCurrent + '/').startsWith(normItem + '/');
      })
      .sort((a, b) => normalizePath(b.href!).length - normalizePath(a.href!).length);

    return prefixMatches[0] || null;
  }, [navigation, bottomNavigation, currentPath]);

  const isItemOrChildActive = React.useCallback((item: NavItem, normCurrent: string): boolean => {
    if (item.href) {
      const normItem = normalizePath(item.href);
      if (normItem === normCurrent || (normItem !== '/' && (normCurrent + '/').startsWith(normItem + '/'))) {
        return true;
      }
    }
    if (item.items) {
      return item.items.some((sub) => isItemOrChildActive(sub, normCurrent));
    }
    return false;
  }, []);

  const getInitialOpenSections = () => {
    const result: Record<string, boolean> = {};
    const normCurrent = normalizePath(currentPath);
    navigation.forEach((group) => {
      if (group.id === 'main') return;
      const groupId = group.id || '';
      if (!groupId) return;
      const hasActive = group.items.some((item) => isItemOrChildActive(item, normCurrent));
      if (hasActive) result[groupId] = true;
    });
    return result;
  };

  const getInitialOpenMenus = () => {
    const result: Record<string, boolean> = {};
    const normCurrent = normalizePath(currentPath);
    navigation.forEach((group) => {
      group.items.forEach((item) => {
        if (item.items && item.items.length > 0) {
          const hasActive = item.items.some((sub) => isItemOrChildActive(sub, normCurrent));
          if (hasActive) {
            result[item.id] = true;
          }
        }
      });
    });
    return result;
  };

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(getInitialOpenSections);
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>(getInitialOpenMenus);

  React.useEffect(() => {
    if (!activeItem) return;
    navigation.forEach((group) => {
      let groupHasActive = false;
      group.items.forEach((item) => {
        if (item.id === activeItem.id && item.href === activeItem.href) {
          groupHasActive = true;
        }
        if (item.items) {
          const hasInSub = item.items.some((sub) => sub.id === activeItem.id && sub.href === activeItem.href);
          if (hasInSub) {
            setOpenMenus((prev) => (prev[item.id] ? prev : { ...prev, [item.id]: true }));
            groupHasActive = true;
          }
        }
      });

      if (groupHasActive && group.id && group.id !== 'main') {
        setOpenSections((prev) => (prev[group.id!] ? prev : { ...prev, [group.id!]: true }));
      }
    });
  }, [activeItem, navigation]);

  const toggleSection = (groupId: string) => {
    if (!groupId || groupId === 'main') return;
    setOpenSections((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
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
    if (!item.href) {
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

  const renderNavItems = (items: NavItem[], isMain = false) => {
    return items.map((item) => {
      const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;

      if (hasSubmenu) {
        const isMenuOpen = !!openMenus[item.id];
        const hasActiveChild = item.items?.some(
          (sub) => activeItem && sub.id === activeItem.id && sub.href === activeItem.href
        );
        const Icon = item.icon;

        return (
          <div key={item.id} className="space-y-0.5">
            <button
              type="button"
              onClick={() => toggleMenu(item.id)}
              className={cn(
                'group flex w-full items-center gap-2.5 rounded-lg transition-all duration-200 select-none text-left',
                'pl-8 pr-2 py-1.5 text-[13px] font-medium',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                hasActiveChild
                  ? 'text-foreground font-semibold bg-surface-elevated/70'
                  : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated',
                item.disabled && 'pointer-events-none opacity-40',
                collapsed && 'justify-center px-2',
              )}
              title={item.label}
              aria-expanded={isMenuOpen}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-colors duration-200',
                    hasActiveChild ? 'text-red-500' : 'text-foreground-muted group-hover:text-foreground',
                  )}
                />
              )}

              {!collapsed && (
                <>
                  <span className="flex-1 truncate leading-tight">{item.label}</span>
                  {item.badge !== undefined && (
                    <Badge
                      variant={item.badgeVariant || 'default'}
                      className="ml-auto text-[10px] px-1.5 py-0 h-4"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 text-foreground-muted/70 group-hover:text-foreground transition-transform duration-200',
                      !isMenuOpen && '-rotate-90'
                    )}
                  />
                </>
              )}
            </button>

            {/* Level 3 Submenus with Tree Guide Line */}
            {!collapsed && isMenuOpen && item.items && (
              <div className="relative ml-11 pl-2.5 my-1 space-y-0.5 border-l border-border/70">
                {item.items.map((subItem) => {
                  const isSubActive = activeItem
                    ? subItem.id === activeItem.id && subItem.href === activeItem.href
                    : false;
                  const SubIcon = subItem.icon;

                  return (
                    <a
                      key={subItem.id}
                      href={subItem.href || '#'}
                      onClick={(e) => handleItemClick(e, subItem)}
                      className={cn(
                        'group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                        isSubActive
                          ? 'bg-black text-white dark:bg-black dark:text-white font-semibold shadow-xs'
                          : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated',
                        subItem.disabled && 'pointer-events-none opacity-40',
                      )}
                      title={subItem.label}
                      aria-current={isSubActive ? 'page' : undefined}
                      aria-label={subItem.label}
                    >
                      {SubIcon ? (
                        <SubIcon
                          className={cn(
                            'h-3.5 w-3.5 shrink-0 transition-colors',
                            isSubActive ? 'text-red-500' : 'text-foreground-muted group-hover:text-foreground',
                          )}
                        />
                      ) : (
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full shrink-0 transition-colors',
                            isSubActive ? 'bg-red-500' : 'bg-muted-foreground/40 group-hover:bg-foreground',
                          )}
                        />
                      )}
                      <span className="flex-1 truncate leading-tight">{subItem.label}</span>
                      {subItem.badge !== undefined && (
                        <Badge
                          variant={subItem.badgeVariant || 'default'}
                          className={cn(
                            'ml-auto text-[9px] px-1 py-0 h-3.5',
                            isSubActive && 'bg-white/20 text-white border-white/30',
                          )}
                        >
                          {subItem.badge}
                        </Badge>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      // Normal Level 2 direct link
      const isActive = activeItem ? item.id === activeItem.id && item.href === activeItem.href : false;
      const Icon = item.icon;

      return (
        <a
          key={item.id}
          href={item.href || '#'}
          onClick={(e) => handleItemClick(e, item)}
          className={cn(
            'group flex items-center gap-2.5 rounded-lg transition-all duration-300 ease-out',
            isMain
              ? 'px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider'
              : 'pl-8 pr-2 py-1.5 text-[13px] font-medium',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            isActive
              ? 'bg-black text-white dark:bg-black dark:text-white shadow-sm'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated hover:shadow-sm',
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
                isMain
                  ? 'h-4 w-4 shrink-0 transition-colors duration-300'
                  : 'h-3.5 w-3.5 shrink-0 transition-colors duration-300',
                isActive ? 'text-red-500' : 'text-foreground-muted group-hover:text-foreground',
              )}
            />
          )}

          {!collapsed && <span className="flex-1 truncate leading-tight">{item.label}</span>}

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
                      !isMain ? "text-foreground-muted group-hover/section:text-foreground transition-colors duration-300" : "text-foreground-muted"
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
                  {renderNavItems(group.items, isMain)}
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
