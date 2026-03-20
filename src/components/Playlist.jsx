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
                        className="playlist-card"
                        style={{
                            borderColor: isActive ? 'rgba(217, 70, 239, 0.5)' : '',
                            backgroundColor: isActive ? 'rgba(217, 70, 239, 0.1)' : ''
                        }}
                        onClick={() => {
                            if (playerRef && typeof playerRef.playVideoAt === 'function') {
                                playerRef.playVideoAt(index);
                            }
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <img
                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                alt="thumbnail"
                                className="playlist-thumb"
                            />
                            <span style={{
                                position: 'absolute',
                                bottom: '2px',
                                right: '4px',
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                fontSize: '10px',
                                padding: '1px 4px',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }}>
                                {index + 1}
                            </span>
                        </div>
                        <div className="playlist-info">
                            <span className="playlist-title" style={{ color: isActive ? 'var(--accent-color)' : '' }}>
                                Video #{index + 1}
                            </span>
                            <span className="playlist-sub">
                                {isActive ? '▶ Playing' : 'Click to play'}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
