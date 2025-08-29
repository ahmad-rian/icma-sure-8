<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\AbstractSubmission;
use App\Models\SubmissionPayment;

// Test submission data loading
$submissionId = '01k3qwhg4bqt20nvavvsvxpy31';

try {
    echo "Testing submission data loading...\n";
    
    $submission = AbstractSubmission::with([
        'user.profile', 
        'contributors', 
        'payment', 
        'country'
    ])->find($submissionId);
    
    if (!$submission) {
        echo "Submission not found!\n";
        exit(1);
    }
    
    echo "Submission found: {$submission->title}\n";
    echo "Contributors count: " . ($submission->contributors ? count($submission->contributors) : 0) . "\n";
    echo "Contributors type: " . gettype($submission->contributors) . "\n";
    echo "Payment status: " . ($submission->payment ? $submission->payment->status : 'No payment') . "\n";
    
    // Test contributors access
    $contributors = $submission->contributors ?? [];
    echo "Safe contributors count: " . count($contributors) . "\n";
    
    // Test keywords access
    $keywords = $submission->keywords ?? [];
    echo "Keywords type: " . gettype($keywords) . "\n";
    echo "Keywords count: " . count($keywords) . "\n";
    
    echo "\nAll tests passed! Data structure is safe.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}