# Email API Service Documentation

## Overview

Email API Service adalah layanan API yang memungkinkan aplikasi sinarilmu.id untuk mengirim email melalui server yang memiliki akses port email terbuka. API ini dirancang untuk mengatasi masalah pemblokiran port 587 di lingkungan production.

## Base URL

```
https://your-email-api-domain.com/api/email
```

## Authentication

API ini menggunakan API Key authentication. API key dapat dikirim melalui:

1. **Header (Recommended)**:
   ```
   X-API-Key: your-api-key-here
   ```

2. **Query Parameter**:
   ```
   ?api_key=your-api-key-here
   ```

## Endpoints

### 1. Send Email

**Endpoint**: `POST /api/email/send`

**Description**: Mengirim email dengan berbagai opsi kustomisasi.

**Headers**:
```
Content-Type: application/json
X-API-Key: your-api-key-here
```

**Request Body**:
```json
{
  "to": [
    "recipient1@example.com",
    "recipient2@example.com"
  ],
  "cc": [
    "cc@example.com"
  ],
  "bcc": [
    "bcc@example.com"
  ],
  "subject": "Test Email Subject",
  "body": "<h1>Hello World</h1><p>This is a test email with HTML content.</p>",
  "body_type": "html",
  "from_name": "Sinar Ilmu Conference",
  "reply_to": "noreply@sinarilmu.id",
  "priority": 3,
  "tags": ["conference", "notification"],
  "metadata": {
    "user_id": "12345",
    "submission_id": "sub_67890"
  },
  "test_connection": false
}
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to` | array | Yes | Array of recipient email addresses |
| `subject` | string | Yes | Email subject line |
| `body` | string | Yes | Email body content |
| `cc` | array | No | Array of CC email addresses |
| `bcc` | array | No | Array of BCC email addresses |
| `body_type` | string | No | "html" or "text" (default: "html") |
| `from_name` | string | No | Sender name |
| `reply_to` | string | No | Reply-to email address |
| `priority` | integer | No | Email priority (1-5, where 1 is highest) |
| `tags` | array | No | Array of tags for categorization |
| `metadata` | object | No | Additional metadata |
| `test_connection` | boolean | No | Test email connection before sending |

**Success Response** (200):
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "message_id": "msg_1234567890",
    "sent_at": "2024-01-15T10:30:00.000000Z",
    "recipients": {
      "to": ["recipient1@example.com", "recipient2@example.com"],
      "cc": ["cc@example.com"],
      "bcc": ["bcc@example.com"]
    }
  }
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "message": "Validation failed",
  "error_code": "VALIDATION_ERROR",
  "errors": {
    "to": ["The to field is required."]
  }
}
```

### 2. Get Service Status

**Endpoint**: `GET /api/email/status`

**Description**: Mendapatkan status layanan email dan statistik.

**Headers**:
```
X-API-Key: your-api-key-here
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "service_status": "operational",
    "email_connection": {
      "success": true,
      "message": "Email configuration is valid",
      "details": {
        "mailer": "smtp",
        "host": "smtp.gmail.com",
        "port": 587,
        "encryption": "tls",
        "from_address": "noreply@sinarilmu.id",
        "tested_at": "2024-01-15T10:30:00.000000Z"
      }
    },
    "statistics": {
      "mail_driver": "smtp",
      "mail_host": "smtp.gmail.com",
      "mail_port": 587,
      "mail_encryption": "tls",
      "from_address": "noreply@sinarilmu.id",
      "from_name": "Sinar Ilmu Conference",
      "queue_enabled": true,
      "last_check": "2024-01-15T10:30:00.000000Z"
    },
    "server_time": "2024-01-15T10:30:00.000000Z"
  }
}
```

### 3. Test Email Connection

**Endpoint**: `GET /api/email/test-connection`

**Description**: Menguji koneksi email server.

**Headers**:
```
X-API-Key: your-api-key-here
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Email connection test successful",
  "data": {
    "success": true,
    "message": "Email configuration is valid",
    "details": {
      "mailer": "smtp",
      "host": "smtp.gmail.com",
      "port": 587,
      "encryption": "tls",
      "from_address": "noreply@sinarilmu.id",
      "tested_at": "2024-01-15T10:30:00.000000Z"
    }
  },
  "tested_at": "2024-01-15T10:30:00.000000Z"
}
```

### 4. Get API Documentation

**Endpoint**: `GET /api/email/public/docs`

**Description**: Mendapatkan informasi dasar API (tidak memerlukan autentikasi).

**Success Response** (200):
```json
{
  "service": "Email API Service",
  "version": "1.0.0",
  "description": "API service for sending emails from sinarilmu.id application",
  "endpoints": {
    "POST /api/email/send": "Send email (requires API key)",
    "GET /api/email/status": "Get service status (requires API key)",
    "GET /api/email/test-connection": "Test email connection (requires API key)",
    "GET /api/email/public/docs": "Get API documentation (public)"
  },
  "authentication": {
    "type": "API Key",
    "header": "X-API-Key",
    "query_param": "api_key (alternative)"
  },
  "documentation_url": "https://your-domain.com/api/email/public/docs",
  "support_email": "support@sinarilmu.id"
}
```

## Error Codes

| Error Code | Description |
|------------|-------------|
| `MISSING_API_KEY` | API key tidak disediakan |
| `INVALID_API_KEY` | API key tidak valid |
| `SERVICE_MISCONFIGURED` | Layanan tidak dikonfigurasi dengan benar |
| `VALIDATION_ERROR` | Error validasi input |
| `EMAIL_CONFIG_ERROR` | Error konfigurasi email |
| `EMAIL_SEND_FAILED` | Gagal mengirim email |
| `INTERNAL_SERVER_ERROR` | Error server internal |
| `STATUS_CHECK_FAILED` | Gagal mengecek status |
| `CONNECTION_TEST_FAILED` | Gagal menguji koneksi |

## Rate Limiting

API ini memiliki rate limiting untuk mencegah abuse:
- **Default**: 100 requests per jam per API key
- **Configurable**: Dapat dikonfigurasi melalui environment variables

## Best Practices

### 1. Error Handling

```php
<?php

