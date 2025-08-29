<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user (or update if exists)
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_allowed' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create regular user (or update if exists)
        $user = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_allowed' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create some additional test users using factory (only if they don't exist)
        if (User::count() < 10) {
            User::factory(3)->create([
                'is_allowed' => true,
                'role' => 'user',
            ]);
        }

        $this->command->info('Test users with ULID created/updated successfully!');
        $this->command->info('Admin ID (ULID): ' . $admin->id);
        $this->command->info('User ID (ULID): ' . $user->id);
    }
}
