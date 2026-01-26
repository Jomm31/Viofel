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
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string|max:500',
            'valid_id' => 'nullable|string|max:255',
            
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

            // Create or find customer
            $customer = Customer::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'full_name' => $validated['full_name'],
                    'phone' => $validated['phone'],
                    'address' => $validated['address'] ?? null,
                    'valid_id' => $validated['valid_id'] ?? null,
                ]
            );

            // Update customer info if they already exist
            $customer->update([
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? $customer->address,
                'valid_id' => $validated['valid_id'] ?? $customer->valid_id,
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
                'status' => 'pending',
            ]);

            // Generate booking reference
            $bookingReference = BookingReference::create([
                'reservation_id' => $reservation->reservation_id,
                'booking_reference' => BookingReference::generateReference(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'reference_number' => $bookingReference->booking_reference,
                'message' => 'Reservation created successfully!',
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

        $reservation = $bookingReference->reservation->load('customer');

        return response()->json([
            'success' => true,
            'reservation' => [
                'reference_number' => $bookingReference->booking_reference,
                'status' => $reservation->status,
                'customer_name' => $reservation->customer->full_name,
                'email' => $reservation->customer->email,
                'phone' => $reservation->customer->phone,
                'origin' => $reservation->origin,
                'destination' => $reservation->destination,
                'reservation_date' => $reservation->reservation_date->format('Y-m-d'),
                'departure_time' => $reservation->departure_time?->format('H:i'),
                'arrival_time' => $reservation->arrival_time?->format('H:i'),
                'estimated_passengers' => $reservation->estimated_passengers,
                'travel_options' => $reservation->travel_options,
                'distance_km' => $reservation->distance_km,
                'created_at' => $reservation->created_at->format('M d, Y'),
            ],
        ]);
    }
}
