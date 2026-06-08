import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-[#c9a84c] text-sm font-semibold tracking-[0.3em] uppercase">404</p>
      <h1
        className="mt-4 text-4xl font-semibold text-white"
        style={{ fontFamily: "var(--font-playfair-display), Georgia, serif" }}
      >
        Page not found
      </h1>
      <p className="mt-4 text-[#a0a0a0]">That page doesn&apos;t exist.</p>
      <Link href="/" className="mt-8">
        <Button>Back home</Button>
      </Link>
    </main>
  );
}
