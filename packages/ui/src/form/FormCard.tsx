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
}

export const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  ({ title, description, icon, action, children, className, contentClassName, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("bg-white dark:bg-neutral-900 border border-border rounded-xl overflow-hidden p-5 lg:p-6", className)}
        {...props}
      >
        {(title || description || icon || action) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 lg:mb-6">
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
        
        <div className={cn("flex flex-col gap-4 lg:gap-5", contentClassName)}>
          {children}
        </div>
      </div>
    );
  }
);

FormCard.displayName = 'FormCard';
