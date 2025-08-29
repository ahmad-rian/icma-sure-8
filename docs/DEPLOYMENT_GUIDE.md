# Email API Service - Deployment Guide

## Overview

Panduan ini menjelaskan langkah-langkah untuk deploy Email API Service ke environment production yang memiliki akses port email terbuka.

## Prerequisites

### Server Requirements

- **PHP**: 8.1 atau lebih tinggi
- **Laravel**: 11.x atau 12.x
- **Web Server**: Nginx atau Apache
- **Database**: MySQL 8.0+ atau PostgreSQL 13+
- **SSL Certificate**: Untuk HTTPS
- **Email Server Access**: Port 587 (SMTP) atau 465 (SMTPS) terbuka

### Network Requirements

- **Outbound SMTP**: Port 587/465 untuk koneksi ke email provider
- **Inbound HTTP/HTTPS**: Port 80/443 untuk menerima API requests
- **Firewall**: Konfigurasi yang memungkinkan traffic email

## Step 1: Server Setup

### 1.1 Install Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install PHP and extensions
sudo apt install php8.1-fpm php8.1-mysql php8.1-xml php8.1-curl php8.1-mbstring php8.1-zip php8.1-gd php8.1-intl

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install nginx

# Install MySQL
sudo apt install mysql-server
```

### 1.2 Configure Nginx

Buat file konfigurasi Nginx:

```nginx
# /etc/nginx/sites-available/email-api.sinarilmu.id
server {
    listen 80;
    server_name email-api.sinarilmu.id;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name email-api.sinarilmu.id;
    root /var/www/email-api/public;
    index index.php;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/email-api.sinarilmu.id.crt;
    ssl_certificate_key /etc/ssl/private/email-api.sinarilmu.id.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Logging
    access_log /var/log/nginx/email-api.access.log;
    error_log /var/log/nginx/email-api.error.log;
}
```

Aktifkan site:

```bash
sudo ln -s /etc/nginx/sites-available/email-api.sinarilmu.id /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 2: Application Deployment

### 2.1 Clone dan Setup Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-org/email-api.git
sudo chown -R www-data:www-data email-api
cd email-api

# Install dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 2.2 Environment Configuration

Buat file `.env` untuk production:

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Konfigurasi `.env`:

```env
# Application
APP_NAME="Email API Service"
APP_ENV=production
APP_KEY=base64:your-generated-key-here
APP_DEBUG=false
APP_URL=https://email-api.sinarilmu.id

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=email_api
DB_USERNAME=email_api_user
DB_PASSWORD=secure_password_here

# Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@sinarilmu.id
MAIL_FROM_NAME="Sinar Ilmu Conference"

# Queue (recommended for production)
QUEUE_CONNECTION=database

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Logging
LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=info

# API Configuration
EMAIL_API_KEY=your-super-secure-api-key-here
EMAIL_API_RATE_LIMIT=100
EMAIL_API_ALLOWED_DOMAINS="sinarilmu.id,localhost"
EMAIL_API_MAX_RECIPIENTS=50
EMAIL_API_MAX_ATTACHMENT_SIZE=10240
```

### 2.3 Database Setup

```bash
# Create database
mysql -u root -p
```

```sql
CREATE DATABASE email_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'email_api_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON email_api.* TO 'email_api_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Run migrations
php artisan migrate --force

# Create queue jobs table
php artisan queue:table
php artisan migrate --force
```

### 2.4 Queue Worker Setup

Buat systemd service untuk queue worker:

```bash
# /etc/systemd/system/email-api-worker.service
[Unit]
Description=Email API Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
Restart=always
RestartSec=5s
ExecStart=/usr/bin/php /var/www/email-api/artisan queue:work --sleep=3 --tries=3 --max-time=3600
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# Enable dan start service
sudo systemctl enable email-api-worker
sudo systemctl start email-api-worker
sudo systemctl status email-api-worker
```

## Step 3: SSL Certificate Setup

### 3.1 Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d email-api.sinarilmu.id

# Test auto-renewal
sudo certbot renew --dry-run
```

### 3.2 Using Custom Certificate

```bash
# Copy certificate files
sudo cp your-certificate.crt /etc/ssl/certs/email-api.sinarilmu.id.crt
sudo cp your-private-key.key /etc/ssl/private/email-api.sinarilmu.id.key

