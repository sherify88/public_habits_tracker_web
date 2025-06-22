import { useEffect, useRef } from 'react';

/**
 * A custom hook for setting up an interval that's declarative and lifecycle-aware.
 * @param callback The function to be called on each interval.
 * @param delay The interval delay in milliseconds. Set to null to pause the interval.
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
} 