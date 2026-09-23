// In-memory hooks for Gizmo's own bundle. Every function here ships in the
// extension. Nothing fetches or evaluates remote JavaScript.
//
// Metro's global `__d` only registers module factories. We wrap it and, after
// each factory runs, adjust three stable export shapes:
//   - SnapshotState.prototype.snapshot  (hearts, hints, cooldown)
//   - isSubscribedStore.get/getSnapshot (paywall reads)
//   - runtimeConfig.EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN (Magic Import cooldown)

const subscribedViews = new WeakMap<object, object>();
const subscriptionViews = new WeakMap<object, object>();
const patchedSnapshotCtors = new WeakSet<object>();
const patchedStores = new WeakSet<object>();
const patchedConfigs = new WeakSet<object>();

export const patchCounts = { snapshot: 0, store: 0, config: 0 };

const LOGGED_OUT_SUBSCRIPTION = Object.freeze({ status: "subscribed" });

type SnapshotRecord = { subscription?: unknown };

export const viewSubscription = (subscription: object): object => {
  const cached = subscriptionViews.get(subscription);
  if (cached) return cached;
  const view = new Proxy(subscription, {
    get(target, prop, receiver) {
      if (prop === "status") return "subscribed";
      return Reflect.get(target, prop, receiver);
    }
  });
  subscriptionViews.set(subscription, view);
  return view;
};

// Stable for a given snapshot object so useSyncExternalStore does not loop.
export const viewSnapshot = (snapshot: unknown): unknown => {
  if (!snapshot || typeof snapshot !== "object") return snapshot;
  const cached = subscribedViews.get(snapshot);
  if (cached) return cached;
  const view = new Proxy(snapshot as SnapshotRecord, {
    get(target, prop, receiver) {
      if (prop !== "subscription") return Reflect.get(target, prop, receiver);
      const subscription = Reflect.get(target, "subscription", receiver);
      if (!subscription || typeof subscription !== "object") return LOGGED_OUT_SUBSCRIPTION;
      return viewSubscription(subscription);
    }
  });
  subscribedViews.set(snapshot, view);
  return view;
};

export const patchSnapshotState = (ctor: unknown): void => {
  if (typeof ctor !== "function" || patchedSnapshotCtors.has(ctor)) return;
  const proto = (ctor as { prototype?: object }).prototype;
  if (!proto) return;
  const desc = Object.getOwnPropertyDescriptor(proto, "snapshot");
  if (!desc?.get) return;
  patchedSnapshotCtors.add(ctor);
  patchCounts.snapshot += 1;
  const read = desc.get;
  Object.defineProperty(proto, "snapshot", {
    configurable: true,
    enumerable: desc.enumerable ?? false,
    get() {
      return viewSnapshot(read.call(this));
    }
  });
};

type SubscribedStore = {
  get?: () => unknown;
  getSnapshot?: () => unknown;
};

export const patchSubscribedStore = (store: unknown): void => {
  if (!store || typeof store !== "object" || patchedStores.has(store)) return;
  const target = store as SubscribedStore;
  if (typeof target.get !== "function") return;
  patchedStores.add(store);
  patchCounts.store += 1;
  target.get = () => true;
  target.getSnapshot = () => true;
};

const isRuntimeConfig = (value: object): boolean =>
  "WEB_LOCALE_CATALOGS" in value || "EXPO_PUBLIC_BACKEND_URL" in value;

export const patchRuntimeConfig = (config: unknown): void => {
  if (!config || typeof config !== "object" || patchedConfigs.has(config)) return;
  if (!isRuntimeConfig(config)) return;
  patchedConfigs.add(config);
  patchCounts.config += 1;
  (config as { EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN?: string }).EXPO_PUBLIC_SKIP_IMPORT_COOLDOWN =
    "true";
};

export const patchModuleExports = (exported: unknown): void => {
  if (!exported || typeof exported !== "object") return;
  const record = exported as Record<string, unknown>;
  if ("SnapshotState" in record) patchSnapshotState(record.SnapshotState);
  if ("isSubscribedStore" in record) patchSubscribedStore(record.isSubscribedStore);
  if ("runtimeConfig" in record) patchRuntimeConfig(record.runtimeConfig);
  if ("env" in record) patchRuntimeConfig(record.env);
};

type MetroFactory = (this: unknown, ...args: unknown[]) => unknown;
type MetroDefine = (factory: MetroFactory, moduleId: unknown, dependencyMap: unknown) => unknown;

const moduleExportsFromArgs = (args: unknown[]): unknown => {
  const moduleObject = args[4] as { exports?: unknown } | undefined;
  if (moduleObject && typeof moduleObject === "object" && "exports" in moduleObject) {
    return moduleObject.exports;
  }
  return args[5];
};

export const wrapMetroFactory = (factory: MetroFactory): MetroFactory => {
  return function (this: unknown, ...args: unknown[]) {
    const result = factory.apply(this, args);
    try {
      patchModuleExports(moduleExportsFromArgs(args));
    } catch (err) {
      console.error("[Gizmo Unlimited] module patch failed:", err);
    }
    return result;
  };
};

type MetroGlobal = {
  __d?: MetroDefine;
};

// Install before Gizmo's Metro runtime assigns global `__d`. The runtime bails
// out if `__d` is already truthy, so the getter stays undefined until that
// assignment. After it, every factory the page registers is wrapped.
export const installMetroHook = (root: object): void => {
  const target = root as MetroGlobal;
  const existing = Object.getOwnPropertyDescriptor(target, "__d");
  if (existing?.get && existing.set) return;

  let impl: MetroDefine | undefined = typeof target.__d === "function" ? target.__d : undefined;
  const define: MetroDefine = (factory, moduleId, dependencyMap) => {
    if (!impl) return undefined;
    return impl(wrapMetroFactory(factory), moduleId, dependencyMap);
  };

  Object.defineProperty(target, "__d", {
    configurable: true,
    enumerable: true,
    get() {
      return impl ? define : undefined;
    },
    set(fn: MetroDefine) {
      impl = fn;
    }
  });
};
