<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bus extends Model
{
    use HasFactory;

    protected $table = 'buses';
    protected $primaryKey = 'bus_id';

    protected $fillable = [
        'plate_number',
        'type',
        'capacity',
        'status',
        'fuel_efficiency'
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'bus_id', 'bus_id');
    }

    /**
     * Check if bus is available for a specific date
     */
    public function isAvailableForDate($date)
    {
        return !$this->reservations()
            ->whereDate('reservation_date', $date)
            ->whereIn('status', ['confirmed', 'pending'])
            ->exists();
    }
}
