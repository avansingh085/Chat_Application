import React, { useEffect, useRef } from "react";

export default function Ringtone({ isRing, src = "/ring.mp3", isLoop = true }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = isLoop; 

    if (isRing) {
      audio.muted = false;

      audio
        .play()
        .then(() => {})
        .catch((err) => {
          console.log("Autoplay blocked:", err);
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isRing, isLoop]);

  return <audio ref={audioRef} src={src} preload="auto" />;
}
