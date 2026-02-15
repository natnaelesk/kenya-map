# Environment Variables - Production Values

## 🚀 Deployed URLs
- **Frontend**: https://kenya-map.vercel.app/
- **Backend**: https://kenya-map.onrender.com

## Backend (Render) - Set These Environment Variables

Go to Render Dashboard → Your Web Service → Environment tab:

```
DJANGO_SECRET_KEY=<generate-your-own-secret-key>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=kenya-map.onrender.com
CORS_ALLOWED_ORIGINS=https://kenya-map.vercel.app,https://kenya-map-git-main.vercel.app
DATABASE_URL=<auto-provided-by-render>
```

**Generate Secret Key:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Frontend (Vercel) - Set This Environment Variable

Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```
VITE_API_URL=https://kenya-map.onrender.com/api
```

**Important:**
- Set for Production, Preview, and Development environments
- The URL must end with `/api`

## 🔧 Fixing "Disallowed Host" Error

If you see "DisallowedHost" error, make sure:
1. `DJANGO_ALLOWED_HOSTS` includes `kenya-map.onrender.com`
2. No trailing slashes in the hostname
3. `DJANGO_DEBUG=False` in production
4. Redeploy after updating environment variables

