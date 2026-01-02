import React, { useState, useEffect } from 'react';
import { Play, Film, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE = 'https://api.sansekai.my.id/api/dramabox';

export default function DramaBoxPlayer() {
  const [dramas, setDramas] = useState([]);
  const [selectedDrama, setSelectedDrama] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('latest');

  // Fetch latest dramas
  useEffect(() => {
    fetchDramas();
  }, [activeTab]);

  const fetchDramas = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeTab === 'latest' ? '/latest' : '/trending';
      const res = await fetch(`${API_BASE}${endpoint}`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      const dramaList = Array.isArray(data) ? data : data.data || [];
      setDramas(dramaList);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dramas:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectDrama = async (drama) => {
    setSelectedDrama(drama);
    setVideoData(null);
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/allepisode?bookId=${drama.bookId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      const episodeList = Array.isArray(data) ? data : data.data || [];
      setEpisodes(episodeList);
    } catch (err) {
      setError('Gagal memuat episode: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playEpisode = async (drama, episodeNum) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/stream?bookId=${drama.bookId}&episode=${episodeNum}`);
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.includes('limit') ? 'IP terkena rate limit. Tunggu beberapa menit.' : `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Stream data:', data);
      
      if (data.videoUrl || data.url || data.video) {
        setVideoData({
          url: data.videoUrl || data.url || data.video,
          episode: episodeNum,
          drama: drama.bookName
        });
      } else {
        setError('Video URL tidak ditemukan dalam response. Data: ' + JSON.stringify(data));
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching video:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Film className="w-10 h-10" />
          DramaBox Video Player
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'latest' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'trending' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Trending
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Video Player */}
        {videoData && (
          <div className="bg-black rounded-lg overflow-hidden mb-8 shadow-2xl">
            <video
              key={videoData.url}
              controls
              autoPlay
              className="w-full aspect-video"
              src={videoData.url}
            >
              <source src={videoData.url} type="video/mp4" />
              Browser Anda tidak mendukung video tag.
            </video>
            <div className="p-4 bg-gray-800">
              <p className="font-semibold text-lg">{videoData.drama}</p>
              <p className="text-sm text-gray-400">Episode {videoData.episode}</p>
            </div>
          </div>
        )}

        {/* Drama Grid */}
        {!selectedDrama && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-3">Loading dramas...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {dramas.map((drama) => (
                  <div
                    key={drama.bookId}
                    onClick={() => selectDrama(drama)}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
                  >
                    <img
                      src={drama.coverWap}
                      alt={drama.bookName}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2">{drama.bookName}</h3>
                      <p className="text-xs text-gray-400 mt-1">{drama.chapterCount} episodes</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Episode List */}
        {selectedDrama && (
          <div>
            <button
              onClick={() => {
                setSelectedDrama(null);
                setEpisodes([]);
                setVideoData(null);
              }}
              className="mb-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              ← Kembali
            </button>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex gap-6">
                <img
                  src={selectedDrama.coverWap}
                  alt={selectedDrama.bookName}
                  className="w-32 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedDrama.bookName}</h2>
                  <p className="text-sm text-gray-400 mb-4">{selectedDrama.introduction}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDrama.tags?.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-600/30 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-3">Loading episodes...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {episodes.map((ep, idx) => (
                  <button
                    key={ep.chapterId}
                    onClick={() => playEpisode(selectedDrama, idx + 1)}
                    className="bg-gray-700 hover:bg-purple-600 rounded-lg p-4 transition flex flex-col items-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    <span className="text-sm font-semibold">EP {idx + 1}</span>
                    {ep.isVip && <span className="text-xs text-yellow-400">VIP</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
