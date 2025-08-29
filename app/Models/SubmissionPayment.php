<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionPayment extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'submission_id',
        'payment_proof',
        'status',
        'admin_notes',
        'uploaded_at',
        'reviewed_at',
        'reviewed_by',
        'amount',
    ];

    /**
     * Boot the model and add validation
     */
    protected static function boot()
    {
        parent::boot();

        // Ensure payment_proof is not empty when creating new records from user upload
        // Allow admin to create payment records without proof (for approval workflow)
        static::creating(function ($payment) {
            // Only validate payment_proof if it's being set (user upload scenario)
            // Admin creates payment records with null payment_proof initially
            if (isset($payment->payment_proof) && empty($payment->payment_proof)) {
                throw new \Exception('Payment proof cannot be empty when provided.');
            }
        });
    }

    protected $casts = [
        'uploaded_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the submission that owns this payment
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(AbstractSubmission::class, 'submission_id');
    }

    /**
     * Get the admin who reviewed this payment
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scope for pending payments
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for approved payments
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for rejected payments
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Check if payment can be edited
     */
    public function canBeEdited(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Get payment proof URL
     */
    public function getPaymentProofUrlAttribute(): ?string
    {
        return $this->payment_proof ? asset('storage/' . $this->payment_proof) : null;
    }

    /**
     * Get the full payment proof URL for frontend
     */
    public function getPaymentProofAttribute($value): ?string
    {
        return $value ? asset('storage/' . $value) : null;
    }
}