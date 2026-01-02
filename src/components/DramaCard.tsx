import { Link } from "react-router-dom";
import { Drama } from "@/lib/api";

interface DramaCardProps {
  drama: Drama;
  rank?: number;
  showBadge?: "new" | "popular" | "top" | null;
}

export function DramaCard({ drama, rank, showBadge }: DramaCardProps) {
  return (
    <Link
      to={`/play/${drama.bookId}`}
      className="group relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] animate-fade-in"
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-1">
        <img
          src={drama.coverWap}
          alt={drama.bookName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-card-overlay opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {rank && (
            <span className="flex items-center justify-center w-8 h-6 rounded-md bg-badge-top text-foreground text-xs font-bold">
              TOP {rank}
            </span>
          )}
          {showBadge === "new" && (
            <span className="px-2 py-0.5 rounded-md bg-badge-new text-foreground text-xs font-medium">
              Terbaru
            </span>
          )}
          {showBadge === "popular" && (
            <span className="px-2 py-0.5 rounded-md bg-badge-popular text-primary-foreground text-xs font-medium">
              Terpopuler
            </span>
          )}
        </div>
        
        {/* DramaBox Badge */}
        {drama.cardType === 1 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/60 backdrop-blur-sm">
            <div className="w-3 h-3 rounded bg-primary flex items-center justify-center">
              <span className="text-[6px] font-bold text-primary-foreground">D</span>
            </div>
            <span className="text-[8px] text-foreground/90">DramaBox Eksklusif</span>
          </div>
        )}
        
        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {drama.bookName}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Ep.{drama.chapterCount}</span>
            {drama.tags && drama.tags[0] && (
              <span className="truncate">{drama.tags[0]}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
