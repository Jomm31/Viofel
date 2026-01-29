import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../Components/Layout/AppLayout';

export default function Welcome({ faqs = [] }) {
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    contact_number: '',
    message: '',
    attachment: null,
  });

  // Handle scrolling to section on page load (when coming from another page)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/inquiries', {
      onSuccess: () => {
        reset();
        alert('Your message has been sent successfully!');
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Welcome to Viofel Transport" />
      
      {/* Hero Section */}
      <div className="relative bg-white pb-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Container */}
          <div className="flex flex-col gap-24 md:gap-40 lg:gap-[210px] relative h-auto min-h-[500px] lg:h-[591px]">
            {/* Title */}
            <h1 
              className="text-center text-black font-normal relative z-10"
              style={{
                fontFamily: 'Crimson Text, serif',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',

              }}
            >
              <span className="text-4xl sm:text-5xl md:text-8xl lg:text-[124px] block">Ready to Explore</span>
            </h1>

            {/* Reservation Button */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 top-[150px] md:top-[200px] lg:top-[280px] w-full text-center">
              <a 
                href="/reserve"
                className="bg-red-900 hover:bg-red-800 text-white px-8 py-3 md:px-12 md:py-4 rounded-full text-base md:text-lg font-semibold transition duration-200 shadow-lg inline-block whitespace-nowrap"
              >
                Reserve Now
              </a>
            </div>

            {/* Placeholder to push container height on mobile */}
            <div className="h-[200px] md:h-[300px] lg:hidden w-full"></div>

            {/* Hero Image Container with Red Background and iPad Frame */}
             <div 
              className="absolute w-full bottom-0 left-0 right-0 bg-[#8b0002] rounded-t-[30px] h-[250px] md:h-[300px] lg:h-[262px]"
            >
               {/* iPad Frame - Responsive Positioning */}
               <div 
                  className="absolute bg-black border-2 border-white/50 rounded-xl md:rounded-[24px] shadow-xl overflow-hidden
                             left-4 right-4 top-[-60px] h-[300px]
                             md:left-[80px] md:right-[80px] md:top-[-100px] md:h-[450px]
                             lg:left-[146px] lg:right-[147px] lg:top-[-169px] lg:h-[644px]"
               >
                  <img 
                    src="/images/bus-fleet.jpg" 
                    alt="Viofel Bus Fleet" 
                    className="w-full h-full object-cover p-1 md:p-2 rounded-xl md:rounded-[22px]"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop';
                    }}
                  />
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Enjoy Traveling with Viofel
            </h2>
            <p className="text-lg text-gray-600">
              Area provides real insights, without the data overload.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Book Your Bus */}
            <div className="flex flex-col">
              <div className="w-12 h-12 mb-6 flex items-center justify-center overflow-hidden rounded">
                <img src="/logos/laptop.jpg" alt="Book Your Bus" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Book Your Bus</h3>
              <p className="text-sm text-gray-600">
                Turn every trip into an unforgettable adventure with our convenient and comfortable tours
              </p>
            </div>

            {/* Ride with Safety */}
            <div className="flex flex-col">
              <div className="w-12 h-12 mb-6 flex items-center justify-center overflow-hidden rounded">
                <img src="/logos/secured.jpg" alt="Ride with Safety" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ride with Safety</h3>
              <p className="text-sm text-gray-600">
                Our professional drivers and well-maintained buses ensure every trip is secure. We make your safety our priority, so you can travel with confidence.
              </p>
            </div>

            {/* Arrive with Comfort */}
            <div className="flex flex-col">
              <div className="w-12 h-12 mb-6 flex items-center justify-center overflow-hidden rounded">
                <img src="/logos/seats.jpg" alt="Arrive with Comfort" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Arrive with Comfort</h3>
              <p className="text-sm text-gray-600">
                Experience a smooth, relaxing ride designed for your ultimate comfort. Sit back, unwind, and reach your destination refreshed and ready to explore.
              </p>
            </div>

            {/* Explore with Ease */}
            <div className="flex flex-col">
              <div className="w-12 h-12 mb-6 flex items-center justify-center overflow-hidden rounded">
                <img src="/logos/bus.jpg" alt="Explore with Ease" className="w-full h-full object-contain" />
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Our Fleet</h2>
          
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
      <div id="contact-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-16">Customer Support - Contact Us</h2>
          
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
      <div id="faq-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* FAQ List */}
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Customer Support - FAQ</h2>
              <p className="text-lg text-gray-600 mb-12">Most Important & Frequent Ask Questions</p>

              <div className="space-y-4">
                {faqs && faqs.length > 0 ? (
                  faqs.map((item, index) => (
                    <div key={item.faq_id || index} className="bg-gray-50 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === (item.faq_id || index) ? null : (item.faq_id || index))}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-gray-500">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-lg text-gray-900">{item.question}</span>
                        </div>
                        <svg 
                          className={`w-10 h-10 text-gray-400 transition-transform duration-300 ${expandedFaq === (item.faq_id || index) ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {/* Dropdown Answer */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ${expandedFaq === (item.faq_id || index) ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-5 pb-5 pl-14 text-gray-600">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    No FAQs available at the moment.
                  </div>
                )}
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

      {/* About Us Section */}
      <div id="about-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">About Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Viofel Transport is a trusted bus rental service providing safe, comfortable, and reliable transportation for tours, events, and group travel across the Philippines.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600">To provide exceptional transportation services that exceed customer expectations through safety, comfort, and reliability.</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Team</h3>
              <p className="text-gray-600">Professional, licensed drivers and friendly staff dedicated to making your journey memorable and stress-free.</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Why Choose Us</h3>
              <p className="text-gray-600">Modern fleet, competitive pricing, 24/7 customer support, and a track record of satisfied customers.</p>
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
