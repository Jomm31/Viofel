import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../Components/Layout/AppLayout';
import axios from 'axios';

export default function Status() {
  const [showDetails, setShowDetails] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                {bookingDetails.status?.charAt(0).toUpperCase() + bookingDetails.status?.slice(1)}
              </span>
              <p className="text-gray-500 mt-2">Reference: {bookingDetails.reference_number}</p>
            </div>

            <div className="space-y-4">
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
