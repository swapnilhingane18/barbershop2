/**
 * LocalStorage Utilities for Customer Identity Management
 */

import { STORAGE_KEYS } from '../constants';
import type { Customer } from '../types';

/**
 * Generate a unique customer ID using current timestamp
 * @returns A unique number-based customer ID
 */
export const generateCustomerId = (): number => {
    return Date.now();
};

/**
 * Retrieve customer data from localStorage
 * @returns Customer object if exists, null otherwise
 */
export const getCustomer = (): Customer | null => {
    const id = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
    const name = localStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME);
    const phone = localStorage.getItem(STORAGE_KEYS.CUSTOMER_PHONE);

    if (!id || !name || !phone) {
        return null;
    }

    return {
        id: parseInt(id, 10),
        name,
        phone,
    };
};

/**
 * Save customer data to localStorage
 * @param id - Customer ID
 * @param name - Customer name
 * @param phone - Customer phone number
 */
export const setCustomer = (id: number, name: string, phone: string): void => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_ID, id.toString());
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_NAME, name);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_PHONE, phone);
};

/**
 * Clear customer data from localStorage
 */
export const clearCustomer = (): void => {
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_ID);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_NAME);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_PHONE);
};
