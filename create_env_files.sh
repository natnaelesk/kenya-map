#!/bin/bash
# Script to create .env files from templates

echo "Creating .env files..."

# Backend .env
cat > .env << 'EOF'
# Backend Environment Variables
# This file is gitignored for security - DO NOT COMMIT SECRETS

# Django Settings
DJANGO_SECRET_KEY=2&@!c(c#$*6hu6r8=9s=b(bsfyy5di160+%vl@8t0)yt=l3x*@
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=kenya-map.onrender.com

# Database (automatically provided by Render when you add PostgreSQL)
# DATABASE_URL is set automatically by Render

# CORS - Frontend URL (Vercel)
CORS_ALLOWED_ORIGINS=https://kenya-map.vercel.app,https://kenya-map-git-main.vercel.app
EOF

# Frontend .env
cat > frontend/.env << 'EOF'
# Frontend Environment Variables
# This file is gitignored for security

# Backend API URL (Render backend)
VITE_API_URL=https://kenya-map.onrender.com/api
EOF

echo "✅ .env files created!"
echo "Backend: .env"
echo "Frontend: frontend/.env"

