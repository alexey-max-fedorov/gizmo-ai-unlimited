import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CACHE_KEY,
  getCachedBundle,
  setCachedBundle,
  clearCachedBundle,
  type StorageLocalApi,
  type CacheEntry
} from "../lib/bundle-cache.ts";

const makeFakeStorage = (initial: Record<string, unknown> = {}): StorageLocalApi => {
  let store = { ...initial };
  return {
    get: async (keys) => {
      if (typeof keys === "string") return { [keys]: store[keys] };
      if (Array.isArray(keys)) {
        const out: Record<string, unknown> = {};
        for (const k of keys) out[k] = store[k];
        return out;
      }
      return { ...store };
    },
    set: async (items) => {
      store = { ...store, ...items };
    },
    remove: async (keys) => {
      const ks = Array.isArray(keys) ? keys : [keys];
      for (const k of ks) delete store[k];
    }
  };
};

describe("getCachedBundle", () => {
  it("returns undefined when no entry exists", async () => {
    const storage = makeFakeStorage();
    const result = await getCachedBundle(storage);
    assert.equal(result, undefined);
  });

  it("returns the stored entry", async () => {
    const entry: CacheEntry = {
      bundleFilename: "entry-abc.js",
      patchesHash: "deadbeef00000000",
      patchedBundle: "console.log(1)",
      storedAt: 1000
    };
    const storage = makeFakeStorage({ [CACHE_KEY]: entry });
    const result = await getCachedBundle(storage);
    assert.deepEqual(result, entry);
  });
});

describe("setCachedBundle", () => {
  it("writes the entry under CACHE_KEY", async () => {
    const storage = makeFakeStorage();
    const entry: CacheEntry = {
      bundleFilename: "entry-abc.js",
      patchesHash: "deadbeef00000000",
      patchedBundle: "console.log(1)",
      storedAt: 1000
    };
    await setCachedBundle(storage, entry);
    const after = await getCachedBundle(storage);
    assert.deepEqual(after, entry);
  });

  it("overwrites any prior entry", async () => {
    const storage = makeFakeStorage();
    await setCachedBundle(storage, {
      bundleFilename: "entry-old.js",
      patchesHash: "aaaaaaaaaaaaaaaa",
      patchedBundle: "old",
      storedAt: 1
    });
    await setCachedBundle(storage, {
      bundleFilename: "entry-new.js",
      patchesHash: "bbbbbbbbbbbbbbbb",
      patchedBundle: "new",
      storedAt: 2
    });
    const after = await getCachedBundle(storage);
    assert.equal(after?.bundleFilename, "entry-new.js");
    assert.equal(after?.patchedBundle, "new");
  });
});

describe("clearCachedBundle", () => {
  it("removes the entry", async () => {
    const storage = makeFakeStorage();
    await setCachedBundle(storage, {
      bundleFilename: "entry-abc.js",
      patchesHash: "deadbeef00000000",
      patchedBundle: "x",
      storedAt: 1
    });
    await clearCachedBundle(storage);
    const after = await getCachedBundle(storage);
    assert.equal(after, undefined);
  });

  it("is a no-op when no entry exists", async () => {
    const storage = makeFakeStorage();
    await clearCachedBundle(storage); // should not throw
    const after = await getCachedBundle(storage);
    assert.equal(after, undefined);
  });
});
