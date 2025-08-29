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
        Schema::create('submission_contributors', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('submission_id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('email');
            $table->ulid('country_id');
            $table->text('affiliation'); // Free text field (e.g., "Informatika, Teknik, Universitas Jenderal Soedirman, Indonesia")
            $table->enum('role', ['author', 'co-author'])->default('co-author');
            $table->boolean('is_primary_contact')->default(false); // Untuk menentukan corresponding author
            $table->boolean('is_submitter')->default(false); // User yang submit otomatis true
            $table->integer('order_index')->default(0); // Urutan kontributor
            $table->timestamps();

            $table->foreign('submission_id')->references('id')->on('abstract_submissions')->onDelete('cascade');
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('restrict');

            $table->index(['submission_id', 'order_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_contributors');
    }
};
