<?php

namespace App\Console\Commands;

use App\Models\AllowedEmail;
use App\Models\User;
use Illuminate\Console\Command;

class RemoveAllowedEmail extends Command
{
    protected $signature = 'email:disallow {email}';
    protected $description = 'Menghapus email dari daftar yang diizinkan untuk login';

    public function handle()
    {
        $email = $this->argument('email');

        $allowedEmail = AllowedEmail::where('email', $email)->first();

        if (!$allowedEmail) {
            $this->error("Email $email tidak ditemukan dalam daftar yang diizinkan.");
            return 1;
        }

        $allowedEmail->delete();

        // Update status user terkait
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->update(['is_allowed' => false]);
            $this->info("Status user dengan email $email telah diperbarui.");
        }

        $this->info("Email $email berhasil dihapus dari daftar yang diizinkan.");

        return 0;
    }
}
