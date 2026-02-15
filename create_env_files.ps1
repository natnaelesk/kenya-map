# PowerShell script to create .env files

Write-Host "Creating .env files..." -ForegroundColor Green

# Backend .env
@"
# Backend Environment Variables
# This file is gitignored for security - DO NOT COMMIT SECRETS

# Django Settings
DJANGO_SECRET_KEY=86#_lw%r2(py@lnnde@@7)2xvr6tem-&rvop7f0dr$d+-v9um5
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=kenya-map.onrender.com

# Database (automatically provided by Render when you add PostgreSQL)
# DATABASE_URL is set automatically by Render

# CORS - Frontend URL (Vercel)
CORS_ALLOWED_ORIGINS=https://kenya-map.vercel.app,https://kenya-map-git-main.vercel.app
"@ | Out-File -FilePath ".env" -Encoding utf8

# Frontend .env
@"
# Frontend Environment Variables
# This file is gitignored for security

# Backend API URL (Render backend)
VITE_API_URL=https://kenya-map.onrender.com/api
"@ | Out-File -FilePath "frontend\.env" -Encoding utf8

Write-Host "✅ .env files created!" -ForegroundColor Green
Write-Host "Backend: .env" -ForegroundColor Cyan
Write-Host "Frontend: frontend\.env" -ForegroundColor Cyan

