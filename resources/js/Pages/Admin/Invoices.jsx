import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';

export default function Invoices({ invoices = [] }) {
    const [processingId, setProcessingId] = useState(null);

    const confirmPayment = async (invoiceId) => {
        if (!confirm('Are you sure you want to confirm this payment?')) return;
        
        setProcessingId(invoiceId);
        try {
            const response = await fetch(`/admin/invoices/${invoiceId}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });
            
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to confirm payment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    return (
        <AdminLayout title="Invoices">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
                    <div className="text-sm text-gray-600">
                        Total: {invoices.length} invoices
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Invoice #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking Reference
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Route
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Issued
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        No invoices found
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-medium text-blue-600">
                                                {invoice.invoice_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {invoice.calculated_cost?.reservation?.first_name} {invoice.calculated_cost?.reservation?.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {invoice.calculated_cost?.reservation?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm">
                                                {invoice.calculated_cost?.reservation?.booking_reference}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {invoice.calculated_cost?.reservation?.pickup_location}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                → {invoice.calculated_cost?.reservation?.dropoff_location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-lg font-semibold text-green-600">
                                                {formatCurrency(invoice.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(invoice.issued_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {invoice.status === 'pending' && (
                                                <button
                                                    onClick={() => confirmPayment(invoice.invoice_id)}
                                                    disabled={processingId === invoice.invoice_id}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {processingId === invoice.invoice_id ? 'Processing...' : 'Confirm Payment'}
                                                </button>
                                            )}
                                            {invoice.status === 'paid' && (
                                                <a
                                                    href={`/api/invoices/${invoice.invoice_id}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    View Invoice
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="text-sm text-yellow-700">Pending</div>
                        <div className="text-2xl font-bold text-yellow-800">
                            {invoices.filter(i => i.status === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-sm text-green-700">Paid</div>
                        <div className="text-2xl font-bold text-green-800">
                            {invoices.filter(i => i.status === 'paid').length}
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm text-blue-700">Total Revenue</div>
                        <div className="text-2xl font-bold text-blue-800">
                            {formatCurrency(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.amount), 0))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
