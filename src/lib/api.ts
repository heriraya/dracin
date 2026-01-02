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

// Helper to extract array from API response
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

// Base fetch with error handling
async function apiFetch(endpoint: string): Promise<any> {
  try {
    const url = `${API_BASE}${endpoint}`;
    console.log('Fetching:', url);
    
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DramaBoxApp/1.0'
      }
    });
    
    if (!res.ok) {
      const text = await res.text();
      console.error('API Error:', res.status, text);
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    
    const json = await res.json();
    console.log('Response:', json);
    return json;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

export async function fetchLatest(): Promise<Drama[]> {
  const json = await apiFetch('/dramabox/latest');
  return extractArray<Drama>(json);
}

export async function fetchTrending(): Promise<Drama[]> {
  const json = await apiFetch('/dramabox/trending');
  return extractArray<Drama>(json);
}

export async function fetchForYou(): Promise<Drama[]> {
  const json = await apiFetch('/dramabox/foryou');
  return extractArray<Drama>(json);
}

export async function fetchVip(): Promise<Drama[]> {
  const json = await apiFetch('/dramabox/vip');
  return extractArray<Drama>(json);
}

export async function fetchDubIndo(): Promise<Drama[]> {
  const json = await apiFetch('/dramabox/dubindo');
  return extractArray<Drama>(json);
}

export async function fetchDetail(bookId: string): Promise<DramaDetail> {
  const json = await apiFetch(`/dramabox/detail?bookId=${bookId}`);
  if (json && typeof json === "object" && "data" in json) {
    return json.data;
  }
  return json;
}

export async function fetchAllEpisodes(bookId: string): Promise<Episode[]> {
  const json = await apiFetch(`/dramabox/allepisode?bookId=${bookId}`);
  return extractArray<Episode>(json);
}

export async function searchDramas(query: string): Promise<Drama[]> {
  const json = await apiFetch(`/dramabox/search?query=${encodeURIComponent(query)}`);
  return extractArray<Drama>(json);
}

export async function fetchPopularSearch(): Promise<string[]> {
  const json = await apiFetch('/dramabox/populersearch');
  return extractArray<string>(json);
}

export async function fetchRandomDrama(): Promise<Drama> {
  const json = await apiFetch('/dramabox/randomdrama');
  if (json && typeof json === "object" && "data" in json) {
    return json.data;
  }
  return json;
}

// Test function untuk debugging
export async function testAPI() {
  console.log('=== Testing API ===');
  
  try {
    console.log('\n1. Testing /dramabox/latest');
    const latest = await fetchLatest();
    console.log('✓ Latest dramas:', latest.length);
    
    if (latest.length > 0) {
      const firstDrama = latest[0];
      console.log('\n2. Testing /dramabox/detail');
      const detail = await fetchDetail(firstDrama.bookId);
      console.log('✓ Drama detail:', detail.bookName);
      
      console.log('\n3. Testing /dramabox/allepisode');
      const episodes = await fetchAllEpisodes(firstDrama.bookId);
      console.log('✓ Episodes:', episodes.length);
      
      if (episodes.length > 0) {
        console.log('\n📺 First episode video URL:', episodes[0].videoUrl);
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}
