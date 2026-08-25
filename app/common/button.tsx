"use client";

export function Button({
  label,
  onClick,
  type = "button",
  disabled,
  loading,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "light";
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={!!disabled}
      aria-busy={loading}
      aria-label={label}
      className={`bg-primary cursor-pointer rounded text-white outline-offset-2 transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 ${size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"} ${variant === "light" ? "bg-transparent" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
