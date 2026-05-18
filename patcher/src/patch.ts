import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GIZMO_ORIGIN, GIZMO_PROBE_URL, VERSION } from "./constants.ts";
import { extractEntryUrl, fetchEntryBundle, fetchHtml } from "./fetch-entry.ts";
import { RULES, applyRules, hashRules } from "./patches.ts";

export type PatchResult = {
  outputDir: string;
  entryPath: string;
  entryUrl: string;
  perRuleCounts: Record<string, number>;
  patchesHash: string;
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

  console.log(`[patcher] applying ${RULES.length} rule(s)`);
  const { output, perRuleCounts } = applyRules(source, RULES);
  const bytesOut = output.length;

  const degraded = RULES.filter((r) => (perRuleCounts[r.id] ?? 0) < r.minMatches);
  if (degraded.length > 0) {
    const summary = degraded
      .map((r) => `${r.id}=${perRuleCounts[r.id] ?? 0} (min ${r.minMatches})`)
      .join(", ");
    throw new Error(
      `Refusing to write patched bundle: rule(s) below minMatches — ${summary}. ` +
      `The minifier output may have changed shape — update find regex in patches.ts.`
    );
  }

  for (const rule of RULES) {
    console.log(`[patcher] rule "${rule.id}" matched ${perRuleCounts[rule.id]} time(s)`);
  }

  const patchesHash = hashRules(RULES);
  const resolvedOutputDir = path.resolve(outputDir);
  await mkdir(resolvedOutputDir, { recursive: true });

  // NOTE: no `generatedAt` here — patches.json must be content-stable so the
  // CI commit-gate only fires on real changes (rules or version bump). Per-run
  // timestamps belong in metadata.json instead.
  const patchesJson = {
    schemaVersion: 1,
    patcherVersion: VERSION,
    hash: patchesHash,
    rules: RULES
  };

  const metadata = {
    generatedAt: new Date().toISOString(),
    patcherVersion: VERSION,
    source: { probeUrl: GIZMO_PROBE_URL, entryUrl, entryPath },
    perRuleCounts,
    patchesHash,
    bytes: { in: bytesIn, out: bytesOut }
  };

  await Promise.all([
    writeFile(path.join(resolvedOutputDir, "entry.min.js"), output, "utf8"),
    writeFile(
      path.join(resolvedOutputDir, "patches.json"),
      `${JSON.stringify(patchesJson, null, 2)}\n`,
      "utf8"
    ),
    writeFile(
      path.join(resolvedOutputDir, "metadata.json"),
      `${JSON.stringify(metadata, null, 2)}\n`,
      "utf8"
    )
  ]);

  console.log(`[patcher] wrote patches.json (hash=${patchesHash})`);
  console.log(`[patcher] wrote entry.min.js (${bytesOut} bytes, verification copy)`);
  return {
    outputDir: resolvedOutputDir,
    entryPath,
    entryUrl,
    perRuleCounts,
    patchesHash,
    bytesIn,
    bytesOut
  };
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
