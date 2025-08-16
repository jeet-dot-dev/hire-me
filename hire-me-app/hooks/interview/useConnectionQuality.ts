import { useEffect, useMemo, useState } from "react";

export function useConnectionQuality() {
  const qualities = useMemo(() => ["excellent", "good", "poor"] as const, []);
  type Quality = typeof qualities[number];

  const [connectionQuality, setConnectionQuality] = useState<Quality>("excellent");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
      setConnectionQuality(randomQuality);
    }, 10000);

    return () => clearInterval(interval);
  }, [qualities]);

  return connectionQuality;
}
