# Environment Variables Template

## 🚀 Production URLs
- **Frontend**: https://kenya-map.vercel.app/
- **Backend**: https://kenya-map.onrender.com

## Backend (Render) Environment Variables

Copy these to your Render Web Service → Environment tab:

```bash
DJANGO_SECRET_KEY=your-secret-key-here-generate-with-django
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=kenya-map.onrender.com
CORS_ALLOWED_ORIGINS=https://kenya-map.vercel.app,https://kenya-map-git-main.vercel.app
DATABASE_URL=<auto-provided-by-render-when-you-link-database>
```

**To generate DJANGO_SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Frontend (Vercel) Environment Variables

Set these in Vercel Project Settings → Environment Variables:

```bash
VITE_API_URL=https://kenya-map.onrender.com/api
```

**Important:** 
- Set for all environments: Production, Preview, and Development
- The backend URL must include `/api` at the end

