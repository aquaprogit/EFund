import { useCallback, useRef } from 'react';

interface DebounceOptions {
    delay?: number;
}

export function useDebounceRequest(defaultDelay = 1000) {
    const refreshTimeout = useRef<NodeJS.Timeout>();
    const refreshPromise = useRef<Promise<any>>();
    const lastRefreshTime = useRef<number>(0);

    const executeRequest = useCallback(async <T>(
        requestFn: () => Promise<T>,
        options: DebounceOptions = {}
    ): Promise<T> => {
        const { delay = defaultDelay } = options;
        const now = Date.now();

        // If there's an ongoing request, return its promise
        if (refreshPromise.current) {
            return refreshPromise.current as Promise<T>;
        }

        // If we recently made a request, wait for the debounce period
        if (now - lastRefreshTime.current < delay) {
            return new Promise<T>((resolve) => {
                if (refreshTimeout.current) {
                    clearTimeout(refreshTimeout.current);
                }

                refreshTimeout.current = setTimeout(async () => {
                    try {
                        refreshPromise.current = requestFn();
                        const result = await refreshPromise.current;
                        lastRefreshTime.current = Date.now();
                        resolve(result);
                    } finally {
                        refreshPromise.current = undefined;
                    }
                }, delay);
            });
        }
        else {
            // Make the request immediately if we haven't made one recently
            try {
                refreshPromise.current = requestFn();
                const result = await refreshPromise.current;
                lastRefreshTime.current = Date.now();
                return result;
            } finally {
                refreshPromise.current = undefined;
            }
        }
    }, [defaultDelay]);

    const cleanup = useCallback(() => {
        if (refreshTimeout.current) {
            clearTimeout(refreshTimeout.current);
        }
        refreshPromise.current = undefined;
        lastRefreshTime.current = 0;
    }, []);

    return {
        executeRequest,
        cleanup
    };
} 