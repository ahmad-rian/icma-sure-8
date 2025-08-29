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
        Schema::create('email_notifications', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('submission_id');
            $table->enum('type', [
                'abstract_approved',    // Email notif abstract disetujui
                'payment_request',      // Email minta upload bukti bayar
                'payment_approved',     // Email pembayaran disetujui
                'loa_ready'            // Email LOA siap
            ]);
            $table->string('recipient_email');
            $table->string('subject');
            $table->text('body');
            $table->enum('status', [
                'pending',
                'sent',
                'failed'
            ])->default('pending');
            $table->timestamp('sent_at')->nullable();
            $table->text('error_message')->nullable(); // Jika gagal kirim
            $table->ulid('sent_by'); // Admin yang trigger bulk action
            $table->timestamps();

            $table->foreign('submission_id')->references('id')->on('abstract_submissions')->onDelete('cascade');
            $table->foreign('sent_by')->references('id')->on('users')->onDelete('cascade');

            $table->index(['type', 'status']);
            $table->index('submission_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_notifications');
    }
};
