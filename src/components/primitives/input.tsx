import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputValue: string;
  inputNameRef?: string;
  classNames?: string[];
  setValue: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  setValue,
  inputValue,
  inputNameRef,
  classNames = [],
  ...rest
}: InputProps) => {
  const defaultClasses = [
    "bg-gray-100 rounded-lg p-2 mt-2 focus:border-4 focus:border-gray-300 focus:outline-gray-300",
  ];
  const combinedClass = twMerge([...defaultClasses, ...classNames].join(" "));
  return (
    <>
      {label && (
        <label htmlFor={`${inputNameRef}-name" className="text-lg font-medium`}>
          {label}
        </label>
      )}
      <input
        value={inputValue}
        onChange={(e) => setValue(e.target.value)}
        className={combinedClass}
        {...rest}
      />
    </>
  );
};
