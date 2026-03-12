#!/bin/bash
set -e

cd /var/www

echo "==> Writing .env"

# Fix APP_URL - ensure it has https:// prefix
FIXED_APP_URL="${APP_URL:-http://localhost}"
if [[ "$FIXED_APP_URL" != http://* ]] && [[ "$FIXED_APP_URL" != https://* ]]; then
    FIXED_APP_URL="https://${FIXED_APP_URL}"
fi

cat > .env << EOF
APP_NAME="${APP_NAME:-Viofel}"
APP_ENV="${APP_ENV:-production}"
APP_KEY="${APP_KEY}"
APP_DEBUG=true
APP_URL="${FIXED_APP_URL}"
ASSET_URL="${FIXED_APP_URL}"

LOG_CHANNEL=stderr
LOG_LEVEL=debug

DB_CONNECTION="${DB_CONNECTION:-pgsql}"
DB_HOST="${DB_HOST}"
DB_PORT="${DB_PORT:-5432}"
DB_DATABASE="${DB_DATABASE}"
DB_USERNAME="${DB_USERNAME}"
DB_PASSWORD="${DB_PASSWORD}"

BROADCAST_DRIVER=log
CACHE_DRIVER=array
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=cookie
SESSION_LIFETIME=120

RECAPTCHA_SITE_KEY="${RECAPTCHA_SITE_KEY}"
RECAPTCHA_SECRET_KEY="${RECAPTCHA_SECRET_KEY}"

PAYMONGO_SECRET_KEY="${PAYMONGO_SECRET_KEY}"
PAYMONGO_PUBLIC_KEY="${PAYMONGO_PUBLIC_KEY}"
PAYMONGO_LIVEMODE="${PAYMONGO_LIVEMODE:-false}"
EOF

echo "==> .env written"

echo "==> Ensuring storage directories"
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "==> Clearing bootstrap cache"
rm -f bootstrap/cache/*.php

echo "==> Checking build output"
echo "public/build contents:"
ls -laR public/build/ 2>&1 || echo "NO BUILD FOLDER!"
echo "==> Checking manifest"
cat public/build/manifest.json 2>/dev/null || cat public/build/.vite/manifest.json 2>/dev/null || echo "NO MANIFEST FOUND!"

echo "==> Running migrations"
php artisan migrate --force || echo "Migration failed, continuing..."

echo "==> Storage link"
php artisan storage:link || true

echo "==> Starting supervisord"
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf