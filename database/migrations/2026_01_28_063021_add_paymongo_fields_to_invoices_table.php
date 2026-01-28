<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration to add PayMongo payment gateway fields to invoices table
 * Supports checkout sessions, payment intents, and payment tracking
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('invoices', function (Blueprint $table) {
            // PayMongo checkout/payment identifiers
            $table->string('paymongo_checkout_id')->nullable()->after('status');
            $table->string('paymongo_payment_id')->nullable()->after('paymongo_checkout_id');
            $table->string('paymongo_payment_intent_id')->nullable()->after('paymongo_payment_id');
            
            // Payment details
            $table->string('payment_method')->nullable()->after('paymongo_payment_intent_id');
            $table->datetime('paid_at')->nullable()->after('payment_method');
            $table->string('checkout_url')->nullable()->after('paid_at');
            
            // Refund tracking
            $table->string('paymongo_refund_id')->nullable()->after('checkout_url');
            $table->datetime('refunded_at')->nullable()->after('paymongo_refund_id');
            
            // Index for faster lookups
            $table->index('paymongo_checkout_id');
            $table->index('paymongo_payment_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropIndex(['paymongo_checkout_id']);
            $table->dropIndex(['paymongo_payment_id']);
            
            $table->dropColumn([
                'paymongo_checkout_id',
                'paymongo_payment_id',
                'paymongo_payment_intent_id',
                'payment_method',
                'paid_at',
                'checkout_url',
                'paymongo_refund_id',
                'refunded_at'
            ]);
        });
    }
};
