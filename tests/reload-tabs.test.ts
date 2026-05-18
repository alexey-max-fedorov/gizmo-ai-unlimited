import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  GIZMO_TAB_URL_PATTERN,
  reloadGizmoTabs,
  type ReloadableTabsApi
} from "../lib/reload-tabs.ts";

describe("GIZMO_TAB_URL_PATTERN", () => {
  it("targets every path under the app.gizmo.ai host over https", () => {
    assert.equal(GIZMO_TAB_URL_PATTERN, "https://app.gizmo.ai/*");
  });
});

describe("reloadGizmoTabs", () => {
  it("queries tabs filtered by the gizmo URL pattern and reloads each one", async () => {
    const queries: Array<{ url: string | string[] }> = [];
    const reloaded: number[] = [];
    const tabs: ReloadableTabsApi = {
      query: async (info) => {
        queries.push(info);
        return [{ id: 11 }, { id: 22 }, { id: 33 }];
      },
      reload: async (tabId) => {
        reloaded.push(tabId);
      }
    };

    const count = await reloadGizmoTabs(tabs);

    assert.equal(count, 3);
    assert.deepEqual(queries, [{ url: "https://app.gizmo.ai/*" }]);
    assert.deepEqual(reloaded, [11, 22, 33]);
  });

  it("skips tabs that have no numeric id", async () => {
    const reloaded: number[] = [];
    const tabs: ReloadableTabsApi = {
      query: async () => [{ id: 1 }, {}, { id: 7 }, { id: undefined }],
      reload: async (tabId) => {
        reloaded.push(tabId);
      }
    };

    const count = await reloadGizmoTabs(tabs);

    assert.equal(count, 2);
    assert.deepEqual(reloaded, [1, 7]);
  });

  it("returns 0 when no tabs match", async () => {
    let reloadCalls = 0;
    const tabs: ReloadableTabsApi = {
      query: async () => [],
      reload: async () => {
        reloadCalls++;
      }
    };

    const count = await reloadGizmoTabs(tabs);

    assert.equal(count, 0);
    assert.equal(reloadCalls, 0);
  });

  it("continues reloading remaining tabs if one reload rejects", async () => {
    const reloaded: number[] = [];
    const tabs: ReloadableTabsApi = {
      query: async () => [{ id: 1 }, { id: 2 }, { id: 3 }],
      reload: async (tabId) => {
        if (tabId === 2) throw new Error("tab closed");
        reloaded.push(tabId);
      }
    };

    const count = await reloadGizmoTabs(tabs);

    assert.equal(count, 2);
    assert.deepEqual(reloaded, [1, 3]);
  });
});
