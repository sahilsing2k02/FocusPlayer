/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from "react";
import "../index.css";

const alarmAudio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");

export function useFocusTimer() {
    const [studyM, setStudyM] = useState(45);
    const [studyS, setStudyS] = useState(0);
    const [breakM, setBreakM] = useState(10);
    const [breakS, setBreakS] = useState(0);

    const [mode, setMode] = useState('study');
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

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setMode('study');
        setTimeLeft(studyM * 60 + studyS);
    };

    return {
        studyM, studyS, breakM, breakS, mode, timeLeft, isRunning, handleTimeChange, toggleTimer, resetTimer
    };
}

export function FocusTimerSidebar({ timerProps }) {
    const { studyM, studyS, breakM, breakS, handleTimeChange, isRunning, mode, toggleTimer, resetTimer } = timerProps;
    const isStudy = mode === 'study';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '4px' }}>
                <button
                    onClick={toggleTimer}
                    style={{ flex: 1, padding: '10px 0', borderRadius: '10px', background: isRunning ? 'rgba(255,255,255,0.05)' : 'var(--accent-gradient)', color: isRunning ? 'var(--text-main)' : 'white', border: isRunning ? '1px solid rgba(255,255,255,0.1)' : 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                    {isRunning ? "⏸ Pause" : "▶ Start"}
                </button>
                <button
                    onClick={resetTimer}
                    style={{ width: '42px', padding: '10px 0', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Reset Timer"
                >
                    🔄
                </button>
            </div>
        </div>
    );
}

export function FocusTimerBadge({ timerProps }) {
    const { mode, timeLeft, isRunning } = timerProps;
    const isStudy = mode === 'study';
    
    const m = Math.floor(timeLeft / 60);
    const s = Math.floor(timeLeft % 60);
    const formattedTime = `${m}:${s < 10 ? '0' + s : s}`;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isRunning ? (isStudy ? 'rgba(217, 70, 239, 0.15)' : 'rgba(16, 185, 129, 0.15)') : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isRunning ? (isStudy ? 'rgba(217, 70, 239, 0.3)' : 'rgba(16, 185, 129, 0.3)') : 'rgba(255,255,255,0.1)'}`,
            padding: '6px 16px',
            borderRadius: '24px',
            color: isRunning ? (isStudy ? 'var(--accent-color)' : 'var(--success-color)') : 'var(--text-main)',
            fontWeight: 'bold',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.5px',
            transition: 'all 0.3s'
        }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>{mode}</span>
            <span style={{ fontSize: '15px' }}>{formattedTime}</span>
        </div>
    );
}
