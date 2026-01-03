import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { DramaGrid } from "@/components/DramaGrid";
import { useForYouDramas } from "@/hooks/useDramas";

const Index = () => {
  const { data: dramas, isLoading, error } = useForYouDramas();
  const [displayCount, setDisplayCount] = useState(9);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && dramas && displayCount < dramas.length) {
          // Load 9 more items
          setDisplayCount((prev) => Math.min(prev + 9, dramas.length));
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [dramas, displayCount]);

  const displayedDramas = dramas?.slice(0, displayCount);

  return (
    <main className="min-h-screen pb-20 md:pb-12">
      <HeroSection
        title="Drama Untuk Anda"
        description="Drama pilihan yang dipersonalisasi khusus untukmu. Temukan cerita seru yang sesuai selera!"
        icon="sparkles"
      />
      <div className="container mx-auto px-4 pb-12">
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Gagal memuat drama. Silakan coba lagi.</p>
          </div>
        )}
        
        <DramaGrid dramas={displayedDramas} isLoading={isLoading} />

        {/* Loader trigger untuk infinite scroll */}
        {dramas && displayCount < dramas.length && (
          <div ref={loaderRef} className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Menampilkan info jumlah */}
        {dramas && dramas.length > 9 && (
          <div className="text-center text-sm text-muted-foreground mt-6">
            Menampilkan {displayCount} dari {dramas.length} drama
          </div>
        )}
      </div>
    </main>
  );
};

export default Index;
