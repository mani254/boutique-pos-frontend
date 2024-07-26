import React, { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function TextInput({ label, variant, name, children, ...props }) {
  return (
    <div className={`form-input input-wrapper ${variant}`}>
      <label htmlFor={name}>{label}</label>
      <input type="text" id={name} name={name} {...props} />
      {children}
    </div>
  );
}

function NumberInput({ label, variant, name, children, ...props }) {
  return (
    <div className={`form-input input-wrapper ${variant}`}>
      <label htmlFor={name}>{label}</label>
      <input type="number" id={name} name={name} {...props} />
      {children}
    </div>
  );
}

function SelectInput({
  label,
  variant,
  name,
  options,
  defaultValue,
  ref,
  ...props
}) {
  return (
    <div className={`form-input select-wrapper ${variant}`} ref={ref}>
      {label && <label htmlFor={name}>{label}</label>}
      <select id={name} name={name} value={defaultValue} {...props}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, variant, name, children, ...props }) {
  return (
    <div className={`form-input input-wrapper ${variant}`}>
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} {...props}></textarea>
      {children}
    </div>
  );
}

function TelInput({ label, variant, name, children, ...props }) {
  return (
    <div className={`form-input input-wrapper ${variant}`}>
      <label htmlFor={name}>{label}</label>
      <input type="tel" id={name} name={name} {...props} />
      {children}
    </div>
  );
}

function PasswordInput({ label, variant, name, children, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`form-input password-input ${variant}`}>
      <label htmlFor={name}>{label}</label>
      <span className="password-wrapper relative">
        <input
          type={`${showPassword ? "text" : "password"}`}
          id={name}
          name={name}
          {...props}
        />
        <span
          className="icon absolute inset-y-12 right-0 flex cursor-pointer items-center pr-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </span>
      {children}
    </div>
  );
}

function Checkbox({ label, variant, name, ...props }) {
  return (
    <div className={`form-input input-wrapper ${variant}`}>
      <input type="checkbox" id={name} name={name} {...props} />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

function RadioButton({ label, variant, name, value, ...props }) {
  return (
    <div className={`form-input input-wrapper ${variant}`}>
      <input type="radio" id={value} name={name} value={value} {...props} />
      <label htmlFor={value}>{label}</label>
    </div>
  );
}

function FileInput({
  label,
  id,
  variant,
  children,
  value = "null",
  ...otherProps
}) {
  const fileInputRef = useRef(null);
  return (
    <div className={`form-input file-input ${variant}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} ref={fileInputRef} {...otherProps} />
      {variant === "variant-1" && (
        <button
          onClick={() => {
            fileInputRef.current.click();
          }}
        >
          {value ? value : "select file"}
        </button>
      )}
      {children}
    </div>
  );
}
function DateInput({ label, variant, name, children, ...props }) {
  return (
    <div className={`form-input input-wrapper ${variant}`}>
      <label htmlFor={name}>{label}</label>
      <input type="date" id={name} name={name} {...props} />
      {children}
    </div>
  );
}

export {
  TextInput,
  NumberInput,
  SelectInput,
  TextArea,
  TelInput,
  RadioButton,
  Checkbox,
  PasswordInput,
  FileInput,
  DateInput,
};
