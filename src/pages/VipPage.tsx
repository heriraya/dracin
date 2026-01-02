import { useQuery } from "@tanstack/react-query";
import { Crown } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DramaCard } from "@/components/DramaCard";
import { DramaCardSkeleton } from "@/components/LoadingSkeleton";
import { fetchVip } from "@/lib/api";
import { Helmet } from "react-helmet-async";

export default function VipPage() {
  const { data: vipDramas, isLoading } = useQuery({
    queryKey: ["dramas", "vip"],
    queryFn: fetchVip,
  });

  return (
    <>
      <Helmet>
        <title>VIP Drama - DramaBox & NetShort</title>
        <meta name="description" content="Koleksi drama VIP eksklusif dengan kualitas terbaik" />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
        <Header />

        <main className="p-4 md:px-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">VIP Drama</h1>
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
              {vipDramas?.map((drama) => (
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
