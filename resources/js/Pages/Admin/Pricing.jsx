import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';

export default function Pricing({ current_fuel_price, fuel_price_history = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [newPrice, setNewPrice] = useState('');

    const handleUpdateFuelPrice = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch('/admin/pricing/fuel-price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ price_per_liter: parseFloat(newPrice) }),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to update fuel price');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setProcessing(false);
        }
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
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <AdminLayout title="Pricing Management">
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Pricing Management</h1>
                    <p className="text-gray-600 mt-1">Manage fuel prices and cost calculations</p>
                </div>

                {/* Current Fuel Price Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold opacity-90">Current Fuel Price</h2>
                            <div className="text-5xl font-bold mt-2">
                                {current_fuel_price ? formatCurrency(current_fuel_price.price_per_liter) : 'N/A'}
                            </div>
                            <p className="text-sm opacity-75 mt-2">
                                Per Liter {current_fuel_price && `• Effective: ${formatDate(current_fuel_price.date_effective)}`}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Update Price
                        </button>
                    </div>
                </div>

                {/* Pricing Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Bus Pricing</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Carousel Bus</span>
                                <span className="font-semibold">₱8,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Tourist Bus</span>
                                <span className="font-semibold">₱12,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700">Standard Bus</span>
                                <span className="font-semibold">₱5,000</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Per Passenger</h3>
                        <div className="text-3xl font-bold text-gray-800">₱200</div>
                        <p className="text-sm text-gray-500 mt-2">Rate per passenger</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Distance Rate</h3>
                        <div className="text-3xl font-bold text-gray-800">₱15/km</div>
                        <p className="text-sm text-gray-500 mt-2">Rate per kilometer</p>
                    </div>
                </div>

                {/* Pricing Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Partial Payment System
                    </h3>
                    <div className="text-sm text-yellow-800 space-y-2">
                        <p><strong>Customers pay upfront:</strong> Bus Cost + Passenger Cost</p>
                        <p><strong>Admin adjusts later:</strong> Distance Cost + Fuel Surcharge based on actual route</p>
                        <p className="italic mt-3">This allows flexibility in pricing based on real-world conditions.</p>
                    </div>
                </div>

                {/* Fuel Price History */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Fuel Price History</h3>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date Effective
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price Per Liter
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fuel_price_history.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="px-6 py-12 text-center text-gray-500">
                                        No fuel price history available
                                    </td>
                                </tr>
                            ) : (
                                fuel_price_history.map((price) => (
                                    <tr key={price.fuel_price_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {formatDate(price.date_effective)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-lg font-semibold text-gray-900">
                                                {formatCurrency(price.price_per_liter)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Fuel Price Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Update Fuel Price</h3>
                        
                        <form onSubmit={handleUpdateFuelPrice} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Price Per Liter (₱)
                                </label>
                                <input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    step="0.01"
                                    min="0"
                                    placeholder="65.00"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Current: {current_fuel_price ? formatCurrency(current_fuel_price.price_per_liter) : 'N/A'}
                                </p>
                            </div>

                            <div className="flex gap-4 justify-end pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={processing}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Price'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
