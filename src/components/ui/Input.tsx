"use client";

import { type InputHTMLAttributes } from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputSize?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-5 py-3.5 text-sm rounded-xl",
};

export default function Input({
  label,
  error,
  inputSize = "md",
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-wider text-white/40"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full border border-white/10 bg-white/5 text-white placeholder-white/25 backdrop-blur-sm transition-all duration-200 outline-none focus:border-white/25 focus:bg-white/10 focus:ring-1 focus:ring-white/10 ${sizeStyles[inputSize]} ${error ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
}
