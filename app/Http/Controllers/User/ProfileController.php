<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the form for editing the user's profile.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->profile;
        $countries = Country::orderBy('name')->get();
        
        return Inertia::render('User/Profile/Edit', [
            'profile' => $profile,
            'countries' => $countries,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'institution' => ['required', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'country_id' => ['required', 'exists:countries,id'],
            'address' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'website' => ['nullable', 'url', 'max:255'],
            'orcid' => ['nullable', 'string', 'max:255'],
            'google_scholar' => ['nullable', 'url', 'max:255'],
            'research_interests' => ['nullable', 'string', 'max:1000'],
        ]);

        // Update or create profile
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return redirect()->route('user.profile.edit')->with('status', 'profile-updated');
    }
}