# Set permissions
sudo chmod 644 /etc/ssl/certs/email-api.sinarilmu.id.crt
sudo chmod 600 /etc/ssl/private/email-api.sinarilmu.id.key
```

## Step 4: Security Configuration

### 4.1 Firewall Setup

```bash
# Install UFW
sudo apt install ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow out 587  # SMTP
sudo ufw allow out 465  # SMTPS
sudo ufw enable
```

### 4.2 Fail2Ban Setup

```bash
# Install Fail2Ban
sudo apt install fail2ban

# Create jail configuration
sudo tee /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/email-api.error.log
maxretry = 3

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/email-api.error.log
maxretry = 10
EOF

# Restart Fail2Ban
sudo systemctl restart fail2ban
```

## Step 5: Monitoring Setup

### 5.1 Log Rotation

```bash
# /etc/logrotate.d/email-api
/var/www/email-api/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        /bin/systemctl reload php8.1-fpm
    endscript
}
```

### 5.2 Health Check Script

```bash
#!/bin/bash
# /usr/local/bin/email-api-health-check.sh

API_URL="https://email-api.sinarilmu.id/api/email/status"
API_KEY="your-api-key-here"
LOG_FILE="/var/log/email-api-health.log"

response=$(curl -s -w "%{http_code}" -H "X-API-Key: $API_KEY" "$API_URL")
http_code=${response: -3}

if [ "$http_code" -eq 200 ]; then
    echo "$(date): API is healthy" >> "$LOG_FILE"
else
    echo "$(date): API health check failed with code $http_code" >> "$LOG_FILE"
    # Send alert (email, Slack, etc.)
fi
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/email-api-health-check.sh

# Add to crontab
echo "*/5 * * * * /usr/local/bin/email-api-health-check.sh" | sudo crontab -
```

## Step 6: Integration dengan Aplikasi Sinarilmu.id

### 6.1 Install HTTP Client di Aplikasi Utama

```bash
# Di aplikasi sinarilmu.id
composer require guzzlehttp/guzzle
```

### 6.2 Buat Service Class untuk Email API

```php
<?php
// app/Services/EmailApiService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class EmailApiService
{
    private string $baseUrl;
    private string $apiKey;
    private int $timeout;
    private int $maxRetries;

    public function __construct()
    {
        $this->baseUrl = config('services.email_api.base_url');
        $this->apiKey = config('services.email_api.key');
        $this->timeout = config('services.email_api.timeout', 30);
        $this->maxRetries = config('services.email_api.max_retries', 3);
    }

    public function sendEmail(array $emailData): array
    {
        $attempt = 0;
        
        while ($attempt < $this->maxRetries) {
            try {
                $response = Http::timeout($this->timeout)
                    ->withHeaders([
                        'X-API-Key' => $this->apiKey,
                        'Content-Type' => 'application/json'
                    ])
                    ->post($this->baseUrl . '/send', $emailData);

                $data = $response->json();

                if ($response->successful() && $data['success']) {
                    Log::info('Email sent successfully via API', [
                        'message_id' => $data['data']['message_id'] ?? null,
                        'recipients' => $emailData['to'] ?? []
                    ]);
                    
                    return $data;
                }

                // Don't retry client errors (4xx)
                if ($response->clientError()) {
                    throw new Exception($data['message'] ?? 'Client error occurred');
                }

            } catch (Exception $e) {
                Log::error('Email API request failed', [
                    'attempt' => $attempt + 1,
                    'error' => $e->getMessage(),
                    'email_data' => $emailData
                ]);

                if ($attempt === $this->maxRetries - 1) {
                    throw $e;
                }
            }

            $attempt++;
            sleep(pow(2, $attempt)); // Exponential backoff
        }

        throw new Exception('Failed to send email after ' . $this->maxRetries . ' attempts');
    }

    public function getStatus(): array
    {
        $response = Http::timeout($this->timeout)
            ->withHeaders(['X-API-Key' => $this->apiKey])
            ->get($this->baseUrl . '/status');

        return $response->json();
    }

    public function testConnection(): array
    {
        $response = Http::timeout($this->timeout)
            ->withHeaders(['X-API-Key' => $this->apiKey])
            ->get($this->baseUrl . '/test-connection');

        return $response->json();
    }
}
```

### 6.3 Konfigurasi di config/services.php

```php
// config/services.php

