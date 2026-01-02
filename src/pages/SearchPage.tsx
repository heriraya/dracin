import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { searchDramas, fetchPopularSearch } from "@/lib/api";
import { DramaCard } from "@/components/DramaCard";
import { DramaCardSkeleton } from "@/components/LoadingSkeleton";
import { Helmet } from "react-helmet-async";

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: popularSearches } = useQuery({
    queryKey: ["popularSearches"],
    queryFn: fetchPopularSearch,
  });

  const { data: searchResults, isLoading, isFetching } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchDramas(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setSearchQuery(term);
  };

  return (
    <>
      <Helmet>
        <title>Cari Drama - DramaBox & NetShort</title>
        <meta name="description" content="Cari drama pendek, dracin, dan short drama favorit Anda" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Search Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          <form onSubmit={handleSearch} className="flex items-center gap-3 p-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-surface-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari drama..."
                className="w-full pl-10 pr-10 py-2.5 bg-surface-1 border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-gold-dark transition-colors"
            >
              Cari
            </button>
          </form>
        </header>

        <main className="p-4">
          {/* Popular Searches */}
          {!searchQuery && popularSearches && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-foreground mb-3">Pencarian Populer</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(term)}
                    className="px-3 py-1.5 bg-surface-1 border border-border rounded-full text-sm text-foreground hover:bg-surface-2 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Search Results */}
          {searchQuery && (
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">
                Hasil pencarian "{searchQuery}"
              </h2>

              {isLoading || isFetching ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <DramaCardSkeleton key={i} />
                  ))}
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map((drama) => (
                    <DramaCard key={drama.bookId} drama={drama} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Tidak ada hasil untuk "{searchQuery}"
                  </p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
}
