'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../Button';

export interface ThemeToggleProps {
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  className?: string;
}

export function ThemeToggle({
  theme = 'light',
  onThemeChange,
  className,
}: ThemeToggleProps) {
  const isDark = theme === 'dark';

  const handleToggle = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    onThemeChange?.(nextTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={className}
      aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-warning" />
      ) : (
        <Moon className="h-4 w-4 text-foreground-muted" />
      )}
    </Button>
  );
}
