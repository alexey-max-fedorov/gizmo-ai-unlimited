import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Gizmo AI Unlimited collects zero personal data. No cookies, no analytics, no telemetry — all patching happens locally in your browser.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <h1
          className="text-4xl font-semibold text-white"
          style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
        >
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[#666666]">
          Last updated {SITE.privacyUpdated} · v{SITE.version}
        </p>

        <div className="mt-10 space-y-8 text-[#a0a0a0] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">The short version</h2>
            <p>
              {SITE.name} collects <strong className="text-white">zero personal data</strong>.
              It does not use cookies, localStorage, or session storage. It does not contact any
              analytics, advertising, or telemetry service. It does not require an account. Every
              part of its work happens locally inside your own browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What the extension does</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fetches a small set of patch rules from the project&apos;s public GitHub repository.</li>
              <li>Fetches Gizmo&apos;s own quiz script from app.gizmo.ai (their code, not your data).</li>
              <li>Applies the rules locally and caches the result in private extension storage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What it never does</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>It never sends any information about you to the author or any third party.</li>
              <li>It never modifies Gizmo&apos;s servers, APIs, or your account state.</li>
              <li>It never tracks your browsing history or quiz activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Storage</h2>
            <p>
              The cached, patched script lives in <code className="text-[#c9a84c]">chrome.storage.local</code>,
              which is private to the extension and inaccessible to websites. It is removed
              automatically when you uninstall the extension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third parties</h2>
            <p>
              The browser stores (Chrome Web Store, Edge Add-ons, Mozilla Add-ons) may record
              install and update events under their own policies. That is platform behavior, not
              data collected by this extension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">This website</h2>
            <p>
              Everything above describes the <strong className="text-white">browser extension</strong>.
              This marketing website (<code className="text-[#c9a84c]">gizmo.best</code>) is separate and uses
              Vercel Analytics and Speed Insights to measure aggregate, anonymous traffic and page
              performance. These are cookieless and do not track you across sites or build a personal
              profile. The extension itself remains analytics-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>
              The full source code is public at{" "}
              <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">
                github.com/alexey-max-fedorov/gizmo-ai-unlimited
              </a>
              . Open an issue there with any questions.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
