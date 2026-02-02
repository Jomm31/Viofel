import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';
import { router } from '@inertiajs/react';
import axios from 'axios';

/**
 * Admin Refunds Page
 * 
 * Displays all refund requests and allows admin to approve/reject
 * Features:
 * - View refund requests with customer details
 * - Approve or reject refunds
 * - Filter by status
 * - Summary statistics
 * 
 * Security: Admin-only access, CSRF protection, input validation
 */
export default function Refunds({ refunds = [] }) {
    const [processingId, setProcessingId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [adminNotes, setAdminNotes] = useState('');
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [pendingAction, setPendingAction] = useState(null);

    /**
     * Filter refunds by status
     */
    const filteredRefunds = refunds.filter(refund => {
        if (filter === 'all') return true;
        return refund.status === filter;
    });

    /**
     * Process refund with validation
     */
    const processRefund = async (refundId, action) => {
        // Validate inputs
        if (!refundId || !action) {
            alert('Invalid refund data');
            return;
        }

        if (!['approved', 'rejected'].includes(action)) {
            alert('Invalid action');
            return;
        }

        const actionText = action === 'approved' ? 'approve' : 'reject';
        if (!confirm(`Are you sure you want to ${actionText} this refund request?`)) return;
        
        setProcessingId(refundId);
        try {
            const response = await axios.post(`/admin/refunds/${refundId}/process`, {
                action,
                admin_notes: adminNotes 
            });
            
            if (response.data.success) {
                alert(`Refund ${action} successfully!`);
                router.reload();
            } else {
                alert(response.data.error || 'Failed to process refund');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An error occurred while processing refund';
            alert(errorMessage);
        } finally {
            setProcessingId(null);
            setAdminNotes('');
            setShowNotesModal(false);
        }
    };

    /**
     * Open notes modal before processing
     */
    const openNotesModal = (refund, action) => {
        setSelectedRefund(refund);
        setPendingAction(action);
        setShowNotesModal(true);
    };

    /**
     * Get status badge color
     */
    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
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

    return (
        <AdminLayout title="Refund Requests">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Refund Requests</h1>
                        <p className="text-gray-600">Review and process customer refund requests</p>
                    </div>
                    
                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filter === status 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                        <div className="text-sm text-gray-600">Total Requests</div>
                        <div className="text-2xl font-bold text-gray-800">{refunds.length}</div>
                    </div>
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
                            {formatCurrency(refunds.filter(r => r.status === 'approved').reduce((sum, r) => sum + parseFloat(r.amount || 0), 0))}
                        </div>
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
                                    Reference
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
                            {filteredRefunds.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        No refund requests found
                                    </td>
                                </tr>
                            ) : (
                                filteredRefunds.map((refund) => (
                                    <tr key={refund.refund_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-gray-600">
                                                #{refund.refund_id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {refund.calculated_cost?.reservation?.customer?.full_name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {refund.calculated_cost?.reservation?.customer?.email || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm text-blue-600">
                                                {refund.calculated_cost?.reservation?.booking_reference?.booking_reference || 'N/A'}
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
                                                {refund.status?.toUpperCase()}
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
            </div>
        </AdminLayout>
    );
}
