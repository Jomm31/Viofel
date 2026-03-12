import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Components/Layout/AppLayout';
import axios from 'axios';

export default function Reserve() {
  const [selectedTripType, setSelectedTripType] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [validIdImage, setValidIdImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [data, setFormData] = useState({
    travel_options: '',
    origin: '',
    destination: '',
    estimated_passengers: '',
    reservation_date: '',
    departure_time: '',
    arrival_time: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });

  const setData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValidIdImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(data).forEach(key => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });
      
      // Append file if exists
      if (validIdImage) {
        formData.append('valid_id_image', validIdImage);
      }

      const response = await axios.post('/api/reservations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setReferenceNumber(response.data.reference_number);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Reservation error:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
        alert('Failed to create reservation: ' + errorMsg);
      }
    } finally {
      setProcessing(false);
    }
  };

  // Success Modal
  if (showSuccess) {
    return (
      <AppLayout>
        <Head title="Reservation Confirmed" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Reservation Submitted!</h1>
            <p className="text-gray-600 mb-6">Your reservation has been successfully submitted. Please save your reference number:</p>
            
            <div className="bg-red-50 border-2 border-red-900 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Reference Number</p>
              <p className="text-3xl font-bold text-red-900 tracking-wider">{referenceNumber}</p>
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Use this reference number to check your reservation status. We will contact you shortly to confirm your booking.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                href="/status"
                className="bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Check Reservation Status
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const tripTypes = [
    { id: 'one-way', title: 'One Way', description: 'Drop - off only' },
    { id: 'full-day', title: 'Full Day', description: 'Round-Trip within the same day' },
    { id: 'overnight', title: 'Overnight', description: '2 Days & 1 Night' },
    { id: 'multi-day', title: 'Multi-Day Tour', description: '3 Days & 2 Nights' },
  ];

  return (
    <AppLayout>
      <Head title="Reserve a Tour Bus" />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Reserve a Tour Bus Now</h1>
            <p className="text-xl text-gray-600">Fill out the form below to reserve your tour bus</p>
          </div>

          {/* Bus Image */}
          <div className="flex justify-end mb-12">
            <img src="/images/reserve-girl.png" alt="Traveler with luggage" className="w-full max-w-md h-96 object-contain rounded-2xl" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Trip Type */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">1.) Type of Trip</h2>
              <div className="space-y-4">
                {tripTypes.map((trip) => (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => {
                      setSelectedTripType(trip.id);
                      setData('travel_options', trip.id);
                    }}
                    className={`w-full flex items-center justify-between p-6 rounded-xl border-2 transition-all ${
                      selectedTripType === trip.id
                        ? 'border-red-900 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900">{trip.title}</h3>
                      <p className="text-gray-600 mt-1">{trip.description}</p>
                    </div>
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  </button>
                ))}
              </div>
              {errors.travel_options && <div className="text-red-600 text-sm mt-2">{errors.travel_options}</div>}
            </div>

            {/* Step 2: Origin */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">2.) Pick-up Location (Origin)</h2>
              <input
                type="text"
                value={data.origin}
                onChange={e => setData('origin', e.target.value)}
                placeholder="Enter pick-up location"
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                required
              />
              {errors.origin && <div className="text-red-600 text-sm mt-2">{errors.origin}</div>}
            </div>

            {/* Step 3: Destination */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">3.) Destination</h2>
              <input
                type="text"
                value={data.destination}
                onChange={e => setData('destination', e.target.value)}
                placeholder="Enter destination"
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                required
              />
              {errors.destination && <div className="text-red-600 text-sm mt-2">{errors.destination}</div>}
            </div>

            {/* Step 4: Date and Time */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">4.) Travel Date & Time</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Reservation Date</label>
                  <input
                    type="date"
                    value={data.reservation_date}
                    onChange={e => setData('reservation_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.reservation_date && <div className="text-red-600 text-sm mt-1">{errors.reservation_date}</div>}
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Departure Time</label>
                  <input
                    type="time"
                    value={data.departure_time}
                    onChange={e => setData('departure_time', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.departure_time && <div className="text-red-600 text-sm mt-1">{errors.departure_time}</div>}
                </div>
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Estimated Arrival</label>
                  <input
                    type="time"
                    value={data.arrival_time}
                    onChange={e => setData('arrival_time', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.arrival_time && <div className="text-red-600 text-sm mt-1">{errors.arrival_time}</div>}
                </div>
              </div>
            </div>

            {/* Step 5: Number of Passengers */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">5.) Number of Passengers</h2>
              <input
                type="number"
                value={data.estimated_passengers}
                onChange={e => setData('estimated_passengers', e.target.value)}
                placeholder="Enter number of passengers"
                min="1"
                className="w-64 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                required
              />
              {errors.estimated_passengers && <div className="text-red-600 text-sm mt-2">{errors.estimated_passengers}</div>}
            </div>

            {/* Step 6: Client Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">6.) Client Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={data.full_name}
                    onChange={e => setData('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.full_name && <div className="text-red-600 text-sm mt-1">{errors.full_name}</div>}
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    placeholder="Enter your email (e.g., user@gmail.com)"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    title="Please enter a valid email with a proper domain (e.g., user@gmail.com)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={data.phone}
                    onChange={e => {
                      // Only allow numbers
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setData('phone', val);
                    }}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">Address (Optional)</label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={e => setData('address', e.target.value)}
                    placeholder="Enter your address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-lg font-medium text-gray-700 mb-2">Valid ID Image</label>
                  <div className="space-y-4">
                    {/* Preview Area */}
                    {previewUrl && (
                      <div className="relative">
                        <img 
                          src={previewUrl} 
                          alt="Valid ID Preview" 
                          className="w-full max-w-md h-auto rounded-lg border-2 border-gray-300"
                        />
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors border-2 border-gray-300">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700 font-medium">
                          {validIdImage ? 'Change Image' : 'Upload Valid ID Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {validIdImage && (
                        <span className="text-sm text-gray-600">
                          {validIdImage.name}
                        </span>
                      )}
                    </div>
                    
                    {errors.valid_id_image && (
                      <div className="text-red-600 text-sm">{errors.valid_id_image}</div>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      Accepted formats: JPEG, PNG, JPG, GIF (Max 2MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={processing}
                className="bg-red-900 hover:bg-red-800 text-white px-24 py-5 rounded-full text-xl font-semibold transition-colors disabled:opacity-50 shadow-lg"
              >
                {processing ? 'Submitting...' : 'Submit Reservation'}
              </button>
            </div>
          </form>
        </div>
      </div>

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
              <div className="flex items-center gap-2 text-gray-300 mb-6">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>277 Hulo Proper, Sapang, Palay SJDM City, Bulacan</span>
              </div>
              <div className="flex gap-4">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Learn more</h3>
              <ul className="space-y-3">
                <li><a href="/reserve" className="text-gray-300 hover:text-white">Reserve</a></li>
                <li><a href="/status" className="text-gray-300 hover:text-white">Status</a></li>
                <li><a href="/status" className="text-gray-300 hover:text-white">Payment</a></li>
                <li><a href="/#contact-section" className="text-gray-300 hover:text-white">Customer Support</a></li>
                <li><a href="/#about-section" className="text-gray-300 hover:text-white">About Us</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
