<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     * 
     * PayMongo webhook needs to be excluded as it comes from external service
     *
     * @var array<int, string>
     */
    protected $except = [
        'webhooks/paymongo',
    ];
}
