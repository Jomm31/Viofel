<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SanitizeInput
{
    /**
     * Fields that should never be sanitized (passwords, tokens, etc.)
     */
    protected $except = [
        'password',
        'password_confirmation',
        'recaptcha_token',
        '_token',
        '_method',
    ];

    /**
     * Sanitize input data to prevent XSS attacks.
     * Strips HTML tags from all string inputs except excluded fields.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $input = $request->all();
        array_walk_recursive($input, function (&$value, $key) {
            if (is_string($value) && !in_array($key, $this->except)) {
                // Strip HTML tags to prevent XSS
                $value = strip_tags($value);
            }
        });
        $request->merge($input);

        return $next($request);
    }
}
