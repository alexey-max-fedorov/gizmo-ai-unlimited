import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  installMetroHook,
  patchModuleExports,
  viewSnapshot,
  viewSubscription,
  wrapMetroFactory
} from "../lib/runtime-patch.ts";

describe("viewSubscription", () => {
  it("reports status subscribed and passes other fields through", () => {
    const subscription = { status: "free", plan: "basic" };
    const view = viewSubscription(subscription) as { status: string; plan: string };
    assert.equal(view.status, "subscribed");
    assert.equal(view.plan, "basic");
    assert.equal(viewSubscription(subscription), view);
  });
});

describe("viewSnapshot", () => {
  it("forces subscription status and stays stable for one snapshot", () => {
    const snapshot = { subscription: { status: "free", renews: 1 }, inventory: { lives: 2 } };
    const view = viewSnapshot(snapshot) as {
      subscription: { status: string; renews: number };
      inventory: { lives: number };
    };
    assert.equal(view.subscription.status, "subscribed");
    assert.equal(view.subscription.renews, 1);
    assert.equal(view.inventory.lives, 2);
    assert.equal(viewSnapshot(snapshot), view);
  });

  it("presents a subscribed object when subscription is missing", () => {
    const view = viewSnapshot({ inventory: {} }) as { subscription: { status: string } };
    assert.equal(view.subscription.status, "subscribed");
  });

  it("leaves non-objects alone", () => {
    assert.equal(viewSnapshot(null), null);
    assert.equal(viewSnapshot(undefined), undefined);
  });
});

describe("patchModuleExports", () => {
  it("makes SnapshotState.snapshot reads report subscribed", () => {
    let raw: unknown = { subscription: { status: "free" } };
    class SnapshotState {
      get snapshot() {
        return raw;
      }
    }
    patchModuleExports({ SnapshotState });
    const state = new SnapshotState();
    const snap = state.snapshot as { subscription: { status: string } };
    assert.equal(snap.subscription.status, "subscribed");
    raw = { subscription: { status: "paused", seats: 3 } };
    const next = state.snapshot as { subscription: { status: string; seats: number } };
    assert.equal(next.subscription.status, "subscribed");
    assert.equal(next.subscription.seats, 3);
  });

  it("forces isSubscribedStore reads to true", () => {
    const isSubscribedStore = {
      get: () => false,
      getSnapshot: () => false
    };
    patchModuleExports({ isSubscribedStore });
    assert.equal(isSubscribedStore.get(), true);
    assert.equal(isSubscribedStore.getSnapshot(), true);
  });

  it("sets the import-cooldown bypass on runtime config only", () => {
    const runtimeConfig: { WEB_LOCALE_CATALOGS: object; EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN?: string } =
      { WEB_LOCALE_CATALOGS: {} };
    const unrelated = { env: { NODE_ENV: "production" } };
    patchModuleExports({ runtimeConfig, env: runtimeConfig });
    patchModuleExports(unrelated);
    assert.equal(runtimeConfig.EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN, "true");
    assert.equal("EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN" in unrelated.env, false);
  });
});

describe("installMetroHook", () => {
  it("wraps factories registered by a later __d assignment", () => {
    const root: { __d?: (factory: (...args: unknown[]) => unknown, id: unknown, deps: unknown) => unknown } =
      {};
    installMetroHook(root);
    assert.equal(root.__d, undefined);

    const store = { get: () => false, getSnapshot: () => false };
    let seen: unknown;
    root.__d = (factory, id) => {
      factory(null, null, null, null, { exports: {} }, undefined, null);
      seen = id;
      return "defined";
    };

    const define = root.__d;
    assert.equal(typeof define, "function");
    const result = define(function (_g, _r, _i, _a, m: { exports: Record<string, unknown> }) {
      m.exports.isSubscribedStore = store;
    }, 7, []);
    assert.equal(result, "defined");
    assert.equal(seen, 7);
    assert.equal(store.get(), true);
  });

  it("patches exports from the module object Metro passes to the factory", () => {
    const store = { get: () => false, getSnapshot: () => false };
    const factory = wrapMetroFactory(function (_g, _r, _i, _a, m: { exports: { isSubscribedStore: typeof store } }) {
      m.exports.isSubscribedStore = store;
    });
    factory(null, null, null, null, { exports: {} }, undefined, null);
    assert.equal(store.get(), true);
  });
});
