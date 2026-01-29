import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    // Handle scroll to section on homepage
    const handleScrollToSection = (sectionId, e) => {
        e.preventDefault();
        
        // Check if we're on the homepage
        if (window.location.pathname === '/') {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                setIsOpen(false);
            }
        } else {
            // Navigate to homepage with hash
            window.location.href = `/#${sectionId}`;
        }
    };

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
                            href="/status" 
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                        >
                            Payment
                        </Link>
                        <a 
                            href="#contact-section"
                            onClick={(e) => handleScrollToSection('contact-section', e)}
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer"
                        >
                            Customer Support
                        </a>
                        <a 
                            href="#about-section"
                            onClick={(e) => handleScrollToSection('about-section', e)}
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer"
                        >
                            About Us
                        </a>
                    </div>

                    {/* Learn More Button */}
                    <div className="hidden md:block">
                        <a 
                            href="#about-section"
                            onClick={(e) => handleScrollToSection('about-section', e)}
                            className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded-full text-sm font-medium transition duration-200 cursor-pointer"
                        >
                            Learn More ›
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button 
                            type="button" 
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-gray-900 focus:outline-none p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link 
                            href="/reserve" 
                            className="block text-gray-700 hover:text-red-900 px-3 py-2 rounded-md text-base font-medium"
                        >
                            Reserve
                        </Link>
                        <Link 
                            href="/status" 
                            className="block text-gray-700 hover:text-red-900 px-3 py-2 rounded-md text-base font-medium"
                        >
                            Status
                        </Link>
                        <Link 
                            href="/status" 
                            className="block text-gray-700 hover:text-red-900 px-3 py-2 rounded-md text-base font-medium"
                        >
                            Payment
                        </Link>
                        <a 
                            href="#contact-section"
                            onClick={(e) => handleScrollToSection('contact-section', e)}
                            className="block text-gray-700 hover:text-red-900 px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                        >
                            Customer Support
                        </a>
                        <a 
                            href="#about-section"
                            onClick={(e) => handleScrollToSection('about-section', e)}
                            className="block text-gray-700 hover:text-red-900 px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                        >
                            About Us
                        </a>
                        <div className="mt-4 px-3">
                            <a 
                                href="#about-section"
                                onClick={(e) => handleScrollToSection('about-section', e)}
                                className="block w-full text-center bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-full text-base font-medium transition duration-200 cursor-pointer"
                            >
                                Learn More ›
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
