// Cloudflare Worker: *.gizmo.best shortlinks. Source of truth for the host map.
// Deployed as `gizmo-redirects`, route `*.gizmo.best/*` on the gizmo.best zone.
// Apex and www are DNS-only (GitHub Pages) and never reach this Worker.

const AMO = "https://addons.mozilla.org/en-US/firefox/addon/gizmo-ai-unlimited/";
const GET = "https://gizmo.best/get";
const REPO = "https://github.com/alexey-max-fedorov/gizmo-ai-unlimited";
const YT = "https://youtu.be/UlrEFLQGZHY";
const AUTHOR = "https://alexey-fedorov.com/";

const utm = (url, sub) => `${url}${url.includes("?") ? "&" : "?"}utm_source=${sub}.gizmo.best`;

// subdomain -> destination (string, or function of the User-Agent)
const MAP = {
  edge: (sub) => utm(GET, sub),
  chrome: (sub) => utm(GET, sub),
  firefox: (sub) => utm(AMO, sub),
  github: (sub) => utm(REPO, sub),
  gh: (sub) => utm(REPO, sub),
  author: (sub) => utm(AUTHOR, sub),
  alexey: (sub) => utm(AUTHOR, sub),
  links: () => "https://gizmo.best/links",
  support: () => `${REPO}/issues/new`,
  youtube: (sub) => utm(YT, sub),
  yt: (sub) => utm(YT, sub),
  tutorial: (sub) => utm(YT, sub),
  // Browser-aware: Firefox -> AMO. Chrome/Edge listings are delisted, so everything else -> /get.
  extension: (sub, ua) => utm(/Firefox/i.test(ua) ? AMO : GET, sub),
  ext: (sub, ua) => utm(/Firefox/i.test(ua) ? AMO : GET, sub),
};

export default {
  async fetch(request) {
    const host = new URL(request.url).hostname.toLowerCase();
    if (host === "gizmo.best" || host === "www.gizmo.best") return fetch(request);
    const sub = host.endsWith(".gizmo.best") ? host.slice(0, -".gizmo.best".length) : "";
    const build = Object.hasOwn(MAP, sub) ? MAP[sub] : null;
    if (!build) return new Response("Not found", { status: 404 });
    const res = Response.redirect(build(sub, request.headers.get("user-agent") || ""), 301);
    // Extension targets vary by User-Agent, so caches must not share them across browsers.
    if (sub === "extension" || sub === "ext") {
      const out = new Response(null, res);
      out.headers.set("Vary", "User-Agent");
      return out;
    }
    return res;
  },
};
