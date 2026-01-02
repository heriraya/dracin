import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronDown, Maximize2, List, Play, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { fetchDetail, fetchAllEpisodes } from "@/lib/api";
import { PlayerSkeleton } from "@/components/LoadingSkeleton";
import { Helmet } from "react-helmet-async";
import { useWatchHistory } from "@/hooks/useWatchHistory";

const API_BASE = "https://api.sansekai.my.id/api/dramabox";

export default function PlayPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialEpisode = parseInt(searchParams.get("ep") || "1", 10);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const { addToHistory, updateProgress, getLastWatched } = useWatchHistory();

  const { data: drama, isLoading: loadingDetail } = useQuery({
    queryKey: ["drama", "detail", bookId],
    queryFn: () => fetchDetail(bookId!),
    enabled: !!bookId,
  });

  const { data: episodes, isLoading: loadingEpisodes } = useQuery({
    queryKey: ["drama", "episodes", bookId],
    queryFn: () => fetchAllEpisodes(bookId!),
    enabled: !!bookId,
  });

  // Fetch video stream URL
  const fetchVideoStream = async (episodeNum: number) => {
    if (!bookId) return;
    
    setLoadingVideo(true);
    setVideoError(null);
    setVideoUrl(null);
    
    try {
      console.log(`Fetching stream for bookId: ${bookId}, episode: ${episodeNum}`);
      
      const res = await fetch(`${API_BASE}/stream?bookId=${bookId}&episode=${episodeNum}`);
      
      if (!res.ok) {
        const text = await res.text();
        if (text.includes('limit') || text.includes('rate')) {
          throw new Error('Rate limit tercapai. Tunggu beberapa menit.');
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Stream response:', data);
      
      // Try different possible field names for video URL
      const url = data.videoUrl || data.url || data.video || data.m3u8 || data.playUrl || data.streamUrl;
      
      if (url) {
        setVideoUrl(url);
        console.log('Video URL set:', url);
      } else {
        console.error('No video URL in response:', data);
        throw new Error('Video URL tidak ditemukan dalam response API');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching video:', err);
      setVideoError(err.message);
    } finally {
      setLoadingVideo(false);
    }
  };

  // Check if there's a saved progress for this drama
  useEffect(() => {
    if (bookId && !searchParams.get("ep")) {
      const lastWatched = getLastWatched(bookId);
      if (lastWatched) {
        setCurrentEpisode(lastWatched.episode);
      }
    }
  }, [bookId, searchParams, getLastWatched]);

  // Fetch video when episode changes
  useEffect(() => {
    if (bookId && currentEpisode) {
      fetchVideoStream(currentEpisode);
    }
  }, [bookId, currentEpisode]);

  // Save to history when drama loads or episode changes
  useEffect(() => {
    if (drama && bookId) {
      addToHistory({
        id: bookId,
        title: drama.bookName,
        poster: drama.coverWap,
        episode: currentEpisode,
        totalEpisodes: drama.chapterCount,
        progress: 0,
        platform: "dramabox",
      });
    }
  }, [drama, bookId, currentEpisode, addToHistory]);

  // Update progress on video timeupdate
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !bookId) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      if (progress > 0) {
        updateProgress(bookId, currentEpisode, Math.round(progress));
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [bookId, currentEpisode, updateProgress]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleEpisodeChange = (ep: number) => {
    setCurrentEpisode(ep);
    setShowEpisodeList(false);
    // Video will auto-fetch due to useEffect
  };

  if (loadingDetail || loadingEpisodes) {
    return <PlayerSkeleton />;
  }

  if (!drama) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Drama tidak ditemukan</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{drama.bookName} - Nonton Gratis | DramaBox</title>
        <meta
          name="description"
          content={drama.introduction?.slice(0, 160) || `Nonton ${drama.bookName} gratis dengan subtitle Indonesia`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Video Player Container */}
        <div className="relative aspect-[9/16] max-h-[85vh] bg-surface-1">
          {/* Loading State */}
          {loadingVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-foreground">Loading episode {currentEpisode}...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {videoError && !loadingVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center px-4 max-w-md">
                <p className="text-destructive mb-4">{videoError}</p>
                <button
                  onClick={() => fetchVideoStream(currentEpisode)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Video */}
          {videoUrl && !videoError ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onClick={handlePlayPause}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={(e) => {
                console.error('Video error:', e);
                setVideoError('Gagal memuat video. Format mungkin tidak didukung.');
              }}
              controls
              autoPlay
            >
              <source src={videoUrl} type="application/x-mpegURL" />
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : !loadingVideo && !videoError ? (
            <div className="relative w-full h-full">
              <img
                src={drama.coverWap}
                alt={drama.bookName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <button
                  onClick={() => fetchVideoStream(currentEpisode)}
                  className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 gradient-top-overlay p-4 z-20">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>

              <div className="flex items-center gap-1 text-foreground text-sm">
                <span className="font-semibold">Ep.{currentEpisode}</span>
                <span className="text-muted-foreground">/ {drama.chapterCount} Episodes</span>
              </div>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-colors"
              >
                <Maximize2 className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
            <button
              onClick={() => setCurrentEpisode((prev) => Math.min(prev + 1, drama.chapterCount))}
              disabled={currentEpisode >= drama.chapterCount}
              className="p-2 rounded-full bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setShowEpisodeList(true)}
              className="p-2 rounded-full bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-colors"
            >
              <List className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Drama Info */}
        <div className="p-4 space-y-3">
          <h1 className="text-lg font-bold text-foreground">{drama.bookName}</h1>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {drama.introduction}
          </p>

          {/* Tags */}
          {drama.tags && drama.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {drama.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-surface-2 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Episode List Modal */}
        {showEpisodeList && (
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowEpisodeList(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 max-h-[60vh] bg-surface-1 rounded-t-2xl p-4 animate-slide-in-right overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Semua Episode</h3>
                <button
                  onClick={() => setShowEpisodeList(false)}
                  className="text-muted-foreground"
                >
                  Tutup
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: drama.chapterCount }, (_, i) => i + 1).map((ep) => (
                  <button
                    key={ep}
                    onClick={() => handleEpisodeChange(ep)}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      ep === currentEpisode
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-2 text-foreground hover:bg-surface-3"
                    }`}
                  >
                    {ep}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
