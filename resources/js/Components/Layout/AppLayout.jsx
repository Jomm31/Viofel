import React from 'react';
import Navigation from './Navigation';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navigation />
            <main className="pt-16 flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
