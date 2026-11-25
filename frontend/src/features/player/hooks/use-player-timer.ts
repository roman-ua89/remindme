import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { PLAYER_TIME_MAX_SECONDS_PER_REPORT } from '@remindme/contracts/activity';

import { recordPlayerTime, recordPlayerTimeKeepalive } from '@/features/activity/api';
import { useTodayActivity } from '@/features/activity/queries/use-today-activity';
import { countGapMs, crossesDropMark } from '@/features/player/utils/visible-time';
import { queryKeys } from '@/lib/query-keys';

const TICK_MS = 1000;
const FLUSH_INTERVAL_MS = 30_000;

function toLocalDay(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

/** The API accepts at most `PLAYER_TIME_MAX_SECONDS_PER_REPORT` per report. */
function splitIntoReports(seconds: number): Array<number> {
    const reports: Array<number> = [];
    for (let left = seconds; left > 0; left -= PLAYER_TIME_MAX_SECONDS_PER_REPORT) {
        reports.push(Math.min(left, PLAYER_TIME_MAX_SECONDS_PER_REPORT));
    }
    return reports;
}

/**
 * Today's Player time in seconds (saved total + time counted on this page), or `null` until the saved total loads.
 * Counts only time while the tab is visible: time in a hidden tab (background tab, minimized window) is skipped.
 * Elapsed time is reported to the API every `FLUSH_INTERVAL_MS`, on unmount and on `pagehide` (reload / tab close,
 * via fetch keepalive). A report that takes today's total across a whole drop (`SECONDS_PER_DROP`) invalidates the score.
 */
export function usePlayerTimer(): number | null {
    const queryClient = useQueryClient();
    const today = useTodayActivity();
    const [displaySeconds, setDisplaySeconds] = useState<number | null>(null);

    /** Today's total as known to the server; `null` until loaded. */
    const savedSecondsRef = useRef<number | null>(null);
    /** Counted on this page but not reported yet. */
    const pendingMsRef = useRef(0);
    const lastTickRef = useRef(Date.now());
    const dayRef = useRef(toLocalDay(new Date()));
    const isFlushingRef = useRef(false);

    // Start from the fresh saved total (not a cached one); a failed load starts from 0.
    const isTodaySettled = today.isFetchedAfterMount || today.isError;
    useEffect(() => {
        if (!isTodaySettled || savedSecondsRef.current !== null) {
            return;
        }
        savedSecondsRef.current = today.data?.date === dayRef.current ? today.data.playerSeconds : 0;
        setDisplaySeconds(savedSecondsRef.current + Math.floor(pendingMsRef.current / 1000));
    }, [isTodaySettled, today.data]);

    useEffect(() => {
        /** Moves the clock to now and counts the gap since the last call, if the tab was visible during it. */
        function collectElapsed(isVisible = document.visibilityState === 'visible') {
            const now = Date.now();
            pendingMsRef.current += countGapMs(now - lastTickRef.current, isVisible);
            lastTickRef.current = now;
        }

        function takePendingSeconds(maxSeconds: number): number {
            const seconds = Math.min(Math.floor(pendingMsRef.current / 1000), maxSeconds);
            pendingMsRef.current -= seconds * 1000;
            if (savedSecondsRef.current !== null) {
                savedSecondsRef.current += seconds;
            }
            return seconds;
        }

        async function flush() {
            // Wait for the saved total so the server's answer can't be double-counted on top of it.
            if (isFlushingRef.current || savedSecondsRef.current === null) {
                return;
            }
            const savedBeforeReport = savedSecondsRef.current;
            const seconds = takePendingSeconds(PLAYER_TIME_MAX_SECONDS_PER_REPORT);
            if (seconds < 1) {
                return;
            }

            isFlushingRef.current = true;
            const day = dayRef.current;
            try {
                const result = await recordPlayerTime(seconds);
                // Server total also includes time from other tabs.
                if (result.date === dayRef.current) {
                    savedSecondsRef.current = result.playerSeconds;
                    if (crossesDropMark(savedBeforeReport, result.playerSeconds)) {
                        void queryClient.invalidateQueries({ queryKey: queryKeys.activity.score });
                    }
                }
            } catch {
                pendingMsRef.current += seconds * 1000;
                // Never null again once loaded.
                if (day === dayRef.current) {
                    savedSecondsRef.current -= seconds;
                }
            } finally {
                isFlushingRef.current = false;
            }
        }

        function flushOnLeave(): Promise<unknown> {
            collectElapsed();
            const seconds = takePendingSeconds(Number.POSITIVE_INFINITY);
            return Promise.all(splitIntoReports(seconds).map(recordPlayerTimeKeepalive));
        }

        function tick() {
            collectElapsed();
            const day = toLocalDay(new Date());
            if (day !== dayRef.current) {
                // New local day: start from 0. Time counted just before midnight lands on the new day (≤ one flush interval).
                dayRef.current = day;
                if (savedSecondsRef.current !== null) {
                    savedSecondsRef.current = 0;
                }
                void flush();
            }
            const saved = savedSecondsRef.current;
            setDisplaySeconds(saved === null ? null : saved + Math.floor(pendingMsRef.current / 1000));
        }

        function handlePageHide() {
            void flushOnLeave();
        }

        function handlePageShow(event: PageTransitionEvent) {
            // Restored from bfcache: the page wasn't open in between.
            if (event.persisted) {
                lastTickRef.current = Date.now();
            }
        }

        function handleVisibilityChange() {
            if (document.visibilityState === 'hidden') {
                // The gap since the last tick was spent visible: count it before the hidden stretch starts.
                collectElapsed(true);
            } else {
                // Shown again: the hidden stretch was not counted, so the clock restarts now.
                lastTickRef.current = Date.now();
            }
        }

        lastTickRef.current = Date.now();
        const tickId = window.setInterval(tick, TICK_MS);
        const flushId = window.setInterval(() => void flush(), FLUSH_INTERVAL_MS);
        window.addEventListener('pagehide', handlePageHide);
        window.addEventListener('pageshow', handlePageShow);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.clearInterval(tickId);
            window.clearInterval(flushId);
            window.removeEventListener('pagehide', handlePageHide);
            window.removeEventListener('pageshow', handlePageShow);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            void flushOnLeave().then(() => queryClient.invalidateQueries({ queryKey: queryKeys.activity.all }));
        };
    }, [queryClient]);

    return displaySeconds;
}
