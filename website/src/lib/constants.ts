export const SITE = {
  name: "Gizmo AI Unlimited",
  shortName: "Gizmo Unlimited",
  url: "https://gizmo.best",
  domain: "gizmo.best",
  tagline: "Study Without Limits",
  seoTitle: "Gizmo AI Unlimited — Unlimited Hearts, Hints & Magic Imports",
  oneLiner:
    "Unlimited hearts, unlocked hints, and unlimited Magic Imports for Gizmo AI — no client-side Magic Import cooldown, no interruptions.",
  description:
    "Unlimited hearts, unlocked hints, and unlimited Magic Imports on Gizmo AI. Removes Magic Import's client-side cooldown and collects no personal data.",
  version: "2.3.0",
  author: "Alexey Fedorov",
  repo: "https://github.com/alexey-max-fedorov/gizmo-ai-unlimited",
  gizmoUrl: "https://app.gizmo.ai",
  privacyUpdated: "May 18, 2026",
} as const;

export const STORES = {
  chrome:
    "https://chromewebstore.google.com/detail/jnbnbecephjaglcnfhmpopikchhifgnh",
  edge: "https://microsoftedge.microsoft.com/addons/detail/gizmo-ai-unlimited/gajdekhpddjnkkldabhaahhhanmkkegi",
  firefox:
    "https://addons.mozilla.org/en-US/firefox/addon/gizmo-ai-unlimited/",
} as const;

export const PRIMARY_CAPABILITIES = [
  "Unlimited hearts",
  "Unlocked hints",
  "Unlimited Magic Imports (client-side cooldown check disabled)",
] as const;

export const SEO_KEYWORDS = [
  "Gizmo AI",
  "Gizmo AI unlimited",
  "Gizmo unlimited hearts",
  "Gizmo hints unlock",
  "Gizmo AI unlimited imports",
  "Gizmo Magic Import",
  "Gizmo import cooldown",
  "Gizmo AI extension",
  "study without limits",
  "app.gizmo.ai",
] as const;

/**
 * gizmo.best redirect shortlinks (served by the standalone `redirect/` Vercel
 * project). Every destination carries `?utm_source=<subdomain>` for attribution,
 * so all install/source links on the site are tracked. `install` is UA-smart:
 * it redirects to the visitor's correct store automatically.
 */
export const SHORTLINKS = {
  install: "https://extension.gizmo.best",
  chrome: "https://chrome.gizmo.best",
  edge: "https://edge.gizmo.best",
  firefox: "https://firefox.gizmo.best",
  github: "https://gh.gizmo.best",
  youtube: "https://yt.gizmo.best",
  author: "https://author.gizmo.best",
} as const;

/** lucide-react icon names, resolved in the component to keep this file framework-free. */
export type IconName =
  | "Heart"
  | "Lightbulb"
  | "ShieldCheck"
  | "RefreshCw"
  | "Lock"
  | "MousePointerClick"
  | "Github"
  | "Download"
  | "PlugZap"
  | "Wand2";

export interface Feature {
  icon: IconName;
  title: string;
  body: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "Heart",
    title: "Unlimited hearts",
    body: "The out-of-hearts modal never appears. Practice every question as many times as you want, with nothing blocking the screen.",
  },
  {
    icon: "Lightbulb",
    title: "Every hint unlocked",
    body: "Hints that are normally gated behind a subscription are available on every question — no upgrade required.",
  },
  {
    icon: "Wand2",
    title: "Unlimited Magic Imports",
    body: "Removes Magic Import's client-side cooldown so you can import again without waiting. It activates automatically — no button or setup required.",
  },
  {
    icon: "RefreshCw",
    title: "Self-healing",
    body: "Patch rules refresh every 2 hours through an automated pipeline, so the extension keeps working after Gizmo ships updates.",
  },
  {
    icon: "Lock",
    title: "Zero data collected",
    body: "No accounts, no cookies, no tracking, no telemetry. Everything runs locally in your browser and nothing is sent to us.",
  },
  {
    icon: "ShieldCheck",
    title: "Open source",
    body: "The full extension and patcher are public on GitHub. Read every line before you install — nothing is hidden.",
  },
];

