"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children?: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  onMouseEnter,
  onMouseLeave,
  style,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const baseClasses =
    "inline-flex items-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { background: "#ffffff", color: "var(--primary)", fontWeight: "bold" },
    outline: { border: "1.5px solid var(--primary)", color: "var(--primary)" },
    ghost: { color: "var(--text)" },
  };

  const variantClasses = {
    primary: "",
    outline: "",
    ghost: "",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === "primary") {
      (e.currentTarget as HTMLElement).style.opacity = "0.85";
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === "primary") {
      (e.currentTarget as HTMLElement).style.opacity = "1";
    }
    onMouseLeave?.(e);
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}