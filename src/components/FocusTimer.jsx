import { useState, useEffect } from "react";
import "../index.css";

const alarmAudio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");

export default function FocusTimer() {
    const [studyM, setStudyM] = useState(45);
    const [studyS, setStudyS] = useState(0);
    const [breakM, setBreakM] = useState(10);
    const [breakS, setBreakS] = useState(0);

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
            alarmAudio.currentTime = 0;
            alarmAudio.play().catch(e => console.log("Audio error:", e));

            setTimeout(() => setIsRunning(false), 0);

            setTimeout(() => {
                if (mode === 'study') {
                    alert("📚 Study session complete! Time for a break.");
                    setMode('break');
                    setTimeLeft(breakM * 60 + breakS);
                } else {
                    alert("☕ Break is over! Let's get back to focus.");
                    setMode('study');
                    setTimeLeft(studyM * 60 + studyS);
                }
            }, 500);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode, studyM, studyS, breakM, breakS]);

    const handleTimeChange = (type, unit, value) => {
        let val = parseInt(value) || 0;
        if (val < 0) val = 0;
        if (unit === 's' && val > 59) val = 59;

        if (type === 'study') {
            if (unit === 'm') setStudyM(val);
            if (unit === 's') setStudyS(val);
            if (mode === 'study' && !isRunning) {
                setTimeLeft(unit === 'm' ? (val * 60 + studyS) : (studyM * 60 + val));
            }
        } else {
            if (unit === 'm') setBreakM(val);
            if (unit === 's') setBreakS(val);
            if (mode === 'break' && !isRunning) {
                setTimeLeft(unit === 'm' ? (val * 60 + breakS) : (breakM * 60 + val));
            }
        }
    };

    const currentTotal = mode === 'study' ? (studyM * 60 + studyS) : (breakM * 60 + breakS);
    const progress = currentTotal > 0 ? ((currentTotal - timeLeft) / currentTotal) * 100 : 0;

    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const formattedTime = `${m}:${s < 10 ? '0' + s : s}`;

    const isStudy = mode === 'study';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>

            {/* Settings Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', width: '100%' }}>

                {/* Study Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(217, 70, 239, 0.1)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Study</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input type="number" min="0" value={studyM === 0 && studyS === 0 ? '' : studyM} onChange={(e) => handleTimeChange('study', 'm', e.target.value)} disabled={isRunning && isStudy} className="time-input" placeholder="00" />
                        <span style={{ color: 'var(--text-muted)' }}>:</span>
                        <input type="number" min="0" max="59" value={studyS === 0 && studyM === 0 ? '' : studyS} onChange={(e) => handleTimeChange('study', 's', e.target.value)} disabled={isRunning && isStudy} className="time-input" placeholder="00" />
                    </div>
                </div>

                {/* Break Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--success-color)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Break</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input type="number" min="0" value={breakM === 0 && breakS === 0 ? '' : breakM} onChange={(e) => handleTimeChange('break', 'm', e.target.value)} disabled={isRunning && !isStudy} className="time-input" placeholder="00" />
                        <span style={{ color: 'var(--text-muted)' }}>:</span>
                        <input type="number" min="0" max="59" value={breakS === 0 && breakM === 0 ? '' : breakS} onChange={(e) => handleTimeChange('break', 's', e.target.value)} disabled={isRunning && !isStudy} className="time-input" placeholder="00" />
                    </div>
                </div>

            </div>

            {/* Circular Timer UI */}
            <div className="timer-circle" style={{
                width: '240px', height: '240px',
                background: `conic-gradient(${isStudy ? 'var(--accent-color)' : 'var(--success-color)'} ${progress}%, rgba(255,255,255,0.05) ${progress}%)`,
                boxShadow: isRunning ? `0 0 35px ${isStudy ? 'rgba(217, 70, 239, 0.25)' : 'rgba(16, 185, 129, 0.25)'}` : '0 0 15px rgba(0,0,0,0.3)',
                transition: 'all 0.5s ease'
            }}>
                <div className="timer-inner" style={{ background: 'var(--bg-color)' }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        color: isStudy ? 'var(--accent-color)' : 'var(--success-color)',
                        marginBottom: '4px',
                        textTransform: 'uppercase'
                    }}>
                        {mode}
                    </span>
                    <h1 style={{ fontSize: '56px', margin: 0, color: 'var(--text-main)', fontWeight: '800', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>
                        {formattedTime}
                    </h1>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}>
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            style={{
                                width: '60px', height: '60px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isRunning ? 'rgba(255, 255, 255, 0.1)' : 'var(--text-main)',
                                color: isRunning ? 'var(--text-main)' : 'var(--bg-color)',
                                border: isRunning ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                cursor: 'pointer',
                                boxShadow: isRunning ? 'none' : '0 10px 30px rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                            onMouseEnter={(e) => !isRunning && (e.currentTarget.style.transform = 'scale(1.08)')}
                            onMouseLeave={(e) => !isRunning && (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            {isRunning ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}>
                                    <path d="M5 3l14 9-14 9V3z"></path>
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setIsRunning(false);
                                setMode('study');
                                setTimeLeft(studyM * 60 + studyS);
                            }}
                            style={{
                                width: '46px', height: '46px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)',
                                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                            title="Reset Timer"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                <path d="M3 3v5h5"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
