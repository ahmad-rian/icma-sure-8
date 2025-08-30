<?php

namespace App\Jobs;

use App\Models\EmailNotification;
use App\Services\EmailApiService;
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
    public $timeout = 120;

    protected $emailNotification;

    public function __construct(EmailNotification $emailNotification)
    {
        $this->emailNotification = $emailNotification;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Skip if already sent
            if ($this->emailNotification->status === 'sent') {
                Log::info('Email already sent, skipping', [
                    'notification_id' => $this->emailNotification->id
                ]);
                return;
            }

            // Prepare email data
            $emailData = [
                'to' => [$this->emailNotification->recipient_email],
                'subject' => $this->emailNotification->subject,
                'body' => $this->emailNotification->body,
                'from_name' => config('mail.from.name', 'ICMA SURE')
            ];

            // Try sending via Sinar Ilmu API first
            if ($this->trySendViaApi($emailData)) {
                return;
            }

            // Fallback to direct Gmail if API fails
            if ($this->trySendViaGmail($emailData)) {
                return;
            }

            // If both methods fail, throw exception for retry
            throw new Exception('Both API and Gmail fallback failed');
        } catch (Exception $e) {
            Log::error('Email notification job failed', [
                'notification_id' => $this->emailNotification->id,
                'recipient' => $this->emailNotification->recipient_email,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts()
            ]);

            // Mark as failed if this is the last attempt
            if ($this->attempts() >= $this->tries) {
                $this->emailNotification->markAsFailed($e->getMessage());
            }

            throw $e;
        }
    }

    /**
     * Try sending email via Sinar Ilmu API
     *
     * @param array $emailData
     * @return bool
     */
    protected function trySendViaApi(array $emailData): bool
    {
        try {
            $emailService = new EmailApiService();
            $result = $emailService->sendViaApi($emailData);

            if ($result['success']) {
                $this->emailNotification->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                    'sent_via' => 'sinarilmu_api',
                    'api_response' => $result['data'] ?? null
                ]);

                Log::info('Email sent successfully via Sinar Ilmu API', [
                    'notification_id' => $this->emailNotification->id,
                    'recipient' => $this->emailNotification->recipient_email,
                    'message_id' => $result['data']['message_id'] ?? null
                ]);

                return true;
            }

            // Log API failure but don't throw exception yet
            Log::warning('Sinar Ilmu API failed, will try Gmail fallback', [
                'notification_id' => $this->emailNotification->id,
                'api_error' => $result['message'] ?? 'Unknown error'
            ]);

            return false;
        } catch (Exception $e) {
            Log::warning('API send attempt failed', [
                'notification_id' => $this->emailNotification->id,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Try sending email via direct Gmail
     *
     * @param array $emailData
     * @return bool
     */
    protected function trySendViaGmail(array $emailData): bool
    {
        try {
            // Send using Laravel's Mail facade (direct Gmail)
            Mail::raw($emailData['body'], function ($message) use ($emailData) {
                $message->to($emailData['to'][0])
                    ->subject($emailData['subject'])
                    ->from(
                        config('mail.from.address'),
                        $emailData['from_name']
                    );
            });

            $this->emailNotification->update([
                'status' => 'sent',
                'sent_at' => now(),
                'sent_via' => 'gmail_direct'
            ]);

            Log::info('Email sent successfully via Gmail fallback', [
                'notification_id' => $this->emailNotification->id,
                'recipient' => $this->emailNotification->recipient_email
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Gmail fallback also failed', [
                'notification_id' => $this->emailNotification->id,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Exception $exception): void
    {
        Log::critical('Email notification job failed permanently', [
            'notification_id' => $this->emailNotification->id,
            'recipient' => $this->emailNotification->recipient_email,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);

        $this->emailNotification->markAsFailed($exception->getMessage());
    }
}
