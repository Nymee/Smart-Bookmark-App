"use client";

import { type InputHTMLAttributes } from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputSize?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-5 py-3 text-base rounded-xl",
  lg: "px-6 py-4 text-base rounded-xl",
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
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10px] font-medium uppercase tracking-wider text-foreground/30"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full border border-amber-200/[0.06] bg-surface-light/60 text-foreground placeholder-foreground/20 backdrop-blur-sm transition-all duration-200 outline-none focus:border-accent/25 focus:bg-surface-light focus:ring-1 focus:ring-accent/10 ${sizeStyles[inputSize]} ${error ? "border-red-500/25 focus:border-red-500/40 focus:ring-red-500/10" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-red-400">{error}</span>
      )}
    </div>
  );
}
