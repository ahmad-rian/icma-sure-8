<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AbstractSubmission extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'user_id',
        'country_id',
        'author_first_name',
        'author_last_name',
        'author_email',
        'author_phone_number',
        'author_affiliation',
        'title',
        'abstract',
        'abstract_pdf',
        'keywords',
        'submission_file',
        'status',
        'reviewer_notes',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'registration_fee',
        'payment_required',
    ];

    protected $casts = [
        'keywords' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'registration_fee' => 'decimal:2',
        'payment_required' => 'boolean',
    ];

    /**
     * Get the keywords attribute, ensuring it's always an array
     */
    public function getKeywordsAttribute($value)
    {
        if (is_null($value)) {
            return [];
        }
        
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        
        return is_array($value) ? $value : [];
    }

    /**
     * Set the keywords attribute, ensuring proper JSON encoding
     */
    public function setKeywordsAttribute($value)
    {
        if (is_null($value) || $value === '') {
            $this->attributes['keywords'] = null;
        } elseif (is_string($value)) {
            // If it's a comma-separated string, convert to array
            $keywords = array_map('trim', explode(',', $value));
            $keywords = array_filter($keywords); // Remove empty values
            $this->attributes['keywords'] = json_encode(array_values($keywords));
        } elseif (is_array($value)) {
            $keywords = array_filter($value); // Remove empty values
            $this->attributes['keywords'] = json_encode(array_values($keywords));
        } else {
            $this->attributes['keywords'] = null;
        }
    }

    /**
     * Get the user who submitted this abstract
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who reviewed this submission
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the country of this submission
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get all contributors for this submission
     */
    public function contributors(): HasMany
    {
        return $this->hasMany(SubmissionContributor::class, 'submission_id')
                    ->orderBy('order_index');
    }

    /**
     * Get the primary contact contributor
     */
    public function primaryContact(): HasOne
    {
        return $this->hasOne(SubmissionContributor::class, 'submission_id')
                    ->where('is_primary_contact', true);
    }

    /**
     * Get the payment record for this submission
     */
    public function payment(): HasOne
    {
        return $this->hasOne(SubmissionPayment::class, 'submission_id');
    }

    /**
     * Get all email notifications for this submission
     */
    public function emailNotifications(): HasMany
    {
        return $this->hasMany(EmailNotification::class, 'submission_id');
    }

    /**
     * Scope for pending submissions
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for approved submissions
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for rejected submissions
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Check if submission can be edited
     */
    public function canBeEdited(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if payment is required
     */
    public function requiresPayment(): bool
    {
        return $this->status === 'approved' && !$this->payment;
    }

    /**
     * Get formatted keywords as string
     */
    public function getKeywordsStringAttribute(): string
    {
        return is_array($this->keywords) ? implode(', ', $this->keywords) : '';
    }
}