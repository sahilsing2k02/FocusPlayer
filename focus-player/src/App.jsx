// src/App.jsx
import { useState } from "react";
import InputBox from "./components/InputBox";
import Player from "./components/Player";
import Timer from "./components/Timer";
import FocusTimer from "./components/FocusTimer";
import Playlist from "./components/Playlist";
import FeedbackModal from "./components/FeedbackModal";
import AnalyticsModal from "./components/AnalyticsModal";
import { useAnalytics } from "./hooks/useAnalytics";
import { getPlaylistId } from "./utils/extractPlaylist";
import "./index.css";

function App() {
  const [playlistId, setPlaylistId] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [playerRef, setPlayerRef] = useState(null);

  useAnalytics(playerRef);

  const [notes, setNotes] = useState(
    localStorage.getItem("notes") || ""
  );

  const [timestampNotes, setTimestampNotes] = useState(
    JSON.parse(localStorage.getItem("timestampNotes")) || []
  );

  const handleSubmit = async (url) => {
    const id = getPlaylistId(url);
    if (id) {
      setPlaylistId(id);

      try {
        const titleRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/playlist?list=${id}`);
        const data = await titleRes.json();
        if (data && data.title) {
          setPlaylistTitle(data.title);
        } else {
          setPlaylistTitle("Focus Playlist");
        }
      } catch (err) {
        setPlaylistTitle("Focus Playlist");
      }
    }
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="header" style={{ justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="menu-btn"
          >
            ☰
          </button>
          <h2>Focus Player</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', marginLeft: '8px' }}>by Sahil Singh</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowAnalytics(true)}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setShowFeedback(true)}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '16px' }}
          >
            ⭐ Community Feedback
          </button>
        </div>
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

      {/* INPUT / HEADER */}
      <div className="input-row">
        {!playlistId ? (
          <InputBox onSubmit={handleSubmit} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h1 style={{ fontSize: '24px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              {playlistTitle || "Loading Title..."}
            </h1>
            <button
              onClick={() => { setPlaylistId(''); setPlaylistTitle(''); setPlayerRef(null); }}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s', marginLeft: '12px' }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              Change Playlist
            </button>
          </div>
        )}
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

      {/* ANALYTICS MODAL */}
      {showAnalytics && (
        <AnalyticsModal onClose={() => setShowAnalytics(false)} />
      )}

      {/* FEEDBACK MODAL */}
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
      {/* FOOTER / COPYRIGHT */}
      <footer style={{ textAlign: 'center', padding: '40px 0 20px 0', color: 'var(--text-muted)', fontSize: '13px', opacity: 0.6 }}>
        © 2026 FocusPlayer • Made by **Sahil Singh**
      </footer>
    </div>
  );
}

export default App;