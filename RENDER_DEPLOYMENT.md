# Render Backend Deployment - Root Directory

## ✅ Yes, you can deploy from the root directory!

The backend is **already configured** to deploy from the root directory. Here's what you need to know:

## 📁 Project Structure

```
kenya-map/ (root directory)
├── backend/          # Django settings
├── core/             # Core app
├── funds/            # Funds app
├── officials/        # Officials app
├── citizens/         # Citizens app
├── frontend/         # Frontend (separate deployment)
├── manage.py         # Django management (in root)
├── requirements.txt  # Dependencies (in root)
├── Procfile          # Render config (in root)
└── render.yaml       # Alternative config (in root)
```

## 🚀 Render Configuration

### Root Directory Setting
- **Root Directory**: Leave **EMPTY** or set to `/` (root)
- All commands run from the repository root
- All paths are relative to root

### Build Command (runs from root)
```bash
pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate --no-input
```

This works because:
- ✅ `requirements.txt` is in root
- ✅ `manage.py` is in root
- ✅ All Django apps are in root

### Start Command (runs from root)
```bash
gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
```

This works because:
- ✅ `backend.wsgi` module is found from root
- ✅ Python path includes root directory

## 📝 Render Setup Steps

1. **Create Web Service**
   - Repository: `https://github.com/natnaelesk/kenya-map.git`
   - **Root Directory**: Leave **EMPTY** ✅
   - Environment: Python 3

2. **Build Command**:
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate --no-input
   ```

3. **Start Command**:
   ```bash
   gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
   ```

4. **Environment Variables**:
   - `DJANGO_SECRET_KEY` - Generate a secret key
   - `DJANGO_DEBUG=False`
   - `DJANGO_ALLOWED_HOSTS=your-backend.onrender.com`
   - `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`
   - `DATABASE_URL` - Auto-provided when you link PostgreSQL

## ✅ Why Root Directory Works

- `manage.py` is in root → Django commands work
- `requirements.txt` is in root → pip can find it
- `backend/` is a Python package in root → `backend.wsgi` is importable
- All Django apps (`core/`, `funds/`, etc.) are in root → Django finds them

## 🔍 Verification

After deployment, verify:
- ✅ Build completes successfully
- ✅ Migrations run
- ✅ Static files collected
- ✅ Server starts on port $PORT
- ✅ API accessible at `/api/`

## 📚 Alternative: Using render.yaml

If you prefer, you can use the `render.yaml` Blueprint:
- Render will auto-detect it
- All paths are already configured for root directory
- Just connect the repo and deploy!

---

**Summary**: Leave Root Directory **EMPTY** in Render settings. Everything is configured to work from the repository root! ✅

