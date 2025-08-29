<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country_id',
        'organization',
        'job_title',
        'bio',
        'website',
        'linkedin',
        'twitter',
        'orcid',
        'google_scholar',
        'researchgate',
        'avatar',
        'date_of_birth',
        'gender',
        'nationality',
        'emergency_contact_name',
        'emergency_contact_phone',
        'dietary_restrictions',
        'accessibility_needs',
        'is_public',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_public' => 'boolean',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the country that the user profile belongs to.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }
        
        return null;
    }

    /**
     * Scope a query to only include public profiles.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }
}