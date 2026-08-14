import React from 'react';
import { cn } from '@adatrack/utils';
import type { Size } from '@adatrack/types';

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: Size;
}

const sizes: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 'md', ...props }) => {
  return (
    <svg
      className={cn('animate-spin text-foreground-muted', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="status"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};
