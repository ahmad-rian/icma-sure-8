<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Exception;

class EmailApiMonitoringService
{
    private const CACHE_PREFIX = 'email_api_monitoring:';
    private const HEALTH_CHECK_CACHE_TTL = 300; // 5 minutes
    
    /**
     * Perform comprehensive health check
     */
    public function performHealthCheck(): array
    {
        $cacheKey = self::CACHE_PREFIX . 'health_check';
        
        return Cache::remember($cacheKey, self::HEALTH_CHECK_CACHE_TTL, function () {
            $startTime = microtime(true);
            
            $healthStatus = [
                'overall_status' => 'healthy',
                'timestamp' => now()->toISOString(),
                'checks' => [],
                'response_time_ms' => 0,
            ];
            
            // Database connectivity check
            $healthStatus['checks']['database'] = $this->checkDatabase();
            
            // Email configuration check
            $healthStatus['checks']['email_config'] = $this->checkEmailConfiguration();
            
            // SMTP connectivity check
            $healthStatus['checks']['smtp_connection'] = $this->checkSmtpConnection();
            
            // Disk space check
            $healthStatus['checks']['disk_space'] = $this->checkDiskSpace();
            
            // Memory usage check
            $healthStatus['checks']['memory_usage'] = $this->checkMemoryUsage();
            
            // Queue status check
            $healthStatus['checks']['queue_status'] = $this->checkQueueStatus();
            
            // Cache connectivity check
            $healthStatus['checks']['cache'] = $this->checkCache();
            
            // Determine overall status
            $healthStatus['overall_status'] = $this->determineOverallStatus($healthStatus['checks']);
            
            // Calculate response time
            $endTime = microtime(true);
            $healthStatus['response_time_ms'] = round(($endTime - $startTime) * 1000, 2);
            
            // Log health check results
            $this->logHealthCheck($healthStatus);
            
            return $healthStatus;
        });
    }
    
    /**
     * Check database connectivity
     */
    private function checkDatabase(): array
    {
        try {
            $startTime = microtime(true);
            DB::connection()->getPdo();
            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            
            return [
                'status' => 'healthy',
                'message' => 'Database connection successful',
                'response_time_ms' => $responseTime,
            ];
        } catch (Exception $e) {
            Log::channel('email_api')->error('Database health check failed', [
                'error' => $e->getMessage()
            ]);
            
            return [
                'status' => 'unhealthy',
                'message' => 'Database connection failed: ' . $e->getMessage(),
                'response_time_ms' => null,
            ];
        }
    }
    
    /**
     * Check email configuration
     */
    private function checkEmailConfiguration(): array
    {
        try {
            $requiredConfigs = [
                'mail.mailers.smtp.host',
                'mail.mailers.smtp.port',
                'mail.mailers.smtp.username',
                'mail.mailers.smtp.password',
                'mail.from.address',
            ];
            
            $missingConfigs = [];
            foreach ($requiredConfigs as $config) {
                if (empty(config($config))) {
                    $missingConfigs[] = $config;
                }
            }
            
            if (!empty($missingConfigs)) {
                return [
                    'status' => 'unhealthy',
                    'message' => 'Missing email configurations: ' . implode(', ', $missingConfigs),
                ];
            }
            
            return [
                'status' => 'healthy',
                'message' => 'Email configuration is complete',
                'config' => [
                    'mailer' => config('mail.default'),
                    'host' => config('mail.mailers.smtp.host'),
                    'port' => config('mail.mailers.smtp.port'),
                    'encryption' => config('mail.mailers.smtp.encryption'),
                    'from_address' => config('mail.from.address'),
                ]
            ];
        } catch (Exception $e) {
            return [
                'status' => 'unhealthy',
                'message' => 'Email configuration check failed: ' . $e->getMessage(),
            ];
        }
    }
    
