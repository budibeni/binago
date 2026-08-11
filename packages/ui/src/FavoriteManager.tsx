'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Checkbox } from './Checkbox';
import { Button } from './Button';

export interface FavoriteItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
}

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

  // Reset selected state when dialog opens
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
      <div className="mt-6 mb-8 max-h-[50vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-neutral-50 transition-colors"
            >
              <Checkbox
                id={`fav-item-${item.id}`}
                checked={selected.has(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <label
                htmlFor={`fav-item-${item.id}`}
                className="flex-1 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4 text-foreground-muted" />}
                  <span className="text-sm font-semibold text-foreground leading-tight">
                    {item.label}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-1 text-xs text-foreground-muted leading-snug line-clamp-2">
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
