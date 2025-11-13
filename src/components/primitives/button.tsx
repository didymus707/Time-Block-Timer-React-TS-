import React from "react";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Simple Button primitive that works with Tailwind or plain classNames.
 * - variant: primary / secondary / ghost
 * - size: sm / md / lg
 *
 * The component intentionally returns a semantic <button> and forwards native props.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) => {
  const base = "inline-flex items-center justify-center font-medium rounded-md transition duration-[var(--blokr-motion-medium)]";
  const sizeMap: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-md",
    lg: "px-6 py-3 text-lg",
  };

  const variantMap: Record<ButtonVariant, string> = {
    primary: "bg-black text-white hover:opacity-90 disabled:opacity-60",
    secondary:
      "bg-neutral-100 text-[var(--blokr-text-primary)] hover:bg-neutral-200 disabled:opacity-60",
    ghost: "bg-transparent text-[var(--blokr-text-primary)] hover:bg-neutral-100 disabled:opacity-60",
  };

  const classes = [base, sizeMap[size], variantMap[variant], className].join(" ");

  return (
    <button
      {...rest}
      disabled={disabled}
      className={classes}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;