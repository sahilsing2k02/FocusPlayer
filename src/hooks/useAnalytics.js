import { useEffect, useRef } from "react";

const defaultStats = {
    watchTime: 0,
    completedVideos: 0,
    lastActiveDate: null,
    streak: 0,
    dailyWatchTime: {}
};

export function useAnalytics(playerRef, setAnalytics) {
    const prevState = useRef(-1);

    useEffect(() => {
        if (!playerRef || typeof setAnalytics !== "function") return;

        const interval = setInterval(() => {
            if (typeof playerRef.getPlayerState !== "function") return;
            const state = playerRef.getPlayerState();
            const today = new Date().toISOString().split("T")[0];

            setAnalytics((currentStats) => {
                const stats = currentStats ? {
                    ...defaultStats,
                    ...currentStats,
                    dailyWatchTime: currentStats.dailyWatchTime || {}
                } : {
                    ...defaultStats
                };

                if (state === 1) {
                    stats.watchTime += 1;

                    if (!stats.dailyWatchTime[today]) stats.dailyWatchTime[today] = 0;
                    stats.dailyWatchTime[today] += 1;

                    if (stats.lastActiveDate !== today) {
                        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
                        stats.streak = stats.lastActiveDate === yesterday ? stats.streak + 1 : 1;
                        stats.lastActiveDate = today;
                    }
                }

                if (state === 0 && prevState.current === 1) {
                    stats.completedVideos += 1;
                }

                prevState.current = state;
                return stats;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [playerRef, setAnalytics]);
}
