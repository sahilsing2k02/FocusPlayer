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
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '16px', width: '100%',
            background: 'var(--c-overlay-strong)', padding: '18px',
            borderRadius: '20px', border: '1px solid var(--panel-border)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.15)'
        }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Study Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--c-overlay-light)', padding: '10px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Outfit' }}>Study</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--c-solid-bg)', padding: '4px 10px', borderRadius: '10px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                        <input type="number" min="0" value={studyM === 0 && studyS === 0 ? '' : studyM} onChange={(e) => handleTimeChange('study', 'm', e.target.value)} disabled={isRunning && isStudy} className="time-input" placeholder="00" style={{ width: '32px', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '16px', fontWeight: 'bold', outline: 'none' }} />
                        <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>:</span>
                        <input type="number" min="0" max="59" value={studyS === 0 && studyM === 0 ? '' : studyS} onChange={(e) => handleTimeChange('study', 's', e.target.value)} disabled={isRunning && isStudy} className="time-input" placeholder="00" style={{ width: '32px', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '16px', fontWeight: 'bold', outline: 'none' }} />
                    </div>
                </div>

                {/* Break Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--c-overlay-light)', padding: '10px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--success-color)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Outfit' }}>Break</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--c-solid-bg)', padding: '4px 10px', borderRadius: '10px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                        <input type="number" min="0" value={breakM === 0 && breakS === 0 ? '' : breakM} onChange={(e) => handleTimeChange('break', 'm', e.target.value)} disabled={isRunning && !isStudy} className="time-input" placeholder="00" style={{ width: '32px', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '16px', fontWeight: 'bold', outline: 'none' }} />
                        <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>:</span>
                        <input type="number" min="0" max="59" value={breakS === 0 && breakM === 0 ? '' : breakS} onChange={(e) => handleTimeChange('break', 's', e.target.value)} disabled={isRunning && !isStudy} className="time-input" placeholder="00" style={{ width: '32px', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '16px', fontWeight: 'bold', outline: 'none' }} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '4px' }}>
                <button
                    onClick={toggleTimer}
                    style={{ flex: 1, padding: '12px 0', borderRadius: '12px', background: isRunning ? 'var(--c-overlay)' : 'var(--accent-gradient)', color: isRunning ? 'var(--text-main)' : 'white', border: isRunning ? '1px solid var(--panel-border)' : 'none', cursor: 'pointer', fontWeight: '700', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', letterSpacing: '0.5px', boxShadow: isRunning ? 'none' : '0 4px 15px var(--accent-glow)', transition: 'all 0.2s' }}
                >
                    {isRunning ? (
                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Pause</>
                    ) : (
                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(2px)' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Start</>
                    )}
                </button>
                <button
                    onClick={resetTimer}
                    style={{ width: '48px', padding: '12px 0', borderRadius: '12px', background: 'var(--c-overlay)', color: 'var(--text-muted)', border: '1px solid var(--panel-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    title="Reset Timer"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path><path d="M3.51 15A9 9 0 0 0 18.36 18.36L23 14"></path></svg>
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
            background: isRunning ? (isStudy ? 'var(--c-overlay-strong)' : 'rgba(16, 185, 129, 0.15)') : 'var(--c-overlay)',
            border: `1px solid ${isRunning ? (isStudy ? 'var(--c-border-strong)' : 'rgba(16, 185, 129, 0.3)') : 'var(--c-overlay)'}`,
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
