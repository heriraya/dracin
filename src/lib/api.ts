const API_BASE = "https://api.sansekai.my.id/api";

export interface Drama {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount: number;
  introduction: string;
  tags: string[];
  tagV3s: Array<{ tagId: number; tagName: string; tagEnName: string }>;
  protagonist?: string;
  rankVo?: {
    rankType: number;
    hotCode: string;
    sort: number;
  };
  cardType?: number;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface Episode {
  chapterId: string;
  chapterName: string;
  chapterIndex: number;
  videoUrl?: string;
  isVip: boolean;
  duration?: number;
}

export interface DramaDetail extends Drama {
  episodes?: Episode[];
}

// Helper to extract array from API response (handles both direct array and {data: [...]} formats)
function extractArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response;
  }
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: unknown }).data;
    if (Array.isArray(data)) {
      return data;
    }
  }
  return [];
}

export async function fetchLatest(): Promise<Drama[]> {
  const res = await fetch(`${API_BASE}/dramabox/latest`);
  if (!res.ok) throw new Error("Failed to fetch latest dramas");
  const json = await res.json();
  return extractArray<Drama>(json);
}

export async function fetchTrending(): Promise<Drama[]> {
  const res = await fetch(`${API_BASE}/dramabox/trending`);
  if (!res.ok) throw new Error("Failed to fetch trending dramas");
  const json = await res.json();
  return extractArray<Drama>(json);
}

export async function fetchForYou(): Promise<Drama[]> {
  const res = await fetch(`${API_BASE}/dramabox/foryou`);
  if (!res.ok) throw new Error("Failed to fetch for you dramas");
  const json = await res.json();
  return extractArray<Drama>(json);
}

export async function fetchVip(): Promise<Drama[]> {
  const res = await fetch(`${API_BASE}/dramabox/vip`);
  if (!res.ok) throw new Error("Failed to fetch VIP dramas");
  const json = await res.json();
  return extractArray<Drama>(json);
}

export async function fetchDubIndo(): Promise<Drama[]> {
  const res = await fetch(`${API_BASE}/dramabox/dubindo`);
  if (!res.ok) throw new Error("Failed to fetch dubbed dramas");
  const json = await res.json();
  return extractArray<Drama>(json);
}

export async function fetchDetail(bookId: string): Promise<DramaDetail> {
  const res = await fetch(`${API_BASE}/dramabox/detail?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch drama detail");
  const json = await res.json();
  // Handle both direct object and {data: {...}} formats
  if (json && typeof json === "object" && "data" in json) {
    return json.data;
  }
  return json;
}

export async function fetchAllEpisodes(bookId: string): Promise<Episode[]> {
  const res = await fetch(`${API_BASE}/dramabox/allepisode?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  const json = await res.json();
  return extractArray<Episode>(json);
}

export async function searchDramas(query: string): Promise<Drama[]> {
  const res = await fetch(`${API_BASE}/dramabox/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search dramas");
  const json = await res.json();
  return extractArray<Drama>(json);
}

export async function fetchPopularSearch(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/dramabox/populersearch`);
  if (!res.ok) throw new Error("Failed to fetch popular searches");
  const json = await res.json();
  return extractArray<string>(json);
}

export async function fetchRandomDrama(): Promise<Drama> {
  const res = await fetch(`${API_BASE}/dramabox/randomdrama`);
  if (!res.ok) throw new Error("Failed to fetch random drama");
  const json = await res.json();
  if (json && typeof json === "object" && "data" in json) {
    return json.data;
  }
  return json;
}
