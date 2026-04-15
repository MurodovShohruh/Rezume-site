import os
os.environ.setdefault('SECRET_KEY', 'test-secret-key-for-testing')
os.environ.setdefault('DEBUG', 'True')
os.environ.setdefault('ALLOWED_HOSTS', 'localhost,127.0.0.1')
os.environ.setdefault('DB_NAME', 'test_db')
os.environ.setdefault('DB_USER', 'postgres')
os.environ.setdefault('DB_PASSWORD', 'postgres')
os.environ.setdefault('DB_HOST', 'localhost')
os.environ.setdefault('REDIS_URL', 'redis://localhost:6379/0')
os.environ.setdefault('ANTHROPIC_API_KEY', 'fake-test-key')
os.environ.setdefault('JWT_ACCESS_TOKEN_LIFETIME', '15')
os.environ.setdefault('JWT_REFRESH_TOKEN_LIFETIME', '7')
os.environ.setdefault('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')
os.environ.setdefault('FRONTEND_URL', 'http://localhost:3000')
os.environ.setdefault('EMAIL_HOST_USER', 'test@test.com')
os.environ.setdefault('EMAIL_HOST_PASSWORD', 'testpass')
os.environ.setdefault('AWS_ACCESS_KEY_ID', '')
os.environ.setdefault('AWS_SECRET_ACCESS_KEY', '')
os.environ.setdefault('AWS_STORAGE_BUCKET_NAME', '')

from config.settings import *

# Override database to use SQLite for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Disable Sentry for tests
SENTRY_DSN = ''

# Use console email backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
