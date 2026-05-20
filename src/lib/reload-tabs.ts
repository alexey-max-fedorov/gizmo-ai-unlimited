export const GIZMO_TAB_URL_PATTERN = "https://*.gizmo.ai/*";

export type ReloadableTabsApi = {
  query: (info: { url: string | string[] }) => Promise<Array<{ id?: number }>>;
  reload: (tabId: number) => Promise<void>;
};

export const reloadGizmoTabs = async (tabs: ReloadableTabsApi): Promise<number> => {
  const matching = await tabs.query({ url: GIZMO_TAB_URL_PATTERN });
  let count = 0;
  for (const tab of matching) {
    if (typeof tab.id !== "number") continue;
    try {
      await tabs.reload(tab.id);
      count++;
    } catch {
      // Tab may have been closed between query and reload — ignore and move on.
    }
  }
  return count;
};
