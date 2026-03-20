import { useState, useEffect } from "react";
import "../index.css";

export default function FocusTimer() {
    const [studyMinutes, setStudyMinutes] = useState(45);
    const [breakMinutes, setBreakMinutes] = useState(10);
    const [mode, setMode] = useState('study'); // 'study' | 'break'
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isRunning && timeLeft === 0) {
            // Time is up!
            const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
            audio.play().catch(() => { });

            setIsRunning(false);

            if (mode === 'study') {
                alert("📚 Study session complete! Time for a 10 minute break.");
                setMode('break');
                setTimeLeft(breakMinutes * 60);
            } else {
                alert("☕ Break is over! Let's get back to focus.");
                setMode('study');
                setTimeLeft(studyMinutes * 60);
            }
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode, studyMinutes, breakMinutes]);

    // When user edits the duration of the current mode, we update timeLeft if it's not running
    const handleStudyChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setStudyMinutes(val);
        if (mode === 'study' && !isRunning) {
            setTimeLeft(val * 60);
        }
    };

    const handleBreakChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setBreakMinutes(val);
        if (mode === 'break' && !isRunning) {
            setTimeLeft(val * 60);
        }
    };

    const currentTotal = (mode === 'study' ? studyMinutes : breakMinutes) * 60;
    const progress = currentTotal > 0 ? ((currentTotal - timeLeft) / currentTotal) * 100 : 0;

    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const formattedTime = `${m}:${s < 10 ? '0' + s : s}`;

    const isStudy = mode === 'study';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px 10px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>

            {/* Settings Row */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', width: '100%', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Study (m)</span>
                    <input
                        type="number"
                        value={studyMinutes}
                        onChange={handleStudyChange}
                        disabled={isRunning && isStudy}
                        style={{ width: '50px', background: 'rgba(255,255,255,0.1)', border: '1px solid transparent', borderRadius: '6px', color: 'white', padding: '4px', textAlign: 'center', display: 'block', marginTop: '4px', outline: 'none' }}
                    />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Break (m)</span>
                    <input
                        type="number"
                        value={breakMinutes}
                        onChange={handleBreakChange}
                        disabled={isRunning && !isStudy}
                        style={{ width: '50px', background: 'rgba(255,255,255,0.1)', border: '1px solid transparent', borderRadius: '6px', color: 'white', padding: '4px', textAlign: 'center', display: 'block', marginTop: '4px', outline: 'none' }}
                    />
                </div>
            </div>

            {/* Circular Timer UI */}
            <div className="timer-circle" style={{
                width: '160px', height: '160px',
                background: `conic-gradient(${isStudy ? 'var(--accent-color)' : 'var(--success-color)'} ${progress}%, rgba(255,255,255,0.05) ${progress}%)`,
                boxShadow: isRunning ? `0 0 20px ${isStudy ? 'rgba(217, 70, 239, 0.4)' : 'rgba(16, 185, 129, 0.4)'}` : '0 0 15px rgba(0,0,0,0.3)'
            }}>
                <div className="timer-inner" style={{ background: 'var(--bg-color)' }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        color: isStudy ? 'var(--accent-color)' : 'var(--success-color)',
                        marginBottom: '4px',
                        textTransform: 'uppercase'
                    }}>
                        {mode}
                    </span>
                    <h1 style={{ fontSize: '36px', margin: 0, color: 'var(--text-main)' }}>
                        {formattedTime}
                    </h1>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            style={{
                                background: isRunning ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent-gradient)',
                                color: isRunning ? '#fca5a5' : 'white',
                                border: isRunning ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                                padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px'
                            }}
                        >
                            {isRunning ? '⏸️' : '▶️'}
                        </button>
                        <button
                            onClick={() => {
                                setIsRunning(false);
                                setTimeLeft(currentTotal);
                            }}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}
                        >
                            🔄
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
