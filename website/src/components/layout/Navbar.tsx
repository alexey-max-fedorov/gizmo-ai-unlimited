"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { NAV_LINKS, SHORTLINKS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-[#1a1a1a]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="" width={28} height={28} className="rounded-md" />
          <span
            className="text-white font-semibold text-lg"
            style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
          >
            Gizmo Unlimited
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#a0a0a0] hover:text-white transition-colors tracking-wide"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href={SHORTLINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="text-[#a0a0a0] hover:text-white transition-colors"
          >
            <GithubIcon size={20} />
          </Link>
          <Button href={SHORTLINKS.install} external size="sm">
            Add to browser
          </Button>
        </div>

        <button
          className="md:hidden text-white p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-[#1a1a1a] px-4 py-6 space-y-4">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-base text-[#a0a0a0] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Button href={SHORTLINKS.install} external className="w-full mt-2">
            Add to browser
          </Button>
        </div>
      )}
    </header>
  );
}
