<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\AbstractSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();
        
        // Redirect admin to dashboard
        if ($user->role === 'admin') {
            return redirect()->intended(route('dashboard', absolute: false));
        }
        
        // For regular users, check if they have any abstract submissions
        $hasSubmissions = AbstractSubmission::where('user_id', $user->id)->exists();
        
        if ($hasSubmissions) {
            // User has submissions, redirect to submissions index
            return redirect()->intended(route('user.submissions.index'));
        } else {
            // User has no submissions, redirect to create submission
            return redirect()->intended(route('user.submissions.create'));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
