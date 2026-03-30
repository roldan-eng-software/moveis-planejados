import * as React from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

export interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children?: React.ReactNode;
  className?: string;
}

const Form = React.forwardRef<
  HTMLFormElement,
  FormProps<any> & React.FormHTMLAttributes<HTMLFormElement>
>(({ form, onSubmit, className, children, ...props }, ref) => (
  <FormProvider {...form}>
    <form
      ref={ref}
      onSubmit={form.handleSubmit(onSubmit)}
      className={className}
      {...props}
    >
      {children}
    </form>
  </FormProvider>
));
Form.displayName = "Form";

const FormField = ({
  label,
  error,
  children,
  className,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mb-4 flex flex-col ${className}`}>
    {label && <label className="mb-2 font-medium text-sm">{label}</label>}
    {children}
    {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
  </div>
);

export { Form, FormField };
