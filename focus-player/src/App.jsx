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

                let timeInSeconds = 0;
                let displayTime = "0:00";
                let videoIndex = -1;

                if (playerRef && typeof playerRef.getCurrentTime === 'function') {
                  timeInSeconds = playerRef.getCurrentTime() || 0;
                  if (typeof playerRef.getPlaylistIndex === 'function') {
                    videoIndex = playerRef.getPlaylistIndex();
                  }
                  const m = Math.floor(timeInSeconds / 60);
                  const s = Math.floor(timeInSeconds % 60);
                  displayTime = `${m}:${s < 10 ? '0' + s : s}`;
                } else {
                  displayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                const newNote = { text: notes, time: displayTime, seconds: timeInSeconds, videoIndex: videoIndex };
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
                  <span
                    className="note-time"
                    onClick={() => {
                      if (note.seconds !== undefined && playerRef) {
                        if (note.videoIndex !== undefined && note.videoIndex >= 0 && typeof playerRef.getPlaylistIndex === 'function' && typeof playerRef.playVideoAt === 'function') {
                          if (playerRef.getPlaylistIndex() !== note.videoIndex) {
                            playerRef.playVideoAt(note.videoIndex);
                            setTimeout(() => { playerRef.seekTo(note.seconds); }, 800);
                            return;
                          }
                        }
                        if (typeof playerRef.seekTo === 'function') {
                          playerRef.seekTo(note.seconds);
                          playerRef.playVideo();
                        }
                      }
                    }}
                    style={{
                      cursor: note.seconds !== undefined ? 'pointer' : 'default',
                      display: 'inline-block',
                      background: note.seconds !== undefined ? 'rgba(217, 70, 239, 0.2)' : 'transparent',
                      padding: note.seconds !== undefined ? '4px 8px' : '0',
                      borderRadius: '6px',
                      color: note.seconds !== undefined ? 'white' : 'inherit',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px'
                    }}
                    title={note.seconds !== undefined ? "Click to seek video" : ""}
                  >
                    {note.videoIndex !== undefined && note.videoIndex >= 0 ? `▶ V${note.videoIndex + 1} | ${note.time}` : (note.seconds !== undefined ? `⏱ ${note.time}` : note.time)}
                  </span>
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