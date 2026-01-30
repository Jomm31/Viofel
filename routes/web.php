<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Admin\BusController;
use App\Http\Controllers\Admin\PricingController;
use App\Http\Controllers\Admin\AuthController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Home page with React - load FAQs from database
Route::get('/', function () {
    $faqs = \App\Models\Faq::all();
    return Inertia::render('Welcome', [
        'faqs' => $faqs
    ]);
})->name('homepage');

// Reserve page
Route::get('/reserve', function () {
    return Inertia::render('Reserve');
})->name('reserve');

// Status page
Route::get('/status', function () {
    return Inertia::render('Status');
})->name('status');

// Legacy homepage route (if needed for backward compatibility)
Route::get('/homepage', [HomeController::class, 'homepage'])->name('homepage.form');

// Public inquiry routes
Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store');

// API routes for reservations (no CSRF for API-like endpoints)
Route::prefix('api')->group(function () {
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::post('/reservations/lookup', [ReservationController::class, 'lookup'])->name('reservations.lookup');
    Route::put('/reservations/{id}', [ReservationController::class, 'update'])->name('reservations.update');
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy'])->name('reservations.destroy');
    Route::get('/reservations/{id}/invoice', [PaymentController::class, 'getInvoiceByReservation'])->name('reservations.invoice');
    
    // Payment API routes
    Route::post('/payments/{reservation}/calculate', [PaymentController::class, 'calculateCost'])->name('payments.calculate');
    Route::post('/payments/{reservation}/process', [PaymentController::class, 'processPayment'])->name('payments.process');
    Route::post('/refunds/{invoice}/request', [PaymentController::class, 'requestRefund'])->name('refunds.request');
    Route::get('/invoices/{invoice}', [PaymentController::class, 'generateInvoice'])->name('invoices.generate');
    
    // PayMongo checkout routes
    Route::post('/payments/{reservation}/checkout', [PaymentController::class, 'createCheckout'])->name('payments.checkout');
});

// PayMongo callback routes (accessible without auth)
Route::get('/payments/success', [PaymentController::class, 'paymentSuccess'])->name('payments.success');
Route::post('/webhooks/paymongo', [PaymentController::class, 'handleWebhook'])->name('webhooks.paymongo');

// Admin authentication routes (accessible without auth)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Admin routes (require authentication)
Route::prefix('admin')->name('admin.')->middleware(['admin'])->group(function () {
    // Logout route
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    // Admin dashboard - redirect to analytics
    Route::get('/', function () {
        return redirect()->route('admin.analytics');
    })->name('dashboard');
    
    // Analytics (main dashboard)
    Route::get('/analytics', [AnalyticsController::class, 'dashboard'])->name('analytics');
    
    Route::get('/inquiries', [InquiryController::class, 'index'])->name('inquiries');
    Route::delete('/inquiries/{id}', [InquiryController::class, 'destroy'])->name('inquiries.destroy');
    
    // FAQ routes
    Route::get('/faqs', [FaqController::class, 'index'])->name('faqs');
    Route::post('/faqs', [FaqController::class, 'store'])->name('faqs.store');
    Route::get('/faqs/{id}/edit', [FaqController::class, 'edit'])->name('faqs.edit');
    Route::put('/faqs/{id}', [FaqController::class, 'update'])->name('faqs.update');
    Route::delete('/faqs/{id}', [FaqController::class, 'destroy'])->name('faqs.destroy');
    
    // Reservation routes
    Route::get('/reservations', [AdminReservationController::class, 'index'])->name('reservations.index');
    Route::get('/reservations/{reservation}', [AdminReservationController::class, 'show'])->name('reservations.show');
    Route::patch('/reservations/{reservation}/status', [AdminReservationController::class, 'updateStatus'])->name('reservations.update-status');
    Route::post('/reservations/{reservation}/cancellation', [AdminReservationController::class, 'handleCancellation'])->name('reservations.cancellation');
    Route::delete('/reservations/{reservation}', [AdminReservationController::class, 'destroy'])->name('reservations.destroy');

    // Bus Management routes
    Route::get('/buses', [BusController::class, 'index'])->name('buses');
    Route::post('/buses', [BusController::class, 'store'])->name('buses.store');
    Route::put('/buses/{id}', [BusController::class, 'update'])->name('buses.update');
    Route::delete('/buses/{id}', [BusController::class, 'destroy'])->name('buses.destroy');
    Route::post('/buses/check-availability', [BusController::class, 'checkAvailability'])->name('buses.check-availability');

    // Pricing Management routes
    Route::get('/pricing', [PricingController::class, 'index'])->name('pricing');
    Route::post('/pricing/fuel-price', [PricingController::class, 'updateFuelPrice'])->name('pricing.fuel-price');
    Route::post('/pricing/adjust/{id}', [PricingController::class, 'adjustReservationCost'])->name('pricing.adjust');

    // Payment & Invoice routes
    Route::get('/paid-clients', [PaymentController::class, 'paidClients'])->name('paid-clients');
    Route::get('/invoices', [PaymentController::class, 'invoices'])->name('invoices');
    Route::get('/refunds', [PaymentController::class, 'refunds'])->name('refunds');
    Route::post('/invoices/{invoice}/confirm', [PaymentController::class, 'confirmPayment'])->name('invoices.confirm');
    Route::post('/refunds/{refund}/process', [PaymentController::class, 'processRefund'])->name('refunds.process');
});