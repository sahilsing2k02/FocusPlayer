import { useEffect, useRef } from "react";

export function useAnalytics(playerRef) {
    const prevState = useRef(-1);

    useEffect(() => {
        if (!playerRef) return;

        const interval = setInterval(() => {
            if (typeof playerRef.getPlayerState !== 'function') return;
            const state = playerRef.getPlayerState();

            // Retrieve existing or initialize defaults
            let stats = JSON.parse(localStorage.getItem("focus_analytics")) || {
                watchTime: 0,
                completedVideos: 0,
                lastActiveDate: null,
                streak: 0,
                dailyWatchTime: {}
            };

            const today = new Date().toISOString().split('T')[0];

            // 1 = PLAYING
            if (state === 1) {
                stats.watchTime += 1;

                if (!stats.dailyWatchTime[today]) stats.dailyWatchTime[today] = 0;
                stats.dailyWatchTime[today] += 1;

                // Streak logic
                if (stats.lastActiveDate !== today) {
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    if (stats.lastActiveDate === yesterday) {
                        stats.streak += 1;
                    } else if (stats.lastActiveDate !== today) {
                        stats.streak = 1;
                    }
                    stats.lastActiveDate = today;
                }
            }

            // 0 = ENDED (Detecting completion of a single video)
            if (state === 0 && prevState.current === 1) {
                stats.completedVideos += 1;
            }

            // Sync and save state tracking to prevent multiple triggers
            prevState.current = state;
            localStorage.setItem("focus_analytics", JSON.stringify(stats));

        }, 1000);

        return () => clearInterval(interval);
    }, [playerRef]);
}
