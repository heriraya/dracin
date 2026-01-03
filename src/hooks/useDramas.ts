import { useQuery } from "@tanstack/react-query";
import type { Drama, SearchResult } from "@/types/drama";

const API_BASE = "https://api.sansekai.my.id/api/netshort/theaters";

// Helper untuk extract drama dari response Netshort
function extractDramasFromResponse(data: any): Drama[] {
  // Netshort mengembalikan array langsung atau object dengan contentInfos
  if (Array.isArray(data)) {
    return data;
  }
  
  // Jika ada structure seperti document yang diberikan
  if (data.contentInfos && Array.isArray(data.contentInfos)) {
    return data.contentInfos.map((item: any) => ({
      id: item.shortPlayId,
      shortPlayId: item.shortPlayId,
      shortPlayLibraryId: item.shortPlayLibraryId,
      title: item.shortPlayName,
      cover: item.shortPlayCover || item.groupShortPlayCover,
      labels: item.labelArray || [],
      heatScore: item.heatScore,
      scriptName: item.scriptName,
      publishTime: item.publishTime,
      // Map semua field lainnya
      ...item
    }));
  }
  
  return [];
}

// Fetch dramas dengan error handling yang lebih baik
async function fetchDramas(endpoint: string): Promise<Drama[]> {
  const response = await fetch(`${API_BASE}/${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dramas: ${response.statusText}`);
  }
  
  const data = await response.json();
  return extractDramasFromResponse(data);
}

// Search dramas
async function searchDramas(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const response = await fetch(
    `${API_BASE}/search?query=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to search dramas: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Transform response ke SearchResult format
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      id: item.shortPlayId || item.id,
      title: item.shortPlayName || item.title,
      cover: item.shortPlayCover || item.cover,
      labels: item.labelArray || item.labels || [],
      heatScore: item.heatScore,
      ...item
    }));
  }
  
  return extractDramasFromResponse(data) as SearchResult[];
}

// Hooks menggunakan TanStack Query
export function useForYouDramas() {
  return useQuery({
    queryKey: ["dramas", "foryou"],
    queryFn: () => fetchDramas("foryou"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useLatestDramas() {
  return useQuery({
    queryKey: ["dramas", "latest"],
    queryFn: () => fetchDramas("latest"),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useTrendingDramas() {
  return useQuery({
    queryKey: ["dramas", "trending"],
    queryFn: () => fetchDramas("trending"),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useSearchDramas(query: string) {
  const normalizedQuery = query.trim();
  
  return useQuery({
    queryKey: ["dramas", "search", normalizedQuery],
    queryFn: () => searchDramas(normalizedQuery),
    enabled: normalizedQuery.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
