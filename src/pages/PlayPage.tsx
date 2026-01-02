import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronDown, Maximize2, List, Play } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { fetchDetail, fetchAllEpisodes } from "@/lib/api";
import { PlayerSkeleton } from "@/components/LoadingSkeleton";
import { Helmet } from "react-helmet-async";
import { useWatchHistory } from "@/hooks/useWatchHistory";

export default function PlayPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialEpisode = parseInt(searchParams.get("ep") || "1", 10);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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

  // Check if there's a saved progress for this drama
  useEffect(() => {
    if (bookId && !searchParams.get("ep")) {
      const lastWatched = getLastWatched(bookId);
      if (lastWatched) {
        setCurrentEpisode(lastWatched.episode);
      }
    }
  }, [bookId, searchParams, getLastWatched]);

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

  const currentEpisodeData = episodes?.[currentEpisode - 1];

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
          {/* Video */}
          {currentEpisodeData?.videoUrl ? (
            <video
              ref={videoRef}
              src={currentEpisodeData.videoUrl}
              className="w-full h-full object-contain"
              onClick={handlePlayPause}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={drama.coverWap}
                alt={drama.bookName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 gradient-top-overlay p-4">
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
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => setCurrentEpisode((prev) => Math.min(prev + 1, drama.chapterCount))}
              className="p-2 rounded-full bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-colors"
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
                    onClick={() => {
                      setCurrentEpisode(ep);
                      setShowEpisodeList(false);
                    }}
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
