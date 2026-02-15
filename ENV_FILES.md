# Environment Files Setup

## 📝 .env Files Created

I've created scripts to generate the `.env` files locally. These files are **gitignored** for security and will NOT be committed to GitHub.

## 🚀 Quick Setup

### Option 1: Run the PowerShell Script (Windows)

```powershell
cd county
.\create_env_files.ps1
```

### Option 2: Run the Bash Script (Linux/Mac)

```bash
cd county
chmod +x create_env_files.sh
./create_env_files.sh
```

### Option 3: Create Manually

#### Backend `.env` (root directory)

Create `county/.env`:

```env
# Backend Environment Variables
DJANGO_SECRET_KEY=z-jd$len8(mk!t2@25tcz6_8)h3h$@kd%c_v7r@_cvub)xyid_
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=kenya-map.onrender.com
CORS_ALLOWED_ORIGINS=https://kenya-map.vercel.app,https://kenya-map-git-main.vercel.app
```

#### Frontend `.env` (frontend directory)

Create `county/frontend/.env`:

```env
# Frontend Environment Variables
VITE_API_URL=https://kenya-map.onrender.com/api
```

## ⚠️ Important Notes

1. **`.env` files are gitignored** - They will NOT be committed to GitHub (this is correct for security)
2. **For Production Deployment:**
   - Set these values in **Render** (backend) environment variables
   - Set `VITE_API_URL` in **Vercel** (frontend) environment variables
3. **Local Development:**
   - The `.env` files will be used automatically by Django and Vite
   - Make sure to create them in the correct directories

## 📋 Production Environment Variables

### Render (Backend)
Set these in Render Dashboard → Web Service → Environment:

```
DJANGO_SECRET_KEY=<your-secret-key>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=kenya-map.onrender.com
CORS_ALLOWED_ORIGINS=https://kenya-map.vercel.app,https://kenya-map-git-main.vercel.app
```

### Vercel (Frontend)
Set this in Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_API_URL=https://kenya-map.onrender.com/api
```

## ✅ Verification

After creating the files:
- Backend `.env` should be in: `county/.env`
- Frontend `.env` should be in: `county/frontend/.env`

These files are for local development. For production, use the platform's environment variable settings (Render/Vercel).

