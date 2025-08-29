<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get the ICMA LPPM user ID
        $icmaLppmUserId = \App\Models\User::where('email', 'icmasure.lppm@unsoed.ac.id')->first()?->id;
        
        if ($icmaLppmUserId) {
            Schema::table('email_notifications', function (Blueprint $table) use ($icmaLppmUserId) {
                $table->ulid('sent_by')->default($icmaLppmUserId)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('email_notifications', function (Blueprint $table) {
            $table->ulid('sent_by')->default(null)->change();
        });
    }
};
