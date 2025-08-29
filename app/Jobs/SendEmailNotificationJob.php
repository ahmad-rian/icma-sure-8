<?php

namespace App\Jobs;

use App\Models\EmailNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

class SendEmailNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [60, 300, 900]; // 1 min, 5 min, 15 min

    /**
     * Create a new job instance.
     */
    public function __construct(
        public EmailNotification $emailNotification
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Skip if already sent
            if ($this->emailNotification->status === 'sent') {
                return;
            }

            // Send email using Laravel's Mail facade
            Mail::raw($this->emailNotification->body, function ($message) {
                $message->to($this->emailNotification->recipient_email)
                        ->subject($this->emailNotification->subject)
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            // Mark as sent
            $this->emailNotification->markAsSent();

            Log::info('Email notification sent successfully', [
                'notification_id' => $this->emailNotification->id,
                'recipient' => $this->emailNotification->recipient_email,
                'type' => $this->emailNotification->type
            ]);

        } catch (Exception $e) {
            Log::error('Failed to send email notification', [
                'notification_id' => $this->emailNotification->id,
                'recipient' => $this->emailNotification->recipient_email,
                'error' => $e->getMessage()
            ]);

            // Mark as failed if this is the last attempt
            if ($this->attempts() >= $this->tries) {
                $this->emailNotification->markAsFailed($e->getMessage());
            }

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Exception $exception): void
    {
        Log::error('Email notification job failed permanently', [
            'notification_id' => $this->emailNotification->id,
            'recipient' => $this->emailNotification->recipient_email,
            'error' => $exception->getMessage()
        ]);

        $this->emailNotification->markAsFailed($exception->getMessage());
    }
}