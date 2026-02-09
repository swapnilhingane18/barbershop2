/**
 * Badge Component
 * Status indicator for queue entries
 */

import { QueueStatus } from '../types';

interface BadgeProps {
    status: QueueStatus;
    className?: string;
}

export const Badge = ({ status, className = '' }: BadgeProps) => {
    const statusConfig = {
        [QueueStatus.WAITING]: {
            label: 'Waiting',
            classes: 'bg-yellow-100 text-yellow-800',
        },
        [QueueStatus.IN_PROGRESS]: {
            label: 'In Progress',
            classes: 'bg-blue-100 text-blue-800',
        },
        [QueueStatus.COMPLETED]: {
            label: 'Completed',
            classes: 'bg-green-100 text-green-800',
        },
        [QueueStatus.NO_SHOW]: {
            label: 'No Show',
            classes: 'bg-red-100 text-red-800',
        },
    };

    const config = statusConfig[status];

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${config.classes} ${className}`}
        >
            {config.label}
        </span>
    );
};
