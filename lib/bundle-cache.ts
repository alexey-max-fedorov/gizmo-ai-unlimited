export const CACHE_KEY = "patchedBundleCache";

export type CacheEntry = {
  bundleFilename: string;
  patchesHash: string;
  patchedBundle: string;
  storedAt: number;
};

// Subset of chrome.storage.StorageArea we depend on — keeps the module test-friendly.
export type StorageLocalApi = {
  get: (keys: string | string[]) => Promise<Record<string, unknown>>;
  set: (items: Record<string, unknown>) => Promise<void>;
  remove: (keys: string | string[]) => Promise<void>;
};

export const getCachedBundle = async (
  storage: StorageLocalApi
): Promise<CacheEntry | undefined> => {
  const result = await storage.get(CACHE_KEY);
  const value = result[CACHE_KEY];
  if (!value || typeof value !== "object") return undefined;
  const entry = value as Partial<CacheEntry>;
  if (
    typeof entry.bundleFilename !== "string" ||
    typeof entry.patchesHash !== "string" ||
    typeof entry.patchedBundle !== "string" ||
    typeof entry.storedAt !== "number"
  ) {
    return undefined;
  }
  return entry as CacheEntry;
};

export const setCachedBundle = async (
  storage: StorageLocalApi,
  entry: CacheEntry
): Promise<void> => {
  await storage.set({ [CACHE_KEY]: entry });
};

export const clearCachedBundle = async (
  storage: StorageLocalApi
): Promise<void> => {
  await storage.remove(CACHE_KEY);
};
