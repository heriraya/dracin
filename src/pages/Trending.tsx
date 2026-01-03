import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DramaCard } from "@/components/DramaCard";
import { DramaCardSkeleton } from "@/components/DramaCardSkeleton";
import type { Drama } from "@/types/drama";

const API_BASE = "https://api.sansekai.my.id/api/dramabox";

async function fetchVipDramas(): Promise<Drama[]> {
  const response = await fetch(
    `${API_BASE}/vip`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch VIP dramas");
  }
  return response.json();
}

export default function VipDrama() {
  const { data: dramas, isLoading } = useQuery({
    queryKey: ["dramas", "vip"],
    queryFn: () => fetchVipDramas(),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">
            Drama VIP
          </h1>
          <p className="text-muted-foreground">
            Drama eksklusif VIP
          </p>
        </div>

        {/* Drama Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <DramaCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {dramas?.map((drama, index) => (
                <DramaCard key={drama.bookId} drama={drama} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
      </div>
    </main>
  );
}
