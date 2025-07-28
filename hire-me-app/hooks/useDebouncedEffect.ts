import { useEffect } from "react";

export function useDebouncedEffect(callback: () => void, delay: number) {
  useEffect(() => {
    const handler = setTimeout(callback, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
}
