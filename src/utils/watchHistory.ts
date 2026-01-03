export interface WatchHistoryItem {
  id: string;
  title: string;
  poster: string;
  lastWatched: number;
}

const KEY = "watch_history";

export function getWatchHistory(): WatchHistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveWatchHistory(item: WatchHistoryItem) {
  const history = getWatchHistory();

  // hapus duplikat
  const filtered = history.filter((h) => h.id !== item.id);

  filtered.unshift({
    ...item,
    lastWatched: Date.now(),
  });

  localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 100)));
}

export function clearWatchHistory() {
  localStorage.removeItem(KEY);
}
