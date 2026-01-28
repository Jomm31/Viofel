<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Invoice Model
 * 
 * Handles invoice records with PayMongo payment integration
 * Supports checkout sessions, payments, and refund tracking
 */
class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';
    protected $primaryKey = 'invoice_id';

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'calculated_cost_id',
        'invoice_number',
        'issued_at',
        'amount',
        'status',
        'paymongo_checkout_id',
        'paymongo_payment_id',
        'paymongo_payment_intent_id',
        'payment_method',
        'paid_at',
        'checkout_url',
        'paymongo_refund_id',
        'refunded_at'
    ];

    /**
     * Attribute casting for date/time fields
     */
    protected $casts = [
        'issued_at' => 'datetime',
        'paid_at' => 'datetime',
        'refunded_at' => 'datetime'
    ];

    /**
     * Relationship: Invoice belongs to a CalculatedCost
     */
    public function calculatedCost()
    {
        return $this->belongsTo(CalculatedCost::class, 'calculated_cost_id', 'calculated_cost_id');
    }

    /**
     * Generate unique invoice number
     * Format: INV-YYYYMMDD-XXXX
     * 
     * @return string
     */
    public static function generateInvoiceNumber()
    {
        $prefix = 'INV-' . date('Ymd');
        $count = self::whereDate('created_at', today())->count() + 1;
        return $prefix . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Check if invoice is paid
     * 
     * @return bool
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Check if invoice is pending payment
     * 
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if invoice has been refunded
     * 
     * @return bool
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }
}
