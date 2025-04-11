<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'location',
        'latitude',
        'longitude',
        'image',
        'is_featured',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the event's formatted location details for display
     */
    public function getFormattedLocationAttribute()
    {
        if ($this->location) {
            if ($this->latitude && $this->longitude) {
                return $this->location . ' (' . $this->latitude . ', ' . $this->longitude . ')';
            }
            return $this->location;
        }

        if ($this->latitude && $this->longitude) {
            return '(' . $this->latitude . ', ' . $this->longitude . ')';
        }

        return 'No location specified';
    }

    /**
     * Check if the event has map coordinates
     */
    public function getHasCoordinatesAttribute()
    {
        return $this->latitude && $this->longitude;
    }
}
