import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, Play, AlertCircle } from "lucide-react";

interface WatchHistoryItem {
  id: string;
  title: string;
  poster: string;
  lastWatched: number;
  episodeIndex?: number;
}

export default function WatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      setLoading(true);
      setError(null);
      
      const stored = localStorage.getItem("watchHistory");
      
      if (!stored) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(stored);
      
      if (!Array.isArray(parsed)) {
        console.error("Watch history is not an array:", parsed);
        setHistory([]);
        setLoading(false);
        return;
      }

      // Sort by lastWatched descending (most recent first)
      const sorted = parsed.sort((a: WatchHistoryItem, b: WatchHistoryItem) => 
        b.lastWatched - a.lastWatched
      );
      
      setHistory(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Error loading watch history:", err);
      setError("Gagal memuat riwayat tontonan");
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua riwayat tontonan?")) {
      try {
        localStorage.removeItem("watchHistory");
        setHistory([]);
      } catch (err) {
        console.error("Error clearing history:", err);
        alert("Gagal menghapus riwayat");
      }
    }
  };

  const removeItem = (id: string) => {
    try {
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      localStorage.setItem("watchHistory", JSON.stringify(updated));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Gagal menghapus item");
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "Baru saja";
      if (minutes < 60) return `${minutes} menit yang lalu`;
      if (hours < 24) return `${hours} jam yang lalu`;
      if (days < 7) return `${days} hari yang lalu`;
      
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Tidak diketahui";
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={loadHistory}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display gradient-text mb-2">
              Riwayat Tontonan
            </h1>
            <p className="text-muted-foreground">
              Drama yang pernah kamu tonton
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hapus Semua</span>
            </button>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Belum Ada Riwayat</h2>
            <p className="text-muted-foreground mb-6">
              Mulai menonton drama untuk melihat riwayat tontonanmu di sini
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Jelajahi Drama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {history.map((item) => (
              <div
                key={`${item.id}-${item.lastWatched}`}
                className="group relative glass rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Poster */}
                <Link
                  to={`/detail/${item.id}`}
                  className="block aspect-[2/3] relative overflow-hidden"
                >
                  {item.poster ? (
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300'%3E%3Crect fill='%23333' width='200' height='300'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Play className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3">
                  <Link
                    to={`/detail/${item.id}`}
                    className="block"
                  >
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
                      {item.title || "Untitled"}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.lastWatched)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/watch/${item.id}${item.episodeIndex !== undefined ? `?ep=${item.episodeIndex}` : ''}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      Lanjut
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
