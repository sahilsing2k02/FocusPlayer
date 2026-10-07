import { useState, useEffect } from "react";
import "../index.css";

export default function Timer({ playerRef }) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistData, setPlaylistData] = useState({ index: 0, total: 0 });

  useEffect(() => {
    let interval;

    if (playerRef && typeof playerRef.getCurrentTime === 'function') {
      interval = setInterval(() => {
        const current = playerRef.getCurrentTime() || 0;
        const total = playerRef.getDuration() || 0;
        const state = playerRef.getPlayerState ? playerRef.getPlayerState() : -1;

        let pIndex = 0;
        let pTotal = 0;
        let currentProgress = 0;

        if (typeof playerRef.getPlaylist === 'function' && typeof playerRef.getPlaylistIndex === 'function') {
          const arr = playerRef.getPlaylist();
          if (arr && arr.length > 0) {
            pTotal = arr.length;
            pIndex = playerRef.getPlaylistIndex();
            // Smoothly combine current video's ratio with index base
            const videoRatio = total > 0 ? (current / total) : 0;
            currentProgress = ((pIndex + videoRatio) / pTotal) * 100;
          } else if (total > 0) {
            currentProgress = (current / total) * 100;
          }
        }

        setCurrentTime(current);
        setDuration(total);
        setProgress(currentProgress);
        setIsPlaying(state === 1);
        setPlaylistData({ index: pIndex, total: pTotal });

      }, 1000);
    }

    return () => clearInterval(interval);
  }, [playerRef]);

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleTogglePlay = () => {
    if (!playerRef) return;
    if (isPlaying) {
      playerRef.pauseVideo();
    } else {
      playerRef.playVideo();
    }
  };

  const handleReset = () => {
    if (!playerRef) return;
    if (playlistData.total > 0 && typeof playerRef.playVideoAt === 'function') {
      playerRef.playVideoAt(0); // Restart entire playlist
    } else {
      playerRef.seekTo(0);
      playerRef.playVideo();
    }
  };

  return (
    <div className="timer-container">
      <div className="timer-circle" style={{ background: 'transparent' }}>
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)', zIndex: 1 }}>
          <circle cx="110" cy="110" r="102" fill="none" stroke="var(--c-overlay-strong)" strokeWidth="12" />
          <circle cx="110" cy="110" r="102" fill="none" stroke="var(--accent-color)" strokeWidth="12"
            strokeDasharray={2 * Math.PI * 102}
            strokeDashoffset={2 * Math.PI * 102 * (1 - (progress || 0) / 100)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="timer-inner">
          <h1 style={{ fontSize: '38px', margin: '0', letterSpacing: '-1px', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
            {playlistData.total > 0 ? `${Math.round(progress || 0)}%` : formatTime(currentTime)}
          </h1>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {playlistData.total > 0 ? `${playlistData.index + 1} of ${playlistData.total} videos` : `/ ${formatTime(duration)}`}
          </span>

          <div className="timer-controls">
            <button
              onClick={handleTogglePlay}
              className={`timer-btn ${isPlaying ? "danger" : "active"}`}
              disabled={!playerRef}
              style={{ opacity: playerRef ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', padding: 0, borderRadius: '50%' }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(2px)' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              )}
            </button>
            <button
              onClick={handleReset}
              className="timer-btn"
              disabled={!playerRef}
              style={{ opacity: playerRef ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', padding: 0, borderRadius: '50%' }}
              title="Restart Playlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path><path d="M3.51 15A9 9 0 0 0 18.36 18.36L23 14"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}