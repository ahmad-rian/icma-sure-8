<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionContributor extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'submission_id',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'country_id',
        'affiliation',
        'role',
        'is_primary_contact',
        'is_submitter',
        'order_index',
    ];

    protected $casts = [
        'is_primary_contact' => 'boolean',
        'is_submitter' => 'boolean',
        'order_index' => 'integer',
    ];

    /**
     * Get the submission that owns this contributor
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(AbstractSubmission::class, 'submission_id');
    }

    /**
     * Get the country of this contributor
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the full name of the contributor
     */
    public function getFullNameAttribute(): string
    {
        $name = $this->first_name;
        if ($this->middle_name) {
            $name .= ' ' . $this->middle_name;
        }
        $name .= ' ' . $this->last_name;
        
        return $name;
    }

    /**
     * Scope for primary contact contributors
     */
    public function scopePrimaryContact($query)
    {
        return $query->where('is_primary_contact', true);
    }

    /**
     * Scope for submitter contributors
     */
    public function scopeSubmitter($query)
    {
        return $query->where('is_submitter', true);
    }

    /**
     * Scope for authors
     */
    public function scopeAuthors($query)
    {
        return $query->where('role', 'author');
    }

    /**
     * Scope for co-authors
     */
    public function scopeCoAuthors($query)
    {
        return $query->where('role', 'co-author');
    }
}