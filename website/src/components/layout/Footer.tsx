import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";
import { SITE, STORES, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="" width={28} height={28} className="rounded-md" />
            <span
              className="text-white font-semibold text-lg"
              style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
            >
              Gizmo Unlimited
            </span>
          </div>
          <p className="mt-4 text-sm text-[#666666] leading-relaxed max-w-xs">
            {SITE.tagline}. A free, open-source extension with zero data collection.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#a0a0a0] mb-4">
            Product
          </h3>
          <ul className="space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[#666666] hover:text-[#c9a84c] transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#a0a0a0] mb-4">
            Install
          </h3>
          <ul className="space-y-3 text-sm">
            <li><a href={STORES.chrome} target="_blank" rel="noopener noreferrer" className="text-[#666666] hover:text-[#c9a84c] transition-colors">Chrome / Brave</a></li>
            <li><a href={STORES.edge} target="_blank" rel="noopener noreferrer" className="text-[#666666] hover:text-[#c9a84c] transition-colors">Microsoft Edge</a></li>
            <li><a href={STORES.firefox} target="_blank" rel="noopener noreferrer" className="text-[#666666] hover:text-[#c9a84c] transition-colors">Firefox</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#a0a0a0] mb-4">
            Project
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/privacy" className="text-[#666666] hover:text-[#c9a84c] transition-colors">Privacy</Link></li>
            <li>
              <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="text-[#666666] hover:text-[#c9a84c] transition-colors inline-flex items-center gap-1.5">
                <Github size={14} /> GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
          <p>© {SITE.author}. Not affiliated with Gizmo AI.</p>
          <p>v{SITE.version}</p>
        </div>
      </div>
    </footer>
  );
}
