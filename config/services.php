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
    | Email API Service Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the Email API service including API keys for
    | authentication and other service-specific settings.
    |
    */

    'email_api' => [
        'api_keys' => [
            env('EMAIL_API_KEY_1'),
            env('EMAIL_API_KEY_2'),
            env('EMAIL_API_KEY_3'),
        ],
        'rate_limit' => [
            'max_attempts' => env('EMAIL_API_RATE_LIMIT', 100),
            'decay_minutes' => env('EMAIL_API_RATE_DECAY', 60),
        ],
        'allowed_domains' => explode(',', env('EMAIL_API_ALLOWED_DOMAINS', '')),
        'max_recipients' => env('EMAIL_API_MAX_RECIPIENTS', 50),
        'max_attachment_size' => env('EMAIL_API_MAX_ATTACHMENT_SIZE', 10485760), // 10MB
    ],

];
