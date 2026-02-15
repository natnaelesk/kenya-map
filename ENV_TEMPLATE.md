# Environment Variables Template

## Backend (Render) Environment Variables

Copy these to your Render Web Service → Environment tab:

```bash
DJANGO_SECRET_KEY=your-secret-key-here-generate-with-django
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-backend-name.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-name.vercel.app,https://your-frontend-name-git-main.vercel.app
DATABASE_URL=<auto-provided-by-render-when-you-link-database>
```

**To generate DJANGO_SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Frontend (Vercel) Environment Variables

Set these in Vercel Project Settings → Environment Variables:

```bash
VITE_API_URL=https://your-backend-name.onrender.com/api
```

**Important:** 
- Replace `your-backend-name.onrender.com` with your actual Render backend URL
- Replace `your-frontend-name.vercel.app` with your actual Vercel frontend URL
- Set for all environments: Production, Preview, and Development

