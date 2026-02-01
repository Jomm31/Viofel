<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\Reservation;
use App\Models\CalculatedCost;
use App\Models\Invoice;
use App\Models\FuelPrice;
use App\Models\Refund;
use Inertia\Inertia;
use Luigel\Paymongo\Facades\Paymongo;

/**
 * PaymentController
 * 
 * Handles all payment-related operations including:
 * - Cost calculation for reservations
 * - PayMongo checkout session creation
 * - Payment processing and verification
 * - Invoice generation and management
 * - Refund requests and processing
 * 
 * Security Features:
 * - Input validation on all endpoints
 * - Try-catch error handling with logging
 * - Access control for admin functions
 */
class PaymentController extends Controller
{
    /**
     * Calculate cost for a reservation
     * Auto-selects bus type based on passenger count
     * 
     * @param Request $request
     * @param int $reservationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function calculateCost(Request $request, $reservationId)
    {
        try {
            // Validate reservation ID
            $validator = Validator::make(['id' => $reservationId], [
                'id' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Invalid reservation ID',
                    'errors' => $validator->errors()
                ], 422);
            }

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
            
            // Total cost (including fuel and distance)
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

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Reservation not found: ' . $reservationId);
            return response()->json(['error' => 'Reservation not found'], 404);
        } catch (\Exception $e) {
            Log::error('Cost calculation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to calculate cost',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create PayMongo checkout session for payment
     * 
     * @param Request $request
     * @param int $reservationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCheckout(Request $request, $reservationId)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'payment_method' => 'required|string|in:gcash,grab_pay,card,paymaya'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Invalid payment method',
                    'errors' => $validator->errors()
                ], 422);
            }

            $reservation = Reservation::with(['customer', 'calculatedCost', 'bookingReference'])
                ->findOrFail($reservationId);

            if (!$reservation->calculatedCost) {
                return response()->json([
                    'error' => 'Cost not calculated yet. Please try again.'
                ], 400);
            }

            // Check if already paid
            if ($reservation->status === 'pending' || $reservation->status === 'confirmed') {
                return response()->json([
                    'error' => 'This reservation has already been paid.'
                ], 400);
            }

            // Calculate partial payment (bus + passengers only)
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
            $partialPayment = $passengerCost + $busCost;

            // Amount in centavos (PayMongo uses smallest currency unit)
            $amountInCentavos = (int)($partialPayment * 100);

            // Create line items for checkout
            $lineItems = [
                [
                    'name' => 'Bus Reservation - ' . ($reservation->bookingReference->booking_reference ?? 'N/A'),
                    'amount' => $amountInCentavos,
                    'currency' => 'PHP',
                    'quantity' => 1,
                    'description' => sprintf(
                        'Bus: ₱%s | %d Passengers: ₱%s',
                        number_format($busCost, 2),
                        $passengers,
                        number_format($passengerCost, 2)
                    )
                ]
            ];

            // Log reservation data for debugging
            Log::info('Payment checkout attempt', [
                'reservation_id' => $reservationId,
                'customer_id' => $reservation->customer_id,
                'customer' => $reservation->customer,
                'email' => $reservation->customer->email ?? null,
                'full_name' => $reservation->customer->full_name ?? null,
                'phone' => $reservation->customer->phone ?? null
            ]);

            // Check if customer exists
            if (!$reservation->customer) {
                return response()->json([
                    'error' => 'Customer information not found. Please contact support.'
                ], 422);
            }

            // Validate customer email before creating checkout
            $customerEmail = $reservation->customer->email ?? null;
            
            // Check for valid email with proper domain (e.g., user@domain.com)
            $emailPattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
            if (empty($customerEmail) || !preg_match($emailPattern, $customerEmail)) {
                return response()->json([
                    'error' => 'A valid email address with a proper domain (e.g., user@gmail.com) is required for payment. The email "' . ($customerEmail ?? 'none') . '" is not valid.',
                    'debug' => config('app.debug') ? ['email_provided' => $customerEmail ?? 'null'] : null
                ], 422);
            }
            
            // Create PayMongo checkout session
            $checkout = Paymongo::checkout()->create([
                'cancel_url' => url('/status?cancelled=true'),
                'success_url' => url('/api/payments/success?checkout_id={CHECKOUT_SESSION_ID}'),
                'line_items' => $lineItems,
                'payment_method_types' => [$request->payment_method],
                'description' => 'Bus Reservation Payment for ' . ($reservation->bookingReference->booking_reference ?? 'N/A'),
                'billing' => [
                    'name' => $reservation->customer->full_name ?? 'Customer',
                    'email' => $reservation->customer->email,
                    'phone' => $reservation->customer->phone ?? null
                ],
                'metadata' => [
                    'reservation_id' => $reservation->reservation_id,
                    'reference_number' => $reservation->bookingReference->booking_reference ?? null
                ]
            ]);

            // Create invoice with checkout info
            $invoice = Invoice::create([
                'calculated_cost_id' => $reservation->calculatedCost->calculated_cost_id,
                'invoice_number' => Invoice::generateInvoiceNumber(),
                'issued_at' => now(),
                'amount' => $partialPayment,
                'status' => 'awaiting_payment',
                'paymongo_checkout_id' => $checkout->id,
                'checkout_url' => $checkout->checkout_url,
                'payment_method' => $request->payment_method
            ]);

            // Store checkout info in session for fallback lookup
            session([
                'last_checkout_id' => $checkout->id,
                'last_checkout_reservation_id' => $reservationId
            ]);

            Log::info('Checkout created', [
                'reservation_id' => $reservationId,
                'checkout_id' => $checkout->id,
                'amount' => $partialPayment
            ]);

            return response()->json([
                'success' => true,
                'checkout_url' => $checkout->checkout_url,
                'checkout_id' => $checkout->id,
                'invoice_id' => $invoice->invoice_id,
                'amount' => $partialPayment
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Reservation not found for checkout: ' . $reservationId);
            return response()->json(['error' => 'Reservation not found'], 404);
        } catch (\Exception $e) {
            Log::error('Checkout creation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to create checkout session',
                'message' => config('app.debug') ? $e->getMessage() : 'Please try again later.'
            ], 500);
        }
    }

    /**
     * Handle successful payment callback from PayMongo
     * 
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function paymentSuccess(Request $request)
    {
        try {
            // PayMongo may send the checkout ID as 'checkout_id' or 'session_id'
            $checkoutId = $request->query('checkout_id') ?? $request->query('session_id');
            
            // Handle case where placeholder wasn't replaced
            if (empty($checkoutId) || $checkoutId === '{CHECKOUT_SESSION_ID}') {
                Log::warning('Payment success called with invalid checkout_id: ' . ($checkoutId ?? 'null'));
                
                // Try to get checkout_id from session (stored during checkout creation)
                $sessionCheckoutId = session('last_checkout_id');
                if ($sessionCheckoutId) {
                    $checkoutId = $sessionCheckoutId;
                    Log::info('Found checkout_id from session', ['checkout_id' => $checkoutId]);
                    session()->forget(['last_checkout_id', 'last_checkout_reservation_id']);
                } else {
                    // Fallback: Try to find the most recent awaiting_payment invoice
                    $invoice = Invoice::where('status', 'awaiting_payment')
                        ->orderBy('created_at', 'desc')
                        ->first();
                        
                    if ($invoice && $invoice->paymongo_checkout_id) {
                        $checkoutId = $invoice->paymongo_checkout_id;
                        Log::info('Found invoice by awaiting_payment status', ['checkout_id' => $checkoutId]);
                    } else {
                        return redirect('/status?error=missing_checkout_id');
                    }
                }
            }

            // Find invoice by checkout ID
            $invoice = Invoice::where('paymongo_checkout_id', $checkoutId)->first();
            
            if (!$invoice) {
                Log::warning('Invoice not found for checkout: ' . $checkoutId);;
                return redirect('/status?error=invoice_not_found');
            }

            // Retrieve checkout session from PayMongo
            $checkout = Paymongo::checkout()->find($checkoutId);
            
            Log::info('Checkout session retrieved', [
                'checkout_id' => $checkoutId,
                'status' => $checkout->status ?? 'unknown',
                'payments_count' => count($checkout->payments ?? [])
            ]);
            
            // Check if checkout exists and has payments (status can be 'active', 'complete', or 'paid')
            if ($checkout && in_array($checkout->status, ['active', 'complete', 'paid'])) {
                // Get payment from checkout
                $payments = $checkout->payments ?? [];
                $paymentId = null;
                $paymentIntentId = null;

                if (!empty($payments)) {
                    $payment = $payments[0];
                    $paymentId = $payment['id'] ?? null;
                    $paymentIntentId = $payment['attributes']['payment_intent_id'] ?? null;
                }

                DB::beginTransaction();

                // Update invoice
                $invoice->update([
                    'status' => 'paid',
                    'paymongo_payment_id' => $paymentId,
                    'paymongo_payment_intent_id' => $paymentIntentId,
                    'paid_at' => now()
                ]);

                // Update reservation status to pending (awaiting admin confirmation)
                if ($invoice->calculatedCost && $invoice->calculatedCost->reservation) {
                    $invoice->calculatedCost->reservation->update(['status' => 'pending']);
                    $referenceNumber = $invoice->calculatedCost->reservation->bookingReference->booking_reference ?? null;
                }

                DB::commit();

                Log::info('Payment successful', [
                    'checkout_id' => $checkoutId,
                    'invoice_id' => $invoice->invoice_id,
                    'payment_id' => $paymentId
                ]);

                return redirect('/status?payment=success&reference=' . ($referenceNumber ?? ''));
            }

            // Handle other checkout statuses
            Log::warning('Checkout status not completed', [
                'checkout_id' => $checkoutId,
                'status' => $checkout->status ?? 'unknown'
            ]);

            // If expired or cancelled, show appropriate message
            if ($checkout && in_array($checkout->status, ['expired', 'cancelled'])) {
                return redirect('/status?cancelled=true');
            }

            return redirect('/status?payment=pending');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment success processing error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return redirect('/status?error=processing_failed');
        }
    }

    /**
     * Process payment (fallback for manual payment marking)
     * 
     * @param Request $request
     * @param int $reservationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function processPayment(Request $request, $reservationId)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reservation = Reservation::with(['customer', 'calculatedCost'])->findOrFail($reservationId);

            if (!$reservation->calculatedCost) {
                return response()->json(['error' => 'Cost not calculated yet'], 400);
            }

            // Check if already paid
            if ($reservation->status !== 'not_paid') {
                return response()->json(['error' => 'Reservation is not in payable state'], 400);
            }

            DB::beginTransaction();

            // Generate invoice
            $invoice = Invoice::create([
                'calculated_cost_id' => $reservation->calculatedCost->calculated_cost_id,
                'invoice_number' => Invoice::generateInvoiceNumber(),
                'issued_at' => now(),
                'amount' => $reservation->calculatedCost->total_cost,
                'status' => 'paid',
                'payment_method' => $request->payment_method,
                'paid_at' => now()
            ]);

            // Update reservation status to pending (awaiting admin confirmation)
            $reservation->update(['status' => 'pending']);

            DB::commit();

            Log::info('Manual payment processed', [
                'reservation_id' => $reservationId,
                'invoice_id' => $invoice->invoice_id
            ]);

            return response()->json([
                'success' => true,
                'invoice' => $invoice,
                'message' => 'Payment processed successfully. Status is now pending admin confirmation.'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Reservation not found'], 404);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Payment processing error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Payment processing failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm payment (Admin only)
     * 
     * @param Request $request
     * @param int $invoiceId
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirmPayment(Request $request, $invoiceId)
    {
        try {
            $invoice = Invoice::with('calculatedCost.reservation')->findOrFail($invoiceId);

            if ($invoice->status !== 'pending' && $invoice->status !== 'paid') {
                return response()->json([
                    'error' => 'Invoice cannot be confirmed in current state'
                ], 400);
            }

            DB::beginTransaction();

            $invoice->update(['status' => 'confirmed']);
            
            if ($invoice->calculatedCost && $invoice->calculatedCost->reservation) {
                $invoice->calculatedCost->reservation->update(['status' => 'confirmed']);
            }

            DB::commit();

            Log::info('Payment confirmed by admin', ['invoice_id' => $invoiceId]);

            return response()->json([
                'success' => true,
                'message' => 'Payment confirmed successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment confirmation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to confirm payment',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Request refund (Customer)
     * 
     * @param Request $request
     * @param int $invoiceId
     * @return \Illuminate\Http\JsonResponse
     */
    public function requestRefund(Request $request, $invoiceId)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|min:10|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
                'message' => 'Please provide a valid reason (10-500 characters)'
            ], 422);
        }

        try {
            $invoice = Invoice::with('calculatedCost.reservation')->findOrFail($invoiceId);

            // Validate invoice status
            if ($invoice->status !== 'paid' && $invoice->status !== 'pending') {
                return response()->json([
                    'error' => 'Refunds can only be requested for paid or pending invoices'
                ], 400);
            }

            // Check if refund already exists
            $existingRefund = Refund::where('calculated_cost_id', $invoice->calculated_cost_id)
                ->whereIn('status', ['pending', 'approved'])
                ->first();

            if ($existingRefund) {
                return response()->json([
                    'error' => 'A refund request already exists for this payment'
                ], 400);
            }

            $refund = Refund::create([
                'calculated_cost_id' => $invoice->calculated_cost_id,
                'reason' => trim($request->reason),
                'refund_date' => now(),
                'amount' => $invoice->amount,
                'status' => 'pending'
            ]);

            Log::info('Refund requested', [
                'invoice_id' => $invoiceId,
                'refund_id' => $refund->refund_id,
                'amount' => $invoice->amount
            ]);

            return response()->json([
                'success' => true,
                'refund' => $refund,
                'message' => 'Refund request submitted successfully. Please wait for admin approval.'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Invoice not found'], 404);
        } catch (\Exception $e) {
            Log::error('Refund request error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to submit refund request',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process refund (Admin only)
     * Approves or rejects refund request
     * 
     * @param Request $request
     * @param int $refundId
     * @return \Illuminate\Http\JsonResponse
     */
    public function processRefund(Request $request, $refundId)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $refund = Refund::with(['calculatedCost.reservation', 'calculatedCost.invoice'])
                ->findOrFail($refundId);

            if ($refund->status !== 'pending') {
                return response()->json([
                    'error' => 'This refund has already been processed'
                ], 400);
            }

            DB::beginTransaction();
            
            $refund->update([
                'status' => $request->action,
                'admin_notes' => $request->admin_notes
            ]);

            // If approved, cancel reservation and update invoice
            if ($request->action === 'approved') {
                if ($refund->calculatedCost && $refund->calculatedCost->reservation) {
                    $refund->calculatedCost->reservation->update(['status' => 'cancelled']);
                }

                if ($refund->calculatedCost && $refund->calculatedCost->invoice) {
                    $invoice = $refund->calculatedCost->invoice;
                    
                    $invoice->update([
                        'status' => 'refunded',
                        'refunded_at' => now()
                    ]);

                    // Process PayMongo refund if payment was made through PayMongo
                    if ($invoice->paymongo_payment_id) {
                        try {
                            $paymongoRefund = Paymongo::refund()->create([
                                'amount' => (int)($refund->amount * 100), // Convert to centavos
                                'payment_id' => $invoice->paymongo_payment_id,
                                'reason' => 'requested_by_customer',
                                'notes' => $refund->reason ?? 'Customer requested refund'
                            ]);

                            $refund->update(['paymongo_refund_id' => $paymongoRefund->id]);

                            Log::info('PayMongo refund processed successfully', [
                                'refund_id' => $refund->refund_id,
                                'paymongo_refund_id' => $paymongoRefund->id,
                                'amount' => $refund->amount,
                                'payment_id' => $invoice->paymongo_payment_id
                            ]);
                        } catch (\Exception $refundException) {
                            // Log the error but don't fail the whole transaction
                            // The refund is still approved internally, PayMongo refund can be retried
                            Log::error('PayMongo refund API error', [
                                'refund_id' => $refund->refund_id,
                                'payment_id' => $invoice->paymongo_payment_id,
                                'error' => $refundException->getMessage()
                            ]);

                            // Update refund with error note
                            $refund->update([
                                'admin_notes' => ($request->admin_notes ? $request->admin_notes . ' | ' : '') . 
                                    'PayMongo refund failed: ' . $refundException->getMessage()
                            ]);
                        }
                    } else {
                        Log::info('Refund approved without PayMongo (no payment_id)', [
                            'refund_id' => $refund->refund_id,
                            'invoice_id' => $invoice->invoice_id
                        ]);
                    }
                }
            }

            DB::commit();

            Log::info('Refund processed', [
                'refund_id' => $refundId,
                'action' => $request->action
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Refund ' . $request->action . ' successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Refund processing error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to process refund',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all refund requests (Admin)
     * 
     * @return \Inertia\Response
     */
    public function refunds()
    {
        $refunds = Refund::with([
            'calculatedCost.reservation.customer',
            'calculatedCost.reservation.bookingReference',
            'calculatedCost.invoice'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('Admin/Refunds', [
            'refunds' => $refunds
        ]);
    }

    /**
     * Get paid clients list (Admin)
     * 
     * @return \Inertia\Response
     */
    public function paidClients()
    {
        $invoices = Invoice::with([
            'calculatedCost.reservation.customer',
            'calculatedCost.reservation.bookingReference'
        ])
        ->where('status', 'paid')
        ->orWhere('status', 'confirmed')
        ->orderBy('paid_at', 'desc')
        ->get();

        return Inertia::render('Admin/PaidClients', [
            'invoices' => $invoices
        ]);
    }

    /**
     * Get all invoices (Admin)
     * 
     * @return \Inertia\Response
     */
    public function invoices()
    {
        $invoices = Invoice::with([
            'calculatedCost.reservation.customer',
            'calculatedCost.reservation.bookingReference',
            'calculatedCost.refunds'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('Admin/Invoices', [
            'invoices' => $invoices
        ]);
    }

    /**
     * Get single invoice details
     * 
     * @param int $invoiceId
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateInvoice($invoiceId)
    {
        try {
            $invoice = Invoice::with([
                'calculatedCost.reservation.customer',
                'calculatedCost.reservation.bookingReference'
            ])->findOrFail($invoiceId);

            return response()->json([
                'success' => true,
                'invoice' => $invoice
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Invoice not found'], 404);
        }
    }

    /**
     * Get invoice by reservation ID
     * 
     * @param int $reservationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInvoiceByReservation($reservationId)
    {
        try {
            $reservation = Reservation::with('calculatedCost.invoice')->findOrFail($reservationId);

            if (!$reservation->calculatedCost || !$reservation->calculatedCost->invoice) {
                return response()->json(['error' => 'No invoice found for this reservation'], 404);
            }

            return response()->json([
                'success' => true,
                'invoice' => $reservation->calculatedCost->invoice,
                'invoice_id' => $reservation->calculatedCost->invoice->invoice_id
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Reservation not found'], 404);
        }
    }

    /**
     * PayMongo Webhook handler
     * Handles payment events from PayMongo
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        
        Log::info('PayMongo webhook received', ['event' => $payload['data']['attributes']['type'] ?? 'unknown']);

        try {
            $eventType = $payload['data']['attributes']['type'] ?? null;
            $eventData = $payload['data']['attributes']['data'] ?? null;

            switch ($eventType) {
                case 'checkout_session.payment.paid':
                    $this->handleCheckoutPaid($eventData);
                    break;

                case 'payment.paid':
                    $this->handlePaymentPaid($eventData);
                    break;

                case 'payment.failed':
                    $this->handlePaymentFailed($eventData);
                    break;

                default:
                    Log::info('Unhandled webhook event type: ' . $eventType);
            }

            return response()->json(['received' => true]);

        } catch (\Exception $e) {
            Log::error('Webhook processing error: ' . $e->getMessage());
            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Handle checkout paid webhook event
     * 
     * @param array $data
     */
    private function handleCheckoutPaid($data)
    {
        $checkoutId = $data['id'] ?? null;
        
        if (!$checkoutId) return;

        $invoice = Invoice::where('paymongo_checkout_id', $checkoutId)->first();
        
        if ($invoice && $invoice->status !== 'paid') {
            DB::beginTransaction();
            
            $invoice->update([
                'status' => 'paid',
                'paid_at' => now()
            ]);

            if ($invoice->calculatedCost && $invoice->calculatedCost->reservation) {
                $invoice->calculatedCost->reservation->update(['status' => 'pending']);
            }

            DB::commit();

            Log::info('Checkout payment confirmed via webhook', ['checkout_id' => $checkoutId]);
        }
    }

    /**
     * Handle payment paid webhook event
     * 
     * @param array $data
     */
    private function handlePaymentPaid($data)
    {
        $paymentId = $data['id'] ?? null;
        
        Log::info('Payment paid webhook', ['payment_id' => $paymentId]);
    }

    /**
     * Handle payment failed webhook event
     * 
     * @param array $data
     */
    private function handlePaymentFailed($data)
    {
        $paymentId = $data['id'] ?? null;
        
        Log::warning('Payment failed webhook', ['payment_id' => $paymentId]);
    }
}
