/**
 * Toast Wrapper
 * Centralized toast notification setup using react-hot-toast
 */

import { Toaster } from 'react-hot-toast';

export const ToastContainer = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#363636',
                    color: '#fff',
                },
                success: {
                    duration: 3000,
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                    },
                },
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
};

// Export toast helper for easy imports
export { toast } from 'react-hot-toast';
