import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../Components/Layout/AppLayout';

export default function Welcome({ faqs = [] }) {
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    contact_number: '',
    message: '',
    attachment: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/inquiries');
  };

  return (
    <AppLayout>
      <Head title="Welcome to Viofel Transport" />
      
      {/* Hero Section */}
      <div className="relative bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-7xl font-serif text-center text-gray-900 mb-16">
            Ready to Explore
          </h1>

          {/* Hero Image with Red Bars on Side */}
          <div className="flex items-center justify-center gap-0">
            {/* Left Red Bar */}
            <div className="w-32 md:w-40 h-56 md:h-64 bg-gradient-to-b from-red-900 to-red-800 rounded-t-3xl flex-shrink-0"></div>
            
            {/* Bus Image */}
            <div className="flex-1 max-w-5xl -mx-6 relative z-10">
              <img 
                src="/images/bus-fleet.jpg" 
                alt="Viofel Bus Fleet" 
                className="w-full h-56 md:h-64 object-cover rounded-t-3xl border-4 border-white shadow-2xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop';
                }}
              />
            </div>
            
            {/* Right Red Bar */}
            <div className="w-32 md:w-40 h-56 md:h-64 bg-gradient-to-b from-red-900 to-red-800 rounded-t-3xl flex-shrink-0"></div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Enjoy Traveling with Viofel
            </h2>
            <p className="text-lg text-gray-600">
              Area provides real insights, without the data overload.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Book Your Bus */}
            <div className="flex flex-col">
              <div className="w-9 h-9 mb-6 flex items-center justify-center">
                <svg className="w-full h-full text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Book Your Bus</h3>
              <p className="text-sm text-gray-600">
                Turn every trip into an unforgettable adventure with our convenient and comfortable tours
              </p>
            </div>

            {/* Ride with Safety */}
            <div className="flex flex-col">
              <div className="w-11 h-11 mb-6 flex items-center justify-center">
                <svg className="w-full h-full text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ride with Safety</h3>
              <p className="text-sm text-gray-600">
                Our professional drivers and well-maintained buses ensure every trip is secure. We make your safety our priority, so you can travel with confidence.
              </p>
            </div>

            {/* Arrive with Comfort */}
            <div className="flex flex-col">
              <div className="w-12 h-12 mb-6 flex items-center justify-center">
                <svg className="w-full h-full text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 9h3V6H4c-1.1 0-2 .9-2 2v3h2V9zm0 4H2v3c0 1.1.9 2 2 2h3v-3H4v-2zm16-7h-3v3h3v2h2V8c0-1.1-.9-2-2-2zm-3 12h3c1.1 0 2-.9 2-2v-3h-2v2h-3v3zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Arrive with Comfort</h3>
              <p className="text-sm text-gray-600">
                Experience a smooth, relaxing ride designed for your ultimate comfort. Sit back, unwind, and reach your destination refreshed and ready to explore.
              </p>
            </div>

            {/* Explore with Ease */}
            <div className="flex flex-col">
              <div className="w-12 h-12 mb-6 flex items-center justify-center">
                <svg className="w-full h-full text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Explore with Ease</h3>
              <p className="text-sm text-gray-600">
                Enjoy a hassle-free journey from beginning to end with our seamless booking process and reliable services. Let us take care of the details—just sit back, relax, and enjoy the ride. Travel made simple, just for you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Fleet Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Fleet</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Coaster Bus Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Coaster Bus</h3>
              <p className="text-gray-600 mb-6">
                A premium tour bus featuring spacious reclining seats, air-conditioning, personal entertainment screens, charging ports, and onboard restroom for maximum comfort.
              </p>
              <div className="w-60 h-60 mx-auto bg-gray-200 rounded-xl"></div>
            </div>

            {/* Tourist Bus Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Tourist Bus</h3>
              <p className="text-gray-600 mb-6">
                A comfortable tour bus with wider reclining seats, air-conditioning, onboard TV, and extra legroom for a more relaxing ride.
              </p>
              <div className="w-60 h-60 mx-auto bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-gray-900 mb-16">Customer Support - Contact Us</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={data.contact_number}
                    onChange={e => setData('contact_number', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.contact_number && <div className="text-red-600 text-sm mt-1">{errors.contact_number}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={data.message}
                    onChange={e => setData('message', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  {errors.message && <div className="text-red-600 text-sm mt-1">{errors.message}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (optional)</label>
                  <input
                    type="file"
                    onChange={e => setData('attachment', e.target.files[0])}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF, DOC, DOCX (max 20MB)</p>
                  {errors.attachment && <div className="text-red-600 text-sm mt-1">{errors.attachment}</div>}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-red-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-800 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="h-full bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Contact information or map</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* FAQ List */}
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">Customer Support - FAQ</h2>
              <p className="text-lg text-gray-600 mb-12">Most Important & Frequent Ask Questions</p>

              <div className="space-y-4">
                {[
                  { id: 1, question: 'How can I book a ticket?' },
                  { id: 2, question: 'What safety measures does Viofel provide for passengers?' },
                  { id: 3, question: 'What routes does Viofel Transport operate?' },
                  { id: 4, question: 'What payment methods are accepted?' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-500">
                        {String(item.id).padStart(2, '0')}
                      </span>
                      <span className="text-lg text-gray-900">{item.question}</span>
                    </div>
                    <svg 
                      className={`w-10 h-10 text-gray-400 transition-transform ${expandedFaq === item.id ? 'rotate-90' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Image Placeholder */}
            <div className="hidden md:block">
              <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500">FAQ illustration or image</p>
              </div>
            </div>
          </div>
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
                <li><a href="#" className="text-gray-300 hover:text-white">Reserve</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Status</a></li>
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
