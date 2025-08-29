<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class EmailApiCleanupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     *
     * @var int
     */
    public $timeout = 300;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $this->cleanupOldLogs();
            $this->cleanupOldStatistics();
            $this->optimizeDatabase();
            
            Log::channel('email_api')->info('Email API cleanup job completed successfully');
        } catch (\Exception $e) {
            Log::channel('email_api')->error('Email API cleanup job failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }

    /**
     * Clean up old log entries
     */
    private function cleanupOldLogs(): void
    {
        $cutoffDate = Carbon::now()->subDays(30);
        
        // Clean up old email API logs (if stored in database)
        // This is a placeholder - adjust based on your actual log storage
        $deletedCount = DB::table('email_api_logs')
            ->where('created_at', '<', $cutoffDate)
            ->delete();
            
        Log::channel('email_api')->info('Cleaned up old logs', [
            'deleted_count' => $deletedCount,
            'cutoff_date' => $cutoffDate->toDateTimeString()
        ]);
    }

    /**
     * Clean up old statistics data
     */
    private function cleanupOldStatistics(): void
    {
        $cutoffDate = Carbon::now()->subDays(90);
        
        // Clean up old statistics (if stored in database)
        // This is a placeholder - adjust based on your actual statistics storage
        $deletedCount = DB::table('email_api_statistics')
            ->where('created_at', '<', $cutoffDate)
            ->delete();
            
        Log::channel('email_api')->info('Cleaned up old statistics', [
            'deleted_count' => $deletedCount,
            'cutoff_date' => $cutoffDate->toDateTimeString()
        ]);
    }

    /**
     * Optimize database tables
     */
    private function optimizeDatabase(): void
    {
        // Optimize email-related tables
        $tables = ['email_api_logs', 'email_api_statistics', 'failed_jobs'];
        
        foreach ($tables as $table) {
            try {
                DB::statement("OPTIMIZE TABLE {$table}");
                Log::channel('email_api')->debug("Optimized table: {$table}");
            } catch (\Exception $e) {
                Log::channel('email_api')->warning("Failed to optimize table: {$table}", [
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::channel('email_api')->error('Email API cleanup job failed permanently', [
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
}