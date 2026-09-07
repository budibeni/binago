import React from 'react';
import { Save } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, type ButtonProps } from '../Button';

export interface FormFooterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Title text displayed on the left side of the footer.
   */
  title?: React.ReactNode;
  
  /**
   * Subtitle text displayed below the title.
   */
  subtitle?: React.ReactNode;
  
  /**
   * Custom content to display on the left side. If provided, replaces title and subtitle.
   */
  leftContent?: React.ReactNode;
  
  /**
   * Callback when cancel button is clicked. If not provided, cancel button is hidden unless rendered via custom actions.
   */
  onCancel?: () => void;
  
  /**
   * Label for the cancel button. Defaults to 'Batal'.
   */
  cancelText?: string;
  
  /**
   * Additional props for the cancel button.
   */
  cancelProps?: Partial<ButtonProps>;
  
  /**
   * Callback when save button is clicked. Useful if not using type="submit".
   */
  onSave?: () => void;
  
  /**
   * Label for the save button. Defaults to 'Simpan'.
   */
  saveText?: string;
  
  /**
   * Additional props for the save button.
   */
  saveProps?: Partial<ButtonProps>;
  
  /**
   * Indicates if the form is currently submitting (disables buttons).
   */
  isSubmitting?: boolean;
  
  /**
   * Custom actions to replace the default cancel and save buttons.
   */
  actions?: React.ReactNode;
  
  /**
   * If true, the footer will be sticky at the bottom of the viewport. Default is true.
   */
  isSticky?: boolean;
}

export const FormFooter = React.forwardRef<HTMLDivElement, FormFooterProps>(
  (
    {
      title,
      subtitle,
      leftContent,
      onCancel,
      cancelText = 'Batal',
      cancelProps,
      onSave,
      saveText = 'Simpan',
      saveProps,
      isSubmitting = false,
      actions,
      isSticky = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between px-4 md:px-6 py-2 bg-background border-t border-border shadow-sm',
          isSticky ? 'fixed bottom-0 left-0 right-0 lg:left-64 z-40' : 'w-full mt-auto shrink-0',
          className
        )}
        {...props}
      >
        <div className="flex flex-col">
          {leftContent ? (
            leftContent
          ) : (
            <>
              {title && <span className="text-[13px] font-bold text-foreground leading-tight">{title}</span>}
              {subtitle && <span className="text-[11px] text-foreground-subtle mt-0.5 leading-tight">{subtitle}</span>}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions ? (
            actions
          ) : (
            <>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting || cancelProps?.disabled}
                  className={cn('h-7 text-xs px-3 bg-background', cancelProps?.className)}
                  {...cancelProps}
                >
                  {cancelText}
                </Button>
              )}
              <Button
                type={onSave ? 'button' : 'submit'}
                variant="primary"
                size="sm"
                onClick={onSave}
                disabled={isSubmitting || saveProps?.disabled}
                className={cn('h-7 text-xs px-4 min-w-[100px] bg-danger hover:bg-danger/90 text-white border-transparent', saveProps?.className)}
                leftIcon={<Save className="w-3.5 h-3.5" />}
                {...saveProps}
              >
                {saveText}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
);

FormFooter.displayName = 'FormFooter';
