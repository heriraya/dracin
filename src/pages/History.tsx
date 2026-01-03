import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWatchHistory } from "@/utils/watchHistory";

interface HistoryItem {
  id: string;
  title: string;
  poster?: string;
  lastWatched: number;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const data = getWatchHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("History error:", e);
      setHistory([]);
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return null;
  }

  if (!history.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Belum ada riwayat tontonan
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Riwayat Tontonan</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {history.map((item) => (
          <Link key={item.id} to={`/watch/${item.id}`}>
            <div className="space-y-2">
              {/* SAFE IMAGE */}
              <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                {item.poster ? (
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              <h2 className="text-sm font-medium line-clamp-2">
                {item.title}
              </h2>

              <p className="text-xs text-muted-foreground">
                {new Date(item.lastWatched).toLocaleString("id-ID")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    <
