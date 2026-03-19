import { useState } from "react";
import InputBox from "./components/InputBox";
import Player from "./components/Player";
import Timer from "./components/Timer";
import { getPlaylistId } from "./utils/extractPlaylist";

function App() {
  const [playlistId, setPlaylistId] = useState("");
  const [showSidebar, setShowSidebar] = useState(false); // ✅ sidebar state

  const handleSubmit = (url) => {
    const id = getPlaylistId(url);
    setPlaylistId(id);
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          
          {/* ☰ BUTTON */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={styles.menuButton}
          >
            ☰
          </button>

          <h2 style={{ margin: 0 }}>🎯 Focus Player</h2>
        </div>
      </div>

      {/* 🔥 SIDEBAR (LEFT) */}
      {showSidebar && (
  <>
    {/* 🔥 OVERLAY */}
    <div
      style={styles.overlay}
      onClick={() => setShowSidebar(false)}
    ></div>

    {/* 🔥 SIDEBAR */}
    <div style={styles.sidebar}>
      <h2>⚙️ Tools</h2>

      <div style={styles.section}>
        <h3>⏱ Timer</h3>
        <Timer />
      </div>

      <div style={styles.section}>
        <h3>📝 Notes</h3>
        <textarea
          placeholder="Write notes..."
          style={styles.textarea}
        />
      </div>
    </div>
  </>
)}

      {/* INPUT */}
      <div style={styles.inputRow}>
        <InputBox onSubmit={handleSubmit} />
      </div>

      {/* VIDEO */}
      <div style={styles.content}>
        <div style={styles.videoSection}>
          <Player playlistId={playlistId} />
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "white",
    height: "100vh",
    padding: "20px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "10px",
  },

  menuButton: {
    fontSize: "22px",
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  sidebar: {
  position: "fixed",
  top: "0",
  left: "0",
  width: "260px",
  height: "100vh",
  backgroundColor: "#1e1e1e",
  padding: "20px",
  boxShadow: "2px 0 10px rgba(0,0,0,0.5)",
  zIndex: 1000,

  transform: "translateX(0)",   // 🔥 visible position
  transition: "transform 0.3s ease",
},

  section: {
    marginBottom: "20px",
  },

  textarea: {
    width: "100%",
    height: "80px",
    borderRadius: "5px",
    border: "none",
    padding: "8px",
    backgroundColor: "#2a2a2a",
    color: "white",
  },

  inputRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "8px",
  },

  content: {
    display: "flex",
    justifyContent: "center",
    height: "calc(100vh - 110px)",
  },

  videoSection: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)", // 🔥 dark blur
  zIndex: 999,
},
};

export default App;