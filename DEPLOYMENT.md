# Render Deployment Guide

This backend is now ready to deploy on Render.

## Quick Deploy Steps

### Option 1: Using Render Dashboard (Recommended)

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository** (https://github.com/mmigithubacc/county.git)
3. **Configure the service:**
   - **Name**: county-backend (or your preferred name)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate --no-input`
   - **Start Command**: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`
   - **Root Directory**: Leave empty (or set to root if needed)

4. **Add a PostgreSQL Database:**
   - Create a new PostgreSQL database on Render
   - Render will automatically provide the `DATABASE_URL` environment variable

5. **Set Environment Variables:**
   - `DJANGO_SECRET_KEY`: Generate a secure secret key (you can use: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
   - `DJANGO_DEBUG`: Set to `False` for production
   - `DJANGO_ALLOWED_HOSTS`: Set to your Render service URL (e.g., `county-backend.onrender.com`)
   - `CORS_ALLOWED_ORIGINS`: Set to your frontend URL(s) (comma-separated, e.g., `https://your-frontend.vercel.app`)

### Option 2: Using render.yaml

If you prefer using the `render.yaml` file:

1. Push the repository to GitHub
2. In Render Dashboard, select "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect and use the `render.yaml` configuration

## Required Environment Variables

- `DJANGO_SECRET_KEY`: Django secret key (required)
- `DJANGO_DEBUG`: Set to `False` for production
- `DJANGO_ALLOWED_HOSTS`: Your Render service hostname
- `CORS_ALLOWED_ORIGINS`: Frontend URL(s) that should access the API
- `DATABASE_URL`: Automatically provided by Render when you add a PostgreSQL database

## Files Added/Modified for Render

- ✅ `Procfile`: Defines the web process
- ✅ `render.yaml`: Alternative configuration file
- ✅ `build.sh`: Build script (optional)
- ✅ `requirements.txt`: Added `gunicorn`, `whitenoise`, and `dj-database-url`
- ✅ `backend/settings.py`: Updated for production (static files, database, CORS)

## Testing Locally

Before deploying, test the production setup locally:

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DJANGO_SECRET_KEY="your-secret-key"
export DJANGO_DEBUG="False"
export DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1"

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# Run with gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

## Notes

- The backend will automatically use PostgreSQL when `DATABASE_URL` is set (provided by Render)
- Static files are served using WhiteNoise
- CORS is configured to allow your frontend domain(s)
- Make sure to run migrations after the first deployment

