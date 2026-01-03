// src/hooks/useDramas.tsx
import { useQuery } from "@tanstack/react-query";
import type { Drama, SearchResult, ApiSource } from "@/types/drama";

// API Endpoints
const API_ENDPOINTS = {
  dramabox: "https://api.sansekai.my.id/api/dramabox",
  netshort: "https://api.sansekai.my.id/api/netshort/theaters",
};

// Extract dramas dari berbagai format response
function extractDramas(data: any, source: ApiSource): any[] {
  if (!data) return [];
  
  // Netshort: Array of groups dengan contentInfos
  if (source === "netshort") {
    if (Array.isArray(data)) {
      if (data.length > 0 && data[0].contentInfos) {
        return data.flatMap(group => 
          Array.isArray(group.contentInfos) ? group.contentInfos : []
        );
      }
      return data;
    }
    if (data.contentInfos && Array.isArray(data.contentInfos)) {
      return data.contentInfos;
    }
  }
  
  // Dramabox
  if (source === "dramabox") {
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.dramas && Array.isArray(data.dramas)) return data.dramas;
  }
  
  return [];
}

// Normalize drama ke format standar
function normalizeDrama(item: any, source: ApiSource): Drama {
  if (source === "netshort") {
    return {
      id: item.shortPlayId,
      title: item.shortPlayName,
      cover: item.shortPlayCover || item.groupShortPlayCover,
      labels: item.labelArray || [],
      heatScore: item.heatScore,
      scriptName: item.scriptName,
      publishTime: item.publishTime,
      source: "netshort",
      _raw: item,
    };
  }
  
  // Dramabox
  return {
    id: item.id || item.dramaId,
    title: item.title || item.name,
    cover: item.cover || item.thumbnail || item.image,
    labels: item.tags || item.genres || item.labels || [],
    heatScore: item.views || item.popularity,
    publishTime: item.publishTime || item.createdAt,
    source: "dramabox",
    _raw: item,
  };
}

// Fetch dramas
async function fetchDramas(
  endpoint: string, 
  source: ApiSource
): Promise<Drama[]> {
  const baseUrl = API_ENDPOINTS[source];
  const response = await fetch(`${baseUrl}/${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${source}: ${response.statusText}`);
  }
  
  const data = await response.json();
  const rawDramas = extractDramas(data, source);
  
  return rawDramas.map(item => normalizeDrama(item, source));
}

// Search dramas
async function searchDramas(
  query: string, 
  source: ApiSource
): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const baseUrl = API_ENDPOINTS[source];
  const response = await fetch(
    `${baseUrl}/search?query=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to search ${source}: ${response.statusText}`);
  }
  
  const data = await response.json();
  const rawDramas = extractDramas(data, source);
  
  return rawDramas.map(item => ({
    id: item.id || item.shortPlayId || item.dramaId,
    title: item.title || item.shortPlayName || item.name,
    cover: item.cover || item.shortPlayCover || item.thumbnail,
    labels: item.labels || item.labelArray || item.tags || [],
    heatScore: item.heatScore || item.views,
    source,
  }));
}

// ===== EXPORTED HOOKS =====

export function useForYouDramas(source: ApiSource = "netshort") {
  return useQuery({
    queryKey: ["dramas", source, "foryou"],
    queryFn: () => fetchDramas("foryou", source),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useLatestDramas(source: ApiSource = "netshort") {
  return useQuery({
    queryKey: ["dramas", source, "latest"],
    queryFn: () => fetchDramas("latest", source),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useTrendingDramas(source: ApiSource = "netshort") {
  return useQuery({
    queryKey: ["dramas", source, "trending"],
    queryFn: () => fetchDramas("trending", source),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useSearchDramas(query: string, source: ApiSource = "netshort") {
  const normalizedQuery = query.trim();
  
  return useQuery({
    queryKey: ["dramas", source, "search", normalizedQuery],
    queryFn: () => searchDramas(normalizedQuery, source),
    enabled: normalizedQuery.length > 0,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

// Hook untuk fetch dari kedua source sekaligus
export function useAllSourcesDramas(endpoint: "foryou" | "latest" | "trending") {
  const dramabox = useQuery({
    queryKey: ["dramas", "dramabox", endpoint],
    queryFn: () => fetchDramas(endpoint, "dramabox"),
    staleTime: 1000 * 60 * 5,
  });
  
  const netshort = useQuery({
    queryKey: ["dramas", "netshort", endpoint],
    queryFn: () => fetchDramas(endpoint, "netshort"),
    staleTime: 1000 * 60 * 5,
  });
  
  return {
    dramabox,
    netshort,
    combined: {
      data: [
        ...(dramabox.data || []),
        ...(netshort.data || []),
      ],
      isLoading: dramabox.isLoading || netshort.isLoading,
      isError: dramabox.isError && netshort.isError,
      error: dramabox.error || netshort.error,
    },
  };
}
