import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNetShortPlay } from "@/hooks/useNetShortPlay";

export default function WatchNetShort() {
  const { shortPlayId } = useParams<{ shortPlayId: string }>();
  const { data, loading } = useNetShortPlay(shortPlayId || "");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!data?.data?.videoUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Video tidak ditemukan
      </div>
    );
  }

  const { videoUrl, title, cover } = data.data;

  return (
    <main className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/netshort"
          className="inline-flex items-center gap-2 mb-4 text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali
        </Link>

        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video
            src={videoUrl}
            controls
            autoPlay
            poster={cover}
            className="w-full h-full"
          />
        </div>

        <h1 className="mt-4 text-xl font-bold">{title}</h1>
      </div>
    </main>
  );
}
