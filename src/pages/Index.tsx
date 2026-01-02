import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DramaRow } from "@/components/DramaRow";
import { DramaRowSkeleton } from "@/components/LoadingSkeleton";
import { fetchLatest, fetchTrending, fetchForYou } from "@/lib/api";
import { Helmet } from "react-helmet-async";

export default function Index() {
  const { data: latestDramas, isLoading: loadingLatest } = useQuery({
    queryKey: ["dramas", "latest"],
    queryFn: fetchLatest,
  });

  const { data: trendingDramas, isLoading: loadingTrending } = useQuery({
    queryKey: ["dramas", "trending"],
    queryFn: fetchTrending,
  });

  const { data: forYouDramas, isLoading: loadingForYou } = useQuery({
    queryKey: ["dramas", "foryou"],
    queryFn: fetchForYou,
  });

  return (
    <>
      <Helmet>
        <title>DramaBox & NetShort - Nonton Drama Pendek & Dracin Sub Indo Gratis</title>
        <meta
          name="description"
          content="Platform terbaik untuk nonton drama pendek (short drama) dan dracin (drama China) terbaru gratis. Nikmati koleksi populer dari DramaBox dan Netshort dengan subtitle Indonesia dan kualitas HD."
        />
        <meta
          name="keywords"
          content="drama pendek, short drama, dracin gratis, nonton dracin, sub indo, dramabox free, netshort free, drama china pendek, aplikasi nonton drama, vip drama"
        />
        <meta property="og:title" content="DramaBox & NetShort - Nonton Drama Pendek Gratis" />
        <meta
          property="og:description"
          content="Nonton ribuan drama pendek dan dracin terbaru secara gratis. Akses eksklusif koleksi DramaBox dan Netshort dalam satu aplikasi."
        />
        <link rel="canonical" href="https://nontondracin.vercel.app/" />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
        <Header />

        <main>
          {/* Latest Section */}
          {loadingLatest ? (
            <DramaRowSkeleton />
          ) : (
            latestDramas && (
              <DramaRow
                title="Latest"
                dramas={latestDramas}
                icon="latest"
              />
            )
          )}

          {/* Trending Section */}
          {loadingTrending ? (
            <DramaRowSkeleton />
          ) : (
            trendingDramas && (
              <DramaRow
                title="Trending"
                dramas={trendingDramas}
                icon="trending"
                showRank
              />
            )
          )}

          {/* For You Section */}
          {loadingForYou ? (
            <DramaRowSkeleton />
          ) : (
            forYouDramas && (
              <DramaRow
                title="For You"
                dramas={forYouDramas}
                icon="foryou"
                showBadges
              />
            )
          )}
        </main>

        <BottomNavigation />
      </div>
    </>
  );
}