'email_api' => [
    'base_url' => env('EMAIL_API_BASE_URL', 'https://email-api.sinarilmu.id/api/email'),
    'key' => env('EMAIL_API_KEY'),
    'timeout' => env('EMAIL_API_TIMEOUT', 30),
    'max_retries' => env('EMAIL_API_MAX_RETRIES', 3),
],
```

### 6.4 Environment Variables di Aplikasi Utama

```env
# .env di aplikasi sinarilmu.id
EMAIL_API_BASE_URL=https://email-api.sinarilmu.id/api/email
EMAIL_API_KEY=your-api-key-here
EMAIL_API_TIMEOUT=30
EMAIL_API_MAX_RETRIES=3
```

### 6.5 Contoh Penggunaan

```php
<?php

use App\Services\EmailApiService;

// Di controller atau service class
public function sendNotificationEmail($user, $subject, $content)
{
    $emailService = new EmailApiService();
    
    try {
        $result = $emailService->sendEmail([
            'to' => [$user->email],
            'subject' => $subject,
            'body' => $content,
            'body_type' => 'html',
            'from_name' => 'Sinar Ilmu Conference',
            'metadata' => [
                'user_id' => $user->id,
                'notification_type' => 'submission_status'
            ]
        ]);
        
        return $result;
        
    } catch (Exception $e) {
        Log::error('Failed to send notification email', [
            'user_id' => $user->id,
            'error' => $e->getMessage()
        ]);
        
        throw $e;
    }
}
```

## Step 7: Backup dan Recovery

### 7.1 Database Backup

```bash
#!/bin/bash
# /usr/local/bin/backup-email-api.sh

BACKUP_DIR="/var/backups/email-api"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="email_api"
DB_USER="email_api_user"
DB_PASS="secure_password_here"

mkdir -p "$BACKUP_DIR"

# Database backup
mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Application backup
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" -C /var/www email-api --exclude=storage/logs --exclude=node_modules

# Keep only last 7 days
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### 7.2 Automated Backup

```bash
# Add to crontab
echo "0 2 * * * /usr/local/bin/backup-email-api.sh" | sudo crontab -
```

## Step 8: Performance Optimization

### 8.1 PHP-FPM Optimization

```ini
; /etc/php/8.1/fpm/pool.d/www.conf

[www]
user = www-data
group = www-data
listen = /var/run/php/php8.1-fpm.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.process_idle_timeout = 10s
pm.max_requests = 500
```

### 8.2 Redis Setup untuk Caching

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo tee -a /etc/redis/redis.conf << EOF
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF

# Restart Redis
sudo systemctl restart redis-server
```

### 8.3 OPcache Configuration

```ini
; /etc/php/8.1/fpm/conf.d/10-opcache.ini

opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
opcache.enable_cli=1
```

## Troubleshooting

### Common Issues

1. **Port 587 Blocked**:
   ```bash
   # Test SMTP connectivity
   telnet smtp.gmail.com 587
   ```

2. **Permission Issues**:
   ```bash
   sudo chown -R www-data:www-data /var/www/email-api
   sudo chmod -R 775 storage bootstrap/cache
   ```

3. **Queue Not Processing**:
   ```bash
   # Check queue worker status
   sudo systemctl status email-api-worker
   
   # Restart queue worker
   sudo systemctl restart email-api-worker
   ```

4. **SSL Certificate Issues**:
   ```bash
   # Test SSL certificate
   openssl s_client -connect email-api.sinarilmu.id:443
   ```

### Log Locations

- **Application Logs**: `/var/www/email-api/storage/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **PHP-FPM Logs**: `/var/log/php8.1-fpm.log`
- **System Logs**: `/var/log/syslog`

## Maintenance

### Regular Tasks

1. **Update Dependencies**:
   ```bash
   composer update --no-dev
   php artisan migrate --force
   ```

2. **Clear Caches**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Monitor Disk Space**:
   ```bash
   df -h
   du -sh /var/www/email-api/storage/logs/
   ```

4. **Check SSL Certificate Expiry**:
   ```bash
   echo | openssl s_client -servername email-api.sinarilmu.id -connect email-api.sinarilmu.id:443 2>/dev/null | openssl x509 -noout -dates
   ```

## Security Checklist

- [ ] SSL certificate installed and configured
- [ ] Firewall configured to allow only necessary ports
- [ ] API key is strong and secure
- [ ] Database credentials are secure
- [ ] File permissions are correctly set
- [ ] Fail2Ban is configured and running
- [ ] Regular security updates are applied
- [ ] Backup system is working
- [ ] Monitoring is in place
- [ ] Rate limiting is configured

## Support

Untuk bantuan deployment atau troubleshooting:
- **Email**: support@sinarilmu.id
- **Documentation**: [Link to documentation]
- **Emergency Contact**: [Emergency contact info]