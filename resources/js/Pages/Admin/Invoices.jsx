import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';

/**
 * Admin Invoices Page
 * 
 * Displays all invoices with PayMongo payment details and management options
 * Features:
 * - View all invoices with customer details
 * - Confirm pending payments
 * - Filter by status
 * - View PayMongo transaction details
 * 
 * Security: Admin-only access, CSRF protection
 */
export default function Invoices({ invoices = [] }) {
    const [processingId, setProcessingId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    /**
     * Filter invoices by status
     */
    const filteredInvoices = invoices.filter(invoice => {
        if (filter === 'all') return true;
        return invoice.status === filter;
    });

    /**
     * Confirm payment with validation
     */
    const confirmPayment = async (invoiceId) => {
        if (!invoiceId) {
            alert('Invalid invoice ID');
            return;
        }
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
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                alert('Payment confirmed successfully!');
                window.location.reload();
            } else {
                alert(data.error || 'Failed to confirm payment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while confirming payment');
        } finally {
            setProcessingId(null);
        }
    };

    /**
     * Get status badge color based on status
     */
    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            confirmed: 'bg-blue-100 text-blue-800',
            awaiting_payment: 'bg-orange-100 text-orange-800',
            cancelled: 'bg-red-100 text-red-800',
            refunded: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    /**
     * Format date for display
     */
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    /**
     * Format currency
     */
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount || 0);
    };

    /**
     * Open invoice detail modal
     */
    const openDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    };

    return (
        <AdminLayout title="Invoices">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
                        <p className="text-gray-600">Manage payment invoices and confirmations</p>
                    </div>
                    
                    {/* Filter Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'awaiting_payment', 'paid', 'confirmed', 'refunded'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === status 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                        <div className="text-sm text-gray-600">Total Invoices</div>
                        <div className="text-2xl font-bold text-gray-800">{invoices.length}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-sm text-green-700">Paid/Confirmed</div>
                        <div className="text-2xl font-bold text-green-800">
                            {invoices.filter(i => i.status === 'paid' || i.status === 'confirmed').length}
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="text-sm text-yellow-700">Awaiting Payment</div>
                        <div className="text-2xl font-bold text-yellow-800">
                            {invoices.filter(i => i.status === 'awaiting_payment').length}
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm text-blue-700">Total Revenue</div>
                        <div className="text-2xl font-bold text-blue-800">
                            {formatCurrency(invoices.filter(i => i.status === 'paid' || i.status === 'confirmed').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0))}
                        </div>
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
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        No invoices found
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-medium text-blue-600">
                                                {invoice.invoice_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {invoice.calculated_cost?.reservation?.customer?.full_name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {invoice.calculated_cost?.reservation?.customer?.email || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-blue-600">
                                                {invoice.calculated_cost?.reservation?.booking_reference?.booking_reference || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-lg font-semibold text-green-600">
                                                {formatCurrency(invoice.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm capitalize">
                                                {invoice.payment_method?.replace('_', ' ') || 'N/A'}
                                            </span>
                                            {invoice.paymongo_payment_id && (
                                                <span className="block text-xs text-blue-500">via PayMongo</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(invoice.status)}`}>
                                                {invoice.status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(invoice.issued_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openDetail(invoice)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </button>
                                                {invoice.status === 'paid' && (
                                                    <button
                                                        onClick={() => confirmPayment(invoice.invoice_id)}
                                                        disabled={processingId === invoice.invoice_id}
                                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processingId === invoice.invoice_id ? 'Processing...' : 'Confirm'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            {showDetailModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Invoice Details</h3>
                                <p className="text-gray-500 font-mono">{selectedInvoice.invoice_number}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(selectedInvoice.status)}`}>
                                    {selectedInvoice.status?.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            {/* Amount */}
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-gray-600">Amount</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {formatCurrency(selectedInvoice.amount)}
                                </p>
                            </div>

                            {/* Customer Info */}
                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Customer Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Name:</span>
                                        <p className="font-medium">{selectedInvoice.calculated_cost?.reservation?.customer?.full_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Email:</span>
                                        <p className="font-medium">{selectedInvoice.calculated_cost?.reservation?.customer?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Phone:</span>
                                        <p className="font-medium">{selectedInvoice.calculated_cost?.reservation?.customer?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Booking Reference:</span>
                                        <p className="font-medium font-mono">{selectedInvoice.calculated_cost?.reservation?.booking_reference?.booking_reference || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Payment Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Payment Method:</span>
                                        <p className="font-medium capitalize">{selectedInvoice.payment_method?.replace('_', ' ') || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Issue Date:</span>
                                        <p className="font-medium">{formatDate(selectedInvoice.issued_at)}</p>
                                    </div>
                                    {selectedInvoice.paid_at && (
                                        <div>
                                            <span className="text-gray-500">Paid Date:</span>
                                            <p className="font-medium">{formatDate(selectedInvoice.paid_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* PayMongo Info */}
                            {(selectedInvoice.paymongo_payment_id || selectedInvoice.paymongo_checkout_id) && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">PayMongo Details</h4>
                                    <div className="bg-blue-50 p-3 rounded-lg space-y-2 text-sm">
                                        {selectedInvoice.paymongo_checkout_id && (
                                            <div>
                                                <span className="text-gray-500">Checkout ID:</span>
                                                <p className="font-mono text-xs">{selectedInvoice.paymongo_checkout_id}</p>
                                            </div>
                                        )}
                                        {selectedInvoice.paymongo_payment_id && (
                                            <div>
                                                <span className="text-gray-500">Payment ID:</span>
                                                <p className="font-mono text-xs">{selectedInvoice.paymongo_payment_id}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            {selectedInvoice.status === 'paid' && (
                                <button
                                    onClick={() => confirmPayment(selectedInvoice.invoice_id)}
                                    disabled={processingId === selectedInvoice.invoice_id}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                                >
                                    Confirm Payment
                                </button>
                            )}
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
