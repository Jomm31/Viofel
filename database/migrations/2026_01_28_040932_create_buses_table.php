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
        Schema::create('buses', function (Blueprint $table) {
            $table->id('bus_id');
            $table->string('plate_number')->unique();
            $table->string('type');
            $table->integer('capacity');
            $table->string('status')->default('available'); // available, in_use, maintenance
            $table->decimal('fuel_efficiency', 8, 2); // km per liter
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
        Schema::dropIfExists('buses');
    }
};
