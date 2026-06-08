import { STATS } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function TrustBar() {
  return (
    <section className="border-y border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.08} className="text-center">
            <div
              className="text-4xl lg:text-5xl font-semibold text-[#c9a84c]"
              style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
            >
              {s.value}
            </div>
            <div className="mt-2 text-xs sm:text-sm text-[#a0a0a0] tracking-wide">
              {s.label}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
