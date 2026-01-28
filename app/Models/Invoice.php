<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';
    protected $primaryKey = 'invoice_id';

    protected $fillable = [
        'calculated_cost_id',
        'invoice_number',
        'issued_at',
        'amount',
        'status'
    ];

    protected $casts = [
        'issued_at' => 'datetime'
    ];

    public function calculatedCost()
    {
        return $this->belongsTo(CalculatedCost::class, 'calculated_cost_id', 'calculated_cost_id');
    }

    public static function generateInvoiceNumber()
    {
        $prefix = 'INV-' . date('Ymd');
        $count = self::whereDate('created_at', today())->count() + 1;
        return $prefix . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
