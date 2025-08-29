<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EmailApiLogging
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $requestId = uniqid('req_', true);
        
        // Log incoming request
        $this->logRequest($request, $requestId);
        
        $response = $next($request);
        
        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2); // in milliseconds
        
        // Log response and performance
        $this->logResponse($request, $response, $requestId, $duration);
        
        return $response;
    }
    
    /**
     * Log incoming request details
     */
    private function logRequest(Request $request, string $requestId): void
    {
        $logData = [
            'request_id' => $requestId,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'timestamp' => now()->toISOString(),
            'headers' => $this->sanitizeHeaders($request->headers->all()),
        ];
        
        // Log request body for POST requests (without sensitive data)
        if ($request->isMethod('POST')) {
            $body = $request->all();
            // Remove sensitive information
            unset($body['api_key']);
            $logData['body'] = $body;
        }
        
        Log::channel('email_api_audit')->info('API Request', $logData);
    }
    
    /**
     * Log response details and performance metrics
     */
    private function logResponse(Request $request, Response $response, string $requestId, float $duration): void
    {
        $statusCode = $response->getStatusCode();
        $isSuccess = $statusCode >= 200 && $statusCode < 300;
        
        $logData = [
            'request_id' => $requestId,
            'status_code' => $statusCode,
            'duration_ms' => $duration,
            'memory_usage' => round(memory_get_peak_usage(true) / 1024 / 1024, 2) . 'MB',
            'timestamp' => now()->toISOString(),
        ];
        
        // Log to appropriate channels
        if ($isSuccess) {
            Log::channel('email_api')->info('API Response', $logData);
        } else {
            Log::channel('email_api')->error('API Error Response', $logData);
        }
        
        // Log performance metrics
        $this->logPerformanceMetrics($request, $duration, $statusCode);
        
        // Log security events for failed requests
        if (!$isSuccess && in_array($statusCode, [401, 403, 429])) {
            $this->logSecurityEvent($request, $statusCode, $requestId);
        }
    }
    
    /**
     * Log performance metrics
     */
    private function logPerformanceMetrics(Request $request, float $duration, int $statusCode): void
    {
        $endpoint = $request->route() ? $request->route()->getName() : $request->path();
        
        $performanceData = [
            'endpoint' => $endpoint,
            'method' => $request->method(),
            'duration_ms' => $duration,
            'status_code' => $statusCode,
            'memory_peak_mb' => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
            'timestamp' => now()->toISOString(),
        ];
        
        // Log slow requests (> 5 seconds)
        if ($duration > 5000) {
            Log::channel('email_api_performance')->warning('Slow API Request', $performanceData);
        } else {
            Log::channel('email_api_performance')->info('API Performance', $performanceData);
        }
    }
    
    /**
     * Log security events
     */
    private function logSecurityEvent(Request $request, int $statusCode, string $requestId): void
    {
        $securityData = [
            'request_id' => $requestId,
            'event_type' => $this->getSecurityEventType($statusCode),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'status_code' => $statusCode,
            'timestamp' => now()->toISOString(),
        ];
        
        Log::channel('email_api_security')->warning('Security Event', $securityData);
    }
    
    /**
     * Get security event type based on status code
     */
    private function getSecurityEventType(int $statusCode): string
    {
        return match ($statusCode) {
            401 => 'unauthorized_access',
            403 => 'forbidden_access',
            429 => 'rate_limit_exceeded',
            default => 'security_violation',
        };
    }
    
    /**
     * Sanitize headers to remove sensitive information
     */
    private function sanitizeHeaders(array $headers): array
    {
        $sensitiveHeaders = ['x-api-key', 'authorization', 'cookie'];
        
        foreach ($sensitiveHeaders as $header) {
            if (isset($headers[$header])) {
                $headers[$header] = ['[REDACTED]'];
            }
        }
        
        return $headers;
    }
}