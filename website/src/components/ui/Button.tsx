import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[#c9a84c] text-black font-semibold hover:bg-[#d4b65e] hover:shadow-[0_0_24px_rgba(201,168,76,0.4)] active:scale-[0.98]",
  outline:
    "border border-[#c9a84c] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.08)] hover:shadow-[0_0_16px_rgba(201,168,76,0.2)] active:scale-[0.98]",
  ghost: "text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] active:scale-[0.98]",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-md",
  md: "px-6 py-3 text-sm rounded-md",
  lg: "px-8 py-4 text-base rounded-md",
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  external,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200 cursor-pointer",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (href) {
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <Link href={href} className={classes} {...externalProps} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
