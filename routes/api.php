<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReservationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Reservation routes
Route::post('/reservations', [ReservationController::class, 'store']);
Route::post('/reservations/lookup', [ReservationController::class, 'lookup']);
Route::put('/reservations/{id}', [ReservationController::class, 'update']);
Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);
Route::get('/reservations/{reservationId}/invoice', [PaymentController::class, 'getInvoiceByReservation']);

// Payment routes
Route::post('/payments/{reservationId}/checkout', [PaymentController::class, 'createCheckout']);
Route::get('/payments/success', [PaymentController::class, 'paymentSuccess']);
Route::post('/payments/webhook', [PaymentController::class, 'handleWebhook']);
Route::post('/payments/{reservationId}/process', [PaymentController::class, 'processPayment']);

// Refund routes
Route::post('/refunds/{invoice}/request', [PaymentController::class, 'requestRefund']);
