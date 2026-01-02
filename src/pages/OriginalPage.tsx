import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DramaCard } from "@/components/DramaCard";
import { DramaCardSkeleton } from "@/components/LoadingSkeleton";
import { fetchLatest } from "@/lib/api";
import { Helmet } from "react-helmet-async";

export default function OriginalPage() {
  const { data: dramas, isLoading } = useQuery({
    queryKey: ["dramas", "original"],
    queryFn: fetchLatest,
  });

  return (
    <>
      <Helmet>
        <title>Drama Bahasa Asli - DramaBox & NetShort</title>
        <meta name="description" content="Koleksi drama dengan bahasa asli (Mandarin, Korea, dll)" />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
        <Header />

        <main className="p-4 md:px-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Bahasa Asli</h1>
          </div>

          {/* Drama Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <DramaCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {dramas?.map((drama) => (
                <DramaCard key={drama.bookId} drama={drama} />
              ))}
            </div>
          )}
        </main>

        <BottomNavigation />
      </div>
    </>
  );
}
