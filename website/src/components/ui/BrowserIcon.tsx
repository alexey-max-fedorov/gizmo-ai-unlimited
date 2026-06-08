interface BrowserIconProps {
  browser: "chrome" | "edge" | "firefox";
  size?: number;
  className?: string;
}

/**
 * Minimal, recognizable monochrome browser glyphs (gold-tintable via currentColor).
 * Kept simple on purpose — these read as "a browser" without infringing brand art.
 */
export function BrowserIcon({ browser, size = 22, className }: BrowserIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (browser === "firefox") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3c3 1.5 4 4 3 6-1-2-3-2.5-5-2 1.5 1 2 2.5 1.5 4A4 4 0 1 1 7 8c.5 2 2 2.5 3.5 2C9 8.5 9.5 5 12 3Z" />
      </svg>
    );
  }

  if (browser === "edge") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M4 13a8 8 0 0 1 14-5c1.2 1.4 1.5 3 1 4.5-1-1.5-3-2.5-5.5-2.5-3 0-5 1.7-5 4 0 1.6 1 3 3 3.5" />
      </svg>
    );
  }

  // chrome
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 8.8h8M9.2 13.6 5.2 6.8M14.8 13.6l-4 6.9" />
    </svg>
  );
}