try {
    $response = Http::withHeaders([
        'X-API-Key' => config('services.email_api.key'),
        'Content-Type' => 'application/json'
    ])->post('https://your-email-api.com/api/email/send', [
        'to' => ['user@example.com'],
        'subject' => 'Test Email',
        'body' => 'Hello World',
        'body_type' => 'html'
    ]);
    
    $data = $response->json();
    
    if ($response->successful() && $data['success']) {
        Log::info('Email sent successfully', [
            'message_id' => $data['data']['message_id']
        ]);
    } else {
        Log::error('Failed to send email', [
            'error' => $data['message'] ?? 'Unknown error',
            'error_code' => $data['error_code'] ?? null
        ]);
    }
} catch (Exception $e) {
    Log::error('Email API request failed', [
        'error' => $e->getMessage()
    ]);
}
```

### 2. Retry Logic

```php
<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;

function sendEmailWithRetry($emailData, $maxRetries = 3) {
    $attempt = 0;
    
    while ($attempt < $maxRetries) {
        try {
            $response = Http::timeout(30)
                ->withHeaders(['X-API-Key' => config('services.email_api.key')])
                ->post('https://your-email-api.com/api/email/send', $emailData);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            // If it's a client error (4xx), don't retry
            if ($response->clientError()) {
                throw new RequestException($response);
            }
            
        } catch (RequestException $e) {
            if ($e->response && $e->response->clientError()) {
                throw $e; // Don't retry client errors
            }
        }
        
        $attempt++;
        if ($attempt < $maxRetries) {
            sleep(pow(2, $attempt)); // Exponential backoff
        }
    }
    
    throw new Exception('Failed to send email after ' . $maxRetries . ' attempts');
}
```

### 3. Logging

```php
<?php

// Log semua request email untuk monitoring
Log::channel('email_api')->info('Email API request', [
    'to' => $emailData['to'],
    'subject' => $emailData['subject'],
    'timestamp' => now(),
    'user_id' => auth()->id()
]);
```

## Security Considerations

1. **API Key Management**:
   - Gunakan API key yang kuat dan unik
   - Rotasi API key secara berkala
   - Jangan commit API key ke repository

2. **Input Validation**:
   - Selalu validasi input sebelum mengirim ke API
   - Sanitasi HTML content jika diperlukan

3. **Rate Limiting**:
   - Implementasi rate limiting di sisi client
   - Monitor usage untuk mendeteksi abuse

4. **HTTPS Only**:
   - Selalu gunakan HTTPS untuk semua request
   - Validasi SSL certificate

## Monitoring dan Logging

API ini menyediakan logging komprehensif untuk monitoring:

- **Request Logging**: Semua request dicatat dengan timestamp dan IP
- **Error Logging**: Error dicatat dengan stack trace untuk debugging
- **Performance Monitoring**: Response time dan success rate
- **Security Logging**: Failed authentication attempts

## Support

Untuk bantuan teknis atau pertanyaan:
- **Email**: support@sinarilmu.id
- **Documentation**: [Link to full documentation]
- **Status Page**: [Link to status page]