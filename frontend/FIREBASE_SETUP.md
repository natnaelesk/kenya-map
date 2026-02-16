# Firebase Setup Guide

This project now uses **Firebase Firestore** instead of a Django backend for data storage.

## 🚀 Quick Start

### 1. Firebase Configuration

Firebase is already configured in `src/firebase/config.js` with your project credentials:
- Project ID: `hawkeye-cb7ea`
- All Firebase services are initialized

### 2. Populate Firebase with Dummy Data

Run the population script to fill Firebase with sample data:

```bash
npm run populate-firebase
```

This will create:
- ✅ 3 Election Cycles
- ✅ 6 Sub-Counties
- ✅ 24 Wards
- ✅ 6 Sectors
- ✅ 6 Fund Sources
- ✅ 3 Governors
- ✅ 6 MPs
- ✅ 50 Projects
- ✅ 80 Budgets
- ✅ 4 Mega Dams
- ✅ 100 Expenditures
- ✅ 60 MP Activities
- ✅ 30 Reviews
- ✅ 20 Impact Reports

### 3. Run the Frontend

```bash
npm run dev
```

The frontend will now connect directly to Firebase - no backend needed!

## 📁 Firebase Collections Structure

### Core Collections
- `electionCycles` - Election cycle periods
- `subCounties` - Sub-counties (constituencies)
- `wards` - Wards within sub-counties
- `sectors` - Government spending sectors

### Funds Collections
- `fundSources` - Funding sources (County, NG-CDF, etc.)
- `budgets` - Annual budget allocations
- `projects` - Development projects
- `expenditures` - Individual expenditure records
- `megaDams` - Mega dam projects

### Officials Collections
- `governors` - County governors
- `mps` - Members of Parliament
- `mpActivities` - MP activity records
- `governorMetrics` - Governor performance metrics

### Citizens Collections
- `reviews` - Citizen reviews on expenditures/projects
- `impactReports` - Citizen-reported impact stories

## 🔧 API Client

All API functions are now in `src/api/firebaseClient.js` and exported through `src/api/client.js` for backward compatibility.

The components don't need any changes - they continue to use the same API functions, but now they connect to Firebase instead of REST API.

## 📝 Adding More Data

To add more data, you can:
1. Run the populate script again (it will add duplicate data)
2. Use Firebase Console to manually add/edit data
3. Modify `scripts/populateFirebase.js` to customize the data

## 🎯 Firebase Console

Access your Firebase console at:
https://console.firebase.google.com/project/hawkeye-cb7ea

## ✅ Benefits

- ✅ No backend server needed
- ✅ Real-time data updates
- ✅ Automatic scaling
- ✅ Free tier available
- ✅ Easy to deploy (just frontend)

## 🔄 Migration Complete

- ✅ Backend API replaced with Firebase
- ✅ All components updated
- ✅ Dummy data populated
- ✅ Ready to use!

