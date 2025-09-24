<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InquiryController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::prefix('passenger')->group(function () {
    Route::get('/homepage', function () {
        return view('Passenger.homepage');
    });
});







Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});




Route::get('/inquiries', [InquiryController::class, 'index'])->name('inquiries.front'); // optional for front
Route::get('/admin/inquiries', [InquiryController::class, 'index'])->name('inquiries.admin'); // admin view
Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store');



require __DIR__.'/auth.php';
