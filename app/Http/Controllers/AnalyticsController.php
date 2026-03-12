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
        try {
            // Get key metrics from reservations
            $totalReservations = Reservation::count();
            $completedReservations = Reservation::where('status', 'completed')->count();
            $cancelledReservations = Reservation::where('status', 'cancelled')->count();
            $pendingReservations = Reservation::where('status', 'pending')->count();

            // Calculate revenue (assuming average price per reservation)
            $avgPricePerPassenger = 500;
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
            $driver = DB::getDriverName();
            if ($driver === 'pgsql') {
                $monthExpr = "TO_CHAR(reservation_date, 'YYYY-MM')";
            } else {
                $monthExpr = 'DATE_FORMAT(reservation_date, "%Y-%m")';
            }
            $monthlyTrends = Reservation::select(
                    DB::raw($monthExpr . ' as month'),
                    DB::raw('count(*) as total'),
                    DB::raw('sum(estimated_passengers) as passengers')
                )
                ->where('reservation_date', '>=', Carbon::now()->subMonths(6))
                ->groupBy(DB::raw($monthExpr))
                ->orderBy(DB::raw($monthExpr))
                ->get();

            // Get total passengers served
            $totalPassengers = Reservation::where('status', 'completed')
                ->sum('estimated_passengers');

            // Get average passengers per trip
            $avgPassengersPerTrip = Reservation::where('status', 'completed')
                ->avg('estimated_passengers') ?? 0;

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
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Analytics error: ' . $e->getMessage());

            $totalReservations = 0;
            $completedReservations = 0;
            $cancelledReservations = 0;
            $pendingReservations = 0;
            $totalRevenue = 0;
            $popularDestinations = collect();
            $popularOrigins = collect();
            $monthlyTrends = collect();
            $totalPassengers = 0;
            $avgPassengersPerTrip = 0;
            $tripTypeDistribution = collect();
            $totalInquiries = 0;
            $totalFaqs = 0;
            $latestMetrics = collect();
        }

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
