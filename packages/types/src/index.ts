import type { ReactNode } from 'react';

// --- Foundation Types ------------------------------
export type Locale = 'id' | 'en';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

// --- TASK-02 Shared Types --------------------------

export type Size = 'sm' | 'md' | 'lg';

export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost';

export type SemanticVariant = 'info' | 'success' | 'warning' | 'danger';

// --- DataTable Types -------------------------------

export type DataTableMode = 'pagination' | 'infinite';

export type FetchState = 'idle' | 'loading' | 'loading-more' | 'success' | 'error';

export type SortDirection = 'asc' | 'desc' | false;

export interface FetchParams {
  pageIndex: number;
  pageSize: number;
  sorting: Array<{ id: string; desc: boolean }>;
  globalFilter: string;
  columnFilters: Array<{ id: string; value: unknown }>;
}

// --- TASK-03 App Shell Types -----------------------

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'default' | 'info' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
}

export interface NavGroup {
  id?: string;
  title?: string;
  items: NavItem[];
}

export interface UserInfo {
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  initials?: string;
}
