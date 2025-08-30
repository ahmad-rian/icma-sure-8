<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Sinar Ilmu Email API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for connecting to Sinar Ilmu Email API service.
    | Dynamic URL based on environment for easy deployment.
    |
    */

    'sinarilmu_email_api' => [
        'url' => env('APP_ENV') === 'production'
            ? 'https://sinarilmu.id/api/email'
            : env('SINARILMU_EMAIL_API_URL', 'http://localhost:8001/api/email'),
        'key' => env('SINARILMU_EMAIL_API_KEY'),
        'timeout' => env('SINARILMU_EMAIL_API_TIMEOUT', 60),
        'retry_attempts' => env('SINARILMU_EMAIL_API_RETRY_ATTEMPTS', 3),
        'retry_delay' => env('SINARILMU_EMAIL_API_RETRY_DELAY', 5),
    ],

    /*
    |--------------------------------------------------------------------------
    | Email API Service Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the Email API service including API keys for
    | authentication and other service-specific settings.
    |
    */

    'email_api' => [
        'enabled' => env('EMAIL_API_ENABLED', true),
        'fallback_enabled' => env('EMAIL_API_FALLBACK_ENABLED', true),
        'fallback_threshold' => env('EMAIL_API_FALLBACK_THRESHOLD', 3),
        'log_requests' => env('EMAIL_API_LOG_REQUESTS', true),
        'log_responses' => env('EMAIL_API_LOG_RESPONSES', true),
        'test_on_boot' => env('EMAIL_API_TEST_ON_BOOT', false),
        'test_interval' => env('EMAIL_API_TEST_INTERVAL', 300),

        // Queue settings
        'use_queue' => env('EMAIL_API_USE_QUEUE', true),
        'queue_name' => env('EMAIL_API_QUEUE_NAME', 'emails'),
        'high_priority_queue' => env('EMAIL_API_HIGH_PRIORITY_QUEUE', 'high_priority_emails'),

        // Rate limiting
        'rate_limit' => [
            'max_attempts' => env('EMAIL_API_RATE_LIMIT', 100),
            'decay_minutes' => env('EMAIL_API_RATE_DECAY', 60),
        ],

        // Validation settings
        'allowed_domains' => array_filter(explode(',', env('EMAIL_API_ALLOWED_DOMAINS', ''))),
        'max_recipients' => env('EMAIL_API_MAX_RECIPIENTS', 50),
        'max_attachment_size' => env('EMAIL_API_MAX_ATTACHMENT_SIZE', 10485760), // 10MB
    ],

];
