import { History, Trash2, Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Helmet } from "react-helmet-async";
import { useWatchHistory, WatchHistoryItem } from "@/hooks/useWatchHistory";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

function HistoryCard({ item, onRemove }: { item: WatchHistoryItem; onRemove: () => void }) {
  return (
    <div className="relative flex gap-3 p-3 bg-surface-1 rounded-xl">
      {/* Poster */}
      <Link to={`/play/${item.id}?ep=${item.episode}`} className="relative flex-shrink-0">
        <img
          src={item.poster}
          alt={item.title}
          className="w-20 h-28 object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
          <Play className="w-8 h-8 text-primary fill-current" />
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-2 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/play/${item.id}?ep=${item.episode}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          Episode {item.episode} / {item.totalEpisodes}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(item.lastWatched, { addSuffix: true, locale: id })}
        </p>
        
        {/* Continue button */}
        <Link
          to={`/play/${item.id}?ep=${item.episode}`}
          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:bg-primary/90 transition-colors"
        >
          <Play className="w-3 h-3 fill-current" />
          Lanjutkan
        </Link>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useWatchHistory();

  return (
    <>
      <Helmet>
        <title>Riwayat Tonton - DramaBox & NetShort</title>
        <meta name="description" content="Riwayat drama yang pernah Anda tonton" />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
        <Header />

        <main className="p-4 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Riwayat Tonton</h1>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Semua</span>
              </button>
            )}
          </div>

          {/* History List */}
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => (
                <HistoryCard
                  key={`${item.id}-${item.lastWatched}`}
                  item={item}
                  onRemove={() => removeFromHistory(item.id)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-surface-1 flex items-center justify-center mb-4">
                <History className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Belum ada riwayat
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Drama yang Anda tonton akan muncul di sini sehingga Anda bisa melanjutkan kapan saja
              </p>
              <Link
                to="/"
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Jelajahi Drama
              </Link>
            </div>
          )}
        </main>

        <BottomNavigation />
      </div>
    </>
  );
}
