<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Get user profile
        $profile = $user->profile;
        
        // Get user submissions (if any)
        $submissions = $user->abstractSubmissions()->latest()->get();
        
        return Inertia::render('User/Dashboard', [
            'profile' => $profile,
            'submissions' => $submissions,
        ]);
    }
}