import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface NetShortItem {
  id: string;
  title: string;
  cover: string;
}

export default function NetShortList() {
  const [data, setData] = useState<NetShortItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.sansekai.my.id/api/netshort/foryou")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data || []);
      })
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
            <div key={item.id} className="relative rounded-lg overflow-hidden">
              <img
                src={item.cover}
                alt={item.title}
                className="w-full aspect-[3/4] object-cover"
              />

              {/* TOMBOL PLAY */}
