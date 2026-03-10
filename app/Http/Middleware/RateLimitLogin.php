<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitLogin
{
    /**
     * Rate limit login attempts to prevent brute force attacks.
     * Allows 5 attempts per minute per IP address.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $key = 'login-attempt:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            if ($request->wantsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'message' => "Too many login attempts. Please try again in {$seconds} seconds.",
                ], Response::HTTP_TOO_MANY_REQUESTS);
            }

            return back()->withErrors([
                'username' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ]);
        }

        RateLimiter::hit($key, 60); // 60 seconds decay

        $response = $next($request);

        // Clear rate limiter on successful login (redirect means success)
        if ($response->getStatusCode() === 302 && !$response->isRedirection()) {
            RateLimiter::clear($key);
        }

        return $response;
    }
}
