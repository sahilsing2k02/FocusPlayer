import { useState } from "react";

export default function InputBox({ onSubmit }) {
  const [url, setUrl] = useState("");

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Paste YouTube Playlist URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "none",
          marginRight: "10px",
        }}
      />

      <button
        onClick={() => onSubmit(url)}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#ff4757",
          color: "white",
          cursor: "pointer",
        }}
      >
        Start Focus
      </button>
    </div>
  );
}