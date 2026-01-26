<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'reservation_id';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'customer_id',
        'bus_id',
        'origin',
        'destination',
        'distance_km',
        'reservation_date',
        'estimated_passengers',
        'travel_options',
        'departure_time',
        'arrival_time',
        'status',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'reservation_date' => 'date',
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'distance_km' => 'decimal:2',
    ];

    /**
     * Get the customer that owns the reservation.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    /**
     * Get the booking reference for the reservation.
     */
    public function bookingReference()
    {
        return $this->hasOne(BookingReference::class, 'reservation_id', 'reservation_id');
    }

    /**
     * Get the reference number for this reservation.
     */
    public function getReferenceNumberAttribute()
    {
        return $this->bookingReference?->booking_reference;
    }
}
