import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWatchHistory,
  WatchHistoryItem,
} from "@/utils/watchHistory";

export default function History() {
  const [history, setHistory] = useState<WatchHistoryItem[] | null>(null);

  useEffect(() => {
    setHistory(getWatchHistory());
  }, []);

  if (history === null) {
    return null; // hindari flicker
  }

  if (!history.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Belum ada riwayat tontonan
      </div>
    );
  }

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Riwayat Tontonan</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {history.map((item) => (
          <Link key={item.id} to={`/watch/${item.id}`}>
            <div className="space-y-2">
              <img
                src={item.poster}
                className="rounded-lg aspect-[2/3] object-cover"
              />
              <h2 className="text-sm line-clamp-2">{item.title}</h2>
              <p className="text-xs text-muted-foreground">
                Terakhir ditonton:
                <br />
                {new Date(item.lastWatched).toLocaleString("id-ID")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
