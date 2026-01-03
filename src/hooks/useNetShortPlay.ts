import { useEffect, useState } from "react";
import axios from "axios";

export function useNetShortPlay(shortPlayId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shortPlayId) return;

    setLoading(true);
    axios
      .get(`https://api.sansekai.my.id/api/netshort/play/${shortPlayId}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [shortPlayId]);

  return { data, loading };
}
