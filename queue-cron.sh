#!/bin/bash

# Laravel Queue Cron Job Script
# Script ini akan memproses queue setiap menit sebagai backup jika supervisor tidak berjalan

# Path ke project Laravel (ganti dengan path yang sesuai)
PROJECT_PATH="/path/to/your/project"

# Masuk ke direktori project
cd $PROJECT_PATH

# Jalankan queue worker sekali
php artisan queue:work --once --timeout=60 >> storage/logs/queue-cron.log 2>&1

# Untuk menggunakan script ini:
# 1. Ganti /path/to/your/project dengan path absolut ke project Laravel
# 2. Buat file ini executable: chmod +x queue-cron.sh
# 3. Tambahkan ke crontab: crontab -e
# 4. Tambahkan baris berikut:
#    * * * * * /path/to/your/project/queue-cron.sh
# 5. Atau gunakan Laravel scheduler dengan menambahkan ke crontab:
#    * * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1