import { ChevronLeft, ChevronRight, Clock, TrendingUp, Sparkles, Crown } from "lucide-react";
import { useRef, useState } from "react";
import { DramaCard } from "./DramaCard";
import { Drama } from "@/lib/api";

interface DramaRowProps {
  title: string;
  dramas: Drama[];
  icon?: "latest" | "trending" | "foryou" | "vip";
  showRank?: boolean;
  showBadges?: boolean;
}

const icons = {
  latest: Clock,
  trending: TrendingUp,
  foryou: Sparkles,
  vip: Crown,
};

export function DramaRow({ title, dramas, icon, showRank, showBadges }: DramaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const Icon = icon ? icons[icon] : null;

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(updateScrollButtons, 300);
    }
  };

  const getBadgeType = (index: number): "new" | "popular" | null => {
    if (!showBadges) return null;
    if (index < 2) return "new";
    if (index < 5) return "popular";
    return null;
  };

  return (
    <section className="py-4 md:py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
        </div>
        
        {/* Desktop Scroll Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-full bg-surface-2 text-foreground hover:bg-surface-3 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-full bg-surface-2 text-foreground hover:bg-surface-3 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drama Cards Scroll */}
      <div
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex gap-3 overflow-x-auto hide-scrollbar px-4 md:px-8 pb-2"
      >
        {dramas.map((drama, index) => (
          <DramaCard
            key={drama.bookId}
            drama={drama}
            rank={showRank ? index + 1 : undefined}
            showBadge={getBadgeType(index)}
          />
        ))}
      </div>
    </section>
  );
}
