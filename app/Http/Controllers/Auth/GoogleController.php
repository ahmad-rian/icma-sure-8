<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AbstractSubmission;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth provider
     */
    public function redirect()
    {
        Log::info('Google OAuth redirect initiated');

        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle callback from Google OAuth provider
     */
    public function callback()
    {
        try {
            Log::info('Google callback started');

            $googleUser = Socialite::driver('google')->user();

            Log::info('Google user data received', [
                'email' => $googleUser->email,
                'name' => $googleUser->name,
                'google_id' => $googleUser->id
            ]);

            $user = DB::transaction(function () use ($googleUser) {
                // Check if user already exists by email or google_id
                $user = User::where('email', $googleUser->email)
                    ->orWhere('google_id', $googleUser->id)
                    ->first();

                if ($user) {
                    Log::info('Existing user found, updating', [
                        'user_id' => $user->id,
                        'email' => $user->email
                    ]);

                    // Update existing user
                    $user->update([
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                        'email_verified_at' => now(),
                    ]);
                    dd('Redirecting to Google OAuth ' . $googleUser->email);
                } else {
                    Log::info('Creating new user', ['email' => $googleUser->email]);

                    // Create new user - semua user baru otomatis diizinkan dan bisa masuk
                    $userData = [
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                        'email_verified_at' => now(),
                        'role' => 'user', // Default role
                        'is_allowed' => true, // Auto allow semua user baru
                        'password' => null, // Set password null untuk Google users
                    ];

                    //Log::info('User data to be created', $userData);
                    dd('Redirecting to Google OAuth ' . $userData);
                    $user = User::create($userData);

                    Log::info('New user created successfully', [
                        'user_id' => $user->id,
                        'email' => $user->email
                    ]);
                }

                return $user;
            });

            // Login user
            Auth::login($user);

            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'role' => $user->role,
                'email' => $user->email
            ]);

            // Redirect based on user role
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard')->with('success', 'Selamat datang kembali, Admin!');
            } else {
                // For regular users, check if they have any abstract submissions
                $hasSubmissions = AbstractSubmission::where('user_id', $user->id)->exists();

                if ($hasSubmissions) {
                    // User has submissions, redirect to submissions index
                    return redirect()->route('user.submissions.index')->with('success', 'Login berhasil! Selamat datang di ICMA SURE.');
                } else {
                    // User has no submissions, redirect to create submission
                    return redirect()->route('user.submissions.create')->with('success', 'Login berhasil! Selamat datang di ICMA SURE. Silakan buat submission pertama Anda.');
                }
            }
        } catch (\Exception $e) {
            Log::error('Google authentication error', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('login')->with('error', 'Terjadi kesalahan saat login dengan Google: ' . $e->getMessage());
        }
    }
}
