<?php

namespace App\Http\Controllers;

use App\Models\BookingReference;
use App\Models\Customer;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Store a new reservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Customer fields
            'full_name' => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'required|digits_between:7,20',
            'address' => 'nullable|string|max:500',
            'valid_id' => 'nullable|string|max:255',
            'valid_id_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            
            // Reservation fields
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'distance_km' => 'nullable|numeric|min:0',
            'reservation_date' => 'required|date|after_or_equal:today',
            'estimated_passengers' => 'required|integer|min:1',
            'travel_options' => 'nullable|string|max:255',
            'departure_time' => 'required|date_format:H:i',
            'arrival_time' => 'nullable|date_format:H:i',
            'bus_id' => 'nullable|integer',
        ]);

        try {
            DB::beginTransaction();

            // Handle file upload
            $validIdPath = null;
            if ($request->hasFile('valid_id_image')) {
                $validIdPath = $request->file('valid_id_image')->store('valid_ids', 'public');
            }

            // Create or find customer
            $customer = Customer::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'full_name' => $validated['full_name'],
                    'phone' => $validated['phone'],
                    'address' => $validated['address'] ?? null,
                    'valid_id' => $validated['valid_id'] ?? null,
                    'valid_id_path' => $validIdPath,
                ]
            );

            // Update customer info if they already exist
            $customer->update([
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? $customer->address,
                'valid_id' => $validated['valid_id'] ?? $customer->valid_id,
                'valid_id_path' => $validIdPath ?? $customer->valid_id_path,
            ]);

            // Create reservation
            $reservation = Reservation::create([
                'customer_id' => $customer->customer_id,
                'bus_id' => $validated['bus_id'] ?? null,
                'origin' => $validated['origin'],
                'destination' => $validated['destination'],
                'distance_km' => $validated['distance_km'] ?? null,
                'reservation_date' => $validated['reservation_date'],
                'estimated_passengers' => $validated['estimated_passengers'],
                'travel_options' => $validated['travel_options'] ?? null,
                'departure_time' => $validated['reservation_date'] . ' ' . $validated['departure_time'],
                'arrival_time' => $validated['arrival_time'] 
                    ? $validated['reservation_date'] . ' ' . $validated['arrival_time'] 
                    : null,
                'status' => 'not_paid',
            ]);

            // Generate booking reference
            $bookingReference = BookingReference::create([
                'reservation_id' => $reservation->reservation_id,
                'booking_reference' => BookingReference::generateReference(),
            ]);

            // Calculate cost automatically with bus selection
            $fuelPrice = \App\Models\FuelPrice::orderBy('date_effective', 'desc')->first();
            
            if (!$fuelPrice) {
                $fuelPrice = \App\Models\FuelPrice::create([
                    'fuel_price' => 65.00,
                    'date_effective' => now(),
                    'price_per_liter' => 65.00,
                    'distance_km' => 0
                ]);
            }

            // Auto-select bus based on passenger count
            $passengers = $reservation->estimated_passengers;
            $busCost = 0;
            
            if ($passengers >= 15 && $passengers <= 25) {
                $busCost = 8000; // Carousel Bus
            } elseif ($passengers >= 26 && $passengers <= 40) {
                $busCost = 12000; // Tourist Bus
            } else {
                $busCost = 5000; // Standard Bus
            }

            $ratePerPassenger = 200;
            $distanceCost = ($reservation->distance_km ?? 100) * 15;
            $fuelSurcharge = ($reservation->distance_km ?? 100) / 10 * $fuelPrice->price_per_liter;
            $passengerCost = $passengers * $ratePerPassenger;
            
            // Partial payment (what customer pays upfront)
            $partialPayment = $passengerCost + $busCost;
            
            // Total cost (including admin-adjustable costs)
            $totalCost = $passengerCost + $busCost + $distanceCost + $fuelSurcharge;

            $calculatedCost = \App\Models\CalculatedCost::create([
                'reservation_id' => $reservation->reservation_id,
                'fuel_price_id' => $fuelPrice->fuel_price_id,
                'total_cost' => $totalCost
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'reference_number' => $bookingReference->booking_reference,
                'message' => 'Reservation created successfully!',
                'total_cost' => $totalCost,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Look up a reservation by reference number.
     */
    public function lookup(Request $request)
    {
        $validated = $request->validate([
            'reference_number' => 'required|string',
        ]);

        $bookingReference = BookingReference::where('booking_reference', $validated['reference_number'])
            ->first();

        if (!$bookingReference) {
            return response()->json([
                'success' => false,
                'message' => 'No reservation found with this reference number.',
            ], 404);
        }

        $reservation = $bookingReference->reservation->load(['customer', 'calculatedCost.refund']);

        // Get refund info if exists
        $refund = $reservation->calculatedCost?->refund;

        // Calculate breakdown
        $passengers = $reservation->estimated_passengers;
        $busType = '';
        $busCost = 0;
        
        if ($passengers >= 15 && $passengers <= 25) {
            $busType = 'Carousel Bus';
            $busCost = 8000;
        } elseif ($passengers >= 26 && $passengers <= 40) {
            $busType = 'Tourist Bus';
            $busCost = 12000;
        } else {
            $busType = 'Standard Bus';
            $busCost = 5000;
        }

        $passengerCost = $passengers * 200;
        $distanceKm = $reservation->distance_km ?? 100;
        $distanceCost = $distanceKm * 15;
        $fuelSurcharge = ($distanceKm / 10) * 65;
        $partialPayment = $passengerCost + $busCost;

        return response()->json([
            'success' => true,
            'reservation' => [
                'id' => $reservation->reservation_id,
                'reference_number' => $bookingReference->booking_reference,
                'status' => $reservation->status,
                'customer_name' => $reservation->customer->full_name,
                'email' => $reservation->customer->email,
                'phone' => $reservation->customer->phone,
                'address' => $reservation->customer->address,
                'origin' => $reservation->origin,
                'destination' => $reservation->destination,
                'reservation_date' => $reservation->reservation_date->format('Y-m-d'),
                'departure_time' => $reservation->departure_time?->format('H:i'),
                'arrival_time' => $reservation->arrival_time?->format('H:i'),
                'estimated_passengers' => $reservation->estimated_passengers,
                'travel_options' => $reservation->travel_options,
                'distance_km' => $distanceKm,
                'distance_cost' => $distanceCost,
                'fuel_surcharge' => $fuelSurcharge,
                'total_cost' => $reservation->calculatedCost?->total_cost ?? null,
                'partial_payment' => $partialPayment,
                'bus_type' => $busType,
                'bus_cost' => $busCost,
                'passenger_cost' => $passengerCost,
                'created_at' => $reservation->created_at->format('M d, Y'),
                'refund' => $refund ? [
                    'status' => $refund->status,
                    'reason' => $refund->reason,
                    'amount' => $refund->amount,
                    'admin_notes' => $refund->admin_notes,
                    'refund_date' => $refund->refund_date?->format('M d, Y'),
                ] : null,
            ],
        ]);
    }

    /**
     * Update an existing reservation.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            // Customer fields
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|digits_between:7,20',
            'address' => 'nullable|string|max:500',
            
            // Reservation fields
            'origin' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'distance_km' => 'nullable|numeric|min:0',
            'reservation_date' => 'required|date',
            'estimated_passengers' => 'required|integer|min:1',
            'travel_options' => 'nullable|string|max:255',
            'departure_time' => 'required|date_format:H:i',
            'arrival_time' => 'nullable|date_format:H:i',
        ]);

        try {
            DB::beginTransaction();

            $reservation = Reservation::findOrFail($id);
            
            // Check if reservation can be modified
            if (in_array($reservation->status, ['cancelled', 'completed'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot modify a ' . $reservation->status . ' reservation.',
                ], 400);
            }

            // Update customer info
            $reservation->customer->update([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? null,
            ]);

            // Update reservation
            $reservation->update([
                'origin' => $validated['origin'],
                'destination' => $validated['destination'],
                'distance_km' => $validated['distance_km'] ?? null,
                'reservation_date' => $validated['reservation_date'],
                'estimated_passengers' => $validated['estimated_passengers'],
                'travel_options' => $validated['travel_options'] ?? null,
                'departure_time' => $validated['reservation_date'] . ' ' . $validated['departure_time'],
                'arrival_time' => $validated['arrival_time'] 
                    ? $validated['reservation_date'] . ' ' . $validated['arrival_time'] 
                    : null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Reservation updated successfully!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update reservation. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete/Cancel a reservation.
     */
    public function destroy(Request $request, $id)
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $reservation = Reservation::findOrFail($id);
            
            // Check if reservation can be cancelled
            if (in_array($reservation->status, ['cancelled', 'completed'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot cancel a ' . $reservation->status . ' reservation.',
                ], 400);
            }

            // Update reservation with cancellation info (pending admin approval)
            $reservation->update([
                'cancellation_reason' => $validated['cancellation_reason'],
                'cancelled_at' => now(),
                'cancellation_status' => 'pending_approval',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cancellation request submitted! Please wait for admin approval.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit cancellation request. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
