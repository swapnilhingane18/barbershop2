/**
 * Queue Service
 * API methods for queue management
 */

import { api } from './api';
import { API_ENDPOINTS } from '../constants';
import type { QueueEntry, PositionResponse } from '../types';

/**
 * Customer joins the queue
 */
export const joinQueue = async (barberId: number, customerId: number): Promise<QueueEntry> => {
    const response = await api.post<QueueEntry>(API_ENDPOINTS.QUEUE.JOIN, null, {
        params: { barberId, customerId },
    });
    return response.data;
};

/**
 * Get current queue for a barber
 */
export const getQueue = async (barberId: number): Promise<QueueEntry[]> => {
    const response = await api.get<QueueEntry[]>(API_ENDPOINTS.QUEUE.GET_QUEUE, {
        params: { barberId },
    });
    return response.data;
};

/**
 * Get customer's position and estimated wait time
 */
export const getPosition = async (
    barberId: number,
    customerId: number
): Promise<PositionResponse> => {
    const response = await api.get<PositionResponse>(API_ENDPOINTS.QUEUE.GET_POSITION, {
        params: { barberId, customerId },
    });
    return response.data;
};

/**
 * Customer cancels their slot in the queue
 */
export const cancelSlot = async (barberId: number, customerId: number): Promise<string> => {
    const response = await api.post<string>(API_ENDPOINTS.QUEUE.CANCEL, null, {
        params: { barberId, customerId },
    });
    return response.data;
};

/**
 * Barber completes current customer (barber-only action)
 */
export const completeCustomer = async (barberId: number): Promise<string> => {
    const response = await api.post<string>(API_ENDPOINTS.QUEUE.COMPLETE, null, {
        params: { barberId },
    });
    return response.data;
};

/**
 * Barber marks current customer as no-show (barber-only action)
 */
export const markNoShow = async (barberId: number): Promise<string> => {
    const response = await api.post<string>(API_ENDPOINTS.QUEUE.NO_SHOW, null, {
        params: { barberId },
    });
    return response.data;
};
