<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManagementDashboard extends Model
{
    use HasFactory;

    protected $table = 'management_dashboards';
    protected $primaryKey = 'dashboard_id';
    public $timestamps = false;

    protected $fillable = [
        'report_id',
        'metric',
        'value',
        'timestamp'
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'timestamp' => 'datetime'
    ];

    // Relationships
    public function centralDataReport()
    {
        return $this->belongsTo(CentralDataReport::class, 'report_id', 'report_id');
    }
}
