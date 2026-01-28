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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id('invoice_id');
            $table->unsignedBigInteger('calculated_cost_id');
            $table->string('invoice_number')->unique();
            $table->datetime('issued_at');
            $table->decimal('amount', 15, 2);
            $table->string('status')->default('pending'); // pending, paid, cancelled
            $table->timestamps();

            $table->foreign('calculated_cost_id')->references('calculated_cost_id')->on('calculated_costs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invoices');
    }
};
