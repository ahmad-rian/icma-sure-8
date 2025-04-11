<?php

namespace App\Http\Middleware;

use App\Models\AllowedEmail;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAllowedEmail
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // Periksa apakah email diizinkan
            $isAllowed = AllowedEmail::where('email', $user->email)->exists();

            if (!$isAllowed) {
                auth()->logout();
                return redirect()->route('login')->with('status', 'Akses ditolak. Email Anda tidak diizinkan untuk login.');
            }

            // Update status user jika bidang is_allowed ada
            if (isset($user->is_allowed)) {
                $user->update(['is_allowed' => true]);
            }
        }

        return $next($request);
    }
}
