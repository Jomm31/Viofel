<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id('reservation_id');
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('bus_id')->nullable();
            $table->unsignedBigInteger('calculated_cost_id')->nullable();
            $table->unsignedBigInteger('fuel_price_id')->nullable();
            $table->string('origin');
            $table->string('destination');
            $table->decimal('distance_km', 10, 2)->nullable();
            $table->date('reservation_date');
            $table->integer('estimated_passengers');
            $table->string('travel_options'); // One Way, Full Day, Overnight, Multi-Day Tour
            $table->dateTime('departure_time');
            $table->dateTime('arrival_time')->nullable();
            $table->string('status')->default('not_paid'); // not_paid, pending, confirmed, completed, cancelled
            $table->timestamps();

            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
