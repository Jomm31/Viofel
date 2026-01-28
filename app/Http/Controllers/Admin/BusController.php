<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bus;
use App\Models\Reservation;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BusController extends Controller
{
    /**
     * Display all buses with availability status
     */
    public function index()
    {
        $buses = Bus::withCount(['reservations as active_reservations_count' => function ($query) {
            $query->whereIn('status', ['confirmed', 'pending'])
                  ->whereDate('reservation_date', '>=', now()->toDateString());
        }])->get()->map(function ($bus) {
            // Check if bus is currently assigned to any active reservation
            $hasActiveReservation = $bus->active_reservations_count > 0;
            
            return [
                'bus_id' => $bus->bus_id,
                'plate_number' => $bus->plate_number,
                'type' => $bus->type,
                'capacity' => $bus->capacity,
                'status' => $bus->status,
                'fuel_efficiency' => $bus->fuel_efficiency,
                'is_available' => $bus->status === 'available' && !$hasActiveReservation,
                'active_reservations' => $bus->active_reservations_count,
            ];
        });

        return Inertia::render('Admin/Buses', [
            'buses' => $buses
        ]);
    }

    /**
     * Store a new bus
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|unique:buses,plate_number|max:20',
            'type' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'fuel_efficiency' => 'nullable|numeric|min:0',
        ]);

        $bus = Bus::create([
            'plate_number' => $validated['plate_number'],
            'type' => $validated['type'],
            'capacity' => $validated['capacity'],
            'fuel_efficiency' => $validated['fuel_efficiency'] ?? null,
            'status' => 'available',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bus added successfully',
            'bus' => $bus
        ]);
    }

    /**
     * Update bus details
     */
    public function update(Request $request, $id)
    {
        $bus = Bus::findOrFail($id);

        $validated = $request->validate([
            'plate_number' => 'required|string|max:20|unique:buses,plate_number,' . $id . ',bus_id',
            'type' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'fuel_efficiency' => 'nullable|numeric|min:0',
            'status' => 'required|in:available,maintenance,unavailable',
        ]);

        $bus->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bus updated successfully',
            'bus' => $bus
        ]);
    }

    /**
     * Delete a bus
     */
    public function destroy($id)
    {
        $bus = Bus::findOrFail($id);
        
        // Check if bus has active reservations
        $hasActiveReservations = $bus->reservations()
            ->whereIn('status', ['confirmed', 'pending'])
            ->whereDate('reservation_date', '>=', now()->toDateString())
            ->exists();

        if ($hasActiveReservations) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete bus with active reservations'
            ], 400);
        }

        $bus->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bus deleted successfully'
        ]);
    }

    /**
     * Get bus availability for a specific date
     */
    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'bus_type' => 'nullable|string',
        ]);

        $date = $validated['date'];
        $busType = $validated['bus_type'] ?? null;

        $query = Bus::where('status', 'available');

        if ($busType) {
            $query->where('type', $busType);
        }

        $availableBuses = $query->whereDoesntHave('reservations', function ($query) use ($date) {
            $query->whereDate('reservation_date', $date)
                  ->whereIn('status', ['confirmed', 'pending']);
        })->get();

        return response()->json([
            'success' => true,
            'available_buses' => $availableBuses
        ]);
    }
}
