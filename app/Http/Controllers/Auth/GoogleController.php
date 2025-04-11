<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AllowedEmail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle Google callback
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Cek apakah email diizinkan
            $isAllowed = AllowedEmail::where('email', $googleUser->getEmail())->exists();

            if (!$isAllowed) {
                return redirect()->route('login')->with('status', 'Akses ditolak. Email Anda tidak diizinkan untuk login.');
            }

            // Cari user berdasarkan google_id
            $user = User::where('google_id', $googleUser->getId())->first();

            // Jika user tidak ada, cek berdasarkan email
            if (!$user) {
                $user = User::where('email', $googleUser->getEmail())->first();

                // Jika masih tidak ada, buat user baru
                if (!$user) {
                    $user = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'is_allowed' => true,
                        'password' => bcrypt(Str::random(16)), // Menggunakan Str::random() bukan str_random()
                        'email_verified_at' => now(),
                    ]);
                } else {
                    // Update user yang sudah ada dengan informasi Google
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'is_allowed' => true,
                    ]);
                }
            }

            // Login user
            Auth::login($user);

            // Regenerate session
            request()->session()->regenerate();

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            // Log error untuk debugging
            \Log::error('Google OAuth Error: ' . $e->getMessage());

            return redirect()->route('login')->with('status', 'Terjadi kesalahan dalam proses login: ' . $e->getMessage());
        }
    }
}
