import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface NetShortItem {
  shortPlayId: string;
  shortPlayName: string;
  shortPlayCover: string;
}

export default function NetShortList() {
  const [data, setData] = useState<NetShortItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.sansekai.my.id/api/netshort/foryou")
      .then((res) => res.json())
      .then((json) => {
        // 🔥 INI KUNCI UTAMA
        setData(Array.isArray(json.contentInfos) ? json.contentInfos : []);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="pt-24 text-center">Loading NetShort...</div>;
  }

  return (
    <main className="pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-4">NetShort</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((item) => (
            <div
              key={item.shortPlayId}
              className="relative rounded-lg overflow-hidden"
            >
              <img
                src={item.shortPlayCover}
                alt={item.shortPlayName}
                className="w-full aspect-[3/4] object-cover"
              />

              {/* ▶️ PLAY */}
              <Link
                to={`/watch/netshort/${item.shortPlayId}`}
                className="absolute inset-0 flex items-center justify-center
                           bg-black/40 opacity-0 hover:opacity-100 transition"
              >
                <Play className="w-12 h-12 text-white" />
              </Link>

              <p className="mt-2 text-sm line-clamp-2">
                {item.shortPlayName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
