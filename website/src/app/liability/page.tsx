import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Liability & Disclaimer",
  description:
    "Gizmo AI Unlimited is a security research proof-of-concept. All liability for use rests with the end user.",
  alternates: { canonical: "/liability" },
};

export default function LiabilityPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <h1
          className="text-4xl font-semibold text-white"
          style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
        >
          Liability & Disclaimer
        </h1>
        <p className="mt-3 text-sm text-[#666666]">
          Last updated September 12, 2026 · v{SITE.version}
        </p>

        <div className="mt-10 space-y-8 text-[#a0a0a0] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Nature of this project</h2>
            <p>
              {SITE.name} is a <strong className="text-white">security research project</strong> and{" "}
              <strong className="text-white">proof of concept</strong>. It exists to demonstrate and
              document client-side modification techniques on web applications as part of ongoing
              security research documented at{" "}
              <a
                href="https://hackany.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a84c] hover:underline"
              >
                hackany.app
              </a>
              . It is <strong className="text-white">not a consumer product</strong> and is not
              marketed, sold, or supported as one.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">No warranty</h2>
            <p>
              This software is provided &ldquo;as is&rdquo;, without warranty of any kind, express
              or implied, including but not limited to the warranties of merchantability, fitness for
              a particular purpose, and noninfringement. The author makes no guarantee that the
              software will function correctly, remain available, or be compatible with any
              particular platform or service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Assumption of risk</h2>
            <p>
              By downloading, installing, or using this software in any form, you acknowledge and
              accept that:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                You are solely responsible for your use of this software and any consequences that
                arise from it.
              </li>
              <li>
                You have reviewed the source code and understand what the software does before
                choosing to run it.
              </li>
              <li>
                Your use of this software may violate the terms of service of third-party platforms,
                and you accept full responsibility for any such violation.
              </li>
              <li>
                The author is not liable for any direct, indirect, incidental, special, exemplary,
                or consequential damages arising from your use of this software, including but not
                limited to account suspension, data loss, or loss of access to third-party services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Limitation of liability</h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall{" "}
              {SITE.author} or any contributor be liable for any claim, damages, or other liability,
              whether in an action of contract, tort, or otherwise, arising from, out of, or in
              connection with the software or the use or other dealings in the software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Not legal advice</h2>
            <p>
              Nothing on this page or in this project constitutes legal advice. If you have questions
              about the legality of using this software in your jurisdiction, consult an attorney.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>
              The full source code is public at{" "}
              <a
                href={SITE.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a84c] hover:underline"
              >
                github.com/alexey-max-fedorov/gizmo-ai-unlimited
              </a>
              . For inquiries, contact{" "}
              <a
                href="mailto:alexey.max.fedorov@gmail.com"
                className="text-[#c9a84c] hover:underline"
              >
                alexey.max.fedorov@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
