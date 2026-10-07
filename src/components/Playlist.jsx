import { useState, useEffect } from 'react';

export default function Playlist({ playerRef }) {
    const [videos, setVideos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let interval;

        if (playerRef) {
            interval = setInterval(() => {
                if (typeof playerRef.getPlaylist === 'function') {
                    const list = playerRef.getPlaylist() || [];
                    if (list.length > 0) {
                        setVideos(list);

                        if (typeof playerRef.getPlaylistIndex === 'function') {
                            setCurrentIndex(playerRef.getPlaylistIndex());
                        }
                    }
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [playerRef]);

    useEffect(() => {
        const el = document.getElementById(`playlist-video-${currentIndex}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentIndex]);

    if (!playerRef || videos.length === 0) {
        return (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No playlist loaded yet.
            </div>
        );
    }

    return (
        <div className="playlist-list">
            {videos.map((videoId, index) => {
                const isActive = index === currentIndex;
                return (
                    <div
                        id={`playlist-video-${index}`}
                        key={index}
                        className={`playlist-card ${isActive ? 'active' : ''}`}
                        onClick={() => {
                            if (playerRef && typeof playerRef.playVideoAt === 'function') {
                                playerRef.playVideoAt(index);
                            }
                        }}
                    >
                        <div className="playlist-thumb-wrapper">
                            <img
                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                alt="thumbnail"
                                className="playlist-thumb"
                            />
                            <span className="playlist-index-badge">
                                {index + 1}
                            </span>
                        </div>
                        <div className="playlist-info">
                            <span className="playlist-title">
                                Video #{index + 1}
                            </span>
                            <span className="playlist-sub">
                                {isActive ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-color)', fontWeight: '600' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        Playing
                                    </span>
                                ) : 'Click to play'}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
