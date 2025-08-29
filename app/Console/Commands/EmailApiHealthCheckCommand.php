<?php

namespace App\Console\Commands;

use App\Services\EmailApiMonitoringService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EmailApiHealthCheckCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email-api:health-check 
                            {--alert : Send alerts if unhealthy}
                            {--verbose : Show detailed output}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Perform health check on Email API service';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting Email API health check...');
        
        try {
            $monitoringService = new EmailApiMonitoringService();
            $healthStatus = $monitoringService->performHealthCheck();
            
            $this->displayHealthStatus($healthStatus);
            
            // Send alerts if requested and service is unhealthy
            if ($this->option('alert') && $healthStatus['overall_status'] === 'unhealthy') {
                $this->sendHealthAlert($healthStatus);
            }
            
            // Log the health check result
            Log::channel('email_api')->info('Health check completed', [
                'status' => $healthStatus['overall_status'],
                'checks' => array_keys($healthStatus['checks']),
                'command_run' => true
            ]);
            
            return $healthStatus['overall_status'] === 'unhealthy' ? 1 : 0;
            
        } catch (\Exception $e) {
            $this->error('Health check failed: ' . $e->getMessage());
            
            Log::channel('email_api')->error('Health check command failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return 1;
        }
    }

    /**
     * Display health status in console
     */
    private function displayHealthStatus(array $healthStatus): void
    {
        $status = $healthStatus['overall_status'];
        
        // Display overall status with color
        match ($status) {
            'healthy' => $this->info("✅ Overall Status: HEALTHY"),
            'degraded' => $this->warn("⚠️  Overall Status: DEGRADED"),
            'unhealthy' => $this->error("❌ Overall Status: UNHEALTHY"),
            default => $this->line("❓ Overall Status: UNKNOWN")
        };
        
        $this->newLine();
        
        // Display individual checks
        $this->info('Individual Health Checks:');
        $this->line('─────────────────────────');
        
        foreach ($healthStatus['checks'] as $checkName => $checkResult) {
            $icon = $checkResult['status'] === 'pass' ? '✅' : '❌';
            $statusText = strtoupper($checkResult['status']);
            
            $this->line("{$icon} {$checkName}: {$statusText}");
            
            if ($this->option('verbose') && isset($checkResult['details'])) {
                foreach ($checkResult['details'] as $key => $value) {
                    $this->line("   └─ {$key}: {$value}");
                }
            }
            
            if ($checkResult['status'] === 'fail' && isset($checkResult['error'])) {
                $this->line("   └─ Error: {$checkResult['error']}");
            }
        }
        
        $this->newLine();
        
        // Display timestamp
        $this->line("Checked at: {$healthStatus['timestamp']}");
    }

    /**
     * Send health alert (placeholder for actual alert implementation)
     */
    private function sendHealthAlert(array $healthStatus): void
    {
        $this->warn('🚨 Sending health alert...');
        
        // Log the alert
        Log::channel('email_api_security')->warning('Email API health alert triggered', [
            'status' => $healthStatus['overall_status'],
            'failed_checks' => array_filter($healthStatus['checks'], fn($check) => $check['status'] === 'fail'),
            'timestamp' => $healthStatus['timestamp']
        ]);
        
        // Here you would implement actual alerting:
        // - Send email to administrators
        // - Send Slack notification
        // - Trigger monitoring system webhook
        // - etc.
        
        $this->info('Health alert sent to administrators.');
    }
}