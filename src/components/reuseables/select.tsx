import React, { useEffect, useState } from "react";

interface InputProps {
  name?: string;
  iconName?: string;
  value?: string | null;
  title?: string;
  inputRef?: React.RefObject<HTMLInputElement>; // Ref for input field
  className?: string;
  placeholder?: string;
  recordList?: string[];
  onChangeText?: (value: string) => void; // Callback for passing selected value
}

const SelectField: React.FC<InputProps> = ({
  recordList = [],
  onChangeText,
  placeholder,
  iconName,
  title,
  value,
  className,
}) => {
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value); // Update the local selected value
    setShow(false); // Close the dropdown
    if (onChangeText) {
      onChangeText(value); // Pass the selected value to the parent component
    }
  };

  useEffect(() => {
    if (value)
      setSelectedValue(value);
  }, [value])
  

  return (
    <div className={`${className} flex flex-col relative`}>
      {title && <div className="pb-1 text-sm italic tracking-wide">{title}</div>}
      <div
        onClick={() => setShow(!show)}
        className="flex flex-row items-center py-3 bg-white border-2 border-secondary w-full cursor-pointer"
      >
        {iconName && (
            <i
              className={`fi ${iconName} text-center px-2 mb-[-.3rem] text-lg text-primary border-r border-primary`}
            ></i>
          )}
        <input
          type="text"
          readOnly
          value={selectedValue || ""}
          placeholder={placeholder}
          className="outline-none px-2 bg-transparent text-primary w-full"
        />
        <i
          className={`fi ${
            show ? "fi-sr-caret-up" : "fi-sr-caret-down"
          } text-center px-2 mb-[-.3rem] text-lg text-primary`}
        ></i>
      </div>

      {/* Dropdown Menu */}
      {show && (
        <div className="flex flex-col gap-1 bg-white border-2 border-secondary w-full max-h-[7rem] overflow-auto absolute mt-[5rem] z-10">
          {recordList.length === 0 ? (
            <div className="text-center text-gray-500 py-2">No options</div>
          ) : (
            recordList.map((el) => (
              <div
                key={el}
                onClick={() => handleSelect(el)}
                className={`${
                  el === recordList.at(-1) ? "" : "border-b border-secondary"
                } flex flex-row capitalize justify-between items-center text-primary px-3 py-2 cursor-pointer hover:bg-gray-100`}
              >
                {el}
                {selectedValue === el && (
                  <i className="fi fi-sr-check-circle text-green-500"></i>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SelectField;
