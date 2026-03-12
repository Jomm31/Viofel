#!/bin/bash
set -e

cd /var/www

# Create .env from environment variables if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate app key if not set
php artisan key:generate --force

# Run database migrations
php artisan migrate --force

# Cache config and routes for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink
php artisan storage:link || true

# Start services
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
