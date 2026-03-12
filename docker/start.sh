#!/bin/bash
set -e

cd /var/www

# Write .env from Render environment variables
cat > .env << EOF
APP_NAME="${APP_NAME:-Viofel}"
APP_ENV="${APP_ENV:-production}"
APP_KEY="${APP_KEY}"
APP_DEBUG=true
APP_URL="${APP_URL:-http://localhost}"

LOG_CHANNEL=stderr
LOG_LEVEL=debug

DB_CONNECTION="${DB_CONNECTION:-pgsql}"
DB_HOST="${DB_HOST}"
DB_PORT="${DB_PORT:-5432}"
DB_DATABASE="${DB_DATABASE}"
DB_USERNAME="${DB_USERNAME}"
DB_PASSWORD="${DB_PASSWORD}"

BROADCAST_DRIVER=log
CACHE_DRIVER="${CACHE_DRIVER:-array}"
FILESYSTEM_DISK=local
QUEUE_CONNECTION="${QUEUE_CONNECTION:-sync}"
SESSION_DRIVER="${SESSION_DRIVER:-cookie}"
SESSION_LIFETIME=120
EOF

# Run database migrations
php artisan migrate --force

# Create storage symlink
php artisan storage:link || true

# Start services
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
