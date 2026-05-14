import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractEntryUrl } from "../src/fetch-entry.ts";

const FIXTURE_OK = `
<!DOCTYPE html>
<html>
<body>
<script src="/_expo/static/js/web/__expo-metro-runtime-3959ce7b26b61ab4053a4b8b218e528d.js" defer></script>
<script src="/_expo/static/js/web/__common-9a3b16481e00e349bc1d3046d23f2b2a.js" defer></script>
<script src="/_expo/static/js/web/entry-a7ba1bec972606400a599699bc996b57.js" defer></script>
</body>
</html>`;

describe("extractEntryUrl", () => {
  it("extracts the entry script path from a Gizmo quiz HTML page", () => {
    const path = extractEntryUrl(FIXTURE_OK);
    assert.equal(path, "/_expo/static/js/web/entry-a7ba1bec972606400a599699bc996b57.js");
  });

  it("ignores other _expo scripts (runtime, common)", () => {
    const path = extractEntryUrl(FIXTURE_OK);
    assert.ok(!path.includes("metro-runtime"));
    assert.ok(!path.includes("__common"));
    assert.ok(path.includes("entry-"));
  });

  it("works regardless of attribute order (defer first)", () => {
    const html = `<script defer src="/_expo/static/js/web/entry-deadbeef.js"></script>`;
    assert.equal(extractEntryUrl(html), "/_expo/static/js/web/entry-deadbeef.js");
  });

  it("throws a descriptive error when the entry script is missing", () => {
    assert.throws(
      () => extractEntryUrl("<html><body>no scripts here</body></html>"),
      /entry-.*\.js/i
    );
  });

  it("only matches lowercase hex hashes", () => {
    const html = `<script src="/_expo/static/js/web/entry-ZZZZ.js" defer></script>`;
    assert.throws(() => extractEntryUrl(html), /entry-.*\.js/i);
  });
});
