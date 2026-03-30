import React from "react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  className = "",
  rows, // for textarea
}) => {
  const isTextArea = type === "textarea";
  const Component = isTextArea ? "textarea" : "input";

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        )}
        <Component
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows || 4}
          className={`w-full ${Icon ? "pl-10" : "px-4"} py-2.5 bg-white border ${
            error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
          } rounded-xl text-sm outline-none transition-all duration-200 ${isTextArea ? "resize-none" : ""}`}
        />
      </div>
      {error && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
