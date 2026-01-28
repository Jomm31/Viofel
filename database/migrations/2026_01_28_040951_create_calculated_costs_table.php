<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calculated_costs', function (Blueprint $table) {
            $table->id('calculated_cost_id');
            $table->unsignedBigInteger('reservation_id');
            $table->unsignedBigInteger('fuel_price_id')->nullable();
            $table->decimal('total_cost', 15, 2);
            $table->timestamps();

            $table->foreign('reservation_id')->references('reservation_id')->on('reservations')->onDelete('cascade');
            $table->foreign('fuel_price_id')->references('fuel_price_id')->on('fuel_prices')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calculated_costs');
    }
};
