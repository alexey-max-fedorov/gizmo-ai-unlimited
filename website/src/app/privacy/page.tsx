import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "The Gizmo AI Unlimited extension makes no network requests and collects no personal data. gizmo.best uses Vercel Analytics. Chrome, Edge, and Firefox stores have their own privacy policies.",
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
              The extension collects <strong className="text-white">zero personal data</strong> and
              makes <strong className="text-white">no network requests</strong>. It does not use
              cookies, localStorage, or session storage. It does not contact any analytics,
              advertising, or telemetry service. It does not require an account. Every part of its
              work happens locally inside your own browser. The gizmo.best website is separate and
              is described below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What the extension does</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Runs a content script that is packaged inside the extension.</li>
              <li>Adjusts in-memory subscription and import-cooldown reads on app.gizmo.ai.</li>
              <li>Leaves Gizmo&apos;s own scripts to load from Gizmo. The extension does not download them.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What it never does</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>It never makes a network request.</li>
              <li>It never sends any information about you to the author or any third party.</li>
              <li>It never modifies Gizmo&apos;s servers, APIs, or your account state.</li>
              <li>It never tracks your browsing history or quiz activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Storage</h2>
            <p>
              The extension does not keep a copy of Gizmo&apos;s scripts and does not use{" "}
              <code className="text-[#c9a84c]">chrome.storage</code>. Uninstalling it removes the
              extension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third parties</h2>
            <p>
              Chrome Web Store, Microsoft Edge Add-ons, and Mozilla Add-ons each have their own
              privacy policy. An install, update, or uninstall through one of those stores is
              recorded by that store, not by this extension.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                Chrome Web Store —{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                Microsoft Edge Add-ons —{" "}
                <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">
                  Microsoft Privacy Statement
                </a>
              </li>
              <li>
                Mozilla Add-ons —{" "}
                <a href="https://www.mozilla.org/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">
                  Mozilla Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">This website</h2>
            <p>
              Everything above describes the <strong className="text-white">browser extension</strong>.
              The extension makes no network requests. This marketing website (
              <code className="text-[#c9a84c]">gizmo.best</code>) does use Vercel Analytics and Speed
              Insights to measure aggregate, anonymous traffic and page performance. Those tools are
              cookieless and do not track you across sites or build a personal profile. The extension
              does not load them.
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
