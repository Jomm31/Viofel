<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelPrice extends Model
{
    use HasFactory;

    protected $table = 'fuel_prices';
    protected $primaryKey = 'fuel_price_id';

    protected $fillable = [
        'fuel_price',
        'date_effective',
        'price_per_liter',
        'distance_km'
    ];

    protected $casts = [
        'date_effective' => 'date'
    ];

    public function calculatedCosts()
    {
        return $this->hasMany(CalculatedCost::class, 'fuel_price_id', 'fuel_price_id');
    }
}
