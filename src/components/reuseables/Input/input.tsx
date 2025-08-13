import React, { forwardRef } from "react";

interface InputProps {
  title?: string;
  type: string;
  iconName?: string;
  readonly?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  ({ title, type, iconName, placeholder, readonly = false, isRequired = false, value, onChange }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {title && <div className="font-semibold tracking-wide text-sm">{title} {isRequired && <span className="font-bold text-sm text-red-600">*</span>} </div>}
        <div className="flex flex-row items-center py-2 bg-white border-2 border-secondary w-full">
          {iconName && (
            <i
              className={`fi ${iconName} text-center px-2 mb-[-.3rem] text-sm text-primary`}
            ></i>
          )}
          <input
            type={type}
            placeholder={placeholder}
            readOnly={readonly}
            ref={ref}
            value={value}
            onChange={onChange}
            className="outline-none border-l px-2 bg-transparent text-primary border-primary w-full"
          />
        </div>
      </div>
    );
  }
);

export default InputField;
