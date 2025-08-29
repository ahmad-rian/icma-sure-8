# Setup Email Otomatis untuk Production

Dokumentasi ini menjelaskan cara mengatur pengiriman email otomatis di lingkungan production untuk aplikasi ICMA UNSOED.

## 1. Laravel Scheduler (Recommended)

### Setup Cron Job
Tambahkan baris berikut ke crontab server production:

```bash
# Edit crontab
crontab -e

# Tambahkan baris ini:
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
```

**Ganti `/path/to/your/project` dengan path absolut ke project Laravel Anda.**

### Verifikasi Scheduler
```bash
# Cek scheduled commands
php artisan schedule:list

# Test scheduler secara manual
php artisan schedule:run
```

## 2. Supervisor (Alternative)

### Install Supervisor
```bash
# Ubuntu/Debian
sudo apt-get install supervisor

# CentOS/RHEL
sudo yum install supervisor
```

### Konfigurasi Supervisor
1. Copy file `supervisor-laravel-worker.conf` ke `/etc/supervisor/conf.d/`
2. Edit path dan user sesuai server production
3. Reload supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

### Monitor Supervisor
```bash
# Cek status worker
sudo supervisorctl status

# Restart worker jika diperlukan
sudo supervisorctl restart laravel-worker:*
```

## 3. Cron Job Backup (Fallback)

Jika supervisor tidak tersedia, gunakan script `queue-cron.sh`:

```bash
# Buat executable
chmod +x queue-cron.sh

# Tambahkan ke crontab
* * * * * /path/to/your/project/queue-cron.sh
```

## 4. Konfigurasi Environment

Pastikan file `.env` production memiliki konfigurasi yang benar:

```env
# Queue Configuration
QUEUE_CONNECTION=database

# Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="ICMA UNSOED"
```

## 5. Monitoring dan Troubleshooting

### Log Files
- Laravel logs: `storage/logs/laravel.log`
- Queue logs: `storage/logs/queue-cron.log`
- Supervisor logs: `/path/to/project/storage/logs/worker.log`

### Useful Commands
```bash
# Cek failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush

# Monitor queue in real-time
php artisan queue:monitor
```

### Health Check
```bash
# Test email notification command
php artisan email:process-notifications

# Check queue status
php artisan queue:work --once --verbose
```

## 6. Rekomendasi Production

1. **Gunakan Laravel Scheduler** dengan cron job untuk kesederhanaan
2. **Setup monitoring** untuk memastikan email terkirim
3. **Backup dengan Supervisor** untuk high-availability
4. **Monitor log files** secara berkala
5. **Test email delivery** setelah deployment

## 7. Security Notes

- Gunakan App Password untuk Gmail, bukan password akun
- Pastikan file `.env` tidak dapat diakses publik
- Monitor failed jobs untuk mendeteksi masalah
- Setup log rotation untuk mencegah disk penuh

---

**Catatan**: Setelah setup, email invoice akan terkirim otomatis tanpa perlu menjalankan `php artisan queue:work --once` secara manual.