<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    use HasFactory;

    protected $table = 'refunds';
    protected $primaryKey = 'refund_id';

    protected $fillable = [
        'calculated_cost_id',
        'reason',
        'refund_date',
        'amount',
        'status'
    ];

    protected $casts = [
        'refund_date' => 'date'
    ];

    public function calculatedCost()
    {
        return $this->belongsTo(CalculatedCost::class, 'calculated_cost_id', 'calculated_cost_id');
    }
}
