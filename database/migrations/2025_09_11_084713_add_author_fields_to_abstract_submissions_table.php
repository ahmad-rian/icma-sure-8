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
        Schema::table('abstract_submissions', function (Blueprint $table) {
            $table->string('author_first_name')->nullable()->after('country_id');
            $table->string('author_last_name')->nullable()->after('author_first_name');
            $table->string('author_email')->nullable()->after('author_last_name');
            $table->string('author_affiliation')->nullable()->after('author_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('abstract_submissions', function (Blueprint $table) {
            $table->dropColumn([
                'author_first_name',
                'author_last_name',
                'author_email',
                'author_affiliation'
            ]);
        });
    }
};
