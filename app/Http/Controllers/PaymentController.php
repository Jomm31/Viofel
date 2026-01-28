<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\CalculatedCost;
use App\Models\Invoice;
use App\Models\FuelPrice;
use App\Models\Refund;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Calculate cost for a reservation
     */
    public function calculateCost(Request $request, $reservationId)
    {
        $reservation = Reservation::with('customer')->findOrFail($reservationId);

        // Get current fuel price (most recent)
        $fuelPrice = FuelPrice::orderBy('date_effective', 'desc')->first();
        
        if (!$fuelPrice) {
            // Create default fuel price if none exists
            $fuelPrice = FuelPrice::create([
                'fuel_price' => 65.00,
                'date_effective' => now(),
                'price_per_liter' => 65.00,
                'distance_km' => 0
            ]);
        }

        // Auto-select bus based on passenger count
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

        // Calculate costs
        $ratePerPassenger = 200;
        $distanceCost = ($reservation->distance_km ?? 100) * 15;
        $fuelSurcharge = ($reservation->distance_km ?? 100) / 10 * $fuelPrice->price_per_liter;
        $passengerCost = $passengers * $ratePerPassenger;
        
        // Partial payment (passenger + bus cost only)
        $partialPayment = $passengerCost + $busCost;
        
        // Total cost (including fuel and distance that admin will adjust)
        $totalCost = $passengerCost + $busCost + $distanceCost + $fuelSurcharge;

        // Create or update calculated cost
        $calculatedCost = CalculatedCost::updateOrCreate(
            ['reservation_id' => $reservationId],
            [
                'fuel_price_id' => $fuelPrice->fuel_price_id,
                'total_cost' => $totalCost
            ]
        );

        return response()->json([
            'success' => true,
            'calculated_cost' => $calculatedCost,
            'total_cost' => $totalCost,
            'partial_payment' => $partialPayment,
            'breakdown' => [
                'bus_type' => $busType,
                'bus_cost' => $busCost,
                'passenger_cost' => $passengerCost,
                'distance_cost' => $distanceCost,
                'fuel_surcharge' => $fuelSurcharge,
                'passengers' => $passengers,
                'distance_km' => $reservation->distance_km ?? 100
            ]
        ]);
    }

    /**
     * Process payment
     */
    public function processPayment(Request $request, $reservationId)
    {
        $request->validate([
            'payment_method' => 'required|string'
        ]);

        $reservation = Reservation::with(['customer', 'calculatedCost'])->findOrFail($reservationId);

        if (!$reservation->calculatedCost) {
            return response()->json(['error' => 'Cost not calculated yet'], 400);
        }

        DB::beginTransaction();
        try {
            // Generate invoice
            $invoice = Invoice::create([
                'calculated_cost_id' => $reservation->calculatedCost->calculated_cost_id,
                'invoice_number' => Invoice::generateInvoiceNumber(),
                'issued_at' => now(),
                'amount' => $reservation->calculatedCost->total_cost,
                'status' => 'pending'
            ]);

            // Update reservation status to confirmed
            $reservation->update(['status' => 'confirmed']);

            DB::commit();

            return response()->json([
                'success' => true,
                'invoice' => $invoice,
                'message' => 'Payment processed successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Payment processing failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Confirm payment (Admin)
     */
    public function confirmPayment(Request $request, $invoiceId)
    {
        $invoice = Invoice::with('calculatedCost.reservation')->findOrFail($invoiceId);

        $invoice->update(['status' => 'paid']);
        
        if ($invoice->calculatedCost && $invoice->calculatedCost->reservation) {
            $invoice->calculatedCost->reservation->update(['status' => 'confirmed']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment confirmed successfully'
        ]);
    }

    /**
     * Request refund (Customer)
     */
    public function requestRefund(Request $request, $invoiceId)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $invoice = Invoice::with('calculatedCost')->findOrFail($invoiceId);

        if ($invoice->status !== 'paid') {
            return response()->json(['error' => 'Can only refund paid invoices'], 400);
        }

        $refund = Refund::create([
            'calculated_cost_id' => $invoice->calculated_cost_id,
            'reason' => $request->reason,
            'refund_date' => now(),
            'amount' => $invoice->amount,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'refund' => $refund,
            'message' => 'Refund request submitted successfully'
        ]);
    }

    /**
     * Approve/Reject refund (Admin)
     */
    public function processRefund(Request $request, $refundId)
    {
        $request->validate([
            'action' => 'required|in:approved,rejected'
        ]);

        $refund = Refund::with('calculatedCost.reservation')->findOrFail($refundId);
        
        $refund->update(['status' => $request->action]);

        if ($request->action === 'approved' && $refund->calculatedCost && $refund->calculatedCost->reservation) {
            $refund->calculatedCost->reservation->update(['status' => 'cancelled']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Refund ' . $request->action . ' successfully'
        ]);
    }

    /**
     * Get all refund requests (Admin)
     */
    public function refunds()
    {
        $refunds = Refund::with([
            'calculatedCost.reservation',
            'calculatedCost.invoice'
        ])
        ->orderBy('refund_date', 'desc')
        ->get();

        return Inertia::render('Admin/Refunds', [
            'refunds' => $refunds
        ]);
    }

    /**
     * Get paid clients (Admin)
     */
    public function paidClients()
    {
        $invoices = Invoice::with([
            'calculatedCost.reservation.customer',
            'calculatedCost.reservation.bookingReference'
        ])
        ->where('status', 'paid')
        ->orderBy('issued_at', 'desc')
        ->get();

        return Inertia::render('Admin/PaidClients', [
            'invoices' => $invoices
        ]);
    }

    /**
     * Get all invoices (Admin)
     */
    public function invoices()
    {
        $invoices = Invoice::with([
            'calculatedCost.reservation.customer',
            'calculatedCost.reservation.bookingReference',
            'calculatedCost.refunds'
        ])
        ->orderBy('issued_at', 'desc')
        ->get();

        return Inertia::render('Admin/Invoices', [
            'invoices' => $invoices
        ]);
    }

    /**
     * Generate invoice PDF
     */
    public function generateInvoice($invoiceId)
    {
        $invoice = Invoice::with([
            'calculatedCost.reservation.customer',
            'calculatedCost.reservation.bookingReference'
        ])->findOrFail($invoiceId);

        return response()->json([
            'success' => true,
            'invoice' => $invoice
        ]);
    }

    /**
     * Get invoice ID from reservation
     */
    public function getInvoiceByReservation($reservationId)
    {
        $reservation = Reservation::with('calculatedCost.invoice')->findOrFail($reservationId);

        if (!$reservation->calculatedCost || !$reservation->calculatedCost->invoice) {
            return response()->json(['error' => 'No invoice found for this reservation'], 404);
        }

        return response()->json([
            'success' => true,
            'invoice_id' => $reservation->calculatedCost->invoice->invoice_id
        ]);
    }
}
