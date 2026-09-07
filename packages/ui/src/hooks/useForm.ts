import React from 'react';
import type { z } from 'zod';

export interface UseFormOptions<T> {
  initialData: Partial<T>;
  validate?: (data: Partial<T>) => Record<string, string>;
  schema?: z.ZodType<any>;
  onSubmit: (data: Partial<T>) => Promise<void> | void;
  resetOn?: any[];
}

export function useForm<T>({ initialData, validate, schema, onSubmit, resetOn = [] }: UseFormOptions<T>) {
  const [formData, setFormData] = React.useState<Partial<T>>(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setFormData(initialData);
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetOn);

  const handleChange = React.useCallback((field: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (prev[field as string]) {
        return { ...prev, [field as string]: '' };
      }
      return prev;
    });
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      if (schema) {
        const result = schema.safeParse(formData);
        if (!result.success) {
          const zErrors: Record<string, string> = {};
          result.error.issues.forEach(issue => {
            const key = issue.path.join('.');
            if (!zErrors[key]) {
              zErrors[key] = issue.message;
            }
          });
          setErrors(zErrors);
          setIsSubmitting(false);
          return;
        }
      } else if (validate) {
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setIsSubmitting(false);
          return;
        }
      }
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = React.useCallback((data: Partial<T> = initialData) => {
    setFormData(data);
    setErrors({});
  }, [initialData]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleSubmit,
    reset
  };
}