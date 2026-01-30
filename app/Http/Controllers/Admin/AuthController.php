<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLogin()
    {
        return Inertia::render('Admin/Login');
    }

    /**
     * Handle admin login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

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
