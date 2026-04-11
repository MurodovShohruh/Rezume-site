#!/bin/sh
set -e

echo "Ma'lumotlar bazasini kutmoqda..."
while ! python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.db import connection
connection.ensure_connection()
" 2>/dev/null; do
  echo "  PostgreSQL tayyor emas, 2 soniya kutilmoqda..."
  sleep 2
done
echo "PostgreSQL tayyor!"

echo "Migratsiyalar qo'llanilmoqda..."
python manage.py migrate --no-input

echo "Static fayllar yig'ilmoqda..."
python manage.py collectstatic --no-input --clear 2>/dev/null || true

echo "Server ishga tushirilmoqda..."
exec "$@"
