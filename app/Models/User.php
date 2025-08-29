<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUlids;

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'password',
        'google_id',
        'avatar',
        'is_allowed',
        'role',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_allowed' => 'boolean',
            'role' => 'string',
        ];
    }

    /**
     * Override the password mutator to handle null values
     */
    public function setPasswordAttribute($value)
    {
        if ($value !== null) {
            $this->attributes['password'] = bcrypt($value);
        } else {
            $this->attributes['password'] = null;
        }
    }

    /**
     * Get the user profile associated with the user.
     */
    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Get the allowed email record associated with the user.
     */
    public function allowedEmail(): HasOne
    {
        return $this->hasOne(AllowedEmail::class, 'email', 'email');
    }

    /**
     * Scope a query to only include allowed users.
     */
    public function scopeAllowed($query)
    {
        return $query->where('is_allowed', true);
    }

    /**
     * Scope a query to only include blocked users.
     */
    public function scopeBlocked($query)
    {
        return $query->where('is_allowed', false);
    }

    /**
     * Scope a query to only include verified users.
     */
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope a query to only include admin users.
     */
    public function scopeAdmin($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope a query to only include regular users.
     */
    public function scopeRegularUser($query)
    {
        return $query->where('role', 'user');
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is regular user.
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Get all abstract submissions for this user.
     */
    public function submissions()
    {
        return $this->hasMany(AbstractSubmission::class);
    }

    /**
     * Get user's initials for avatar.
     */
    public function getInitialsAttribute(): string
    {
        $words = explode(' ', $this->name);
        $initials = '';

        foreach ($words as $word) {
            $initials .= strtoupper(substr($word, 0, 1));
        }

        return substr($initials, 0, 2);
    }
}
