/**
 * TypeScript Interfaces for API Responses
 * Based on backend entity structures documented in Phase 0
 */

// Queue Status Enum (matches backend QueueStatus)
export const enum QueueStatus {
    WAITING = 'WAITING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    NO_SHOW = 'NO_SHOW',
}

// Slot Status Enum (matches backend SlotStatus)
export const enum SlotStatus {
    AVAILABLE = 'AVAILABLE',
    BOOKED = 'BOOKED',
    LOCKED = 'LOCKED',
}

// QueueEntry interface (matches backend QueueEntry entity)
export interface QueueEntry {
    id: number;
    barberId: number;
    customerId: number;
    position: number;
    status: QueueStatus;
    createdAt: string; // ISO 8601 format
    updatedAt: string; // ISO 8601 format
}

// Slot interface (matches backend Slot entity)
export interface Slot {
    id: number;
    barberId: number;
    startTime: string; // ISO 8601 format
    endTime: string; // ISO 8601 format
    status: SlotStatus;
    version: number;
    bookedByUserId: number | null;
}

// Customer interface (frontend-only, for localStorage)
export interface Customer {
    id: number;
    name: string;
    phone: string;
}

// Position Response (from GET /queue/position)
export interface PositionResponse {
    position: number;
    status: QueueStatus;
    estimatedWaitTime: number; // in minutes
}
