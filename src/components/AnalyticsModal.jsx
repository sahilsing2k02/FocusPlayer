import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../index.css";

export default function AnalyticsModal({ onClose }) {
    const [stats] = useState(() => {
        const data = localStorage.getItem("focus_analytics");
        return data ? JSON.parse(data) : {
            watchTime: 0,
            completedVideos: 0,
            streak: 0,
            dailyWatchTime: {}
        };
    });

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${totalSeconds % 60}s`;
    };

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const shortDate = d.toLocaleDateString('en-US', { weekday: 'short' });

        chartData.push({
            name: shortDate,
            minutes: stats.dailyWatchTime[dateStr] ? Math.round(stats.dailyWatchTime[dateStr] / 60) : 0
        });
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <h3>📊 Focus Analytics</h3>
                    <button onClick={onClose} className="close-btn">✖</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    <div className="stat-card">
                        <span className="stat-label">Total Focus Time</span>
                        <h2 className="stat-value">{formatTime(stats.watchTime)}</h2>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Videos Completed</span>
                        <h2 className="stat-value">{stats.completedVideos}</h2>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Current Streak</span>
                        <h2 className="stat-value">{stats.streak} 🔥</h2>
                    </div>
                </div>

                <h4 style={{ color: 'var(--text-main)', marginBottom: '16px', fontFamily: 'Outfit', fontSize: '20px' }}>Activity (Last 7 Days)</h4>
                <div style={{ width: '100%', height: '300px', background: 'var(--c-overlay)', borderRadius: '16px', padding: '20px 20px 0 0', border: '1px solid rgba(239,68,68,0.1)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.9)' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,68,68,0.1)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(239,68,68,0.1)" tick={{ fontSize: 12, fill: 'var(--c-overlay)' }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="rgba(239,68,68,0.1)" tick={{ fontSize: 12, fill: 'var(--c-overlay)' }} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip
                                cursor={{ fill: 'var(--c-overlay)' }}
                                contentStyle={{ background: 'var(--c-modal-bg)', border: '1px solid rgba(239,68,68, 0.4)', borderRadius: '12px', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                labelStyle={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '4px' }}
                            />
                            <Bar dataKey="minutes" fill="url(#colorUv)" radius={[8, 8, 0, 0]} maxBarSize={60} />
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.9} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
