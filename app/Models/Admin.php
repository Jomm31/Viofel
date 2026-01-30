<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'admins';
    protected $primaryKey = 'admin_id';

    protected $fillable = [
        'username',
        'password',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    // Relationships
    public function centralDataReports()
    {
        return $this->hasMany(CentralDataReport::class, 'admin_id', 'admin_id');
    }
}
