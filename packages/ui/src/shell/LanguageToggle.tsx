'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../Dropdown';
import type { Locale } from '@binago/types';

export interface LanguageToggleProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  className?: string;
}

export function LanguageToggle({
  currentLocale,
  onLocaleChange,
  className,
}: LanguageToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className}
          aria-label="Pilih Bahasa"
          leftIcon={<Globe className="h-4 w-4 text-foreground-muted" />}
        >
          <span className="uppercase text-xs font-semibold">{currentLocale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => onLocaleChange('id')}
          className={currentLocale === 'id' ? 'font-semibold text-primary' : ''}
        >
          <span>Bahasa Indonesia</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onLocaleChange('en')}
          className={currentLocale === 'en' ? 'font-semibold text-primary' : ''}
        >
          <span>English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
