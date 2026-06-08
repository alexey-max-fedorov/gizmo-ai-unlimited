import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as = "h2",
  className,
}: SectionHeadingProps) {
  const Title = as;
  return (
    <div
      className={cn(
        align === "center" ? "text-center mx-auto max-w-2xl" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
          {eyebrow}
        </p>
      )}
      <Title
        className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight"
        style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
      >
        {title}
      </Title>
      {subtitle && (
        <p className="mt-5 text-[#a0a0a0] text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
