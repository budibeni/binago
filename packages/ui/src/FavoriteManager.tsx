'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Plus } from 'lucide-react';
import { Dialog } from './Dialog';
import { Checkbox } from './Checkbox';
import { Button } from './Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FavoriteItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
}

// ─── FavoriteSectionHeader ────────────────────────────────────────────────────
// Generic header for the "Favorites" section.
// Renders title, subtitle, and two action buttons.
// Completely domain-agnostic — all text and handlers passed via props.

export interface FavoriteSectionHeaderProps {
  title: string;
  subtitle: string;
  manageLabel: string;
  addLabel: string;
  onManageClick: () => void;
  /** Primary button variant: 'accent' (red) or 'dark' (neutral-900). Default: 'accent' */
  addButtonVariant?: 'accent' | 'dark';
}

export function FavoriteSectionHeader({
  title,
  subtitle,
  manageLabel,
  addLabel,
  onManageClick,
  addButtonVariant = 'accent',
}: FavoriteSectionHeaderProps) {
  const addBtnClass =
    addButtonVariant === 'dark'
      ? 'inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500'
      : 'inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500';

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      {/* Left: title + subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        </div>
        <p className="text-sm text-neutral-500">{subtitle}</p>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onManageClick}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <Edit2 className="h-3.5 w-3.5" />
          {manageLabel}
        </button>
        <button
          type="button"
          onClick={onManageClick}
          className={addBtnClass}
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>
    </div>
  );
}

// ─── FavoriteManager ──────────────────────────────────────────────────────────
// Generic dialog for managing favorite selections.
// Domain-agnostic: no knowledge of Business/Personal/localStorage/routes.

export interface FavoriteManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  items: FavoriteItem[];
  selectedIds: string[];
  onSave: (newSelectedIds: string[]) => void;
  cancelLabel: string;
  saveLabel: string;
}

export function FavoriteManager({
  open,
  onOpenChange,
  title,
  description,
  items,
  selectedIds,
  onSave,
  cancelLabel,
  saveLabel,
}: FavoriteManagerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Reset local selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelected(new Set(selectedIds));
    }
  }, [open, selectedIds]);

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave(Array.from(selected));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className="max-w-xl"
    >
      <div className="mt-6 mb-6 max-h-[50vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-neutral-50 transition-colors cursor-pointer"
              onClick={() => toggleItem(item.id)}
            >
              <Checkbox
                id={`fav-item-${item.id}`}
                checked={selected.has(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor={`fav-item-${item.id}`}
                className="flex-1 cursor-pointer select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4 text-foreground-muted shrink-0" />}
                  <span className="text-sm font-semibold text-foreground leading-tight">
                    {item.label}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-0.5 text-xs text-foreground-muted leading-snug line-clamp-2">
                    {item.description}
                  </p>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button onClick={handleSave}>
          {saveLabel}
        </Button>
      </div>
    </Dialog>
  );
}