    /**
     * Check SMTP connection
     */
    private function checkSmtpConnection(): array
    {
        try {
            $startTime = microtime(true);
            
            // Test SMTP connection using socket
            $host = config('mail.mailers.smtp.host');
            $port = config('mail.mailers.smtp.port');
            $timeout = 10;
            
            $socket = @fsockopen($host, $port, $errno, $errstr, $timeout);
            
            if (!$socket) {
                return [
                    'status' => 'unhealthy',
                    'message' => "SMTP connection failed: {$errstr} ({$errno})",
                ];
            }
            
            fclose($socket);
            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            
            return [
                'status' => 'healthy',
                'message' => 'SMTP connection successful',
                'response_time_ms' => $responseTime,
                'host' => $host,
                'port' => $port,
            ];
        } catch (Exception $e) {
            return [
                'status' => 'unhealthy',
                'message' => 'SMTP connection check failed: ' . $e->getMessage(),
            ];
        }
    }
    
    /**
     * Check disk space
     */
    private function checkDiskSpace(): array
    {
        try {
            $path = storage_path();
            $freeBytes = disk_free_space($path);
            $totalBytes = disk_total_space($path);
            
            if ($freeBytes === false || $totalBytes === false) {
                return [
                    'status' => 'unknown',
                    'message' => 'Unable to determine disk space',
                ];
            }
            
            $freeGB = round($freeBytes / 1024 / 1024 / 1024, 2);
            $totalGB = round($totalBytes / 1024 / 1024 / 1024, 2);
            $usedPercent = round((($totalBytes - $freeBytes) / $totalBytes) * 100, 2);
            
            $status = 'healthy';
            $message = 'Disk space is adequate';
            
            if ($usedPercent > 90) {
                $status = 'critical';
                $message = 'Disk space critically low';
            } elseif ($usedPercent > 80) {
                $status = 'warning';
                $message = 'Disk space running low';
            }
            
            return [
                'status' => $status,
                'message' => $message,
                'free_gb' => $freeGB,
                'total_gb' => $totalGB,
                'used_percent' => $usedPercent,
            ];
        } catch (Exception $e) {
            return [
                'status' => 'unknown',
                'message' => 'Disk space check failed: ' . $e->getMessage(),
            ];
        }
    }
    
    /**
     * Check memory usage
     */
    private function checkMemoryUsage(): array
    {
        try {
            $memoryUsage = memory_get_usage(true);
            $memoryPeak = memory_get_peak_usage(true);
            $memoryLimit = $this->parseMemoryLimit(ini_get('memory_limit'));
            
            $usageMB = round($memoryUsage / 1024 / 1024, 2);
            $peakMB = round($memoryPeak / 1024 / 1024, 2);
            $limitMB = round($memoryLimit / 1024 / 1024, 2);
            
            $usagePercent = $memoryLimit > 0 ? round(($memoryUsage / $memoryLimit) * 100, 2) : 0;
            
            $status = 'healthy';
            $message = 'Memory usage is normal';
            
            if ($usagePercent > 90) {
                $status = 'critical';
                $message = 'Memory usage critically high';
            } elseif ($usagePercent > 80) {
                $status = 'warning';
                $message = 'Memory usage high';
            }
            
            return [
                'status' => $status,
                'message' => $message,
                'current_mb' => $usageMB,
                'peak_mb' => $peakMB,
                'limit_mb' => $limitMB,
                'usage_percent' => $usagePercent,
            ];
        } catch (Exception $e) {
            return [
                'status' => 'unknown',
                'message' => 'Memory usage check failed: ' . $e->getMessage(),
            ];
        }
    }
    
    /**
     * Check queue status
     */
    private function checkQueueStatus(): array
    {
        try {
            // Check if queue connection is working
            $queueConnection = config('queue.default');
            
            if ($queueConnection === 'sync') {
                return [
                    'status' => 'warning',
                    'message' => 'Queue is using sync driver (not recommended for production)',
                    'connection' => $queueConnection,
                ];
            }
            
            // For database queue, check failed jobs
            if ($queueConnection === 'database') {
                $failedJobs = DB::table('failed_jobs')->count();
                
                $status = 'healthy';
                $message = 'Queue is working normally';
                
                if ($failedJobs > 100) {
                    $status = 'warning';
                    $message = 'High number of failed jobs detected';
                }
                
                return [
                    'status' => $status,
                    'message' => $message,
                    'connection' => $queueConnection,
                    'failed_jobs' => $failedJobs,
                ];
            }
            
            return [
                'status' => 'healthy',
                'message' => 'Queue configuration appears valid',
                'connection' => $queueConnection,
            ];
        } catch (Exception $e) {
            return [
                'status' => 'unhealthy',
                'message' => 'Queue status check failed: ' . $e->getMessage(),
            ];
        }
    }
    
