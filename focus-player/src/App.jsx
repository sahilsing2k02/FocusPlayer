import { useState } from "react";
import InputBox from "./components/InputBox";
import Player from "./components/Player";
import Timer from "./components/Timer";
import FocusTimer from "./components/FocusTimer";
import Playlist from "./components/Playlist";
import { getPlaylistId } from "./utils/extractPlaylist";
import "./index.css";

function App() {
  const [playlistId, setPlaylistId] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [playerRef, setPlayerRef] = useState(null);

  const [notes, setNotes] = useState(
    localStorage.getItem("notes") || ""
  );

  const [timestampNotes, setTimestampNotes] = useState(
    JSON.parse(localStorage.getItem("timestampNotes")) || []
  );

  const handleSubmit = (url) => {
    const id = getPlaylistId(url);
    if (id) {
      setPlaylistId(id);
    }
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="header">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="menu-btn"
        >
          ☰
        </button>
        <h2>Focus Player</h2>
      </div>

      {/* SIDEBAR */}
      <>
        <div
          className={`sidebar-overlay ${showSidebar ? "open" : ""}`}
          onClick={() => setShowSidebar(false)}
        ></div>

        <div className={`sidebar ${showSidebar ? "open" : ""}`}>
          <div className="sidebar-title">
            ⚙️ Tools
          </div>

          <div className="sidebar-section">
            <h3>⏱ Focus Timer</h3>
            <FocusTimer />
          </div>

          <div className="sidebar-section">
            <h3>📝 Notes</h3>
            <textarea
              placeholder="Write your brilliant thoughts here..."
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                localStorage.setItem("notes", e.target.value);
              }}
              className="notes-input"
            />
            <button
              onClick={() => {
                if (!notes.trim()) return;
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const newNote = { text: notes, time: time };
                const updated = [...timestampNotes, newNote];
                setTimestampNotes(updated);
                localStorage.setItem("timestampNotes", JSON.stringify(updated));
                setNotes("");
              }}
              className="btn-primary"
            >
              ➕ Add Timestamp Note
            </button>

            <div className="notes-list">
              {timestampNotes.map((note, index) => (
                <div key={index} className="note-card">
                  <span className="note-time">{note.time}</span>
                  <p className="note-text">{note.text}</p>
                </div>
              ))}
            </div>

            <div className="notes-footer">
              <span>{notes.length} characters</span>
              <button
                onClick={() => {
                  setNotes("");
                  localStorage.removeItem("notes");
                }}
                className="btn-clear"
              >
                Clear Input
              </button>
            </div>

            {timestampNotes.length > 0 && (
              <button
                onClick={() => {
                  setTimestampNotes([]);
                  localStorage.removeItem("timestampNotes");
                }}
                className="btn-clear"
                style={{ width: "100%", marginTop: "10px", borderColor: "rgba(239, 68, 68, 0.1)" }}
              >
                Clear All Notes
              </button>
            )}
          </div>
        </div>
      </>

      {/* INPUT */}
      <div className="input-row">
        <InputBox onSubmit={handleSubmit} />
      </div>

      {/* VIDEO & PLAYLIST */}
      <div className="content-area">
        <div className="player-wrapper">
          <Player playlistId={playlistId} setPlayerRef={setPlayerRef} />
        </div>

        {playlistId && (
          <div className="home-playlist-panel">
            <Timer playerRef={playerRef} />

            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "16px 0 12px 0" }}>
              <span style={{ fontSize: "16px" }}>🔀</span>
              <h3 style={{ fontSize: "14px", color: "var(--text-main)", fontWeight: "600", letterSpacing: "0.5px" }}>Playlist Queue</h3>
            </div>
            <Playlist playerRef={playerRef} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;