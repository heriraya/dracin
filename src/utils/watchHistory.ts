interface WatchHistoryItem {
  id: string;
  title: string;
  poster: string;
  lastWatched: number;
  episodeIndex?: number;
}

export const saveWatchHistory = (item: WatchHistoryItem) => {
  try {
    const stored = localStorage.getItem("watchHistory");
    let history: WatchHistoryItem[] = stored ? JSON.parse(stored) : [];

    // Hapus item lama jika sudah ada (berdasarkan id)
    history = history.filter((h) => h.id !== item.id);

    // Tambahkan item baru di awal array
    history.unshift(item);

    // Batasi maksimal 50 item
    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    localStorage.setItem("watchHistory", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving watch history:", error);
  }
};
