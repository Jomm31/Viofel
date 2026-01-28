<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FuelPrice;
use App\Models\CalculatedCost;
use App\Models\Reservation;
use Inertia\Inertia;

class PricingController extends Controller
{
    /**
     * Display pricing settings
     */
    public function index()
    {
        $currentFuelPrice = FuelPrice::orderBy('date_effective', 'desc')->first();
        $fuelPriceHistory = FuelPrice::orderBy('date_effective', 'desc')->limit(10)->get();

        return Inertia::render('Admin/Pricing', [
            'current_fuel_price' => $currentFuelPrice,
            'fuel_price_history' => $fuelPriceHistory
        ]);
    }

    /**
     * Update fuel price
     */
    public function updateFuelPrice(Request $request)
    {
        $validated = $request->validate([
            'price_per_liter' => 'required|numeric|min:0',
        ]);

        $fuelPrice = FuelPrice::create([
            'fuel_price' => $validated['price_per_liter'],
            'date_effective' => now(),
            'price_per_liter' => $validated['price_per_liter'],
            'distance_km' => 0
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Fuel price updated successfully',
            'fuel_price' => $fuelPrice
        ]);
    }

    /**
     * Adjust reservation cost (for admin to modify fuel/distance costs)
     */
    public function adjustReservationCost(Request $request, $reservationId)
    {
        try {
            $validated = $request->validate([
                'distance_km' => 'nullable|numeric|min:0',
                'distance_cost' => 'nullable|numeric|min:0',
                'fuel_surcharge' => 'nullable|numeric|min:0',
            ]);

            $reservation = Reservation::with('calculatedCost')->findOrFail($reservationId);

            if (!$reservation->calculatedCost) {
                return response()->json(['error' => 'No calculated cost found for this reservation'], 404);
            }

            // Update reservation distance if provided
            if (isset($validated['distance_km'])) {
                $reservation->update(['distance_km' => $validated['distance_km']]);
            }

            // Recalculate with admin adjustments
            $passengers = $reservation->estimated_passengers;
            $busCost = 0;
            
            if ($passengers >= 15 && $passengers <= 25) {
                $busCost = 8000;
            } elseif ($passengers >= 26 && $passengers <= 40) {
                $busCost = 12000;
            } else {
                $busCost = 5000;
            }

            $passengerCost = $passengers * 200;
            $distanceCost = $validated['distance_cost'] ?? (($reservation->distance_km ?? 100) * 15);
            $fuelSurcharge = $validated['fuel_surcharge'] ?? ((($reservation->distance_km ?? 100) / 10) * 65);

            $newTotalCost = $passengerCost + $busCost + $distanceCost + $fuelSurcharge;

            $reservation->calculatedCost->update([
                'total_cost' => $newTotalCost
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cost adjusted successfully',
                'new_total' => $newTotalCost,
                'breakdown' => [
                    'passenger_cost' => $passengerCost,
                    'bus_cost' => $busCost,
                    'distance_cost' => $distanceCost,
                    'fuel_surcharge' => $fuelSurcharge,
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to adjust cost',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
