import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrowserIcon } from "@/components/ui/BrowserIcon";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { CHROME_MANUAL_INSTALL, EDGE_MANUAL_INSTALL, STORES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Get the extension",
  description:
    "Gizmo AI Unlimited is temporarily unavailable on the Chrome Web Store and Microsoft Edge Add-ons. Install it from Firefox Add-ons, or load the v2.2.0 GitHub release unpacked in Chrome or Edge.",
  alternates: { canonical: "/get" },
};

const OPTIONS = [
  {
    title: "Firefox",
    body: "Install from the Mozilla Add-ons listing.",
    href: STORES.firefox,
    cta: "Open Firefox listing",
    icon: <BrowserIcon browser="firefox" size={22} />,
  },
  {
    title: "Google Chrome",
    body: "The store listing is down. Download v2.2.0, unzip it, turn on Developer mode at chrome://extensions, and choose Load unpacked.",
    href: CHROME_MANUAL_INSTALL,
    cta: "v2.2.0 on GitHub",
    icon: <GithubIcon size={22} />,
  },
  {
    title: "Microsoft Edge",
    body: "The Edge Add-ons listing is down. Download v2.2.0 (the Chrome zip works in Edge), unzip it, turn on Developer mode at edge://extensions, and choose Load unpacked.",
    href: EDGE_MANUAL_INSTALL,
    cta: "v2.2.0 on GitHub",
    icon: <BrowserIcon browser="edge" size={22} />,
  },
] as const;

export default function GetPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.3em] uppercase mb-5">
              Install
            </p>
            <h1
              className="text-4xl sm:text-5xl font-semibold text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
            >
              Temporarily unavailable on the Chrome and Edge stores
            </h1>
            <p className="mt-6 text-lg text-[#a0a0a0] leading-relaxed">
              Gizmo AI Unlimited is temporarily unavailable on the Chrome Web Store and
              Microsoft Edge Add-ons. The Firefox listing is still up. On Google Chrome,
              Edge, or Brave, install v2.2.0 manually from GitHub.
            </p>

            <div className="mt-12 grid gap-4">
              {OPTIONS.map((option) => (
                <a
                  key={option.title}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 hover:border-[#333] hover:bg-[#111] transition-colors"
                >
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[rgba(201,168,76,0.1)] text-[#c9a84c]">
                    {option.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-white font-semibold flex items-center gap-1.5">
                      {option.title}
                      <ArrowUpRight
                        size={16}
                        className="text-[#c9a84c] opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                      />
                    </h2>
                    <p className="mt-1 text-sm text-[#a0a0a0] leading-relaxed">{option.body}</p>
                    <p className="mt-2 text-sm text-[#c9a84c]">{option.cta}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
