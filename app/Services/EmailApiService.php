<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Exception;

class EmailApiService
{
    /**
     * Send email via API
     *
     * @param array $emailData
     * @return array
     */
    public function sendEmail(array $emailData): array
    {
        try {
            // Log the email sending attempt
            Log::info('Email API: Attempting to send email', [
                'to' => $emailData['to'],
                'subject' => $emailData['subject'],
                'tags' => $emailData['tags'] ?? [],
                'metadata' => $emailData['metadata'] ?? []
            ]);

            // Create and send the email
            $mailable = new ApiMailable($emailData);
            
            // Send to primary recipients
            Mail::to($emailData['to'])
                ->when(!empty($emailData['cc']), function ($mail) use ($emailData) {
                    return $mail->cc($emailData['cc']);
                })
                ->when(!empty($emailData['bcc']), function ($mail) use ($emailData) {
                    return $mail->bcc($emailData['bcc']);
                })
                ->send($mailable);

            // Log successful sending
            Log::info('Email API: Email sent successfully', [
                'to' => $emailData['to'],
                'subject' => $emailData['subject'],
                'message_id' => $this->generateMessageId()
            ]);

            return [
                'success' => true,
                'message' => 'Email sent successfully',
                'data' => [
                    'message_id' => $this->generateMessageId(),
                    'recipients_count' => count($emailData['to']),
                    'cc_count' => count($emailData['cc'] ?? []),
                    'bcc_count' => count($emailData['bcc'] ?? []),
                    'sent_at' => now()->toISOString()
                ]
            ];

        } catch (Exception $e) {
            // Log the error
            Log::error('Email API: Failed to send email', [
                'error' => $e->getMessage(),
                'to' => $emailData['to'],
                'subject' => $emailData['subject'],
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send email',
                'error' => $e->getMessage(),
                'error_code' => 'EMAIL_SEND_FAILED'
            ];
        }
    }

    /**
     * Validate email configuration
     *
     * @return array
     */
    public function validateEmailConfig(): array
    {
        try {
            $config = config('mail');
            
            $requiredConfigs = [
                'default' => $config['default'] ?? null,
                'mailers.' . ($config['default'] ?? 'smtp') => $config['mailers'][$config['default'] ?? 'smtp'] ?? null,
                'from.address' => $config['from']['address'] ?? null,
                'from.name' => $config['from']['name'] ?? null,
            ];

            $missingConfigs = [];
            foreach ($requiredConfigs as $key => $value) {
                if (empty($value)) {
                    $missingConfigs[] = $key;
                }
            }

            if (!empty($missingConfigs)) {
                return [
                    'success' => false,
                    'message' => 'Email configuration is incomplete',
                    'missing_configs' => $missingConfigs
                ];
            }

            return [
                'success' => true,
                'message' => 'Email configuration is valid',
                'config' => [
                    'driver' => $config['mailers'][$config['default']]['transport'] ?? 'unknown',
                    'host' => $config['mailers'][$config['default']]['host'] ?? 'unknown',
                    'port' => $config['mailers'][$config['default']]['port'] ?? 'unknown',
                    'from_address' => $config['from']['address'],
                    'from_name' => $config['from']['name']
                ]
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to validate email configuration',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Test email connectivity
     *
     * @param string $testEmail
     * @return array
     */
    public function testEmailConnectivity(string $testEmail): array
    {
        try {
            $testData = [
                'to' => [$testEmail],
                'subject' => 'Email API Test - ' . now()->format('Y-m-d H:i:s'),
                'body' => '<h2>Email API Test</h2><p>This is a test email from the Email API service.</p><p>Sent at: ' . now()->toDateTimeString() . '</p>',
                'body_type' => 'html',
                'from_name' => 'Email API Service',
                'tags' => ['test', 'connectivity'],
                'metadata' => [
                    'test_type' => 'connectivity',
                    'timestamp' => now()->timestamp
                ]
            ];

            return $this->sendEmail($testData);

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Email connectivity test failed',
                'error' => $e->getMessage(),
                'error_code' => 'CONNECTIVITY_TEST_FAILED'
            ];
        }
    }

    /**
     * Test email connection and configuration
     *
     * @return array
     */
    public function testEmailConnection(): array
    {
        try {
            // Get mail configuration
            $mailer = config('mail.default');
            $config = config("mail.mailers.{$mailer}");
            
            if (!$config) {
                return [
                    'success' => false,
                    'error' => 'Mail configuration not found',
                    'details' => "No configuration found for mailer: {$mailer}"
                ];
            }
            
            // Test SMTP connection if using SMTP
            if ($mailer === 'smtp') {
                $host = $config['host'] ?? null;
                $port = $config['port'] ?? 587;
                $timeout = 10;
                
                if (!$host) {
                    return [
                        'success' => false,
                        'error' => 'SMTP host not configured'
                    ];
                }
                
                // Test socket connection
                $socket = @fsockopen($host, $port, $errno, $errstr, $timeout);
                
                if (!$socket) {
                    return [
                        'success' => false,
                        'error' => "Cannot connect to SMTP server: {$errstr} ({$errno})",
                        'details' => [
                            'host' => $host,
                            'port' => $port,
                            'timeout' => $timeout
                        ]
                    ];
                }
                
                fclose($socket);
            }
            
            // Test by creating a mail instance
            $testMail = new ApiMailable([
                'subject' => 'Connection Test',
                'body' => 'This is a connection test email.',
                'body_type' => 'text'
            ]);
            
            return [
                'success' => true,
                'message' => 'Email configuration is valid',
                'details' => [
                    'mailer' => $mailer,
                    'host' => $config['host'] ?? 'N/A',
                    'port' => $config['port'] ?? 'N/A',
                    'encryption' => $config['encryption'] ?? 'none',
                    'from_address' => config('mail.from.address'),
                    'tested_at' => now()->toISOString()
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Email configuration test failed: ' . $e->getMessage(),
                'details' => [
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ];
        }
    }

    /**
     * Get email sending statistics
     *
     * @return array
     */
    public function getEmailStats(): array
    {
        try {
            // This would typically query a database or cache
            // For now, we'll return mock data
            return [
                'success' => true,
                'data' => [
                    'total_sent_today' => 0, // Would be calculated from logs/database
                    'total_failed_today' => 0,
                    'success_rate' => 100.0,
                    'last_sent_at' => null,
                    'service_status' => 'operational'
                ]
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to retrieve email statistics',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Generate a unique message ID
     *
     * @return string
     */
    private function generateMessageId(): string
    {
        return 'email-api-' . uniqid() . '-' . time();
    }
}

/**
 * Custom Mailable class for API emails
 */
class ApiMailable extends Mailable
{
    protected array $emailData;

    public function __construct(array $emailData)
    {
        $this->emailData = $emailData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $envelope = new Envelope(
            subject: $this->emailData['subject']
        );

        // Set from address if provided
        if (!empty($this->emailData['from_name'])) {
            $envelope = new Envelope(
                from: new Address(config('mail.from.address'), $this->emailData['from_name']),
                subject: $this->emailData['subject']
            );
        }

        // Set reply-to if provided
        if (!empty($this->emailData['reply_to'])) {
            $envelope = new Envelope(
                from: !empty($this->emailData['from_name']) ? new Address(config('mail.from.address'), $this->emailData['from_name']) : null,
                replyTo: [new Address($this->emailData['reply_to'])],
                subject: $this->emailData['subject']
            );
        }

        return $envelope;
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $bodyType = $this->emailData['body_type'] ?? 'html';
        
        if ($bodyType === 'html') {
            return new Content(
                html: 'emails.api-email-html',
                with: ['body' => $this->emailData['body']]
            );
        } else {
            return new Content(
                text: 'emails.api-email-text',
                with: ['body' => $this->emailData['body']]
            );
        }
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        if (!empty($this->emailData['attachments'])) {
            foreach ($this->emailData['attachments'] as $attachment) {
                $attachments[] = Attachment::fromData(
                    fn () => base64_decode($attachment['content']),
                    $attachment['name']
                )->withMime($attachment['mime_type']);
            }
        }

        return $attachments;
    }
}