import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout';
import { router } from '@inertiajs/react';

export default function Reservations({ reservations, currentStatus, search }) {
  const [searchInput, setSearchInput] = useState(search || '');
  const [statusFilter, setStatusFilter] = useState(currentStatus || 'all');
  const [showCostModal, setShowCostModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [costForm, setCostForm] = useState({
    distance_km: '',
    distance_cost: '',
    fuel_surcharge: '',
  });
  const [processing, setProcessing] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/reservations', { search: searchInput, status: statusFilter }, { preserveState: true });
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    router.get('/admin/reservations', { search: searchInput, status: newStatus }, { preserveState: true });
  };

  const handleUpdateStatus = (id, newStatus) => {
    router.patch(`/admin/reservations/${id}/status`, { status: newStatus });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      router.delete(`/admin/reservations/${id}`);
    }
  };

  const handleSetCostClick = (reservation) => {
    console.log('Selected reservation:', reservation);
    console.log('Reservation ID:', reservation.reservation_id);
    setSelectedReservation(reservation);
    // Calculate default values
    const distanceKm = reservation.distance_km || 100;
    const distanceCost = distanceKm * 15;
    const fuelSurcharge = (distanceKm / 10) * 65;
    
    setCostForm({
      distance_km: distanceKm,
      distance_cost: distanceCost,
      fuel_surcharge: fuelSurcharge,
    });
    setShowCostModal(true);
  };

  const handleCostFormChange = (e) => {
    const { name, value } = e.target;
    setCostForm(prev => {
      const updated = { ...prev, [name]: parseFloat(value) || 0 };
      
      // Auto-calculate fuel surcharge when distance_km changes
      if (name === 'distance_km') {
        updated.distance_cost = updated.distance_km * 15;
        updated.fuel_surcharge = (updated.distance_km / 10) * 65;
      }
      
      return updated;
    });
  };

  const handleCostSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    console.log('Submitting cost adjustment for reservation ID:', selectedReservation.reservation_id);
    console.log('Cost form data:', costForm);

    try {
      const reservationId = selectedReservation.reservation_id;
      console.log('Using reservation ID:', reservationId);
      
      const response = await fetch(`/admin/pricing/adjust/${reservationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({
          distance_km: costForm.distance_km,
          distance_cost: costForm.distance_cost,
          fuel_surcharge: costForm.fuel_surcharge,
        }),
      });

      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setShowCostModal(false);
        alert('Cost adjusted successfully! Customer will see updated payment amount.');
        window.location.reload();
      } else {
        console.error('Error response:', data);
        alert(data.message || data.error || 'Failed to adjust cost');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'not_paid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveCancellation = async (id) => {
    if (confirm('Are you sure you want to approve this cancellation request?')) {
      try {
        const response = await fetch(`/admin/reservations/${id}/cancellation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
          },
          body: JSON.stringify({ action: 'approve' }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Cancellation approved successfully!');
          window.location.reload();
        } else {
          alert(data.message || 'Failed to approve cancellation');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    }
  };

  const handleRejectCancellation = async (id) => {
    if (confirm('Are you sure you want to reject this cancellation request?')) {
      try {
        const response = await fetch(`/admin/reservations/${id}/cancellation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
          },
          body: JSON.stringify({ action: 'reject' }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Cancellation rejected successfully!');
          window.location.reload();
        } else {
          alert(data.message || 'Failed to reject cancellation');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    }
  };

  return (
    <AdminLayout title="Manage Reservations">
      <div className="py-8 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Reservations</h1>
          <p className="text-gray-600">View and manage all bus reservations</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email, or reference..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Reference</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Valid ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Route</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Passengers</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Cancellation</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations?.data && reservations.data.length > 0 ? (
                  reservations.data.map((reservation) => (
                    <tr key={reservation.reservation_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-blue-600 font-bold">
                        #{reservation.reservation_id}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-semibold">
                        {reservation.booking_reference?.booking_reference || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{reservation.customer?.full_name}</p>
                          <p className="text-sm text-gray-500">{reservation.customer?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {reservation.customer?.valid_id_path ? (
                          <a 
                            href={`/storage/${reservation.customer.valid_id_path}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img 
                              src={`/storage/${reservation.customer.valid_id_path}`} 
                              alt="Valid ID" 
                              className="w-16 h-16 object-cover rounded border hover:opacity-75 transition-opacity"
                              onError={(e) => { 
                                e.target.style.display = 'none'; 
                                e.target.parentElement.innerHTML = '<div class="text-xs text-gray-500">📄 View ID</div>'; 
                              }}
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">No ID</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {reservation.origin} → {reservation.destination}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(reservation.reservation_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{reservation.estimated_passengers}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {reservation.cancellation_reason ? (
                          <div className="max-w-xs">
                            <p className="text-xs text-gray-600 truncate" title={reservation.cancellation_reason}>
                              {reservation.cancellation_reason}
                            </p>
                            {reservation.cancellation_status === 'pending_approval' && (
                              <div className="flex gap-1 mt-1">
                                <button
                                  onClick={() => handleApproveCancellation(reservation.reservation_id)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectCancellation(reservation.reservation_id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {reservation.cancellation_status === 'approved' && (
                              <span className="text-xs text-green-600 font-medium">✓ Approved</span>
                            )}
                            {reservation.cancellation_status === 'rejected' && (
                              <span className="text-xs text-red-600 font-medium">✗ Rejected</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleSetCostClick(reservation)}
                            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors text-sm"
                            title="Set Distance & Fuel Cost"
                          >
                            Set Cost
                          </button>
                          <select
                            value={reservation.status}
                            onChange={(e) => handleUpdateStatus(reservation.reservation_id, e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleDelete(reservation.reservation_id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-8 text-gray-500">
                      No reservations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {reservations?.links && (
            <div className="mt-6 flex justify-center gap-2">
              {reservations.links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => link.url && router.get(link.url)}
                  disabled={!link.url}
                  className={`px-3 py-1 rounded ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : link.url
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Set Cost Modal */}
      {showCostModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Set Distance & Fuel Cost</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Reservation #{selectedReservation.reservation_id} - {selectedReservation.customer?.full_name}
                </p>
              </div>
              <button
                onClick={() => setShowCostModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Current Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Current Reservation Info</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-700">Route:</span>
                  <p className="font-medium text-blue-900">{selectedReservation.origin} → {selectedReservation.destination}</p>
                </div>
                <div>
                  <span className="text-blue-700">Passengers:</span>
                  <p className="font-medium text-blue-900">{selectedReservation.estimated_passengers}</p>
                </div>
                <div>
                  <span className="text-blue-700">Bus Cost:</span>
                  <p className="font-medium text-blue-900">
                    ₱{selectedReservation.estimated_passengers >= 26 && selectedReservation.estimated_passengers <= 40 
                      ? '12,000' 
                      : selectedReservation.estimated_passengers >= 15 && selectedReservation.estimated_passengers <= 25 
                      ? '8,000' 
                      : '5,000'}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700">Passenger Cost:</span>
                  <p className="font-medium text-blue-900">₱{(selectedReservation.estimated_passengers * 200).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCostSubmit} className="space-y-6">
              {/* Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km) *
                </label>
                <input
                  type="number"
                  name="distance_km"
                  value={costForm.distance_km}
                  onChange={handleCostFormChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fuel surcharge will be automatically calculated
                </p>
              </div>

              {/* Auto-calculated fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance Cost (₱)
                  </label>
                  <input
                    type="number"
                    name="distance_cost"
                    value={costForm.distance_cost}
                    onChange={handleCostFormChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Default: {costForm.distance_km} km × ₱15/km = ₱{(costForm.distance_km * 15).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Surcharge (₱)
                  </label>
                  <input
                    type="number"
                    name="fuel_surcharge"
                    value={costForm.fuel_surcharge}
                    onChange={handleCostFormChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-calculated based on distance
                  </p>
                </div>
              </div>

              {/* Total Preview */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">New Total Cost Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Bus Cost:</span>
                    <span className="font-medium">
                      ₱{(selectedReservation.estimated_passengers >= 26 && selectedReservation.estimated_passengers <= 40 
                        ? 12000 
                        : selectedReservation.estimated_passengers >= 15 && selectedReservation.estimated_passengers <= 25 
                        ? 8000 
                        : 5000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Passenger Cost:</span>
                    <span className="font-medium">₱{(selectedReservation.estimated_passengers * 200).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Distance Cost:</span>
                    <span className="font-medium">₱{parseFloat(costForm.distance_cost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Fuel Surcharge:</span>
                    <span className="font-medium">₱{parseFloat(costForm.fuel_surcharge || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-300">
                    <span className="font-bold text-green-900">New Total:</span>
                    <span className="text-xl font-bold text-green-900">
                      ₱{(
                        (selectedReservation.estimated_passengers >= 26 && selectedReservation.estimated_passengers <= 40 ? 12000 : selectedReservation.estimated_passengers >= 15 && selectedReservation.estimated_passengers <= 25 ? 8000 : 5000) +
                        (selectedReservation.estimated_passengers * 200) +
                        parseFloat(costForm.distance_cost || 0) +
                        parseFloat(costForm.fuel_surcharge || 0)
                      ).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCostModal(false)}
                  disabled={processing}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {processing ? 'Saving...' : 'Set Cost & Notify Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
