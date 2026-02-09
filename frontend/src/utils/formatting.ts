/**
 * Formatting Utilities
 * Helper functions for date/time and wait time formatting
 */

/**
 * Format ISO 8601 date string to readable date
 * @param isoString - ISO 8601 date string
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

/**
 * Format ISO 8601 date string to readable time
 * @param isoString - ISO 8601 date string
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

/**
 * Format ISO 8601 date string to readable date and time
 * @param isoString - ISO 8601 date string
 * @returns Formatted date and time string (e.g., "Jan 15, 2024 at 2:30 PM")
 */
export const formatDateTime = (isoString: string): string => {
    return `${formatDate(isoString)} at ${formatTime(isoString)}`;
};

/**
 * Format wait time in minutes to human-readable string
 * @param minutes - Wait time in minutes
 * @returns Formatted wait time (e.g., "5 min", "1 hr 30 min")
 */
export const formatWaitTime = (minutes: number): string => {
    if (minutes < 1) {
        return 'Less than 1 min';
    }

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
};

/**
 * Get relative time from now
 * @param isoString - ISO 8601 date string
 * @returns Relative time string (e.g., "2 minutes ago", "in 5 minutes")
 */
export const getRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
        return 'Just now';
    }

    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};
