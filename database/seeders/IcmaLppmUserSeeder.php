<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class IcmaLppmUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'icmasure.lppm@unsoed.ac.id'],
            [
                'id' => Str::ulid(),
                'name' => 'ICMA LPPM UNSOED',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}