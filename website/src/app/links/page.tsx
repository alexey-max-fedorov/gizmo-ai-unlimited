import type { Metadata } from "next";
import { ExternalLink, Download, Globe, Play, GitFork, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Links — Gizmo AI Unlimited",
  description:
    "Every *.gizmo.best shortlink in one place — install the extension, watch the tutorial, and more.",
  alternates: {
    canonical: "https://gizmo.best/links",
  },
};

type LinkItem = {
  label: string;
  aliases: string[];
  href: string;
  destination: string;
  description: string;
  icon: React.ReactNode;
};

type LinkGroup = {
  category: string;
  items: LinkItem[];
};

const iconClass = "shrink-0 text-[#c9a84c]";

const LINKS: LinkGroup[] = [
  {
    category: "Install",
    items: [
      {
        label: "Get the extension",
        aliases: ["extension.gizmo.best", "ext.gizmo.best"],
        href: "https://extension.gizmo.best",
        destination: "gizmo.best/get store",
        description: "Redirects to the right store for your browser",
        icon: <Download size={18} className={iconClass} />,
      },
      {
        label: "Chrome Web Store",
        aliases: ["chrome.gizmo.best"],
        href: "https://chrome.gizmo.best",
        destination: "chromewebstore.google.com",
        description: "Gizmo AI Unlimited on the Chrome Web Store",
        icon: <Globe size={18} className={iconClass} />,
      },
      {
        label: "Microsoft Edge Add-ons",
        aliases: ["edge.gizmo.best"],
        href: "https://edge.gizmo.best",
        destination: "microsoftedge.microsoft.com",
        description: "Gizmo AI Unlimited on the Microsoft Edge Add-ons store",
        icon: <Globe size={18} className={iconClass} />,
      },
      {
        label: "Firefox Add-ons",
        aliases: ["firefox.gizmo.best"],
        href: "https://firefox.gizmo.best",
        destination: "addons.mozilla.org",
        description: "Gizmo AI Unlimited on Firefox AMO",
        icon: <Globe size={18} className={iconClass} />,
      },
    ],
  },
  {
    category: "Tutorial",
    items: [
      {
        label: "Watch the tutorial",
        aliases: ["youtube.gizmo.best", "yt.gizmo.best", "tutorial.gizmo.best"],
        href: "https://youtube.gizmo.best",
        destination: "youtu.be/UlrEFLQGZHY",
        description: "How to install and use the extension",
        icon: <Play size={18} className={iconClass} />,
      },
    ],
  },
  {
    category: "Source",
    items: [
      {
        label: "GitHub",
        aliases: ["github.gizmo.best", "gh.gizmo.best"],
        href: "https://github.gizmo.best",
        destination: "github.com/alexey-max-fedorov/gizmo-ai-unlimited",
        description: "Open-source code on GitHub",
        icon: <GitFork size={18} className={iconClass} />,
      },
    ],
  },
  {
    category: "Author",
    items: [
      {
        label: "Alexey Fedorov",
        aliases: ["author.gizmo.best", "alexey.gizmo.best"],
        href: "https://author.gizmo.best",
        destination: "alexey-fedorov.com",
        description: "The developer behind Gizmo AI Unlimited",
        icon: <User size={18} className={iconClass} />,
      },
    ],
  },
];

export default function LinksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        <section className="py-24 sm:py-32 w-full relative overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-[#c9a84c] text-xs font-semibold tracking-[0.3em] uppercase mb-5">
                ✦ Short Links
              </p>
              <h1
                className="text-4xl sm:text-5xl font-semibold text-white mb-4 leading-tight"
                style={{ fontFamily: "var(--font-playfair-display)" }}
              >
                All Links
              </h1>
              <p className="text-[#a0a0a0] text-base leading-relaxed">
                Every{" "}
                <span className="text-white font-mono text-sm">
                  *.gizmo.best
                </span>{" "}
                shortlink in one place.
              </p>
            </div>

            <div className="space-y-8">
              {LINKS.map((group) => (
                <div key={group.category}>
                  <h2 className="text-[#666] text-xs font-semibold tracking-[0.25em] uppercase mb-3 px-1">
                    {group.category}
                  </h2>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <a
                        key={item.aliases[0]}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 p-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333] hover:bg-[#111] transition-all duration-200"
                      >
                        <div className="mt-0.5">{item.icon}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                            {item.aliases.map((alias, i) => (
                              <span
                                key={alias}
                                className="text-white text-sm font-mono"
                              >
                                {alias}
                                {i < item.aliases.length - 1 && (
                                  <span className="text-[#444] ml-2">/</span>
                                )}
                              </span>
                            ))}
                          </div>
                          <p className="text-[#666] text-xs truncate">
                            → {item.destination}
                          </p>
                          <p className="text-[#555] text-xs mt-1">
                            {item.description}
                          </p>
                        </div>

                        <ExternalLink
                          size={14}
                          className="shrink-0 mt-0.5 text-[#333] group-hover:text-[#c9a84c] transition-colors duration-200"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
