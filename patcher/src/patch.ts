import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GIZMO_ORIGIN, GIZMO_PROBE_URL, VERSION } from "./constants.ts";
import { extractEntryUrl, fetchEntryBundle, fetchHtml } from "./fetch-entry.ts";
import { applyAllPatches } from "./patches.ts";

export type PatchResult = {
  outputDir: string;
  entryPath: string;
  entryUrl: string;
  isSubscribedCount: number;
  bytesIn: number;
  bytesOut: number;
};

export const runPatch = async (outputDir = "dist"): Promise<PatchResult> => {
  console.log(`[patcher] v${VERSION} starting`);
  console.log(`[patcher] fetching ${GIZMO_PROBE_URL}`);
  const html = await fetchHtml(GIZMO_PROBE_URL);

  const entryPath = extractEntryUrl(html);
  const entryUrl = `${GIZMO_ORIGIN}${entryPath}`;
  console.log(`[patcher] entry path: ${entryPath}`);

  console.log(`[patcher] fetching bundle (${entryUrl})`);
  const source = await fetchEntryBundle(entryPath);
  const bytesIn = source.length;
  console.log(`[patcher] source bundle: ${bytesIn} bytes`);

  console.log(`[patcher] applying patches`);
  const { output, isSubscribedCount } = applyAllPatches(source);
  const bytesOut = output.length;
  if (isSubscribedCount === 0) {
    throw new Error(
      "Refusing to write patched bundle: applyIsSubscribedPatch matched ZERO occurrences. " +
      "The minifier output may have changed shape — update the regex in patches.ts."
    );
  }
  console.log(`[patcher] isSubscribed replaced ${isSubscribedCount} time(s)`);

  const resolvedOutputDir = path.resolve(outputDir);
  await mkdir(resolvedOutputDir, { recursive: true });

  const metadata = {
    generatedAt: new Date().toISOString(),
    patcherVersion: VERSION,
    source: { probeUrl: GIZMO_PROBE_URL, entryUrl, entryPath },
    patches: { isSubscribedCount },
    bytes: { in: bytesIn, out: bytesOut }
  };

  await Promise.all([
    writeFile(path.join(resolvedOutputDir, "entry.min.js"), output, "utf8"),
    writeFile(
      path.join(resolvedOutputDir, "metadata.json"),
      `${JSON.stringify(metadata, null, 2)}\n`,
      "utf8"
    )
  ]);

  console.log(`[patcher] wrote ${path.join(resolvedOutputDir, "entry.min.js")} (${bytesOut} bytes)`);
  return { outputDir: resolvedOutputDir, entryPath, entryUrl, isSubscribedCount, bytesIn, bytesOut };
};

const isEntrypoint = process.argv[1] === fileURLToPath(import.meta.url);

if (isEntrypoint) {
  const outputDir = process.argv[2] ?? "dist";
  runPatch(outputDir)
    .then((result) => {
      console.log(`[patcher] success: ${JSON.stringify(result, null, 2)}`);
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.stack ?? error.message : String(error);
      console.error(`[patcher] FAILED:\n${message}`);
      process.exitCode = 1;
    });
}
