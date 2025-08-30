<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendEmailApiRequest;
use App\Services\EmailApiService;
use App\Services\EmailApiMonitoringService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
class EmailApiController extends Controller
{
    protected EmailApiService $emailService;

    public function __construct(EmailApiService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Send email via API
     *
     * @param SendEmailApiRequest $request
     * @return JsonResponse
     */
    public function sendEmail(SendEmailApiRequest $request): JsonResponse
    {
        try {
            // Get validated data
            $emailData = $request->validated();
            
            // Log the email sending attempt
            Log::info('Email API request received', [
                'to' => $emailData['to'],
                'subject' => $emailData['subject'],
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Test email configuration if requested
            if ($request->boolean('test_connection')) {
                $connectionTest = $this->emailService->testConnection();
                if (!$connectionTest['success']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Email configuration test failed',
                        'error' => $connectionTest['message'],
                        'error_code' => 'EMAIL_CONFIG_ERROR'
                    ], 500);
                }
            }

            // Send the email
            $result = $this->emailService->sendViaApi($emailData);

            if ($result['success']) {
                Log::info('Email sent successfully via API', [
                    'to' => $emailData['to'],
                    'subject' => $emailData['subject'],
                    'message_id' => $result['message_id'] ?? null
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Email sent successfully',
                    'data' => [
                        'message_id' => $result['message_id'] ?? null,
                        'sent_at' => now()->toISOString(),
                        'recipients' => [
                            'to' => $emailData['to'],
                            'cc' => $emailData['cc'] ?? [],
                            'bcc' => $emailData['bcc'] ?? []
                        ]
                    ]
                ], 200);
            } else {
                Log::error('Failed to send email via API', [
                    'to' => $emailData['to'],
                    'subject' => $emailData['subject'],
                    'error' => $result['error']
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send email',
                    'error' => $result['error'],
                    'error_code' => 'EMAIL_SEND_FAILED'
                ], 500);
            }
        } catch (Exception $e) {
            Log::error('Email API error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['attachments'])
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Internal server error occurred while sending email',
                'error_code' => 'INTERNAL_SERVER_ERROR'
            ], 500);
        }
    }

    /**
     * Get email service status and statistics
     *
     * @return JsonResponse
     */
    public function getStatus(): JsonResponse
    {
        try {
            // Test email connection
            $connectionTest = $this->emailService->testConnection();
            
            // Get email statistics
            $stats = $this->emailService->getStatus();

            return response()->json([
                'success' => true,
                'data' => [
                    'service_status' => 'operational',
                    'email_connection' => $connectionTest,
                    'statistics' => $stats,
                    'server_time' => now()->toISOString()
                ]
            ], 200);
        } catch (Exception $e) {
            Log::error('Email API status check error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get service status',
                'error_code' => 'STATUS_CHECK_FAILED'
            ], 500);
        }
    }

    /**
     * Test email configuration
     *
     * @return JsonResponse
     */
    public function testConnection(): JsonResponse
    {
        try {
            $result = $this->emailService->testConnection();

            return response()->json([
                'success' => $result['success'],
                'message' => $result['success'] ? 'Email connection test successful' : 'Email connection test failed',
                'data' => $result,
                'tested_at' => now()->toISOString()
            ], $result['success'] ? 200 : 500);
        } catch (Exception $e) {
            Log::error('Email connection test error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Connection test failed',
                'error' => $e->getMessage(),
                'error_code' => 'CONNECTION_TEST_FAILED'
            ], 500);
        }
    }

    /**
     * Get comprehensive health check status
     *
     * @return JsonResponse
     */
    public function healthCheck(): JsonResponse
    {
        try {
            $monitoringService = new EmailApiMonitoringService();
            $healthStatus = $monitoringService->performHealthCheck();
            
            $statusCode = match ($healthStatus['overall_status']) {
                'healthy' => 200,
                'degraded' => 200,
                'unhealthy' => 503,
                default => 500,
            };
            
            return response()->json([
                'success' => $healthStatus['overall_status'] !== 'unhealthy',
                'data' => $healthStatus,
            ], $statusCode);
        } catch (Exception $e) {
            Log::channel('email_api')->error('Health check failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Health check failed',
                'error_code' => 'HEALTH_CHECK_FAILED',
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }
    
    /**
     * Get API usage statistics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStatistics(Request $request): JsonResponse
    {
        try {
            $days = $request->query('days', 7);
            $days = max(1, min(30, (int) $days)); // Limit between 1-30 days
            
            $monitoringService = new EmailApiMonitoringService();
            $statistics = $monitoringService->getUsageStatistics($days);
            
            return response()->json([
                'success' => true,
                'data' => $statistics,
            ], 200);
        } catch (Exception $e) {
            Log::channel('email_api')->error('Failed to get statistics', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to get statistics',
                'error_code' => 'STATISTICS_FAILED',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
