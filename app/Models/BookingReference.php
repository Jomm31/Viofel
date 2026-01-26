<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BookingReference extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'reference_id';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'reservation_id',
        'booking_reference',
    ];

    /**
     * Get the reservation that owns the booking reference.
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id', 'reservation_id');
    }

    /**
     * Generate a unique booking reference number.
     */
    public static function generateReference(): string
    {
        do {
            // Generate reference like: VIO-XXXXXX (6 alphanumeric characters)
            $reference = 'VIO-' . strtoupper(Str::random(6));
        } while (self::where('booking_reference', $reference)->exists());

        return $reference;
    }
}
