import { useEffect, useRef } from "react";

export default function Player({ playlistId, setPlayerRef }) {
  const playerContainerRef = useRef(null);

  useEffect(() => {
    if (!playlistId) return;

    let player;

    function createPlayer() {
      player = new window.YT.Player(playerContainerRef.current, {
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
          },
        },
      });
    }

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
  }, [playlistId, setPlayerRef]);

  return <div ref={playerContainerRef} style={{ width: "100%", height: "100%" }}></div>;
}