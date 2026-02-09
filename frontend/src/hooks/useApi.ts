/**
 * useApi Hook
 * Generic hook for managing API call state (loading, error, data)
 */

import { useState } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    execute: (apiCall: () => Promise<T>) => Promise<T | null>;
    reset: () => void;
}

/**
 * Custom hook for managing API call state
 * @returns Object with data, loading, error states and execute function
 */
export const useApi = <T,>(): UseApiReturn<T> => {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = async (apiCall: () => Promise<T>): Promise<T | null> => {
        setState({ data: null, loading: true, error: null });

        try {
            const result = await apiCall();
            setState({ data: result, loading: false, error: null });
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setState({ data: null, loading: false, error: errorMessage });
            return null;
        }
    };

    const reset = () => {
        setState({ data: null, loading: false, error: null });
    };

    return {
        ...state,
        execute,
        reset,
    };
};
