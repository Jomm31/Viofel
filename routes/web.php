<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/



// Public inquiry routes - CORRECT VERSION


Route::get('/homepage', [HomeController::class, 'homepage'])->name('homepage.form');


Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store');
Route::delete('/inquiries/{id}', [InquiryController::class, 'destroy'])->name('inquiries.destroy');

// Admin routes
Route::get('/admin/inquiries', [InquiryController::class, 'index'])->name('admin.inquiries');

// FAQ routes
Route::get('/admin/faqs', [FaqController::class, 'index'])->name('admin.faqs');
Route::post('/admin/faqs', [FaqController::class, 'store'])->name('admin.faqs.store');
Route::delete('/admin/faqs/{id}', [FaqController::class, 'destroy'])->name('admin.faqs.destroy');

// ✅ New routes for editing
Route::get('/admin/faqs/{id}/edit', [FaqController::class, 'edit'])->name('admin.faqs.edit');
Route::put('/admin/faqs/{id}', [FaqController::class, 'update'])->name('admin.faqs.update');


// Dashboard and profile routes
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});




require __DIR__.'/auth.php';