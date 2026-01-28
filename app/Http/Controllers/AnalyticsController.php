<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Reservation;
use App\Models\Inquiry;
use App\Models\Faq;
use App\Models\CentralDataReport;
use App\Models\ManagementDashboard;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function dashboard()
    {
        return $this->getAnalyticsData('Admin/Dashboard');
    }

    public function index()
    {
        return $this->getAnalyticsData('Admin/Analytics');
    }

    private function getAnalyticsData($view)
    {
        // Get key metrics from reservations
        $totalReservations = Reservation::count();
        $completedReservations = Reservation::where('status', 'completed')->count();
        $cancelledReservations = Reservation::where('status', 'cancelled')->count();
        $pendingReservations = Reservation::where('status', 'pending')->count();

        // Calculate revenue (assuming average price per reservation)
        $avgPricePerPassenger = 500; // You can adjust this or get from a config
        $totalRevenue = Reservation::where('status', 'completed')
            ->sum(DB::raw('estimated_passengers * ' . $avgPricePerPassenger));

        // Get popular destinations
        $popularDestinations = Reservation::select('destination', DB::raw('count(*) as total'))
            ->groupBy('destination')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Get popular origins
        $popularOrigins = Reservation::select('origin', DB::raw('count(*) as total'))
            ->groupBy('origin')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Get monthly reservation trends (last 6 months)
        $monthlyTrends = Reservation::select(
                DB::raw('DATE_FORMAT(reservation_date, "%Y-%m") as month'),
                DB::raw('count(*) as total'),
                DB::raw('sum(estimated_passengers) as passengers')
            )
            ->where('reservation_date', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Get total passengers served
        $totalPassengers = Reservation::where('status', 'completed')
            ->sum('estimated_passengers');

        // Get average passengers per trip
        $avgPassengersPerTrip = Reservation::where('status', 'completed')
            ->avg('estimated_passengers');

        // Trip type distribution
        $tripTypeDistribution = Reservation::select('travel_options', DB::raw('count(*) as total'))
            ->groupBy('travel_options')
            ->get();

        // Recent activity counts
        $totalInquiries = Inquiry::count();
        $totalFaqs = Faq::count();

        // Get latest management dashboard metrics
        $latestMetrics = ManagementDashboard::with('centralDataReport')
            ->orderByDesc('timestamp')
            ->limit(10)
            ->get();

        return Inertia::render($view, [
            'kpis' => [
                'totalReservations' => $totalReservations,
                'completedReservations' => $completedReservations,
                'cancelledReservations' => $cancelledReservations,
                'pendingReservations' => $pendingReservations,
                'totalRevenue' => $totalRevenue,
                'totalPassengers' => $totalPassengers,
                'avgPassengersPerTrip' => round($avgPassengersPerTrip, 1),
                'totalInquiries' => $totalInquiries,
                'totalFaqs' => $totalFaqs,
            ],
            'popularDestinations' => $popularDestinations,
            'popularOrigins' => $popularOrigins,
            'monthlyTrends' => $monthlyTrends,
            'tripTypeDistribution' => $tripTypeDistribution,
            'latestMetrics' => $latestMetrics,
        ]);
    }
}
