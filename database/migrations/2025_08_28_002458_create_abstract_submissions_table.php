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
        Schema::create('abstract_submissions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('user_id'); // User yang submit (otomatis jadi author)
            $table->string('title');
            $table->longText('abstract'); // Untuk TinyMCE content (HTML)
            $table->string('abstract_pdf')->nullable(); // Path ke file PDF yang di-generate
            $table->json('keywords')->nullable(); // Array of keywords
            $table->string('submission_file')->nullable(); // Path to uploaded file
            $table->enum('status', [
                'pending',
                'approved',
                'rejected'
            ])->default('pending');
            $table->text('reviewer_notes')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->ulid('reviewed_by')->nullable(); // Admin who reviewed
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');

            $table->index(['status', 'submitted_at']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abstract_submissions');
    }
};
