<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of reservations.
     */
    public function index(Request $request)
    {
        $query = Reservation::with(['customer', 'bookingReference'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by reference number or customer name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('customer', function ($cq) use ($search) {
                    $cq->where('full_name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('bookingReference', function ($bq) use ($search) {
                    $bq->where('booking_reference', 'like', "%{$search}%");
                });
            });
        }

        $reservations = $query->paginate(15);

        return view('admin.reservations.index', [
            'reservations' => $reservations,
            'currentStatus' => $request->status ?? 'all',
            'search' => $request->search ?? '',
        ]);
    }

    /**
     * Display the specified reservation.
     */
    public function show(Reservation $reservation)
    {
        $reservation->load(['customer', 'bookingReference']);

        return view('admin.reservations.show', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Update the reservation status.
     */
    public function updateStatus(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $reservation->update([
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Reservation status updated successfully!');
    }

    /**
     * Remove the specified reservation.
     */
    public function destroy(Reservation $reservation)
    {
        // Delete booking reference first (due to foreign key)
        $reservation->bookingReference()->delete();
        $reservation->delete();

        return redirect()->route('admin.reservations.index')
            ->with('success', 'Reservation deleted successfully!');
    }
}
