<?php

namespace App\Console\Commands;

use App\Models\AllowedEmail;
use Illuminate\Console\Command;

class AddAllowedEmail extends Command
{
    protected $signature = 'email:allow {email}';
    protected $description = 'Menambahkan email ke daftar yang diizinkan untuk login';

    public function handle()
    {
        $email = $this->argument('email');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error("Email tidak valid: $email");
            return 1;
        }

        $allowedEmail = AllowedEmail::firstOrCreate(['email' => $email]);

        $this->info("Email $email berhasil ditambahkan ke daftar yang diizinkan.");

        return 0;
    }
}
