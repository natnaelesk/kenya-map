#!/bin/bash
# Script to create .env files from templates

echo "Creating .env files..."

# Backend .env
cat > .env << 'EOF'
# Backend Environment Variables
# This file is gitignored for security - DO NOT COMMIT SECRETS

# Django Settings
DJANGO_SECRET_KEY=z-jd$len8(mk!t2@25tcz6_8)h3h$@kd%c_v7r@_cvub)xyid_
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

