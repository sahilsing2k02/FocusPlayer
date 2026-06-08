import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
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
import { db } from "./firebase";
import "./index.css";

const defaultAnalytics = {
  watchTime: 0,
  completedVideos: 0,
  lastActiveDate: null,
  streak: 0,
  dailyWatchTime: {}
};

const getStoredJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getClientId = () => {
  const existing = localStorage.getItem("focus_client_id");
  if (existing) return existing;

  const nextId = crypto.randomUUID();
  localStorage.setItem("focus_client_id", nextId);
  return nextId;
};

function App() {
  const timerProps = useFocusTimer();
  const clientIdRef = useRef(getClientId());
  const profileReadyRef = useRef(false);
  const analyticsSaveTimeoutRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [playerRef, setPlayerRef] = useState(null);
  const [profileReady, setProfileReady] = useState(false);
  const [openToolSection, setOpenToolSection] = useState("timer");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notes, setNotes] = useState(localStorage.getItem("notes") || "");
  const [noteTag, setNoteTag] = useState(localStorage.getItem("noteTag") || "None");
  const [timestampNotes, setTimestampNotes] = useState(getStoredJson("timestampNotes", []));
  const [todos, setTodos] = useState(getStoredJson("focus_todos", []));
  const [analytics, setAnalytics] = useState(getStoredJson("focus_analytics", defaultAnalytics));

  const syncProfile = async (patch) => {
    if (!profileReadyRef.current) return;

    try {
      await setDoc(
        doc(db, "focusProfiles", clientIdRef.current),
        {
          ...patch,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving profile to Firebase:", error);
    }
  };

  useEffect(() => {
    const profileRef = doc(db, "focusProfiles", clientIdRef.current);

    const unsubscribe = onSnapshot(
      profileRef,
      (snapshot) => {
        const data = snapshot.data();

        if (data) {
          if (typeof data.theme === "string") setTheme(data.theme);
          if (typeof data.currentUrl === "string") setCurrentUrl(data.currentUrl);
          if (typeof data.playlistTitle === "string") setPlaylistTitle(data.playlistTitle);
          if (typeof data.noteTag === "string") setNoteTag(data.noteTag);
          if (Array.isArray(data.timestampNotes)) setTimestampNotes(data.timestampNotes);
          if (Array.isArray(data.todos)) setTodos(data.todos);
          if (data.analytics) {
            setAnalytics({
              ...defaultAnalytics,
              ...data.analytics,
              dailyWatchTime: data.analytics.dailyWatchTime || {}
            });
          }
        }

        profileReadyRef.current = true;
        setProfileReady(true);
      },
      (error) => {
        console.error("Error syncing Firebase profile:", error);
        profileReadyRef.current = true;
        setProfileReady(true);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.className = theme === "dark" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    syncProfile({ theme });
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("noteTag", noteTag);
    syncProfile({ noteTag });
  }, [noteTag]);

  useEffect(() => {
    localStorage.setItem("timestampNotes", JSON.stringify(timestampNotes));
    syncProfile({ timestampNotes });
  }, [timestampNotes]);

  useEffect(() => {
    localStorage.setItem("focus_todos", JSON.stringify(todos));
    syncProfile({ todos });
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("focus_analytics", JSON.stringify(analytics));

    if (!profileReady) return undefined;

    if (analyticsSaveTimeoutRef.current) {
      clearTimeout(analyticsSaveTimeoutRef.current);
    }

    analyticsSaveTimeoutRef.current = setTimeout(() => {
      syncProfile({ analytics });
      analyticsSaveTimeoutRef.current = null;
    }, 5000);

    return () => {
      if (analyticsSaveTimeoutRef.current) {
        clearTimeout(analyticsSaveTimeoutRef.current);
      }
    };
  }, [analytics, profileReady]);

  useEffect(() => () => {
    if (analyticsSaveTimeoutRef.current) {
      clearTimeout(analyticsSaveTimeoutRef.current);
    }
  }, []);

  useAnalytics(playerRef, setAnalytics);

  const exportNotesToPDF = () => {
    if (timestampNotes.length === 0) {
      alert("No notes to export yet!");
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 20;

    pdf.setFontSize(20);
    pdf.setTextColor(239, 68, 68);
    pdf.text(playlistTitle || "FocusPlayer Study Session", 10, yPos);

    yPos += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 10, yPos);
    yPos += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    timestampNotes.forEach((note, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFont("helvetica", "bold");
      const videoStr = note.videoIndex !== undefined && note.videoIndex >= 0 ? `Video ${note.videoIndex + 1}` : "Timer";
      const tagStr = note.tag && note.tag !== "None" ? `[${note.tag}]` : "";
      pdf.text(`${index + 1}. ${videoStr} - ${note.time} ${tagStr}`, 10, yPos);

      yPos += 6;

      pdf.setFont("helvetica", "normal");
      const lines = pdf.splitTextToSize(note.text, pageWidth - 20);
      pdf.text(lines, 10, yPos);

      yPos += (lines.length * 6) + 6;
    });

    pdf.save("FocusPlayer_Study_Notes.pdf");
  };

  const handleSubmit = async (url) => {
    const id = getPlaylistId(url);
    if (!id) return;

    setCurrentUrl(id);
    syncProfile({ currentUrl: id });

    try {
      const titleRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/playlist?list=${id}`);
      const data = await titleRes.json();
      const nextTitle = data && data.title ? data.title : "Focus Playlist";
      setPlaylistTitle(nextTitle);
      syncProfile({ playlistTitle: nextTitle });
    } catch {
      setPlaylistTitle("Focus Playlist");
      syncProfile({ playlistTitle: "Focus Playlist" });
    }
  };

  return (
    <div className="app-container">
      <div className="header" style={{ justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => setShowSidebar(!showSidebar)} className="menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <h2>Focus Player</h2>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <FocusTimerBadge timerProps={timerProps} />
          <AmbientSounds />
          <button
            onClick={() => setTheme((t) => t === "light" ? "dark" : "light")}
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: "14px", borderRadius: "16px", background: "var(--c-overlay-light)", border: "1px solid var(--c-border)", color: "var(--text-main)", boxShadow: "none" }}
            onMouseEnter={(e) => e.target.style.background = "var(--c-overlay)"}
            onMouseLeave={(e) => e.target.style.background = "var(--c-overlay-light)"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => setShowAnalytics(true)}
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: "14px", borderRadius: "16px", background: "var(--c-overlay-light)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--text-main)", boxShadow: "none" }}
            onMouseEnter={(e) => e.target.style.background = "var(--c-overlay)"}
            onMouseLeave={(e) => e.target.style.background = "var(--c-overlay-light)"}
          >
            Analytics
          </button>
          <button
            onClick={() => setShowFeedback(true)}
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: "14px", borderRadius: "16px" }}
          >
            Community Feedback
          </button>
        </div>
      </div>

      <>
        <div className={`sidebar-overlay ${showSidebar ? "open" : ""}`} onClick={() => setShowSidebar(false)}></div>

        <div className={`sidebar ${showSidebar ? "open" : ""}`}>
          <div className="sidebar-header">
            <div>
              <div className="sidebar-eyebrow">Workspace</div>
              <div className="sidebar-title">
                Study Tools
              </div>
            </div>
            <div className="sidebar-status">Focused Setup</div>
          </div>

          <div className="sidebar-section sidebar-panel">
            <button
              type="button"
              className={`sidebar-section-head sidebar-section-toggle ${openToolSection === "timer" ? "open" : ""}`}
              onClick={() => setOpenToolSection((current) => current === "timer" ? "" : "timer")}
            >
              <div>
                <div className="sidebar-section-index">1. Focus Timer</div>
                <p>Keep your session paced and intentional.</p>
              </div>
              <span className="sidebar-section-badge">{openToolSection === "timer" ? "Open" : "Closed"}</span>
            </button>
            {openToolSection === "timer" && (
              <div className="sidebar-section-body">
                <FocusTimerSidebar timerProps={timerProps} />
              </div>
            )}
          </div>

          <div className="sidebar-section sidebar-panel">
            <button
              type="button"
              className={`sidebar-section-head sidebar-section-toggle ${openToolSection === "tasks" ? "open" : ""}`}
              onClick={() => setOpenToolSection((current) => current === "tasks" ? "" : "tasks")}
            >
              <div>
                <div className="sidebar-section-index">2. Task List</div>
                <p>Track the work you want to finish today.</p>
              </div>
              <span className="sidebar-section-badge">{openToolSection === "tasks" ? "Open" : "Closed"}</span>
            </button>
            {openToolSection === "tasks" && (
              <div className="sidebar-section-body">
                <TodoList todos={todos} setTodos={setTodos} />
              </div>
            )}
          </div>

          <div className="sidebar-section sidebar-panel">
            <button
              type="button"
              className={`sidebar-section-head sidebar-section-toggle ${openToolSection === "notes" ? "open" : ""}`}
              onClick={() => setOpenToolSection((current) => current === "notes" ? "" : "notes")}
            >
              <div>
                <div className="sidebar-section-index">3. Notes</div>
                <p>Capture quick ideas and timestamped takeaways.</p>
              </div>
              <span className="sidebar-section-badge">{openToolSection === "notes" ? "Open" : "Closed"}</span>
            </button>
            {openToolSection === "notes" && (
              <div className="sidebar-section-body">
                <textarea
              placeholder="Write your brilliant thoughts here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-input"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["None", "Important", "Code", "Review"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setNoteTag(tag)}
                    className={`tag-pill ${noteTag === tag ? "active" : ""}`}
                  >
                    {tag === "None" ? "No Tag" : tag}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (!notes.trim()) return;

                  let timeInSeconds = 0;
                  let displayTime = "0:00";
                  let videoIndex = -1;

                  if (playerRef && typeof playerRef.getCurrentTime === "function") {
                    timeInSeconds = playerRef.getCurrentTime() || 0;
                    if (typeof playerRef.getPlaylistIndex === "function") {
                      videoIndex = playerRef.getPlaylistIndex();
                    }
                    const m = Math.floor(timeInSeconds / 60);
                    const s = Math.floor(timeInSeconds % 60);
                    displayTime = `${m}:${s < 10 ? `0${s}` : s}`;
                  } else {
                    displayTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  }

                  const newNote = { text: notes, time: displayTime, seconds: timeInSeconds, videoIndex, tag: noteTag };
                  setTimestampNotes((currentNotes) => [...currentNotes, newNote]);
                  setNotes("");
                }}
                className="btn-primary"
                style={{ width: "100%", padding: "12px" }}
              >
                Add Timestamp Note
              </button>
            </div>

            <div className="notes-list">
              {timestampNotes.map((note, index) => (
                <div key={index} className="note-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span
                      className="note-time"
                      onClick={() => {
                        if (note.seconds !== undefined && playerRef) {
                          if (note.videoIndex !== undefined && note.videoIndex >= 0 && typeof playerRef.getPlaylistIndex === "function" && typeof playerRef.playVideoAt === "function") {
                            if (playerRef.getPlaylistIndex() !== note.videoIndex) {
                              playerRef.playVideoAt(note.videoIndex);
                              setTimeout(() => { playerRef.seekTo(note.seconds); }, 800);
                              return;
                            }
                          }
                          if (typeof playerRef.seekTo === "function") {
                            playerRef.seekTo(note.seconds);
                            playerRef.playVideo();
                          }
                        }
                      }}
                      style={{
                        cursor: note.seconds !== undefined ? "pointer" : "default",
                        display: "inline-block",
                        background: note.seconds !== undefined ? "var(--c-overlay-strong)" : "transparent",
                        padding: note.seconds !== undefined ? "4px 8px" : "0",
                        borderRadius: "6px",
                        color: note.seconds !== undefined ? "var(--danger-color)" : "inherit",
                        fontSize: "11px",
                        fontWeight: "bold",
                        letterSpacing: "0.5px"
                      }}
                      title={note.seconds !== undefined ? "Click to seek video" : ""}
                    >
                      {note.videoIndex !== undefined && note.videoIndex >= 0 ? `V${note.videoIndex + 1} | ${note.time}` : (note.seconds !== undefined ? `Timer ${note.time}` : note.time)}
                    </span>
                    {note.tag && note.tag !== "None" && (
                      <span style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        background: note.tag === "Important" ? "var(--c-border)" : note.tag === "Code" ? "rgba(59, 130, 246, 0.2)" : "rgba(249, 115, 22, 0.2)",
                        color: note.tag === "Important" ? "#ef4444" : note.tag === "Code" ? "#3b82f6" : "#f97316"
                      }}>
                        {note.tag}
                      </span>
                    )}
                  </div>
                  <p className="note-text">{note.text}</p>
                </div>
              ))}
            </div>

            <div className="notes-footer">
              <span>{notes.length} characters</span>
              <div style={{ display: "flex", gap: "8px" }}>
                {timestampNotes.length > 0 && (
                  <button
                    onClick={exportNotesToPDF}
                    className="btn-clear"
                    style={{ borderColor: "var(--c-border-heavy)", color: "var(--danger-color)" }}
                    onMouseEnter={(e) => { e.target.style.background = "var(--c-overlay)"; e.target.style.borderColor = "var(--c-hover-solid)"; }}
                    onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "var(--c-border-heavy)"; e.target.style.color = "var(--danger-color)"; }}
                    title="Download Notes as PDF"
                  >
                    To PDF
                  </button>
                )}
                <button
                  onClick={() => setNotes("")}
                  className="btn-clear"
                >
                  Clear Input
                </button>
              </div>
            </div>

            {timestampNotes.length > 0 && (
              <button
                onClick={() => setTimestampNotes([])}
                className="btn-clear"
                style={{ width: "100%", marginTop: "10px", borderColor: "rgba(239, 68, 68, 0.1)" }}
              >
                Clear All Notes
              </button>
            )}
              </div>
            )}
          </div>
        </div>
      </>

      <div className="input-row">
        {!currentUrl ? (
          <InputBox onSubmit={handleSubmit} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "var(--c-card-bg)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "12px 24px", borderRadius: "40px", boxShadow: "0 10px 30px rgba(239, 68, 68, 0.1)" }}>
            <h1 style={{ fontSize: "24px", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
              {playlistTitle || "Loading Title..."}
            </h1>
            <button
              onClick={() => {
                setCurrentUrl("");
                setPlaylistTitle("");
                setPlayerRef(null);
                syncProfile({ currentUrl: "", playlistTitle: "" });
              }}
              style={{ background: "var(--c-overlay)", border: "none", color: "var(--danger-color)", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", transition: "all 0.2s", marginLeft: "12px" }}
              onMouseEnter={(e) => e.target.style.background = "var(--c-border)"}
              onMouseLeave={(e) => e.target.style.background = "var(--c-overlay)"}
            >
              Change Playlist
            </button>
          </div>
        )}
      </div>

      <main className="content-area">
        <div className="player-wrapper">
          <Player playlistId={currentUrl} setPlayerRef={setPlayerRef} />
        </div>

        {currentUrl && (
          <div className="home-playlist-panel">
            <Timer playerRef={playerRef} />

            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "16px 0 12px 0" }}>
              <span style={{ fontSize: "16px" }}>Queue</span>
              <h3 style={{ fontSize: "14px", color: "var(--text-main)", fontWeight: "600", letterSpacing: "0.5px" }}>Playlist Queue</h3>
            </div>
            <Playlist playerRef={playerRef} />
          </div>
        )}
      </main>

      {showAnalytics && (
        <AnalyticsModal onClose={() => setShowAnalytics(false)} stats={analytics} />
      )}

      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
    </div>
  );
}

export default App;
