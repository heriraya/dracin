const KEY = "watch_history";

export function getWatchHistory() {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
