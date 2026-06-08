import { STEPS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionHeading
            eyebrow="How it works"
            title="Local patching, nothing leaves your browser"
            subtitle="No servers are touched and no Gizmo account is changed. The extension rewrites only the quiz script running on your own machine."
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.1}>
              <div className="relative h-full bg-[#111111] border border-[#1a1a1a] rounded-xl p-8 overflow-hidden">
                <span
                  className="absolute top-3 right-5 text-[#c9a84c]/20 text-6xl font-bold select-none"
                  style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm text-[#a0a0a0] leading-relaxed">{step.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.1}>
          <p className="mt-10 text-center text-sm text-[#666666]">
            Open-source patcher · in-browser only · no telemetry
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
