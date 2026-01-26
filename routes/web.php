<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\Admin\ReservationController as AdminReservationController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Home page with React
Route::get('/', function () {
    return Inertia::render('Welcome');
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
});

// Admin routes (TODO: Add authentication middleware when needed)
Route::prefix('admin')->name('admin.')->group(function () {
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
    Route::delete('/reservations/{reservation}', [AdminReservationController::class, 'destroy'])->name('reservations.destroy');
});