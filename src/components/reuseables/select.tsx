import React, { useEffect, useState } from "react";

interface InputProps {
  name?: string;
  iconName?: string;
  value?: string | null;
  title?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  placeholder?: string;
  disabled?: boolean; // Added disabled prop
  recordList?: string[] | null;
  onChangeText?: (value: string) => void;
}

const SelectField: React.FC<InputProps> = ({
  recordList = [],
  onChangeText,
  placeholder,
  iconName,
  title,
  value,
  disabled = false, // Default to false
  className,
}) => {
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    if (disabled) return; // Prevent selection if disabled
    setSelectedValue(value);
    setShow(false);
    if (onChangeText) {
      onChangeText(value);
    }
  };

  useEffect(() => {
    if (value) setSelectedValue(value);
  }, [value]);

  return (
    <div className={`${className} flex flex-col relative`}>
      {title && <div className="pb-1 text-sm italic tracking-wide">{title}</div>}

      {/* Dropdown Menu */}
      {show && !disabled && (
        <div className="flex flex-col gap-1 bg-white border-2 border-secondary w-full max-h-[9rem] overflow-auto absolute bottom-[4rem] z-10">
          {recordList && recordList.length === 0 ? (
            <div className="text-center text-gray-500 py-2">No options</div>
          ) : (
            recordList &&
            recordList.map((el) => (
              <div
                key={el}
                onClick={() => handleSelect(el)}
                className={`${
                  el === recordList.at(-1) ? "" : "border-b border-secondary"
                } flex flex-row capitalize justify-between items-center text-primary px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  disabled ? "cursor-not-allowed text-gray-400" : ""
                }`}
              >
                {el}
                {selectedValue === el && !disabled && (
                  <i className="fi fi-sr-check-circle text-green-500"></i>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div
        onClick={() => !disabled && setShow(!show)}
        className={`flex flex-row items-center py-3 border-2 w-full cursor-pointer ${
          disabled ? "bg-gray-300 border-gray-400 cursor-not-allowed" : "bg-white border-secondary"
        }`}
      >
        {iconName && (
          <i
            className={`fi ${iconName} text-center px-2 mb-[-.3rem] text-lg border-r ${
              disabled ? "text-gray-400 border-gray-400" : "text-primary border-primary"
            }`}
          ></i>
        )}
        <input
          type="text"
          readOnly
          value={selectedValue || ""}
          placeholder={placeholder}
          className={`outline-none px-2 bg-transparent w-full ${
            disabled ? "text-gray-400 cursor-not-allowed" : "text-primary"
          }`}
          disabled={disabled}
        />
        <i
          className={`fi ${
            show ? "fi-sr-caret-up" : "fi-sr-caret-down"
          } text-center px-2 mb-[-.3rem] text-lg ${
            disabled ? "text-gray-400" : "text-primary"
          }`}
        ></i>
      </div>
    </div>
  );
};

export default SelectField;
