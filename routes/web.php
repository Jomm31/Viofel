<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
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

// Legacy homepage route (if needed for backward compatibility)
Route::get('/homepage', [HomeController::class, 'homepage'])->name('homepage.form');

// Public inquiry routes
Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store');

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
});