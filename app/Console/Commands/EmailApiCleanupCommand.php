<?php

namespace App\Console\Commands;

use App\Jobs\EmailApiCleanupJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EmailApiCleanupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email-api:cleanup 
                            {--queue : Run cleanup as a queued job}
                            {--force : Force cleanup without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old Email API logs and statistics';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (!$this->option('force')) {
            if (!$this->confirm('This will clean up old Email API logs and statistics. Continue?')) {
                $this->info('Cleanup cancelled.');
                return 0;
            }
        }
        
        try {
            if ($this->option('queue')) {
                $this->runAsQueuedJob();
            } else {
                $this->runDirectly();
            }
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error('Cleanup failed: ' . $e->getMessage());
            
            Log::channel('email_api')->error('Cleanup command failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return 1;
        }
    }

    /**
     * Run cleanup as a queued job
     */
    private function runAsQueuedJob(): void
    {
        $this->info('Dispatching cleanup job to queue...');
        
        EmailApiCleanupJob::dispatch();
        
        $this->info('✅ Cleanup job has been queued successfully.');
        $this->line('You can monitor the job progress in your queue worker logs.');
        
        Log::channel('email_api')->info('Email API cleanup job dispatched via command');
    }

    /**
     * Run cleanup directly (synchronously)
     */
    private function runDirectly(): void
    {
        $this->info('Running cleanup directly...');
        
        $job = new EmailApiCleanupJob();
        $job->handle();
        
        $this->info('✅ Cleanup completed successfully.');
        
        Log::channel('email_api')->info('Email API cleanup completed via direct command');
    }
}