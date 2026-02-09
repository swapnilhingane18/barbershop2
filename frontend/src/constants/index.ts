/**
 * Application Constants
 */

// Barber Configuration
export const BARBER_ID = 1; // TODO: Replace with API call when multi-barber support is added

// API Endpoints
export const API_ENDPOINTS = {
    // Queue Management
    QUEUE: {
        JOIN: '/api/queue/join',
        CANCEL: '/api/queue/cancel',
        COMPLETE: '/api/queue/complete',
        NO_SHOW: '/api/queue/no-show',
        GET_QUEUE: '/api/queue',
        GET_POSITION: '/api/queue/position',
    },
    // Slot Management
    SLOTS: {
        GENERATE: '/api/slots/generate',
        GET_SLOTS: '/api/slots',
        BOOK: '/api/slots', // + /{id}/book
    },
} as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
    CUSTOMER_ID: 'barbershop_customer_id',
    CUSTOMER_NAME: 'barbershop_customer_name',
    CUSTOMER_PHONE: 'barbershop_customer_phone',
} as const;
