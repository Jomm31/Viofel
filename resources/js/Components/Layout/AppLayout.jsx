import React from 'react';
import Navigation from './Navigation';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}
