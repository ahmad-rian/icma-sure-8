<?php

namespace App\Console\Commands;

use App\Jobs\SendEmailNotificationJob;
use App\Models\EmailNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessEmailNotifications extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'email:process-notifications {--limit=50 : Maximum number of notifications to process}';

    /**
     * The console command description.
     */
    protected $description = 'Process pending email notifications and dispatch them to queue';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $limit = (int) $this->option('limit');
        
        $this->info("Processing up to {$limit} pending email notifications...");

        // Get pending email notifications
        $notifications = EmailNotification::pending()
            ->orderBy('created_at', 'asc')
            ->limit($limit)
            ->get();

        if ($notifications->isEmpty()) {
            $this->info('No pending email notifications found.');
            return self::SUCCESS;
        }

        $processed = 0;
        $failed = 0;

        foreach ($notifications as $notification) {
            try {
                // Dispatch job to queue
                SendEmailNotificationJob::dispatch($notification);
                $processed++;
                
                $this->line("✓ Queued notification {$notification->id} for {$notification->recipient_email}");
                
            } catch (\Exception $e) {
                $failed++;
                $this->error("✗ Failed to queue notification {$notification->id}: {$e->getMessage()}");
                
                Log::error('Failed to queue email notification', [
                    'notification_id' => $notification->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->newLine();
        $this->info("Processing completed:");
        $this->info("- Queued: {$processed}");
        $this->info("- Failed: {$failed}");
        $this->info("- Total: {$notifications->count()}");

        if ($failed > 0) {
            $this->warn("Some notifications failed to queue. Check logs for details.");
            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}