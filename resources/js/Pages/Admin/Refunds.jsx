import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';

export default function Refunds({ refunds = [] }) {
    const [processingId, setProcessingId] = useState(null);

    const processRefund = async (refundId, action) => {
        const actionText = action === 'approved' ? 'approve' : 'reject';
        if (!confirm(`Are you sure you want to ${actionText} this refund request?`)) return;
        
        setProcessingId(refundId);
        try {
            const response = await fetch(`/admin/refunds/${refundId}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ action }),
            });
            
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to process refund');
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
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    return (
        <AdminLayout title="Refund Requests">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Refund Requests</h1>
                    <div className="text-sm text-gray-600">
                        Total: {refunds.length} requests
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Invoice #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reason
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
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
                            {refunds.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        No refund requests found
                                    </td>
                                </tr>
                            ) : (
                                refunds.map((refund) => (
                                    <tr key={refund.refund_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-gray-600">
                                                #{refund.refund_id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {refund.calculated_cost?.reservation?.first_name} {refund.calculated_cost?.reservation?.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {refund.calculated_cost?.reservation?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-blue-600">
                                                {refund.calculated_cost?.invoice?.invoice_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700 max-w-xs truncate" title={refund.reason}>
                                                {refund.reason}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-lg font-semibold text-red-600">
                                                {formatCurrency(refund.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(refund.refund_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(refund.status)}`}>
                                                {refund.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            {refund.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => processRefund(refund.refund_id, 'approved')}
                                                        disabled={processingId === refund.refund_id}
                                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => processRefund(refund.refund_id, 'rejected')}
                                                        disabled={processingId === refund.refund_id}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {refund.status !== 'pending' && (
                                                <span className="text-gray-400 italic">Processed</span>
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
                            {refunds.filter(r => r.status === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-sm text-green-700">Approved</div>
                        <div className="text-2xl font-bold text-green-800">
                            {refunds.filter(r => r.status === 'approved').length}
                        </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="text-sm text-red-700">Total Refunded</div>
                        <div className="text-2xl font-bold text-red-800">
                            {formatCurrency(refunds.filter(r => r.status === 'approved').reduce((sum, r) => sum + parseFloat(r.amount), 0))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
