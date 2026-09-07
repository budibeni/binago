import React from 'react';
import { cn } from '@adatrack/utils';

export interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Title of the card section.
   */
  title?: string;
  
  /**
   * Optional description text below the title.
   */
  description?: string;
  
  /**
   * Optional icon to display on the left of the title and description.
   */
  icon?: React.ReactNode;
  
  /**
   * Optional action element to display on the right side of the header (e.g. a Button).
   */
  action?: React.ReactNode;
  
  /**
   * Content of the card (usually form fields).
   */
  children: React.ReactNode;
  
  /**
   * Class name for the internal content container.
   */
  contentClassName?: string;
  /**
   * Number of columns for the internal grid layout (1 or 2). Defaults to 1.
   * If set to 2, it will automatically respond to FormShell layout modes.
   */
  columns?: 1 | 2;
}

export const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  ({ title, description, icon, action, children, className, contentClassName, columns = 1, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "bg-white dark:bg-neutral-900 border border-border rounded-xl overflow-hidden",
          "p-5 lg:p-6",
          "group-data-[layout=drawer]/form:!p-3.5 group-data-[layout=drawer]/form:!rounded-lg",
          "group-data-[layout=dialog]/form:!p-3.5 group-data-[layout=dialog]/form:!rounded-lg",
          "group-data-[layout=default]/form:!p-3.5 group-data-[layout=default]/form:!rounded-lg",
          className
        )}
        {...props}
      >
        {(title || description || icon || action) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 lg:mb-6 group-data-[layout=drawer]/form:!mb-2 group-data-[layout=dialog]/form:!mb-2 group-data-[layout=default]/form:!mb-2">
            <div className="flex items-start gap-3.5">
              {icon && (
                <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  {icon}
                </div>
              )}
              <div className="flex flex-col">
                {title && (
                  <h3 className="text-sm font-semibold text-foreground leading-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-[11px] text-foreground-subtle mt-0.5 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {action && (
              <div className="shrink-0">
                {action}
              </div>
            )}
          </div>
        )}
        <div 
          className={cn(
            columns === 1 
              ? "flex flex-col gap-4 lg:gap-5 group-data-[layout=drawer]/form:!gap-2 group-data-[layout=dialog]/form:!gap-2 group-data-[layout=default]/form:!gap-2" 
              : "grid grid-cols-1 gap-4 lg:gap-5 group-data-[layout=default]/form:md:grid-cols-2 group-data-[layout=fullscreen]/form:md:grid-cols-2 group-data-[layout=drawer]/form:!gap-2 group-data-[layout=dialog]/form:!gap-2 group-data-[layout=default]/form:!gap-2", 
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

FormCard.displayName = 'FormCard';
