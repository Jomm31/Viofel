<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalculatedCost extends Model
{
    use HasFactory;

    protected $table = 'calculated_costs';
    protected $primaryKey = 'calculated_cost_id';

    protected $fillable = [
        'reservation_id',
        'fuel_price_id',
        'total_cost'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id', 'reservation_id');
    }

    public function fuelPrice()
    {
        return $this->belongsTo(FuelPrice::class, 'fuel_price_id', 'fuel_price_id');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'calculated_cost_id', 'calculated_cost_id');
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class, 'calculated_cost_id', 'calculated_cost_id');
    }

    /**
     * Get the latest refund for this calculated cost
     */
    public function refund()
    {
        return $this->hasOne(Refund::class, 'calculated_cost_id', 'calculated_cost_id')->latestOfMany('refund_id');
    }
}
