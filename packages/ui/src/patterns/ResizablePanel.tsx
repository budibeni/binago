import React from 'react';
import { cn } from '@adatrack/utils';

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
}

export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      className,
      minWidth = 240,
      maxWidth = 600,
      defaultWidth = 320,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const [width, setWidth] = React.useState(defaultWidth);
    const [isResizing, setIsResizing] = React.useState(false);

    const startResizing = React.useCallback(
      (mouseDownEvent: React.MouseEvent) => {
        mouseDownEvent.preventDefault();
        setIsResizing(true);

        const startX = mouseDownEvent.clientX;
        const startWidth = width;

        const onMouseMove = (mouseMoveEvent: MouseEvent) => {
          const newWidth = startWidth + (mouseMoveEvent.clientX - startX);
          if (newWidth >= minWidth && newWidth <= maxWidth) {
            setWidth(newWidth);
          }
        };

        const onMouseUp = () => {
          setIsResizing(false);
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      },
      [width, minWidth, maxWidth],
    );

    return (
      <div
        ref={ref}
        style={{ width: `${width}px`, ...style }}
        className={cn(
          'relative shrink-0 border-r border-border bg-surface select-none',
          isResizing && 'cursor-col-resize',
          className,
        )}
        {...props}
      >
        {children}
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors"
          role="separator"
          aria-orientation="vertical"
          aria-valuenow={width}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          aria-label="Tarik untuk mengubah ukuran panel"
        />
      </div>
    );
  },
);
ResizablePanel.displayName = 'ResizablePanel';
