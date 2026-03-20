import { useState } from "react";
import "../index.css";

export default function InputBox({ onSubmit }) {
  const [url, setUrl] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit(url);
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Paste YouTube Playlist URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <button
          onClick={() => onSubmit(url)}
          className="search-btn"
        >
          🔍
        </button>
      </div>
    </div>
  );
}