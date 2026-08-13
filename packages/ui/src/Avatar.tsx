import React from 'react';
import { cn } from '@binago/utils';
import type { Size } from '@binago/types';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: Size;
}

const sizes: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt = '',
  initials,
  size = 'md',
  ...props
}) => {
  const [imgError, setImgError] = React.useState(false);
  const showImage = src && !imgError;
  const fallback = initials
    ? initials.slice(0, 2).toUpperCase()
    : alt
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full bg-surface-elevated text-foreground-muted font-medium overflow-hidden select-none',
        sizes[size],
        className,
      )}
      aria-label={alt || initials}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
};
