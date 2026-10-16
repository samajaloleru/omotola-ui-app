import React, { useEffect, useId, useState } from "react";
import { PiCaretDownBold } from "react-icons/pi";

interface SelectProps {
  icon?: React.ReactNode;
  value?: string | null;
  title?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  recordList?: string[] | null;
  onChangeText?: (value: string) => void;
}

const SelectField: React.FC<SelectProps> = ({
  recordList = [],
  onChangeText,
  placeholder,
  icon,
  title,
  value,
  disabled = false,
  className = "",
}) => {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState<string>(value ?? "");

  useEffect(() => {
    setSelectedValue(value ?? "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
    onChangeText?.(e.target.value);
  };

  return (
    <div className={`${className} flex flex-col gap-1.5`}>
      {title && <label htmlFor={id} className="text-sm font-medium text-ink">{title}</label>}
      <div className={`field relative ${disabled ? "bg-sand text-muted" : ""}`}>
        {icon && <span className="shrink-0 text-lg text-muted">{icon}</span>}
        <select
          id={id}
          value={selectedValue}
          onChange={handleChange}
          disabled={disabled}
          className={`h-full w-full cursor-pointer appearance-none bg-transparent py-2 pr-6 outline-none disabled:cursor-not-allowed ${
            selectedValue ? "text-ink" : "text-muted/70"
          }`}
        >
          <option value="">{placeholder || "Select"}</option>
          {recordList?.map((el) => (
            <option key={el} value={el}>{el}</option>
          ))}
        </select>
        <PiCaretDownBold className="pointer-events-none absolute right-3 text-sm text-muted" />
      </div>
    </div>
  );
};

export default SelectField;
