import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon,
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed clickable";

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2" size={size === "sm" ? 14 : 18} />
      ) : Icon ? (
        <Icon className="mr-2" size={size === "sm" ? 14 : 18} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
