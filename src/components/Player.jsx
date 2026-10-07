import { useEffect, useRef } from "react";

const POSITION_KEY = "focus_player_position";

function savePosition(player) {
  try {
    if (!player || typeof player.getPlaylistIndex !== "function") return;
    const index = player.getPlaylistIndex();
    const time = player.getCurrentTime() || 0;
    if (index >= 0) {
      localStorage.setItem(POSITION_KEY, JSON.stringify({ index, time }));
    }
  } catch { /* best-effort */ }
}

function getSavedPosition() {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const pos = JSON.parse(raw);
    if (typeof pos.index === "number" && typeof pos.time === "number") return pos;
  } catch { /* ignore */ }
  return null;
}

export default function Player({ playlistId, setPlayerRef }) {
  const containerRef = useRef(null);
  const positionSaveInterval = useRef(null);

  useEffect(() => {
    if (!playlistId) return;

    let player;
    
    // Create an un-managed inner div for YouTube to replace
    const ytTarget = document.createElement('div');
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(ytTarget);
    }

    function restorePosition(ytPlayer) {
      const saved = getSavedPosition();
      if (!saved || saved.index < 0) return;

      const playlist = ytPlayer.getPlaylist();
      if (!playlist || saved.index >= playlist.length) return;

      const currentIndex = ytPlayer.getPlaylistIndex();
      if (currentIndex !== saved.index) {
        ytPlayer.playVideoAt(saved.index);
        // Wait for the new video to load before seeking
        setTimeout(() => {
          if (saved.time > 0) ytPlayer.seekTo(saved.time, true);
          ytPlayer.pauseVideo();
        }, 1500);
      } else if (saved.time > 0) {
        ytPlayer.seekTo(saved.time, true);
        ytPlayer.pauseVideo();
      }
    }

    function createPlayer() {
      player = new window.YT.Player(ytTarget, {
        height: "100%",
        width: "100%",
        playerVars: {
          listType: "playlist",
          list: playlistId,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            if (setPlayerRef) {
              setPlayerRef(event.target);
            }
            // Restore position after the playlist has loaded
            setTimeout(() => restorePosition(event.target), 2000);
          },
        },
      });

      // Save position every 3 seconds while playing
      positionSaveInterval.current = setInterval(() => {
        if (player) savePosition(player);
      }, 3000);
    }

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    // Flush position on page unload
    const handleUnload = () => {
      if (player) savePosition(player);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (positionSaveInterval.current) {
        clearInterval(positionSaveInterval.current);
      }
      if (player && typeof player.destroy === 'function') {
        savePosition(player);
        player.destroy();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [playlistId, setPlayerRef]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>;
}