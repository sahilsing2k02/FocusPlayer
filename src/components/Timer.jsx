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
      <div className="timer-circle" style={{
        background: `conic-gradient(var(--accent-color) ${progress}%, rgba(239,68,68,0.1) ${progress}%)`
      }}>
        <div className="timer-inner">
          <h1 style={{ fontSize: '32px' }}>
            {playlistData.total > 0 ? `${playlistData.index + 1} / ${playlistData.total}` : formatTime(currentTime)}
          </h1>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '8px', letterSpacing: '1px' }}>
            {playlistData.total > 0 ? "PLAYLIST PROGRESS" : `/ ${formatTime(duration)}`}
          </span>

          <div className="timer-controls">
            <button
              onClick={handleTogglePlay}
              className={`timer-btn ${isPlaying ? "danger" : "active"}`}
              disabled={!playerRef}
              style={{ opacity: playerRef ? 1 : 0.5, fontSize: '18px', padding: '6px 14px' }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <button
              onClick={handleReset}
              className="timer-btn"
              disabled={!playerRef}
              style={{ opacity: playerRef ? 1 : 0.5, fontSize: '18px', padding: '6px 14px' }}
              title="Restart Playlist"
            >
              🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}