import React from 'react';
import { cn } from '@binago/utils';
import { Spinner } from '../Spinner';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  className,
  label = 'Memuat data...',
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center min-h-[180px]',
        className,
      )}
      {...props}
    >
      <Spinner size="lg" className="mb-3 text-primary" />
      {label && <p className="text-sm font-medium text-foreground-muted">{label}</p>}
      {children}
    </div>
  );
};
