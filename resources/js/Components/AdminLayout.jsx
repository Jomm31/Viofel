import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminLayout({ title, children, auth }) {
  const handleLogout = (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      router.post('/admin/logout');
    }
  };

  return (
    <>
      <Head title={title} />
      
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white flex-shrink-0 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'cursive', color: '#ff4d6d' }}>
              Viofel Transport
            </h1>
          </div>
          
          <nav className="mt-6 px-4 space-y-2 flex-1">
            <Link
              href="/admin/reservations"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Reservations
            </Link>

            <Link
              href="/admin/buses"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Bus Management
            </Link>

            <Link
              href="/admin/pricing"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Pricing Management
            </Link>
            
            <Link
              href="/admin/paid-clients"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Paid Clients
            </Link>

            <Link
              href="/admin/invoices"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Invoices
            </Link>

            <Link
              href="/admin/refunds"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Refund Requests
            </Link>
            
            <Link
              href="/admin/inquiries"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Customer Inquiries
            </Link>
            
            <Link
              href="/admin/faqs"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              FAQs
            </Link>
            
            <Link
              href="/admin/analytics"
              className="block px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Analytics
            </Link>
          </nav>

          {/* User info and logout at bottom */}
          <div className="p-4 border-t border-gray-700">
            {auth?.admin && (
              <div className="mb-3 px-2">
                <p className="text-sm text-gray-400">Logged in as:</p>
                <p className="text-sm font-semibold">{auth.admin.username}</p>
                <p className="text-xs text-gray-500">{auth.admin.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-center"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
