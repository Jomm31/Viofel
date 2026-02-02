import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Analytics({ kpis, popularDestinations, popularOrigins, monthlyTrends, tripTypeDistribution, latestMetrics }) {
    return (
        <>
            <Head title="Analytics Dashboard - Viofel Transport" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
                            <p className="text-gray-600">Monitor your business performance and key metrics</p>
                        </div>
                        <Link 
                            href="/admin" 
                            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all shadow-md"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* KPI Reports & Strategic Insights Banner */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">KPI Reports & Strategic Analysis</h2>
                                <p className="text-white/90 mb-3">
                                    Generating periodic and ad hoc reports on key performance indicators (KPIs) including revenue, fleet utilization, and operational efficiency.
                                </p>
                                <p className="text-white/80 text-sm">
                                    📊 Analyzing trends to support strategic decision-making and identify operational inefficiencies for continuous improvement.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Total Reservations */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Reservations</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{kpis.totalReservations}</h3>
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
                                    <h3 className="text-3xl font-bold text-gray-800">{kpis.completedReservations}</h3>
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
                                    <h3 className="text-3xl font-bold text-gray-800">₱{kpis.totalRevenue.toLocaleString()}</h3>
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
                                    <h3 className="text-3xl font-bold text-gray-800">{kpis.totalPassengers}</h3>
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
                                    <h3 className="text-3xl font-bold text-gray-800">{kpis.pendingReservations}</h3>
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
                                    <h3 className="text-3xl font-bold text-gray-800">{kpis.cancelledReservations}</h3>
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
                            <h3 className="text-2xl font-bold text-gray-800">{kpis.avgPassengersPerTrip}</h3>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <p className="text-gray-500 text-sm font-medium mb-1">Total Inquiries</p>
                            <h3 className="text-2xl font-bold text-gray-800">{kpis.totalInquiries}</h3>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <p className="text-gray-500 text-sm font-medium mb-1">Total FAQs</p>
                            <h3 className="text-2xl font-bold text-gray-800">{kpis.totalFaqs}</h3>
                        </div>
                    </div>

                    {/* Charts and Tables Grid */}
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

                    {/* Trip Type Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Type Distribution</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {tripTypeDistribution.map((type, index) => (
                                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 text-sm mb-1">{type.travel_options}</p>
                                    <h4 className="text-2xl font-bold text-gray-800">{type.total}</h4>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {((type.total / kpis.totalReservations) * 100).toFixed(1)}% of total
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Trends */}
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

                    {/* Latest Dashboard Metrics */}
                    {latestMetrics.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
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

                    {/* Fleet Utilization & Operational Efficiency */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Fleet Utilization & Operational Efficiency</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    <p className="text-sm font-medium text-blue-700">Completion Rate</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-800">
                                    {kpis.totalReservations > 0 ? ((kpis.completedReservations / kpis.totalReservations) * 100).toFixed(1) : 0}%
                                </p>
                                <p className="text-xs text-blue-600 mt-1">Trips completed successfully</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium text-green-700">Avg Revenue/Trip</p>
                                </div>
                                <p className="text-2xl font-bold text-green-800">
                                    ₱{kpis.completedReservations > 0 ? (kpis.totalRevenue / kpis.completedReservations).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
                                </p>
                                <p className="text-xs text-green-600 mt-1">Per completed reservation</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium text-yellow-700">Pending Rate</p>
                                </div>
                                <p className="text-2xl font-bold text-yellow-800">
                                    {kpis.totalReservations > 0 ? ((kpis.pendingReservations / kpis.totalReservations) * 100).toFixed(1) : 0}%
                                </p>
                                <p className="text-xs text-yellow-600 mt-1">Awaiting processing</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <p className="text-sm font-medium text-red-700">Cancellation Rate</p>
                                </div>
                                <p className="text-2xl font-bold text-red-800">
                                    {kpis.totalReservations > 0 ? ((kpis.cancelledReservations / kpis.totalReservations) * 100).toFixed(1) : 0}%
                                </p>
                                <p className="text-xs text-red-600 mt-1">Identify improvement areas</p>
                            </div>
                        </div>
                    </div>

                    {/* Strategic Insights */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Strategic Insights & Recommendations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">📈 Revenue Optimization</h4>
                                <p className="text-sm text-gray-300">
                                    Focus on high-demand routes like your top destinations. Consider premium pricing during peak seasons to maximize revenue.
                                </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">🚌 Fleet Utilization</h4>
                                <p className="text-sm text-gray-300">
                                    Average {kpis.avgPassengersPerTrip} passengers per trip. Optimize bus assignments based on passenger count to reduce operational costs.
                                </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">⚠️ Operational Efficiency</h4>
                                <p className="text-sm text-gray-300">
                                    Monitor pending reservations ({kpis.pendingReservations}) and reduce processing time to improve customer satisfaction.
                                </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">🎯 Growth Opportunities</h4>
                                <p className="text-sm text-gray-300">
                                    Analyze underperforming routes and consider marketing campaigns for popular origins to increase bookings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
