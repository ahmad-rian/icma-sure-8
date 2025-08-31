<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\AllowedEmail;
use Illuminate\Support\Facades\DB;

class UpdateExistingUsersSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $adminEmails = [
                'ahmad.ritonga@mhs.unsoed.ac.id',
                'hamas.fathi@mhs.unsoed.ac.id',
            ];

            foreach ($adminEmails as $email) {
                $user = User::where('email', $email)->first();
                if ($user) {
                    $user->update([
                        'role' => 'admin',
                        'is_allowed' => true,
                    ]);

                    AllowedEmail::firstOrCreate(['email' => $email]);
                    $this->command->info("✓ Updated {$email} to admin role");
                } else {
                    // Create admin user if not found
                    $adminName = explode('@', $email)[0];
                    $adminName = ucwords(str_replace('.', ' ', $adminName));
                    
                    $user = User::create([
                        'name' => $adminName,
                        'email' => $email,
                        'password' => bcrypt('password'), // Default password
                        'role' => 'admin',
                        'is_allowed' => true,
                        'email_verified_at' => now(),
                        'phone_number' => null, // Default phone number
                    ]);

                    AllowedEmail::firstOrCreate(['email' => $email]);
                    $this->command->info("✓ Created admin user {$email} with ULID: {$user->id}");
                }
            }

            User::whereNull('role')->update(['role' => 'user']);

            $allowedEmails = AllowedEmail::pluck('email')->toArray();
            User::whereIn('email', $allowedEmails)->update(['is_allowed' => true]);
            User::whereNotIn('email', $allowedEmails)->update(['is_allowed' => false]);

            $this->command->info('✓ Updated all users');
        });

        $adminCount = User::where('role', 'admin')->count();
        $userCount = User::where('role', 'user')->count();
        $allowedCount = User::where('is_allowed', true)->count();

        $this->command->info("Admins: {$adminCount}, Users: {$userCount}, Allowed: {$allowedCount}");

        $admins = User::where('role', 'admin')->get(['name', 'email']);
        foreach ($admins as $admin) {
            $this->command->info("Admin: {$admin->name} ({$admin->email})");
        }
    }
}
