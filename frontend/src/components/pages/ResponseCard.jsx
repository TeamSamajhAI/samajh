import { useRef, useState, useEffect } from "react";
import { responseCardStyles as styles } from "./ResponseCard.style";

function ResponseCard({ text, language, audioUrl }) {
  const audioRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const speeds = [1, 1.25, 1.5, 0.75];
  const [speedIndex, setSpeedIndex] = useState(0);

  /* 🔊 Audio sync + autoplay */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.playbackRate = speeds[speedIndex];

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const toggleSpeed = () => {
    const audio = audioRef.current;
    const next = (speedIndex + 1) % speeds.length;
    audio.playbackRate = speeds[next];
    setSpeedIndex(next);
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* 🚫 Nothing until explanation exists */
  if (!text) {
    return null;
  }

  return (
    <section style={styles.wrapper}>
      <div
        style={{
          ...styles.card,
          animation: "fadeUp 0.5s ease both",
        }}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={styles.title}>📘 Explanation</h3>
          <span style={styles.langBadge}>
            {language?.toUpperCase()}
          </span>
        </div>

        {/* DIVIDER */}
        <div style={styles.gradientDivider} />

        {/* TEXT */}
        <p style={styles.text}>{text}</p>

        {audioUrl && (
          <audio ref={audioRef} src={audioUrl} preload="metadata" />
        )}

        {/* AUDIO CONTROLS */}
        {audioUrl && (
          <div style={styles.audioBar}>
            <button
              onClick={togglePlay}
              style={{
                ...styles.playBtn,
                transform: isPlaying ? "scale(1.05)" : "scale(1)",
              }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                const t = Number(e.target.value);
                audioRef.current.currentTime = t;
                setCurrentTime(t);
              }}
              style={styles.progress}
            />

            <span style={styles.time}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button onClick={toggleSpeed} style={styles.speedBtn}>
              {speeds[speedIndex]}×
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ResponseCard;
