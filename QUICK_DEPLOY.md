# Quick Deployment Reference

## 🚀 Fast Track Deployment

### Backend → Render (5 minutes)

1. **Create PostgreSQL Database**
   - Render Dashboard → New → PostgreSQL
   - Name: `county-db`
   - Create

2. **Create Web Service**
   - Render Dashboard → New → Web Service
   - Connect GitHub repo: `https://github.com/mmigithubacc/county.git`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate --no-input
     ```
   - **Start Command:**
     ```bash
     gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
     ```

3. **Set Environment Variables:**
   - `DJANGO_SECRET_KEY` = Generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
   - `DJANGO_DEBUG` = `False`
   - `DJANGO_ALLOWED_HOSTS` = `your-backend-name.onrender.com`
   - `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app` (update after frontend deploy)
   - Link PostgreSQL database (auto-adds `DATABASE_URL`)

4. **Deploy** → Wait for build to complete
5. **Copy your backend URL:** `https://your-backend-name.onrender.com`

---

### Frontend → Vercel (3 minutes)

1. **Import Project**
   - Vercel Dashboard → Add New → Project
   - Import GitHub repo: `https://github.com/mmigithubacc/county.git`
   - **Root Directory:** `frontend`
   - Framework: Vite (auto-detected)

2. **Set Environment Variable:**
   - `VITE_API_URL` = `https://your-backend-name.onrender.com/api`
   - (Use the backend URL from step above)

3. **Deploy** → Wait for build to complete
4. **Copy your frontend URL:** `https://your-frontend-name.vercel.app`

---

### Connect Them (2 minutes)

1. **Update Backend CORS:**
   - Go to Render Web Service → Environment
   - Update `CORS_ALLOWED_ORIGINS`:
     ```
     https://your-frontend-name.vercel.app,https://your-frontend-name-git-main.vercel.app
     ```
   - Render will auto-redeploy

2. **Test:**
   - Visit your Vercel frontend URL
   - Check browser console for errors
   - Verify API calls work

---

## ✅ Done!

- **Frontend:** https://your-frontend-name.vercel.app
- **Backend:** https://your-backend-name.onrender.com/api
- **Admin:** https://your-backend-name.onrender.com/admin

---

## 📋 Files Ready for Deployment

✅ `Procfile` - Render web service configuration  
✅ `render.yaml` - Alternative Render Blueprint config  
✅ `requirements.txt` - Python dependencies (includes gunicorn, whitenoise)  
✅ `vercel.json` - Vercel configuration (root)  
✅ `frontend/vercel.json` - Vercel configuration (frontend)  
✅ `backend/settings.py` - Production-ready Django settings  
✅ `build.sh` - Build script for Render  

---

## 🔑 Generate Secret Key

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

