# Deployment Guide: Backend (Render) + Frontend (Vercel)

This guide will help you deploy the County Transparency Platform to production.

## 📋 Prerequisites

- GitHub account with the repository pushed
- Render account (free tier available)
- Vercel account (free tier available)

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `county-db` (or your preferred name)
   - **Database**: `county`
   - **User**: `county_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid if needed)
4. Click **"Create Database"**
5. **Note the Internal Database URL** (you'll need it)

### Step 2: Create Web Service on Render

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `https://github.com/natnaelesk/kenya-map.git`
3. Configure the service:

   **Basic Settings:**
   - **Name**: `county-backend` (or your preferred name)
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: **Leave empty** ✅ (Backend deploys from root directory)
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate --no-input
     ```
   - **Start Command**: 
     ```bash
     gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
     ```

### Step 3: Set Environment Variables

In your Render Web Service, go to **"Environment"** tab and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `DJANGO_SECRET_KEY` | Generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` | **Required** |
| `DJANGO_DEBUG` | `False` | **Required** |
| `DJANGO_ALLOWED_HOSTS` | `your-backend-name.onrender.com` | Replace with your actual Render URL |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | Will update after frontend deployment |
| `DATABASE_URL` | Auto-filled from PostgreSQL service | **Auto-configured** |

**To generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 4: Link Database

1. In your Web Service settings, go to **"Environment"** tab
2. Under **"Add Environment Variable"**, select **"Add from Database"**
3. Choose your PostgreSQL database
4. Render will automatically add `DATABASE_URL`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (usually 5-10 minutes)
4. **Note your backend URL**: `https://your-backend-name.onrender.com`

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `https://github.com/natnaelesk/kenya-map.git`
4. Configure:

   **Project Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (Frontend is in subdirectory)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 2: Set Environment Variables

In Vercel project settings, go to **"Environment Variables"** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-name.onrender.com/api` | Production, Preview, Development |

**Important:** Replace `your-backend-name.onrender.com` with your actual Render backend URL.

### Step 3: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Wait for deployment to complete (usually 2-3 minutes)
4. **Note your frontend URL**: `https://your-frontend-name.vercel.app`

---

## 🔗 Part 3: Connect Frontend and Backend

### Update Backend CORS Settings

1. Go back to your Render Web Service
2. Update the `CORS_ALLOWED_ORIGINS` environment variable:
   ```
   https://your-frontend-name.vercel.app,https://your-frontend-name-git-main.vercel.app
   ```
   (Include both the production URL and preview URLs)

3. **Redeploy** the backend service (Render will auto-redeploy when env vars change)

### Verify Connection

1. Visit your Vercel frontend URL
2. Open browser DevTools → Network tab
3. Check that API calls are going to your Render backend
4. Verify no CORS errors in console

---

## ✅ Post-Deployment Checklist

### Backend (Render)
- [ ] PostgreSQL database created and linked
- [ ] All environment variables set
- [ ] Build completes successfully
- [ ] Migrations ran successfully
- [ ] Static files collected
- [ ] Backend URL accessible
- [ ] API endpoints responding (test `/api/dashboard/`)

### Frontend (Vercel)
- [ ] Environment variable `VITE_API_URL` set
- [ ] Build completes successfully
- [ ] Frontend URL accessible
- [ ] No console errors
- [ ] API calls working

### Integration
- [ ] CORS configured correctly
- [ ] Frontend can fetch data from backend
- [ ] All pages loading correctly

---

## 🔧 Optional: Seed Sample Data

After deployment, you can seed the database with sample data:

1. In Render, go to your Web Service
2. Open **"Shell"** tab
3. Run:
   ```bash
   python manage.py seed_data
   ```

---

## 🐛 Troubleshooting

### Backend Issues

**Build fails:**
- Check that all dependencies are in `requirements.txt`
- Verify Python version compatibility
- Check build logs for specific errors

**Database connection fails:**
- Verify `DATABASE_URL` is set correctly
- Check that database is in same region as web service
- Ensure database is not paused (free tier pauses after inactivity)

**CORS errors:**
- Verify `CORS_ALLOWED_ORIGINS` includes your Vercel URL
- Check that URLs don't have trailing slashes
- Ensure `DJANGO_DEBUG=False` in production

### Frontend Issues

**Build fails:**
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel auto-detects)
- Check build logs for specific errors

**API calls fail:**
- Verify `VITE_API_URL` is set correctly
- Check that backend URL is accessible
- Verify CORS is configured on backend
- Check browser console for specific errors

**404 errors on routes:**
- Verify `vercel.json` has rewrite rules
- Check that `outputDirectory` is set to `dist`

---

## 📝 Environment Variables Summary

### Render (Backend)
```
DJANGO_SECRET_KEY=<generated-secret-key>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-backend-name.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
DATABASE_URL=<auto-provided-by-render>
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend-name.onrender.com/api
```

---

## 🎉 You're Done!

Your application should now be live:
- **Frontend**: https://your-frontend-name.vercel.app
- **Backend API**: https://your-backend-name.onrender.com/api
- **Admin Panel**: https://your-backend-name.onrender.com/admin/

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Vite Production Guide](https://vitejs.dev/guide/build.html)

---

## 🔄 Updating Your Deployment

### Backend Updates
1. Push changes to GitHub
2. Render will automatically detect and redeploy
3. Or manually trigger redeploy from Render dashboard

### Frontend Updates
1. Push changes to GitHub
2. Vercel will automatically detect and redeploy
3. Preview deployments are created for each PR

---

**Need Help?** Check the logs in Render and Vercel dashboards for detailed error messages.

