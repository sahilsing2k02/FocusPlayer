import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../index.css";

const defaultStats = {
    watchTime: 0,
    completedVideos: 0,
    streak: 0,
    dailyWatchTime: {}
};

export default function AnalyticsModal({ onClose, stats = defaultStats }) {
    const analytics = {
        ...defaultStats,
        ...stats,
        dailyWatchTime: stats.dailyWatchTime || {}
    };

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
        const dateStr = d.toISOString().split("T")[0];
        const shortDate = d.toLocaleDateString("en-US", { weekday: "short" });

        chartData.push({
            name: shortDate,
            minutes: analytics.dailyWatchTime[dateStr] ? Math.round(analytics.dailyWatchTime[dateStr] / 60) : 0
        });
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "800px" }}>
                <div className="modal-header">
                    <h3>Focus Analytics</h3>
                    <button onClick={onClose} className="close-btn">X</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
                    <div className="stat-card">
                        <span className="stat-label">Today's Focus Time</span>
                        <h2 className="stat-value">{formatTime(analytics.dailyWatchTime[new Date().toISOString().split("T")[0]] || 0)}</h2>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Videos Completed</span>
                        <h2 className="stat-value">{analytics.completedVideos}</h2>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Current Streak</span>
                        <h2 className="stat-value">
                            {analytics.streak} <span className="streak-fire" aria-label="fire">🔥</span>
                        </h2>
                        <span className="stat-caption">
                            {analytics.streak === 1 ? "day in a row" : "days in a row"}
                        </span>
                    </div>
                </div>

                <h4 style={{ color: "var(--text-main)", marginBottom: "16px", fontFamily: "Outfit", fontSize: "20px", fontWeight: "600", letterSpacing: "-0.5px" }}>Activity (Last 7 Days)</h4>
                <div style={{ width: "100%", height: "300px", background: "var(--c-overlay-strong)", backdropFilter: "blur(12px)", borderRadius: "20px", padding: "20px 20px 0 0", border: "1px solid var(--panel-border)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12, fill: "var(--text-muted)", fontWeight: "500" }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12, fill: "var(--text-muted)", fontWeight: "500" }} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip
                                cursor={{ fill: "var(--c-overlay-light)" }}
                                contentStyle={{ background: "var(--c-modal-bg)", backdropFilter: "blur(12px)", border: "1px solid var(--panel-border)", borderRadius: "16px", color: "var(--text-main)", boxShadow: "0 15px 35px rgba(0,0,0,0.2)" }}
                                labelStyle={{ color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}
                            />
                            <Bar dataKey="minutes" fill="url(#colorUv)" radius={[10, 10, 0, 0]} maxBarSize={60} />
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
