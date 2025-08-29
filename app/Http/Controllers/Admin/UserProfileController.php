<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search');
        
        $userProfiles = UserProfile::with(['user', 'country'])
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('institution', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($userQuery) use ($search) {
                          $userQuery->where('email', 'like', "%{$search}%");
                      })
                      ->orWhereHas('country', function ($countryQuery) use ($search) {
                          $countryQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/UserProfiles/Index', [
            'userProfiles' => $userProfiles,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $users = User::whereDoesntHave('profile')
            ->orderBy('email')
            ->get(['id', 'email']);
            
        $countries = Country::orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/UserProfiles/Create', [
            'users' => $users,
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'string', 'exists:users,id', 'unique:user_profiles,user_id'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'country_id' => ['required', 'string', 'exists:countries,id'],
            'institution' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        UserProfile::create($validated);

        return redirect()->route('admin.user-profiles.index')
            ->with('success', 'User profile created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(UserProfile $userProfile): Response
    {
        $userProfile->load(['user', 'country']);

        return Inertia::render('Admin/UserProfiles/Show', [
            'userProfile' => $userProfile,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserProfile $userProfile): Response
    {
        $userProfile->load(['user', 'country']);
        
        $users = User::where('id', $userProfile->user_id)
            ->orWhereDoesntHave('profile')
            ->orderBy('email')
            ->get(['id', 'email']);
            
        $countries = Country::orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/UserProfiles/Edit', [
            'userProfile' => $userProfile,
            'users' => $users,
            'countries' => $countries,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserProfile $userProfile)
    {
        $validated = $request->validate([
            'user_id' => [
                'required', 
                'string', 
                'exists:users,id', 
                Rule::unique('user_profiles', 'user_id')->ignore($userProfile->id)
            ],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'country_id' => ['required', 'string', 'exists:countries,id'],
            'institution' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $userProfile->update($validated);

        return redirect()->route('admin.user-profiles.index')
            ->with('success', 'User profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserProfile $userProfile)
    {
        try {
            $userProfile->delete();

            return redirect()->route('admin.user-profiles.index')
                ->with('success', 'User profile deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.user-profiles.index')
                ->with('error', 'Failed to delete user profile: ' . $e->getMessage());
        }
    }

    /**
     * Remove multiple user profiles from storage.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:user_profiles,id'
        ]);

        try {
            $count = UserProfile::whereIn('id', $request->ids)->count();
            UserProfile::whereIn('id', $request->ids)->delete();

            return redirect()->route('admin.user-profiles.index')
                ->with('success', "Successfully deleted {$count} user profile(s).");
        } catch (\Exception $e) {
            return redirect()->route('admin.user-profiles.index')
                ->with('error', 'Failed to delete user profiles: ' . $e->getMessage());
        }
    }
}