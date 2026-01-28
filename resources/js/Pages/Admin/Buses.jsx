import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';

export default function Buses({ buses = [] }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [editingBus, setEditingBus] = useState(null);
    const [formData, setFormData] = useState({
        plate_number: '',
        type: '',
        capacity: '',
        fuel_efficiency: '',
        status: 'available',
    });

    const handleAddClick = () => {
        setFormData({
            plate_number: '',
            type: '',
            capacity: '',
            fuel_efficiency: '',
            status: 'available',
        });
        setShowAddModal(true);
    };

    const handleEditClick = (bus) => {
        setEditingBus(bus);
        setFormData({
            plate_number: bus.plate_number,
            type: bus.type,
            capacity: bus.capacity,
            fuel_efficiency: bus.fuel_efficiency || '',
            status: bus.status,
        });
        setShowEditModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch('/admin/buses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to add bus');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setProcessing(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch(`/admin/buses/${editingBus.bus_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update bus');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (busId) => {
        if (!confirm('Are you sure you want to delete this bus?')) return;

        try {
            const response = await fetch(`/admin/buses/${busId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete bus');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    const getAvailabilityBadge = (isAvailable) => {
        return isAvailable
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const getStatusBadge = (status) => {
        const badges = {
            available: 'bg-green-100 text-green-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            unavailable: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout title="Bus Management">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Bus Management</h1>
                        <p className="text-gray-600 mt-1">Manage your fleet and availability</p>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Bus
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                        <div className="text-sm text-gray-600">Total Buses</div>
                        <div className="text-2xl font-bold text-gray-800">{buses.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                        <div className="text-sm text-gray-600">Available</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {buses.filter(b => b.is_available).length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                        <div className="text-sm text-gray-600">In Use</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {buses.filter(b => b.active_reservations > 0).length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                        <div className="text-sm text-gray-600">Maintenance</div>
                        <div className="text-2xl font-bold text-red-600">
                            {buses.filter(b => b.status === 'maintenance').length}
                        </div>
                    </div>
                </div>

                {/* Buses Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plate Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Capacity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fuel Efficiency
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Availability
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {buses.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No buses found. Add your first bus to get started.
                                    </td>
                                </tr>
                            ) : (
                                buses.map((bus) => (
                                    <tr key={bus.bus_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-semibold text-gray-900">
                                                {bus.plate_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-700">{bus.type}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-700">{bus.capacity} passengers</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-700">
                                                {bus.fuel_efficiency ? `${bus.fuel_efficiency} km/L` : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(bus.status)}`}>
                                                {bus.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityBadge(bus.is_available)}`}>
                                                    {bus.is_available ? 'Available' : 'In Use'}
                                                </span>
                                                {bus.active_reservations > 0 && (
                                                    <span className="text-xs text-gray-500">
                                                        ({bus.active_reservations} active)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button
                                                onClick={() => handleEditClick(bus)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(bus.bus_id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Bus Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Bus</h3>
                        
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Plate Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="plate_number"
                                        value={formData.plate_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bus Type *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="Carousel Bus">Carousel Bus (15-25 passengers)</option>
                                        <option value="Tourist Bus">Tourist Bus (26-40 passengers)</option>
                                        <option value="Standard Bus">Standard Bus (&lt;15 passengers)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Capacity *
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fuel Efficiency (km/L)
                                    </label>
                                    <input
                                        type="number"
                                        name="fuel_efficiency"
                                        value={formData.fuel_efficiency}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    disabled={processing}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                                >
                                    {processing ? 'Adding...' : 'Add Bus'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Bus Modal */}
            {showEditModal && editingBus && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Bus</h3>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Plate Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="plate_number"
                                        value={formData.plate_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bus Type *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="Carousel Bus">Carousel Bus (15-25 passengers)</option>
                                        <option value="Tourist Bus">Tourist Bus (26-40 passengers)</option>
                                        <option value="Standard Bus">Standard Bus (&lt;15 passengers)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Capacity *
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fuel Efficiency (km/L)
                                    </label>
                                    <input
                                        type="number"
                                        name="fuel_efficiency"
                                        value={formData.fuel_efficiency}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="available">Available</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
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
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
