import React, { useEffect, useRef } from 'react';

export default function Ringtone({ isRing, src = '/ring.mp3' }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isRing) {
      audio.muted = false;      // ensure unmuted if autoplay blocked
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isRing]);

  return <audio ref={audioRef} src={src} preload="auto" loop />;
}
