import { useState } from "react";

export default function InputBox({ onSubmit }) {
  const [url, setUrl] = useState("");

  return (
    <div style={styles.wrapper}>
      
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Paste YouTube Playlist URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={() => onSubmit(url)}
          style={styles.searchButton}
        >
          🔍
        </button>
      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },

  searchBar: {
    display: "flex",
    alignItems: "center",
    width: "500px",
    backgroundColor: "#121212",
    border: "1px solid #303030",
    borderRadius: "25px",
    overflow: "hidden",
  },

  input: {
    flex: 1,
    padding: "10px 15px",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: "14px",
  },

  searchButton: {
    padding: "10px 15px",
    backgroundColor: "#303030",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
};