import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '../Components/Layout/AppLayout';
import axios from 'axios';

export default function Status() {
  const [showDetails, setShowDetails] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    origin: '',
    destination: '',
    reservation_date: '',
    departure_time: '',
    arrival_time: '',
    estimated_passengers: '',
    travel_options: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    setShowDetails(false);

    try {
      const response = await axios.post('/api/reservations/lookup', {
        reference_number: referenceNumber,
      });
      
      if (response.data.success) {
        setBookingDetails(response.data.reservation);
        setShowDetails(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No reservation found with this reference number.');
      } else {
        setError('Failed to lookup reservation. Please try again.');
      }
      setShowDetails(false);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_paid':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'not_paid':
        return 'Not Paid Yet';
      case 'pending':
        return 'Pending Confirmation';
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1);
    }
  };

  const formatTripType = (type) => {
    const types = {
      'one-way': 'One Way',
      'full-day': 'Full Day',
      'overnight': 'Overnight',
      'multi-day': 'Multi-Day Tour',
    };
    return types[type] || type || 'N/A';
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const confirmEdit = () => {
    // Populate form with current booking details
    setEditFormData({
      full_name: bookingDetails.customer_name,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      address: bookingDetails.address || '',
      origin: bookingDetails.origin,
      destination: bookingDetails.destination,
      reservation_date: bookingDetails.reservation_date,
      departure_time: bookingDetails.departure_time,
      arrival_time: bookingDetails.arrival_time || '',
      estimated_passengers: bookingDetails.estimated_passengers,
      travel_options: bookingDetails.travel_options,
    });
    setShowEditModal(false);
    setShowEditForm(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const response = await axios.put(`/api/reservations/${bookingDetails.id}`, editFormData);
      
      if (response.data.success) {
        // Refresh the booking details
        const lookupResponse = await axios.post('/api/reservations/lookup', {
          reference_number: referenceNumber,
        });
        if (lookupResponse.data.success) {
          setBookingDetails(lookupResponse.data.reservation);
        }
        setShowEditForm(false);
        alert('Reservation updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update reservation. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cancelEditForm = () => {
    setShowEditForm(false);
    setError('');
  };

  const confirmCancel = async () => {
    setProcessing(true);
    setError('');
    
    try {
      const response = await axios.delete(`/api/reservations/${bookingDetails.id}`);
      
      if (response.data.success) {
        setShowCancelModal(false);
        setShowDetails(false);
        setBookingDetails(null);
        alert('Reservation cancelled successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation. Please try again.');
      setShowCancelModal(false);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentClick = () => {
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setProcessing(true);
    setError('');
    
    try {
      const response = await axios.post(`/api/payments/${bookingDetails.id}/process`, {
        payment_method: paymentMethod
      });
      
      if (response.data.success) {
        setShowPaymentModal(false);
        setPaymentMethod('');
        // Refresh booking details
        const lookupResponse = await axios.post('/api/reservations/lookup', {
          reference_number: referenceNumber,
        });
        if (lookupResponse.data.success) {
          setBookingDetails(lookupResponse.data.reservation);
        }
        alert('Payment processed successfully! Your reservation is now pending confirmation.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
      setShowPaymentModal(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleRefundClick = () => {
    setShowRefundModal(true);
  };

  const confirmRefund = async () => {
    if (!refundReason.trim()) {
      alert('Please provide a reason for the refund');
      return;
    }

    setProcessing(true);
    setError('');
    
    try {
      // First, get the invoice ID from the reservation
      const reservation = await axios.get(`/api/reservations/${bookingDetails.id}/invoice`);
      const invoiceId = reservation.data.invoice_id;

      const response = await axios.post(`/api/refunds/${invoiceId}/request`, {
        reason: refundReason
      });
      
      if (response.data.success) {
        setShowRefundModal(false);
        setRefundReason('');
        // Refresh booking details
        const lookupResponse = await axios.post('/api/reservations/lookup', {
          reference_number: referenceNumber,
        });
        if (lookupResponse.data.success) {
          setBookingDetails(lookupResponse.data.reservation);
        }
        alert('Refund request submitted successfully! Please wait for admin approval.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit refund request. Please try again.');
      setShowRefundModal(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout>
      <Head title="Your Booking Status - Viofel Transport" />
      
      {/* Hero Section */}
      <div className="relative bg-white pt-10 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 py-12">
            {/* Left Column - Form */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Booking Status
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
                Enter your Reference Number
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value.toUpperCase())}
                    placeholder="VIO-XXXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                    required
                  />
                  {error && (
                    <div className="text-red-600 text-sm mt-1">{error}</div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-full text-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {processing ? 'Checking...' : 'Check Status'}
                </button>
              </form>

              <p className="text-gray-600 mt-6 text-sm">
                Please wait and always check your phone and your email, we will call you for the transaction
              </p>
            </div>

            {/* Right Column - Image */}
            <div className="hidden md:block">
              <div className="w-full h-80 bg-gradient-to-br from-pink-200 via-purple-200 to-green-200 rounded-3xl flex items-center justify-center">
                <div className="text-6xl">🌺</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Section */}
      {showDetails && bookingDetails && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Status Badge */}
            <div className="text-center mb-8">
              <span className={`inline-flex items-center px-6 py-2 rounded-full text-lg font-semibold ${getStatusColor(bookingDetails.status)}`}>
                {formatStatus(bookingDetails.status)}
              </span>
              <p className="text-gray-500 mt-2">Reference: {bookingDetails.reference_number}</p>
            </div>

            {/* Cost Breakdown Receipt */}
            {bookingDetails.total_cost && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Payment Receipt
                </h3>
                
                <div className="space-y-3 text-sm">
                  {/* Bus Selection */}
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <span className="font-medium text-gray-700">Bus Type:</span>
                      <p className="text-xs text-gray-500">{bookingDetails.bus_type}</p>
                    </div>
                    <span className="font-semibold text-gray-900">₱{parseFloat(bookingDetails.bus_cost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {/* Passenger Cost */}
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <span className="font-medium text-gray-700">Passenger Cost:</span>
                      <p className="text-xs text-gray-500">{bookingDetails.estimated_passengers} passengers × ₱200</p>
                    </div>
                    <span className="font-semibold text-gray-900">₱{parseFloat(bookingDetails.passenger_cost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {/* Partial Payment */}
                  <div className="flex justify-between items-center pt-2 pb-3 bg-green-50 -mx-3 px-3 rounded">
                    <div>
                      <span className="font-bold text-green-800">Your Payment (Partial):</span>
                      <p className="text-xs text-green-600">Bus + Passengers</p>
                    </div>
                    <span className="text-xl font-bold text-green-700">₱{parseFloat(bookingDetails.partial_payment || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {/* Additional Costs (Admin will adjust) */}
                  <div className="mt-4 pt-3 border-t-2 border-dashed">
                    <p className="text-xs text-gray-600 italic mb-2">
                      ⓘ Additional costs calculated by admin:
                    </p>
                    <div className="text-xs text-gray-700 space-y-1 ml-4">
                      <div className="flex justify-between">
                        <span>• Distance Cost ({bookingDetails.distance_km || 100} km × ₱15)</span>
                        <span className="font-semibold">₱{parseFloat(bookingDetails.distance_cost || ((bookingDetails.distance_km || 100) * 15)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Fuel Surcharge</span>
                        <span className="font-semibold">₱{parseFloat(bookingDetails.fuel_surcharge || (((bookingDetails.distance_km || 100) / 10) * 65)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Total */}
                  <div className="flex justify-between items-center pt-3 border-t-2">
                    <span className="font-bold text-gray-800">Total Cost:</span>
                    <span className="text-xl font-bold text-gray-900">₱{parseFloat(bookingDetails.total_cost).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> You will pay <strong>₱{parseFloat(bookingDetails.partial_payment || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong> now (Bus + Passengers). 
                    The distance and fuel costs have been calculated by admin based on actual route details.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Action Buttons */}
              {bookingDetails.status === 'not_paid' && (
                <div className="flex gap-4 justify-center mb-6">
                  <button
                    onClick={handlePaymentClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={handleEditClick}
                    className="bg-[#dfecc6] hover:bg-[#cfe0b0] text-black px-8 py-3 rounded-full text-sm font-bold transition-colors"
                  >
                    Edit Reservation
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors"
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}
              {(bookingDetails.status === 'pending' || bookingDetails.status === 'confirmed') && (
                <div className="flex gap-4 justify-center mb-6">
                  <button
                    onClick={handleRefundClick}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors"
                  >
                    Request Refund
                  </button>
                </div>
              )}
              {bookingDetails.status === 'cancelled' && (
                <div className="text-center mb-6">
                  <p className="text-gray-600 italic">This reservation has been cancelled</p>
                </div>
              )}

              {/* Your Name */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Your Name</h3>
                </div>
                <p className="text-gray-700 ml-9">{bookingDetails.customer_name}</p>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                </div>
                <p className="text-gray-700 ml-9">{bookingDetails.email} | {bookingDetails.phone}</p>
              </div>

              {/* Type of Trip */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Type of Trip</h3>
                </div>
                <p className="text-gray-700 ml-9">{formatTripType(bookingDetails.travel_options)}</p>
              </div>

              {/* Origin */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Origin</h3>
                </div>
                <p className="text-gray-700 ml-9">{bookingDetails.origin}</p>
              </div>

              {/* Destination */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Destination</h3>
                </div>
                <p className="text-gray-700 ml-9">{bookingDetails.destination}</p>
              </div>

              {/* Departure Time */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Departure</h3>
                </div>
                <p className="text-gray-700 ml-9">{bookingDetails.departure_time} - {bookingDetails.reservation_date}</p>
              </div>

              {/* Passengers */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Estimated Passengers</h3>
                </div>
                <p className="text-gray-700 ml-9">{bookingDetails.estimated_passengers} passengers</p>
              </div>

              {/* Booked On */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Booked On</h3>
                </div>
                <p className="text-gray-700 ml-9">{bookingDetails.created_at}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Section */}
      {showEditForm && bookingDetails && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Edit Reservation</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleEditFormSubmit} className="space-y-6">
                {/* Client Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={editFormData.full_name}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address (Optional)
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={editFormData.origin}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={editFormData.destination}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reservation Date
                    </label>
                    <input
                      type="date"
                      name="reservation_date"
                      value={editFormData.reservation_date}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Passengers
                    </label>
                    <input
                      type="number"
                      name="estimated_passengers"
                      value={editFormData.estimated_passengers}
                      onChange={handleEditFormChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Trip
                    </label>
                    <select
                      name="travel_options"
                      value={editFormData.travel_options}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select trip type</option>
                      <option value="one-way">One Way</option>
                      <option value="full-day">Full Day</option>
                      <option value="overnight">Overnight</option>
                      <option value="multi-day">Multi-Day Tour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Time
                    </label>
                    <input
                      type="time"
                      name="departure_time"
                      value={editFormData.departure_time}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-6 border-t">
                  <button
                    type="button"
                    onClick={cancelEditForm}
                    disabled={processing}
                    className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-[#dfecc6] hover:bg-[#cfe0b0] text-black px-8 py-3 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {processing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Confirmation Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Modify Reservation</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 text-lg mb-8">
              Are you sure you want to edit/modify your reservation?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors"
              >
                Back
              </button>
              <button
                onClick={confirmEdit}
                className="bg-[#dfecc6] hover:bg-[#cfe0b0] text-black px-8 py-3 rounded-full text-sm font-bold transition-colors"
              >
                Confirm Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Cancel Reservation</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 text-lg mb-8">
              Are you sure you want to cancel this reservation?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={processing}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={confirmCancel}
                disabled={processing}
                className="bg-[#dfecc6] hover:bg-[#cfe0b0] text-black px-8 py-3 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
              >
                {processing ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                <p className="text-gray-700 mb-2">
                  <strong>Partial Payment (Now):</strong>
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ₱{bookingDetails?.partial_payment ? parseFloat(bookingDetails.partial_payment).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Includes: Bus ({bookingDetails?.bus_type}) + Passengers
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-xs text-gray-600">
                  <strong>Estimated Total:</strong> ₱{bookingDetails?.total_cost ? parseFloat(bookingDetails.total_cost).toLocaleString('en-PH', { minimumFractionDigits: 2 }) : '0.00'}
                </p>
                <p className="text-xs text-gray-500 italic mt-1">
                  Final amount will be adjusted by admin based on actual fuel & distance costs
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select payment method</option>
                <option value="gcash">GCash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={processing}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Request Refund</h3>
              <button
                onClick={() => setShowRefundModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 text-lg mb-4">
                Refund Amount: <span className="font-bold text-2xl text-red-600">₱{bookingDetails?.total_cost ? parseFloat(bookingDetails.total_cost).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Refund
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Please provide a reason for your refund request..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="4"
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowRefundModal(false)}
                disabled={processing}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRefund}
                disabled={processing}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
              >
                {processing ? 'Submitting...' : 'Submit Refund Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-6">
                <div className="w-56 h-12 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-white font-bold">VIOFEL TRANSPORT</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">277 Hulo Proper, Sapang, Palay SJDM City, Bulacan</p>
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
                <div className="w-6 h-6 bg-gray-700 rounded"></div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Learn more</h3>
              <ul className="space-y-3">
                <li><a href="/reserve" className="text-gray-300 hover:text-white">Reserve</a></li>
                <li><a href="/status" className="text-gray-300 hover:text-white">Status</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Payment</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Customer Support</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
