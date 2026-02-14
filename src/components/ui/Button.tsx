"use client";

import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "glass" | "solid" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  glass:
    "border border-white/10 bg-white/10 text-white backdrop-blur-sm hover:border-white/25 hover:bg-white/15 hover:shadow-lg hover:shadow-white/5",
  solid:
    "bg-white text-black hover:bg-white/90",
  ghost:
    "text-white/60 hover:text-white hover:bg-white/5",
  danger:
    "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3.5 text-sm rounded-xl gap-3",
};

export default function Button({
  variant = "glass",
  size = "md",
  fullWidth = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`group relative inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