export interface Step {
  title: string;
  body: string;
}

/** "How it works" — the technical flow, for a semi-technical audience. */
export const STEPS: Step[] = [
  {
    title: "Fetch the rules",
    body: "In the background, the extension downloads a small set of text-replacement patch rules from the project's public GitHub repo.",
  },
  {
    title: "Patch locally",
    body: "It grabs Gizmo's own quiz script, applies the rules entirely inside your browser, and caches the result in private extension storage.",
  },
  {
    title: "Study uninterrupted",
    body: "The patched app gives you unlimited hearts, opens every hint, and removes Magic Import's client-side cooldown. Leave Gizmo and it steps aside.",
  },
];

export interface InstallTarget {
  browser: "chrome" | "edge" | "firefox";
  label: string;
  note: string;
  href: string;
}

export const INSTALL: InstallTarget[] = [
  {
    browser: "chrome",
    label: "Add to Chrome",
    note: "Works on Chrome, Brave & other Chromium browsers",
    href: SHORTLINKS.chrome,
  },
  {
    browser: "edge",
    label: "Add to Edge",
    note: "From the official Microsoft Edge Add-ons store",
    href: SHORTLINKS.edge,
  },
  {
    browser: "firefox",
    label: "Add to Firefox",
    note: "Reviewed and listed on Mozilla Add-ons (AMO)",
    href: SHORTLINKS.firefox,
  },
];

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: "∞", label: "Hearts, hints & imports" },
  { value: "$0", label: "Forever free" },
  { value: "0", label: "Bytes of data collected" },
  { value: "2h", label: "Auto-update cadence" },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "What is Gizmo AI Unlimited?",
    a: "Gizmo AI Unlimited is a free, open-source browser extension that gives you unlimited hearts, unlocked hints, and unlimited Magic Imports by changing how app.gizmo.ai behaves in your browser.",
  },
  {
    q: "Does it remove the Gizmo AI Magic Import cooldown?",
    a: "Yes. It disables the client-side cooldown check used by Magic Import. It does not bypass or disable any server-side limits Gizmo may enforce.",
  },
  {
    q: "Is it free?",
    a: "Yes. It is completely free and always will be. There is no paid tier, no account, and no payment of any kind.",
  },
  {
    q: "Is it safe? Does it collect my data?",
    a: "It collects zero personal data. There are no cookies, no localStorage, no analytics, and no telemetry. All patching happens locally inside your browser, and the entire source code is public on GitHub so anyone can audit it.",
  },
  {
    q: "Which browsers are supported?",
    a: "Chrome, Microsoft Edge, Brave (and other Chromium browsers) through the Chrome Web Store and Edge Add-ons, plus Firefox through Mozilla Add-ons.",
  },
  {
    q: "Do I need a Gizmo account or subscription?",
    a: "No. The extension does not touch your Gizmo account, servers, or APIs. It only changes how the quiz page behaves inside your own browser, so you can use it with a free Gizmo account.",
  },
  {
    q: "Will it keep working when Gizmo updates their site?",
    a: "Yes. The patch rules are automatically refreshed every two hours by a scheduled pipeline, so the extension self-heals shortly after Gizmo ships changes.",
  },
  {
    q: "Does it modify Gizmo's servers or other users' experience?",
    a: "No. Nothing is changed on Gizmo's side. The patch applies only to the script running in your browser and deactivates automatically when you leave a quiz.",
  },
  {
    q: "How do I install it?",
    a: "Click the install button for your browser, add it from the official store, then open any quiz on app.gizmo.ai. It activates automatically — there is no setup or settings panel.",
  },
];

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Install", href: "#install" },
  { label: "FAQ", href: "#faq" },
] as const;
