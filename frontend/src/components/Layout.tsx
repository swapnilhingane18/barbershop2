/**
 * Layout Component
 * Main application layout with header and content area
 */

import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    title?: string;
}

export const Layout = ({ children, title = 'Barbershop Queue' }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">💈 {title}</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};
