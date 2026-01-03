export interface WatchHistoryItem {
  id: string;
  title: string;
  poster: string;
  lastWatched: number;
}

const KEY = "watch_history";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getWatchHistory(): WatchHistoryItem[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWatchHistory(item: WatchHistoryItem) {
  if (!isBrowser()) return;

  const history = getWatchHistory();
  const filtered = history.filter((h) => h.id !== item.id);

  filtered.unshift(item);

  window.localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 100)));
}

export function clearWatchHistory() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
}