    /**
     * Check cache connectivity
     */
    private function checkCache(): array
    {
        try {
            $startTime = microtime(true);
            $testKey = 'health_check_' . uniqid();
            $testValue = 'test_value_' . time();
            
            // Test cache write
            Cache::put($testKey, $testValue, 60);
            
            // Test cache read
            $retrievedValue = Cache::get($testKey);
            
            // Clean up
            Cache::forget($testKey);
            
            $responseTime = round((microtime(true) - $startTime) * 1000, 2);
            
            if ($retrievedValue === $testValue) {
                return [
                    'status' => 'healthy',
                    'message' => 'Cache is working properly',
                    'driver' => config('cache.default'),
                    'response_time_ms' => $responseTime,
                ];
            } else {
                return [
                    'status' => 'unhealthy',
                    'message' => 'Cache read/write test failed',
                    'driver' => config('cache.default'),
                ];
            }
        } catch (Exception $e) {
            return [
                'status' => 'unhealthy',
                'message' => 'Cache connectivity check failed: ' . $e->getMessage(),
                'driver' => config('cache.default'),
            ];
        }
    }
    
    /**
     * Determine overall health status
     */
    private function determineOverallStatus(array $checks): string
    {
        $criticalCount = 0;
        $unhealthyCount = 0;
        $warningCount = 0;
        
        foreach ($checks as $check) {
            switch ($check['status']) {
                case 'critical':
                    $criticalCount++;
                    break;
                case 'unhealthy':
                    $unhealthyCount++;
                    break;
                case 'warning':
                    $warningCount++;
                    break;
            }
        }
        
        if ($criticalCount > 0 || $unhealthyCount > 2) {
            return 'unhealthy';
        } elseif ($unhealthyCount > 0 || $warningCount > 2) {
            return 'degraded';
        } else {
            return 'healthy';
        }
    }
    
    /**
     * Log health check results
     */
    private function logHealthCheck(array $healthStatus): void
    {
        $logLevel = match ($healthStatus['overall_status']) {
            'unhealthy' => 'error',
            'degraded' => 'warning',
            default => 'info',
        };
        
        Log::channel('email_api')->log($logLevel, 'Health Check Completed', [
            'overall_status' => $healthStatus['overall_status'],
            'response_time_ms' => $healthStatus['response_time_ms'],
            'checks_summary' => $this->summarizeChecks($healthStatus['checks']),
        ]);
    }
    
    /**
     * Summarize check results
     */
    private function summarizeChecks(array $checks): array
    {
        $summary = [];
        foreach ($checks as $checkName => $checkResult) {
            $summary[$checkName] = $checkResult['status'];
        }
        return $summary;
    }
    
    /**
     * Parse memory limit string to bytes
     */
    private function parseMemoryLimit(string $memoryLimit): int
    {
        if ($memoryLimit === '-1') {
            return PHP_INT_MAX;
        }
        
        $unit = strtolower(substr($memoryLimit, -1));
        $value = (int) substr($memoryLimit, 0, -1);
        
        return match ($unit) {
            'g' => $value * 1024 * 1024 * 1024,
            'm' => $value * 1024 * 1024,
            'k' => $value * 1024,
            default => (int) $memoryLimit,
        };
    }
    
    /**
     * Get API usage statistics
     */
    public function getUsageStatistics(int $days = 7): array
    {
        try {
            $startDate = now()->subDays($days)->startOfDay();
            
            // This would require a proper logging/metrics system
            // For now, return basic structure
            return [
                'period' => [
                    'start' => $startDate->toISOString(),
                    'end' => now()->toISOString(),
                    'days' => $days,
                ],
                'requests' => [
                    'total' => 0,
                    'successful' => 0,
                    'failed' => 0,
                    'rate_limited' => 0,
                ],
                'emails' => [
                    'sent' => 0,
                    'failed' => 0,
                    'queued' => 0,
                ],
                'performance' => [
                    'avg_response_time_ms' => 0,
                    'max_response_time_ms' => 0,
                    'min_response_time_ms' => 0,
                ],
                'note' => 'Detailed statistics require log analysis implementation'
            ];
        } catch (Exception $e) {
            Log::channel('email_api')->error('Failed to get usage statistics', [
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }
}