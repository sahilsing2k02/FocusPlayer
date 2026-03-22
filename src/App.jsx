// src/App.jsx
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import InputBox from "./components/InputBox";
import Player from "./components/Player";
import Timer from "./components/Timer";
import { useFocusTimer, FocusTimerSidebar, FocusTimerBadge } from "./components/FocusTimerElements";
import TodoList from "./components/TodoList";
import AmbientSounds from "./components/AmbientSounds";
import Playlist from "./components/Playlist";
import FeedbackModal from "./components/FeedbackModal";
import AnalyticsModal from "./components/AnalyticsModal";
import { useAnalytics } from "./hooks/useAnalytics";
import { getPlaylistId } from "./utils/extractPlaylist";
import "./index.css";

function App() {
  const timerProps = useFocusTimer();
  const [currentUrl, setCurrentUrl] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [playerRef, setPlayerRef] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useAnalytics(playerRef);

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }
  }, [theme]);

  const [notes, setNotes] = useState(
    localStorage.getItem("notes") || ""
  );
  const [noteTag, setNoteTag] = useState(
    localStorage.getItem("noteTag") || "None"
  );

  const [timestampNotes, setTimestampNotes] = useState(
    JSON.parse(localStorage.getItem("timestampNotes")) || []
  );

  const exportNotesToPDF = () => {
    if (timestampNotes.length === 0) {
      alert("No notes to export yet!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text(playlistTitle || "FocusPlayer Study Session", 10, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 10, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    timestampNotes.forEach((note, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      const videoStr = note.videoIndex !== undefined && note.videoIndex >= 0 ? `Video ${note.videoIndex + 1}` : 'Timer';
      const tagStr = note.tag && note.tag !== "None" ? `[${note.tag}]` : '';
      doc.text(`${index + 1}. ${videoStr} - ${note.time} ${tagStr}`, 10, yPos);
      
      yPos += 6;

      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(note.text, pageWidth - 20);
      doc.text(lines, 10, yPos);
      
      yPos += (lines.length * 6) + 6;
    });

    doc.save("FocusPlayer_Study_Notes.pdf");
  };

  const handleSubmit = async (url) => {
    const id = getPlaylistId(url);
    if (id) {
      setCurrentUrl(id);

      try {
        const titleRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/playlist?list=${id}`);
        const data = await titleRes.json();
        if (data && data.title) {
          setPlaylistTitle(data.title);
        } else {
          setPlaylistTitle("Focus Playlist");
        }
      } catch {
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
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <FocusTimerBadge timerProps={timerProps} />
          <button
            onClick={() => {
              const nextTheme = theme === "light" ? "dark" : "light";
              setTheme(nextTheme);
              localStorage.setItem("theme", nextTheme);
            }}
            style={{ background: 'transparent', border: '1px solid var(--panel-border)', borderRadius: '50%', color: 'var(--text-main)', fontSize: '18px', cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Toggle Theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <AmbientSounds />
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
            <FocusTimerSidebar timerProps={timerProps} />
          </div>

          <div className="sidebar-section">
            <h3>📋 Task List</h3>
            <TodoList />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['None', 'Important', 'Code', 'Review'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setNoteTag(tag);
                      localStorage.setItem("noteTag", tag);
                    }}
                    className={`tag-pill ${noteTag === tag ? 'active' : ''}`}
                  >
                    {tag === 'None' ? 'No Tag' : tag === 'Important' ? '🔴 Important' : tag === 'Code' ? '🔵 Code' : '🟠 Review'}
                  </button>
                ))}
              </div>
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

                  const newNote = { text: notes, time: displayTime, seconds: timeInSeconds, videoIndex: videoIndex, tag: noteTag };
                  const updated = [...timestampNotes, newNote];
                  setTimestampNotes(updated);
                  localStorage.setItem("timestampNotes", JSON.stringify(updated));
                  setNotes("");
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                ➕ Add Timestamp Note
              </button>
            </div>

            <div className="notes-list">
              {timestampNotes.map((note, index) => (
                <div key={index} className="note-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
                    {note.tag && note.tag !== "None" && (
                      <span style={{
                        fontSize: '10px', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        background: note.tag === 'Important' ? 'rgba(239, 68, 68, 0.2)' : note.tag === 'Code' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                        color: note.tag === 'Important' ? '#ef4444' : note.tag === 'Code' ? '#3b82f6' : '#f97316'
                      }}>
                        {note.tag === 'Important' ? '🔴 Important' : note.tag === 'Code' ? '🔵 Code' : '🟠 Review'}
                      </span>
                    )}
                  </div>
                  <p className="note-text">{note.text}</p>
                </div>
              ))}
            </div>

            <div className="notes-footer">
              <span>{notes.length} characters</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {timestampNotes.length > 0 && (
                  <button
                    onClick={exportNotesToPDF}
                    className="btn-clear"
                    style={{ borderColor: 'rgba(139, 92, 246, 0.4)', color: '#d8b4fe' }}
                    onMouseEnter={(e) => { e.target.style.background = 'rgba(139, 92, 246, 0.15)'; e.target.style.borderColor = 'rgba(139, 92, 246, 0.8)'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(139, 92, 246, 0.4)'; e.target.style.color = '#d8b4fe'; }}
                    title="Download Notes as PDF"
                  >
                    📄 To PDF
                  </button>
                )}
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
        {!currentUrl ? (
          <InputBox onSubmit={handleSubmit} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h1 style={{ fontSize: '24px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              {playlistTitle || "Loading Title..."}
            </h1>
            <button
              onClick={() => { setCurrentUrl(''); setPlaylistTitle(''); setPlayerRef(null); }}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s', marginLeft: '12px' }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              Change Playlist
            </button>
          </div>
        )}
      </div>

      {/* Main App Content */}
      <main className="content-area">
        <div className="player-wrapper">
          <Player playlistId={currentUrl} setPlayerRef={setPlayerRef} />
        </div>

        {currentUrl && (
          <div className="home-playlist-panel">
            <Timer playerRef={playerRef} />

            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "16px 0 12px 0" }}>
              <span style={{ fontSize: "16px" }}>🔀</span>
              <h3 style={{ fontSize: "14px", color: "var(--text-main)", fontWeight: "600", letterSpacing: "0.5px" }}>Playlist Queue</h3>
            </div>
            <Playlist playerRef={playerRef} />
          </div>
        )}
      </main>

      {/* ANALYTICS MODAL */}
      {showAnalytics && (
        <AnalyticsModal onClose={() => setShowAnalytics(false)} />
      )}

      {/* FEEDBACK MODAL */}
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
    </div>
  );
}

export default App;