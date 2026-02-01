<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

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

// Payment routes
Route::post('/payments/{reservationId}/checkout', [PaymentController::class, 'createCheckout']);
Route::get('/payments/success', [PaymentController::class, 'paymentSuccess']);
Route::post('/payments/webhook', [PaymentController::class, 'handleWebhook']);
Route::post('/payments/{reservationId}/process', [PaymentController::class, 'processPayment']);
Route::get('/payments/{reservationId}/invoice', [PaymentController::class, 'getInvoiceByReservation']);
