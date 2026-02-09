/**
 * Customer Context
 * Manages customer identity and state across the application
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Customer } from '../types';
import { getCustomer, setCustomer as saveCustomer } from '../utils/localStorage';

interface CustomerContextType {
    customer: Customer | null;
    setCustomer: (id: number, name: string, phone: string) => void;
    isLoading: boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

interface CustomerProviderProps {
    children: ReactNode;
}

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
    const [customer, setCustomerState] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load customer from localStorage on mount
    useEffect(() => {
        const savedCustomer = getCustomer();
        if (savedCustomer) {
            setCustomerState(savedCustomer);
        }
        setIsLoading(false);
    }, []);

    const setCustomer = (id: number, name: string, phone: string) => {
        const newCustomer: Customer = { id, name, phone };
        setCustomerState(newCustomer);
        saveCustomer(id, name, phone);
    };

    return (
        <CustomerContext.Provider value={{ customer, setCustomer, isLoading }}>
            {children}
        </CustomerContext.Provider>
    );
};

// Custom hook to use CustomerContext
export const useCustomer = () => {
    const context = useContext(CustomerContext);
    if (context === undefined) {
        throw new Error('useCustomer must be used within a CustomerProvider');
    }
    return context;
};
