<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CentralDataReport extends Model
{
    use HasFactory;

    protected $table = 'central_data_reports';
    protected $primaryKey = 'report_id';

    protected $fillable = [
        'admin_id',
        'report_type',
        'date_generated',
        'description',
        'data_source'
    ];

    protected $casts = [
        'date_generated' => 'datetime'
    ];

    // Relationships
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'admin_id');
    }

    public function managementDashboards()
    {
        return $this->hasMany(ManagementDashboard::class, 'report_id', 'report_id');
    }
}
