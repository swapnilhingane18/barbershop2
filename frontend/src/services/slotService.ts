/**
 * Slot Service
 * API methods for slot management
 */

import { api } from './api';
import { API_ENDPOINTS } from '../constants';
import type { Slot } from '../types';

/**
 * Generate appointment slots for a barber
 */
export const generateSlots = async (
    barberId: number,
    start: string, // ISO 8601 format
    end: string, // ISO 8601 format
    duration: number // minutes
): Promise<Slot[]> => {
    const response = await api.post<Slot[]>(API_ENDPOINTS.SLOTS.GENERATE, null, {
        params: { barberId, start, end, duration },
    });
    return response.data;
};

/**
 * Get available slots for a barber on a specific date
 */
export const getSlots = async (barberId: number, date: string): Promise<Slot[]> => {
    const response = await api.get<Slot[]>(API_ENDPOINTS.SLOTS.GET_SLOTS, {
        params: { barberId, date },
    });
    return response.data;
};

/**
 * Book a specific slot (optional for MVP)
 */
export const bookSlot = async (slotId: number, userId: number): Promise<Slot> => {
    const response = await api.post<Slot>(`${API_ENDPOINTS.SLOTS.BOOK}/${slotId}/book`, null, {
        params: { userId },
    });
    return response.data;
};
