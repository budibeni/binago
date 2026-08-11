'use client';

import React from 'react';
import * as RadixSeparator from '@radix-ui/react-separator';
import { cn } from '@binago/utils';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixSeparator.Root> {}

export const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) => {
  return (
    <RadixSeparator.Root
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
};
