import React, { forwardRef } from "react";

interface InputProps {
  title?: string;
  iconName?: string;
  type: string;
  placeholder?: string;
}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  ({ title, type, iconName, placeholder }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {title && <div className="">{title}</div>}
        <div className="flex flex-row items-center py-3 bg-white border-2 border-secondary w-full">
          {iconName && (
            <i
              className={`fi ${iconName} text-center px-2 mb-[-.3rem] text-lg text-primary`}
            ></i>
          )}
          <input
            type={type}
            placeholder={placeholder}
            ref={ref} // Attach the ref here
            className="outline-none border-l px-2 bg-transparent text-primary border-primary w-full"
          />
        </div>
      </div>
    );
  }
);

export default InputField;
