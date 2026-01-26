import React from 'react';
import { Link } from '@inertiajs/react';

export default function Navigation() {
    return (
        <nav 
            className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-semibold text-gray-900">
                            Viofel Transportation
                        </Link>
                    </div>


                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-8">
                        <Link 
                            href="/reserve" 
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                        >
                            Reserve
                        </Link>
                        <Link 
                            href="/status" 
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                        >
                            Status
                        </Link>
                        <Link 
                            href="/payment" 
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                        >
                            Payment
                        </Link>
                        <Link 
                            href="/customer-support" 
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                        >
                            Customer Support
                        </Link>
                        <Link 
                            href="/about" 
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                        >
                            About Us
                        </Link>
                    </div>

                    {/* Learn More Button */}
                    <div className="hidden md:block">
                        <Link 
                            href="/learn-more"
                            className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-full text-sm font-medium transition duration-200"
                        >
                            Learn More ›
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button 
                            type="button" 
                            className="text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
