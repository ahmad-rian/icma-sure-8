<?php

// 1. MASALAH DI RedirectBasedOnRole MIDDLEWARE
// File: app/Http/Middleware/RedirectBasedOnRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // PERBAIKAN: Jangan proses jika user belum login
        if (!auth()->check()) {
            return $next($request);
        }

        $user = auth()->user();

        // If user is not allowed, redirect to access denied
        if (!$user->is_allowed) {
            return redirect()->route('access.denied');
        }

        // PERBAIKAN: Pastikan ada method/property role
        if (!isset($user->role)) {
            // Jika user tidak punya role, set default
            $user->role = 'user';
        }

        // If user is admin and trying to access home page, redirect to dashboard
        if ($user->role === 'admin' && $request->routeIs('home')) {
            return redirect()->route('admin.dashboard');
        }

        // PERBAIKAN: Hapus redirect untuk user biasa ke admin routes
        // Biarkan middleware lain yang handle

        return $next($request);
    }
}
