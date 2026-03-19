import { useRef } from "react";

export default function Player({ playlistId }) {
  const playerRef = useRef();

  if (!playlistId) return null;

  const url = `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;

  const goFullscreen = () => {
    if (playerRef.current.requestFullscreen) {
      playerRef.current.requestFullscreen();
    }
  };

  return (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: "90%",
        height: "90%",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={url}
        title="YouTube Player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  </div>
);
}