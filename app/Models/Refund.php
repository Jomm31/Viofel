<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Refund Model
 * 
 * Handles refund requests for paid reservations
 * Integrates with PayMongo for payment refunds
 */
class Refund extends Model
{
    use HasFactory;

    protected $table = 'refunds';
    protected $primaryKey = 'refund_id';

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'calculated_cost_id',
        'reason',
        'refund_date',
        'amount',
        'status',
        'admin_notes',
        'paymongo_refund_id'
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'refund_date' => 'date',
        'amount' => 'decimal:2'
    ];

    /**
     * Relationship: Refund belongs to CalculatedCost
     */
    public function calculatedCost()
    {
        return $this->belongsTo(CalculatedCost::class, 'calculated_cost_id', 'calculated_cost_id');
    }

    /**
     * Check if refund is pending
     * 
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if refund was approved
     * 
     * @return bool
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if refund was rejected
     * 
     * @return bool
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}
