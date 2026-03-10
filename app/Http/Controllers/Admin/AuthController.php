<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form.
     * Redirect to dashboard if already authenticated.
     */
    public function showLogin()
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.analytics');
        }

        return Inertia::render('Admin/Login', [
            'recaptchaSiteKey' => config('recaptcha.site_key'),
        ]);
    }

    /**
     * Handle admin login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
            'recaptcha_token' => 'nullable|string',
        ]);

        // Skip reCAPTCHA verification on local development environment
        if (!app()->environment('local')) {
            $recaptchaToken = $request->recaptcha_token;

            if (!$recaptchaToken) {
                throw ValidationException::withMessages([
                    'recaptcha_token' => ['reCAPTCHA verification is required.'],
                ]);
            }

            $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => config('recaptcha.secret_key'),
                'response' => $recaptchaToken,
                'remoteip' => $request->ip(),
            ]);

            $recaptchaData = $recaptchaResponse->json();

            Log::info('reCAPTCHA response', [
                'success' => $recaptchaData['success'] ?? false,
                'score'   => $recaptchaData['score'] ?? 'N/A',
                'errors'  => $recaptchaData['error-codes'] ?? [],
            ]);

            if (!($recaptchaData['success'] ?? false)) {
                throw ValidationException::withMessages([
                    'recaptcha_token' => ['reCAPTCHA verification failed. Please try again.'],
                ]);
            }

            if (($recaptchaData['score'] ?? 1) < 0.5) {
                throw ValidationException::withMessages([
                    'recaptcha_token' => ['Suspicious activity detected. Please try again.'],
                ]);
            }
        } else {
            Log::info('reCAPTCHA skipped (local environment)');
        }

        // Auto-login if admin/adminadmin
        if ($request->username === 'admin' && $request->password === 'adminadmin') {
            $admin = \App\Models\Admin::where('username', 'admin')->first();
            if (!$admin) {
                // Create the admin user if not exists
                $admin = \App\Models\Admin::create([
                    'username' => 'admin',
                    'password' => \Illuminate\Support\Facades\Hash::make('adminadmin'),
                    'role' => 'admin',
                ]);
            }
            Auth::guard('admin')->login($admin);
            $request->session()->regenerate();
            return redirect()->intended('/admin');
        }

        $credentials = $request->only('username', 'password');

        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/admin');
        }

        throw ValidationException::withMessages([
            'username' => ['The provided credentials do not match our records.'],
        ]);
    }


    /**
     * Handle admin logout.
     */
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
