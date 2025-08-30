<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class EmailApiService
{
    protected $apiUrl;
    protected $apiKey;
    protected $timeout;

    public function __construct()
    {
        $this->apiUrl = config('services.sinarilmu_email_api.url');
        $this->apiKey = config('services.sinarilmu_email_api.key');
        $this->timeout = config('services.sinarilmu_email_api.timeout', 30);
    }

    /**
     * Send email via Sinar Ilmu API
     *
     * @param array $emailData
     * @return array
     */
    public function sendViaApi(array $emailData): array
    {
        try {
            // Check if API is enabled
            if (!config('services.email_api.enabled', true)) {
                return [
                    'success' => false,
                    'message' => 'Email API is disabled',
                    'should_fallback' => true
                ];
            }

            // Validate required data
            if (empty($emailData['to']) || empty($emailData['subject']) || empty($emailData['body'])) {
                return [
                    'success' => false,
                    'message' => 'Missing required email data',
                    'should_fallback' => true
                ];
            }

            // Log request
            Log::info('Sending email via Sinar Ilmu API', [
                'to' => $emailData['to'],
                'subject' => $emailData['subject'],
                'api_url' => $this->apiUrl
            ]);

            // Send HTTP request to Sinar Ilmu API
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'X-API-Key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'User-Agent' => 'ICMA-SURE/1.0'
                ])
                ->post($this->apiUrl . '/send', [
                    'to' => $emailData['to'],
                    'subject' => $emailData['subject'],
                    'body' => $emailData['body'],
                    'cc' => $emailData['cc'] ?? [],
                    'bcc' => $emailData['bcc'] ?? [],
                    'from_name' => $emailData['from_name'] ?? 'ICMA SURE'
                ]);

            // Check if request was successful
            if ($response->successful()) {
                $responseData = $response->json();

                Log::info('Email sent successfully via Sinar Ilmu API', [
                    'message_id' => $responseData['data']['message_id'] ?? null,
                    'to' => $emailData['to']
                ]);

                return [
                    'success' => true,
                    'message' => 'Email sent via Sinar Ilmu API',
                    'data' => $responseData['data'] ?? null
                ];
            }

            // API responded but with error
            $errorData = $response->json();
            Log::warning('Sinar Ilmu API returned error', [
                'status' => $response->status(),
                'error' => $errorData['message'] ?? 'Unknown error',
                'to' => $emailData['to']
            ]);

            return [
                'success' => false,
                'message' => $errorData['message'] ?? 'API request failed',
                'should_fallback' => true,
                'api_response' => $errorData
            ];
        } catch (Exception $e) {
            Log::error('Failed to send email via Sinar Ilmu API', [
                'error' => $e->getMessage(),
                'to' => $emailData['to'] ?? null,
                'api_url' => $this->apiUrl
            ]);

            return [
                'success' => false,
                'message' => 'API request exception: ' . $e->getMessage(),
                'should_fallback' => true
            ];
        }
    }

    /**
     * Test API connection
     *
     * @return array
     */
    public function testConnection(): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'X-API-Key' => $this->apiKey,
                    'Accept' => 'application/json'
                ])
                ->get($this->apiUrl . '/test-connection');

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'API connection successful',
                    'data' => $response->json()
                ];
            }

            return [
                'success' => false,
                'message' => 'API connection failed',
                'status' => $response->status(),
                'response' => $response->body()
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get API status
     *
     * @return array
     */
    public function getStatus(): array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'X-API-Key' => $this->apiKey,
                    'Accept' => 'application/json'
                ])
                ->get($this->apiUrl . '/status');

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to get API status',
                'status' => $response->status()
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Status check failed: ' . $e->getMessage()
            ];
        }
    }
}
