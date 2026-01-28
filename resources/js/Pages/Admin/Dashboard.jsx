import React from 'react';
import AdminLayout from '@/Components/AdminLayout';

export default function Dashboard({ kpis, popularDestinations, popularOrigins, monthlyTrends, tripTypeDistribution, latestMetrics }) {
  return (
    <AdminLayout title="Analytics Dashboard - Viofel Transport">
      <div className="py-8 px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor your business performance and key metrics</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Reservations */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Reservations</p>
                    <h3 className="text-3xl font-bold text-gray-800">{kpis?.totalReservations || 0}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Completed Reservations */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Completed Trips</p>
                    <h3 className="text-3xl font-bold text-gray-800">{kpis?.completedReservations || 0}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-800">₱{(kpis?.totalRevenue || 0).toLocaleString()}</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Passengers */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Passengers Served</p>
                    <h3 className="text-3xl font-bold text-gray-800">{kpis?.totalPassengers || 0}</h3>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pending Reservations */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Pending Reservations</p>
                    <h3 className="text-3xl font-bold text-gray-800">{kpis?.pendingReservations || 0}</h3>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Cancelled Reservations */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Cancelled Reservations</p>
                    <h3 className="text-3xl font-bold text-gray-800">{kpis?.cancelledReservations || 0}</h3>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-500 text-sm font-medium mb-1">Avg Passengers per Trip</p>
                <h3 className="text-2xl font-bold text-gray-800">{kpis?.avgPassengersPerTrip || 0}</h3>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-500 text-sm font-medium mb-1">Total Inquiries</p>
                <h3 className="text-2xl font-bold text-gray-800">{kpis?.totalInquiries || 0}</h3>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-500 text-sm font-medium mb-1">Total FAQs</p>
                <h3 className="text-2xl font-bold text-gray-800">{kpis?.totalFaqs || 0}</h3>
              </div>
            </div>

            {/* Charts and Tables Grid */}
            {popularDestinations && popularOrigins && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Popular Destinations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Destinations</h3>
                  <div className="space-y-3">
                    {popularDestinations.map((dest, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-3">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 font-medium">{dest.destination}</span>
                        </div>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                          {dest.total} trips
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Origins */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Origins</h3>
                  <div className="space-y-3">
                    {popularOrigins.map((origin, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold mr-3">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 font-medium">{origin.origin}</span>
                        </div>
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                          {origin.total} trips
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Trip Type Distribution */}
            {tripTypeDistribution && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Type Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tripTypeDistribution.map((type, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <p className="text-gray-600 text-sm mb-1">{type.travel_options}</p>
                      <h4 className="text-2xl font-bold text-gray-800">{type.total}</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        {kpis?.totalReservations ? ((type.total / kpis.totalReservations) * 100).toFixed(1) : 0}% of total
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Trends */}
            {monthlyTrends && monthlyTrends.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Reservation Trends (Last 6 Months)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Month</th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">Reservations</th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">Passengers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTrends.map((trend, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-700">{trend.month}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">{trend.total}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">{trend.passengers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Latest Dashboard Metrics */}
            {latestMetrics && latestMetrics.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Latest Management Dashboard Metrics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Metric</th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">Value</th>
                        <th className="text-right py-3 px-4 text-gray-600 font-semibold">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestMetrics.map((metric, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-700">{metric.metric}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">{metric.value}</td>
                          <td className="py-3 px-4 text-right text-gray-600 text-sm">
                            {new Date(metric.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
      </AdminLayout>
  );
}
