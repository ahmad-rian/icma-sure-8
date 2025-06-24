<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AllowedEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_allowed', $request->status === 'allowed');
        }

        // Filter by role
        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'status', 'role']),
            'stats' => [
                'total' => User::count(),
                'allowed' => User::where('is_allowed', true)->count(),
                'blocked' => User::where('is_allowed', false)->count(),
                'verified' => User::whereNotNull('email_verified_at')->count(),
                'admins' => User::where('role', 'admin')->count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'is_allowed' => 'boolean',
            'role' => 'required|in:admin,user',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'is_allowed' => $request->is_allowed ?? false,
                'role' => $request->role,
                'email_verified_at' => now(), // Auto verify for admin created users
            ]);

            // Add to allowed emails if user is allowed
            if ($request->is_allowed) {
                AllowedEmail::firstOrCreate(['email' => $request->email]);
            }
        });

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'loginHistory' => $this->getUserLoginHistory($user),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'is_allowed' => 'boolean',
            'role' => 'required|in:admin,user',
        ]);

        DB::transaction(function () use ($request, $user) {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'is_allowed' => $request->is_allowed ?? false,
                'role' => $request->role,
            ];

            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }

            $user->update($userData);

            // Handle allowed email
            if ($request->is_allowed) {
                AllowedEmail::firstOrCreate(['email' => $request->email]);
            } else {
                AllowedEmail::where('email', $request->email)->delete();
            }
        });

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        DB::transaction(function () use ($user) {
            // Remove from allowed emails
            AllowedEmail::where('email', $user->email)->delete();

            // Delete user
            $user->delete();
        });

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle user access status
     */
    public function toggleAccess(User $user)
    {
        DB::transaction(function () use ($user) {
            $user->update(['is_allowed' => !$user->is_allowed]);

            if ($user->is_allowed) {
                AllowedEmail::firstOrCreate(['email' => $user->email]);
            } else {
                AllowedEmail::where('email', $user->email)->delete();
            }
        });

        $status = $user->is_allowed ? 'allowed' : 'blocked';
        return back()->with('success', "User access has been {$status}.");
    }

    /**
     * Bulk actions for users
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:allow,block,delete',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
        ]);

        $userIds = $request->user_ids;

        // Prevent action on current user
        if (in_array(auth()->id(), $userIds)) {
            return back()->with('error', 'You cannot perform bulk actions on your own account.');
        }

        DB::transaction(function () use ($request, $userIds) {
            switch ($request->action) {
                case 'allow':
                    User::whereIn('id', $userIds)->update(['is_allowed' => true]);
                    $emails = User::whereIn('id', $userIds)->pluck('email');
                    foreach ($emails as $email) {
                        AllowedEmail::firstOrCreate(['email' => $email]);
                    }
                    break;

                case 'block':
                    User::whereIn('id', $userIds)->update(['is_allowed' => false]);
                    $emails = User::whereIn('id', $userIds)->pluck('email');
                    AllowedEmail::whereIn('email', $emails)->delete();
                    break;

                case 'delete':
                    $emails = User::whereIn('id', $userIds)->pluck('email');
                    AllowedEmail::whereIn('email', $emails)->delete();
                    User::whereIn('id', $userIds)->delete();
                    break;
            }
        });

        $count = count($userIds);
        return back()->with('success', "{$count} users have been {$request->action}ed successfully.");
    }

    /**
     * Get user login history (you might need to implement session tracking)
     */
    private function getUserLoginHistory(User $user)
    {
        // This is a simplified version - you might want to implement proper login tracking
        return collect([
            [
                'ip_address' => '192.168.1.1',
                'user_agent' => 'Mozilla/5.0...',
                'login_at' => now()->subDays(1),
            ],
            // Add more mock data or implement real tracking
        ]);
    }
}
