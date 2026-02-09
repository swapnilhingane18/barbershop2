/**
 * Barber Context
 * Manages barber selection state across the application
 * Currently hardcoded to BARBER_ID = 1 for MVP
 */

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { BARBER_ID } from '../constants';

interface BarberContextType {
    barberId: number;
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

interface BarberProviderProps {
    children: ReactNode;
}

export const BarberProvider = ({ children }: BarberProviderProps) => {
    // Hardcoded to BARBER_ID = 1 for MVP
    // TODO: Replace with dynamic barber selection when multi-barber support is added
    const barberId = BARBER_ID;

    return (
        <BarberContext.Provider value={{ barberId }}>
            {children}
        </BarberContext.Provider>
    );
};

// Custom hook to use BarberContext
export const useBarber = () => {
    const context = useContext(BarberContext);
    if (context === undefined) {
        throw new Error('useBarber must be used within a BarberProvider');
    }
    return context;
};
