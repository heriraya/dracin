import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function WatchNetShort() {
  const { id } = useParams<{ id: string }>();

  const videoUrl = `https://api.sansekai.my.id/api/netshort/play/${id}`;

  return (
    <main className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/netshort"
          className="inline-flex items-center gap-2 mb-4 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali
        </Link>

        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full"
          />
        </div>
      </div>
    </main>
  );
}
