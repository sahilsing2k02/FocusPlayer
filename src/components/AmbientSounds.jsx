import { useState, useRef, useEffect } from "react";
import "../index.css";

const SOUNDS = [
    { id: 'rain', name: 'Rain', icon: '🌧️', url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' }
];

export default function AmbientSounds() {
    const [volumes, setVolumes] = useState(SOUNDS.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {}));
    const audioRefs = useRef({});

    useEffect(() => {
        const currentRefs = audioRefs.current;
        SOUNDS.forEach(s => {
            const audio = new Audio(s.url);
            audio.loop = true;
            currentRefs[s.id] = audio;
        });

        return () => {
            SOUNDS.forEach(s => {
                const audio = currentRefs[s.id];
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, []);

    const handleVolumeChange = (id, vol) => {
        setVolumes(prev => ({ ...prev, [id]: vol }));
        const audio = audioRefs.current[id];
        if (audio) {
            audio.volume = vol;
            if (vol > 0 && audio.paused) {
                audio.play().catch(e => console.log('Audio play failed', e));
            } else if (vol === 0 && !audio.paused) {
                audio.pause();
            }
        }
    };

    return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'var(--c-overlay)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.1)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Ambient</span>
            <div style={{ display: 'flex', gap: '12px' }}>
                {SOUNDS.map(sound => (
                    <div key={sound.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span 
                            title={sound.name} 
                            style={{ 
                                cursor: 'pointer', 
                                fontSize: '18px', 
                                filter: volumes[sound.id] > 0 ? 'drop-shadow(0 0 8px rgba(239,68,68,0.1))' : 'grayscale(100%) opacity(40%)',
                                transform: volumes[sound.id] > 0 ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.2s ease'
                            }} 
                            onClick={() => handleVolumeChange(sound.id, volumes[sound.id] > 0 ? 0 : 0.5)}
                        >
                            {sound.icon}
                        </span>
                        {volumes[sound.id] > 0 && (
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volumes[sound.id]}
                                onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                                style={{ 
                                    width: '40px', 
                                    height: '4px', 
                                    appearance: 'none', 
                                    background: 'var(--accent-color)', 
                                    borderRadius: '2px', 
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
