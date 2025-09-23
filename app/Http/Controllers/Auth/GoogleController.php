<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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
        try {
            Log::info('Google OAuth redirect initiated', [
                'session_id' => session()->getId(),
                'user_agent' => request()->userAgent(),
                'ip' => request()->ip()
            ]);

            // Clear any existing OAuth state to prevent conflicts
            session()->forget('state');

            return Socialite::driver('google')->redirect();
        } catch (\Exception $e) {
            Log::error('Google OAuth redirect error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('home')
                ->with('error', 'Tidak dapat memulai login dengan Google. Silakan coba lagi.');
        }
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

                    // Update existing user with Google data
                    $user->update([
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                        'email_verified_at' => now(),
                    ]);
                } else {
                    Log::info('Creating new user', ['email' => $googleUser->email]);

                    // Ensure no duplicate emails by checking thoroughly
                    $existingEmailUser = User::where('email', $googleUser->email)->first();
                    if ($existingEmailUser) {
                        Log::warning('Duplicate email found during Google OAuth', [
                            'existing_user_id' => $existingEmailUser->id,
                            'google_email' => $googleUser->email
                        ]);

                        // Link the Google account to existing user instead of creating duplicate
                        $existingEmailUser->update([
                            'google_id' => $googleUser->id,
                            'avatar' => $googleUser->avatar,
                            'email_verified_at' => now(),
                        ]);

                        return $existingEmailUser;
                    }

                    // Create new user - semua user baru otomatis diizinkan dan bisa masuk
                    $userName = $googleUser->name;

                    // Check if name already exists and modify if needed
                    $originalName = $userName;
                    $counter = 1;
                    while (User::where('name', $userName)->exists()) {
                        $userName = $originalName . ' ' . $counter;
                        $counter++;

                        Log::info('Name collision detected, using modified name', [
                            'original_name' => $originalName,
                            'modified_name' => $userName
                        ]);
                    }

                    $userData = [
                        'name' => $userName,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                        'email_verified_at' => now(),
                        'phone_number' => mt_rand(1000000000, 9999999999),
                        'role' => 'user', // Default role
                        'is_allowed' => true, // Auto allow semua user baru
                        'password' => null, // Set password null untuk Google users
                    ];

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
                // For regular users, redirect to submission closed page since submission period has ended
                return redirect()->route('user.submissions.index')->with('info', 'Login berhasil! Periode submission telah ditutup. Terima kasih atas minat Anda terhadap ICMA SURE 2025.');
            }
        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::warning('Google OAuth InvalidStateException', [
                'error' => $e->getMessage(),
                'session_id' => session()->getId(),
                'user_agent' => request()->userAgent(),
                'ip' => request()->ip()
            ]);

            // Clear session and redirect with error message
            session()->invalidate();
            session()->regenerateToken();

            return redirect()->route('home')
                ->withErrors(['oauth' => 'Sesi login Google telah berakhir. Silakan coba login lagi.'])
                ->with('error', 'Terjadi masalah dengan autentikasi Google. Silakan coba lagi.');
        } catch (\Exception $e) {
            Log::error('Google OAuth callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('home')
                ->withErrors(['oauth' => 'Terjadi kesalahan saat login dengan Google.'])
                ->with('error', 'Login gagal. Silakan coba lagi.');
        }
    }
}
