'use client';

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@binago/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ElementType;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  showHomeIcon?: boolean;
  className?: string;
}

export function Breadcrumb({
  items,
  homeHref = '/',
  showHomeIcon = true,
  className,
}: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs font-medium text-foreground-muted', className)}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHomeIcon && (
          <li className="inline-flex items-center">
            <a
              href={homeHref}
              className="inline-flex items-center gap-1 text-foreground-muted hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded-sm"
              aria-label="Beranda"
            >
              <Home className="h-3.5 w-3.5 shrink-0" />
            </a>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {(showHomeIcon || index > 0) && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-foreground-subtle"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 font-semibold text-foreground',
                    isLast && 'truncate max-w-[200px]',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-foreground-muted" />}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="inline-flex items-center gap-1 text-foreground-muted hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded-sm"
                >
                  {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-foreground-muted" />}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
