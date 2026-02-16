# Kenya County Transparency Platform

A comprehensive transparency platform for tracking county governance, funds, projects, and citizen engagement in Kenya.

## 🚀 Features

- **Dashboard**: Overview of county budgets, spending, and projects
- **Funds Tracking**: Detailed budget allocation and expenditure tracking
- **Projects**: Monitor project status, completion, and impact
- **Officials**: Track governors and MPs performance and activities
- **Citizen Engagement**: Reviews and impact reports from citizens
- **Interactive Maps**: Visual representation of county data

## 🛠️ Tech Stack

### Backend
- **Firebase Firestore** - NoSQL database (replaces Django backend)
- **Firebase Analytics** - Analytics tracking

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Leaflet** - Interactive maps
- **Firebase SDK** - Firebase integration

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase account (already configured)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Populate Firebase with dummy data (first time only)
npm run populate-firebase

# Run development server
npm run dev
```

**Note:** No backend server needed! The app uses Firebase Firestore directly.

## 🌐 Deployment

### Backend → Render
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

Quick setup:
1. Create PostgreSQL database on Render
2. Create Web Service
3. Set environment variables (see [ENV_TEMPLATE.md](./ENV_TEMPLATE.md))
4. Deploy

### Frontend → Vercel
1. Import repository to Vercel
2. Set root directory to `frontend`
3. Set `VITE_API_URL` environment variable
4. Deploy

For quick deployment, see [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

## 📚 Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Fast track deployment
- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - Environment variables reference
- [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - Deployment checklist

## 🔑 Environment Variables

### Backend (Render)
- `DJANGO_SECRET_KEY` - Django secret key
- `DJANGO_DEBUG` - Set to `False` in production
- `DJANGO_ALLOWED_HOSTS` - Your Render domain
- `CORS_ALLOWED_ORIGINS` - Your Vercel frontend URL
- `DATABASE_URL` - Auto-provided by Render

### Frontend (Vercel)
- `VITE_API_URL` - Your Render backend API URL

## 📁 Project Structure

```
county/
├── backend/          # Django settings and configuration
├── core/             # Core models (election cycles, sectors, wards)
├── funds/            # Budget and project tracking
├── officials/        # Governors and MPs data
├── citizens/         # Citizen reviews and reports
├── frontend/         # React frontend application
├── manage.py         # Django management script
├── requirements.txt # Python dependencies
└── Procfile          # Render deployment config
```

## 🧪 Testing

Run the test script to verify both servers:

```bash
python test_servers.py
```

## 📝 API Endpoints

- `/api/dashboard/` - Dashboard summary
- `/api/election-cycles/` - Election cycles
- `/api/sectors/` - Sectors
- `/api/sub-counties/` - Sub-counties
- `/api/wards/` - Wards
- `/api/funds/` - Funds and budgets
- `/api/officials/` - Officials data
- `/api/citizens/` - Citizen engagement
- `/admin/` - Django admin panel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available for use.

## 🙏 Acknowledgments

Built for transparency and accountability in county governance.


