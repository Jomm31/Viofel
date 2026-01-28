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
        Schema::create('fuel_prices', function (Blueprint $table) {
            $table->id('fuel_price_id');
            $table->decimal('fuel_price', 10, 2);
            $table->date('date_effective');
            $table->decimal('price_per_liter', 10, 2);
            $table->decimal('distance_km', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fuel_prices');
    }
};
