<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'name',
        'code',
        'iso_code',
        'phone_code',
    ];

    /**
     * Get all submission contributors from this country
     */
    public function submissionContributors(): HasMany
    {
        return $this->hasMany(SubmissionContributor::class);
    }

    /**
     * Get all abstract submissions from this country
     */
    public function abstractSubmissions(): HasMany
    {
        return $this->hasMany(AbstractSubmission::class);
    }

    /**
     * Get all user profiles from this country
     */
    public function userProfiles(): HasMany
    {
        return $this->hasMany(UserProfile::class);
    }

    /**
     * Scope for active countries
     */
    public function scopeActive($query)
    {
        return $query->whereNotNull('name');
    }

    /**
     * Get country display name with code
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name . ($this->code ? ' (' . $this->code . ')' : '');
    }
}