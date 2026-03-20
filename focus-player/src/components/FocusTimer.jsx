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

            setIsRunning(false);

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
                width: '180px', height: '180px',
                background: `conic-gradient(${isStudy ? 'var(--accent-color)' : 'var(--success-color)'} ${progress}%, rgba(255,255,255,0.05) ${progress}%)`,
                boxShadow: isRunning ? `0 0 25px ${isStudy ? 'rgba(217, 70, 239, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` : '0 0 15px rgba(0,0,0,0.3)'
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
                    <h1 style={{ fontSize: '42px', margin: 0, color: 'var(--text-main)' }}>
                        {formattedTime}
                    </h1>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            style={{
                                background: isRunning ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent-gradient)',
                                color: isRunning ? '#fca5a5' : 'white',
                                border: isRunning ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                                padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px'
                            }}
                        >
                            {isRunning ? '⏸️' : '▶️'}
                        </button>
                        <button
                            onClick={() => {
                                setIsRunning(false);
                                setMode('study');
                                setTimeLeft(studyM * 60 + studyS);
                            }}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}
                        >
                            🔄
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
