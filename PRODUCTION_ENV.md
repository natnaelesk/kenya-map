# Production Environment Variables

## 🔧 Fix "Disallowed Host" Error

Your backend needs these environment variables set in **Render**:

## Render (Backend) Environment Variables

Go to: Render Dashboard → Your Web Service → Environment tab

Add/Update these variables:

```
DJANGO_SECRET_KEY=<your-generated-secret-key>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=kenya-map.onrender.com
CORS_ALLOWED_ORIGINS=https://kenya-map.vercel.app,https://kenya-map-git-main.vercel.app
```

**Note:** `DATABASE_URL` is automatically provided by Render when you link the PostgreSQL database.

## Vercel (Frontend) Environment Variable

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add this variable:

```
VITE_API_URL=https://kenya-map.onrender.com/api
```

**Important:** 
- Set for **all environments**: Production, Preview, Development
- Make sure the URL ends with `/api`

## ✅ After Setting Variables

1. **Render**: The service will automatically redeploy when you save environment variables
2. **Vercel**: You may need to trigger a redeploy manually or it will redeploy on next push

## 🧪 Test

After redeployment:
- Frontend: https://kenya-map.vercel.app/
- Backend API: https://kenya-map.onrender.com/api/dashboard/
- Admin: https://kenya-map.onrender.com/admin/

The "Disallowed Host" error should be fixed! ✅

