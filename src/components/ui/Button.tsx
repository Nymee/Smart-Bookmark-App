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
    "border border-amber-200/[0.06] bg-surface-light/80 text-foreground backdrop-blur-sm hover:border-amber-200/[0.14] hover:bg-surface-light",
  solid:
    "bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/15",
  ghost:
    "text-foreground/45 hover:text-foreground/75 hover:bg-surface-light/50",
  danger:
    "border border-red-500/12 bg-red-500/[0.06] text-red-400 hover:bg-red-500/[0.1] hover:border-red-500/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
  md: "px-6 py-3 text-base rounded-xl gap-2",
  lg: "px-8 py-4 text-base rounded-xl gap-3",
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
      className={`group relative inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
