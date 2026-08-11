import React from 'react';
import { type LucideIcon, type LucideProps } from 'lucide-react';
import { cn } from '@binago/utils';
import type { Size } from '@binago/types';

export interface IconProps extends Omit<LucideProps, 'size'> {
  icon: LucideIcon;
  size?: Size | number;
}

const sizes: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: Component, size = 'md', className, ...props }, ref) => {
    const sizeClass = typeof size === 'number' ? undefined : sizes[size];
    const customSize = typeof size === 'number' ? size : undefined;

    return (
      <Component
        ref={ref}
        size={customSize}
        className={cn('shrink-0 text-current', sizeClass, className)}
        aria-hidden="true"
        {...props}
      />
    );
  },
);
Icon.displayName = 'Icon';
