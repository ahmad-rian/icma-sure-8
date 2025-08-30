<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailNotification extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'submission_id',
        'recipient_email',
        'sent_by',
        'subject',
        'body',
        'type',
        'status',
        'sent_at',
        'sent_via',
        'api_response',
        'error_message',
        'failed_at',
        'retry_count',
        'metadata',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'failed_at' => 'datetime',
        'api_response' => 'array',
        'metadata' => 'array',
    ];

    /**
     * Get the submission that owns this notification
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(AbstractSubmission::class, 'submission_id');
    }

    /**
     * Get the user who sent this notification
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sent_by');
    }

    /**
     * Scope for sent notifications
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    /**
     * Scope for pending notifications
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for failed notifications
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope by notification type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for notifications sent via specific method
     */
    public function scopeSentVia($query, string $method)
    {
        return $query->where('sent_via', $method);
    }

    /**
     * Mark notification as sent
     */
    public function markAsSent(string $sentVia = null, array $apiResponse = null): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
            'sent_via' => $sentVia ?? 'unknown',
            'api_response' => $apiResponse,
            'error_message' => null,
            'failed_at' => null,
        ]);
    }

    /**
     * Mark notification as sent via Sinar Ilmu API
     */
    public function markAsSentViaApi(array $apiResponse = null): void
    {
        $this->markAsSent('sinarilmu_api', $apiResponse);
    }

    /**
     * Mark notification as sent via Gmail fallback
     */
    public function markAsSentViaGmail(): void
    {
        $this->markAsSent('gmail_direct');
    }

    /**
     * Mark notification as failed
     */
    public function markAsFailed(string $errorMessage): void
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $errorMessage,
            'failed_at' => now(),
        ]);
    }

    /**
     * Increment retry count
     */
    public function incrementRetry(): void
    {
        $this->increment('retry_count');
    }

    /**
     * Check if notification can be retried
     */
    public function canRetry(int $maxRetries = 3): bool
    {
        return $this->status !== 'sent' && $this->retry_count < $maxRetries;
    }

    /**
     * Get status badge color for UI
     */
    public function getStatusBadgeAttribute(): string
    {
        return match ($this->status) {
            'sent' => 'success',
            'pending' => 'warning',
            'failed' => 'danger',
            default => 'secondary'
        };
    }

    /**
     * Get human readable sent via text
     */
    public function getSentViaTextAttribute(): string
    {
        return match ($this->sent_via) {
            'sinarilmu_api' => 'Sinar Ilmu API',
            'gmail_direct' => 'Gmail Direct',
            'unknown' => 'Unknown',
            default => ucfirst(str_replace('_', ' ', $this->sent_via))
        };
    }

    /**
     * Check if notification was sent via API
     */
    public function wasSentViaApi(): bool
    {
        return $this->sent_via === 'sinarilmu_api';
    }

    /**
     * Check if notification was sent via Gmail fallback
     */
    public function wasSentViaGmail(): bool
    {
        return $this->sent_via === 'gmail_direct';
    }

    /**
     * Get notification summary for logging
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'recipient' => $this->recipient_email,
            'subject' => $this->subject,
            'status' => $this->status,
            'sent_via' => $this->sent_via,
            'retry_count' => $this->retry_count,
            'sent_at' => $this->sent_at?->toISOString(),
            'failed_at' => $this->failed_at?->toISOString(),
        ];
    }
}
