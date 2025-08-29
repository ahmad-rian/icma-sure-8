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
        Schema::create('submission_payments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('submission_id');
            $table->string('payment_proof'); // Path file bukti pembayaran (jpg, jpeg, png)
            $table->enum('status', [
                'pending',
                'approved',
                'rejected'
            ])->default('pending');
            $table->text('admin_notes')->nullable(); // Catatan dari admin
            $table->timestamp('uploaded_at')->nullable(); // Kapan user upload
            $table->timestamp('reviewed_at')->nullable(); // Kapan admin review
            $table->ulid('reviewed_by')->nullable(); // Admin yang review
            $table->timestamps();

            $table->foreign('submission_id')->references('id')->on('abstract_submissions')->onDelete('cascade');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');

            $table->unique('submission_id'); // 1 submission = 1 payment
            $table->index(['status', 'uploaded_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_payments');
    }
};
