import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Single-instance audio preview player. Only one preview plays at a time;
 * calling toggle on the active url pauses it, calling on a new url switches.
 */
export function usePreviewPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.addEventListener("ended", () => setPlayingUrl(null));
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(
    (url: string) => {
      const audio = audioRef.current;
      if (!audio || !url) return;
      if (playingUrl === url) {
        audio.pause();
        setPlayingUrl(null);
        return;
      }
      audio.src = url;
      void audio.play().then(
        () => setPlayingUrl(url),
        () => setPlayingUrl(null),
      );
    },
    [playingUrl],
  );

  return { playingUrl, toggle };
}
