import { useEffect, useRef } from "react";

export default function Player({ playlistId, setPlayerRef }) {
  const playerContainerRef = useRef(null);

  useEffect(() => {
    if (!playlistId) return;

    let player;

    function createPlayer() {
      player = new window.YT.Player(playerContainerRef.current, {
        height: "400",
        width: "700",
        playerVars: {
          listType: "playlist",
          list: playlistId,
        },
        events: {
          onReady: (event) => {
            if (setPlayerRef) {
              setPlayerRef(event.target);
            }
          },
        },
      });
    }

    // Load API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (player) player.destroy();
    };
  }, [playlistId]);

  return <div ref={playerContainerRef}></div>;
}