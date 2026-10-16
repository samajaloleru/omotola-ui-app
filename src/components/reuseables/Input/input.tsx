import React, { forwardRef, useId } from "react";

interface InputProps {
  title?: string;
  type: string;
  icon?: React.ReactNode;
  readonly?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  value?: string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  ({ title, type, icon, placeholder, readonly = false, isRequired = false, value, autoComplete, onChange, onKeyDown }, ref) => {
    const id = useId();

    return (
      <div className="flex w-full flex-col gap-1.5">
        {title && (
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {title} {isRequired && <span className="text-danger">*</span>}
          </label>
        )}
        <div className={`field ${readonly ? "bg-sand text-muted" : ""}`}>
          {icon && <span className="shrink-0 text-lg text-muted">{icon}</span>}
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            readOnly={readonly}
            ref={ref}
            value={value}
            autoComplete={autoComplete}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="h-full w-full bg-transparent py-2 outline-none placeholder:text-muted/70"
          />
        </div>
      </div>
    );
  }
);

export default InputField;
