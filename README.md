# Precision Agriculture Platform 🌱

Modern IoT-based agricultural monitoring platform with real-time data visualization, AI insights, and smart farming capabilities.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RifqiAfandi/Precision-Agriculture-Website)

## 🚀 Features

- **Real-time Monitoring** - Live sensor data from GH Compax and SkyVera systems
- **Interactive Dashboards** - Beautiful data visualization with responsive charts
- **AI Insights** - Smart recommendations for farming decisions
- **Multi-device Support** - Fully responsive design for mobile, tablet, and desktop
- **Dark Mode** - Eye-friendly theme switching
- **Authentication** - Secure user authentication and authorization
- **Error Handling** - Comprehensive error boundaries for stability

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router v6, TailwindCSS 4
- **State Management:** TanStack Query (React Query)
- **Charts:** Recharts
- **UI Components:** Radix UI, Lucide Icons
- **Build Tool:** Vite 7
- **Deployment:** Vercel

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/RifqiAfandi/Precision-Agriculture-Website.git
cd Precision-Agriculture-Website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Environment Variables

This project uses Firebase for real-time database. You need to set up the following environment variables:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_DATABASE_URL` | Firebase Realtime Database URL |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID |

**Note:** Never commit your `.env` file to version control. Use `.env.example` as a template.

## 🔥 Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Realtime Database
3. Set up database rules for your use case
4. Get your Firebase config from Project Settings
5. Copy the credentials to your `.env` file

6. Update `.env.local` with your configuration:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Precision Agriculture Platform
```

5. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables:**
   - In Vercel Dashboard, go to Settings → Environment Variables
   - Add the following variables:
     ```
     VITE_API_URL=https://your-api-domain.com/api
     VITE_APP_NAME=Precision Agriculture Platform
     VITE_NODE_ENV=production
     ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app automatically

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

### Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch (production)
- Create preview deployments for pull requests
- Run build checks before deployment

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)

The project includes a `vercel.json` file with optimized settings:
- SPA routing (all routes → index.html)
- Asset caching (1 year for static files)
- Build configuration

### Build Optimization

The Vite build is optimized for production:
- Code splitting for better caching
- Minification with Terser
- Separate vendor chunks (React, TanStack Query, UI libraries)
- Tree shaking for smaller bundle size

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Maintenance
npm run lint         # Run ESLint
npm run clean        # Clean build artifacts
```

## 🌐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.example.com/api` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `Precision Agriculture Platform` |
| `VITE_APP_VERSION` | App version | `1.0.0` |
| `VITE_ENABLE_AI_INSIGHTS` | Enable AI features | `true` |
| `VITE_ENABLE_EXPORT` | Enable data export | `true` |
| `VITE_GOOGLE_ANALYTICS_ID` | GA tracking ID | - |
| `VITE_SENTRY_DSN` | Sentry error tracking | - |

## 🏗️ Project Structure

```
src/
├── app/              # App configuration & routing
├── components/       # Reusable UI components
│   ├── common/      # Shared components (Logo, ErrorBoundary)
│   └── ui/          # UI library components (45+ components)
├── constants/        # Configuration constants
├── contexts/         # React contexts (Auth, etc.)
├── features/         # Feature-based modules
│   ├── ghcompax/    # Greenhouse monitoring
│   └── skyvera/     # Weather monitoring
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── auth/        # Authentication pages
│   └── dashboard/   # Dashboard pages
├── services/         # API services
└── styles/           # Global styles
```

## 🔐 Authentication

Default credentials for demo:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

⚠️ **Important:** Change these credentials in production!

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear cache and reinstall:
```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
```

2. Check Node.js version:
```bash
node --version  # Should be >= 18.x
```

### Deployment Issues

1. **Build fails on Vercel:**
   - Check build logs in Vercel dashboard
   - Ensure all environment variables are set
   - Verify Node.js version in `package.json`

2. **Routes not working:**
   - Ensure `vercel.json` rewrites are configured
   - Check React Router configuration

3. **Environment variables not loading:**
   - Variables must start with `VITE_`
   - Set in Vercel dashboard, not in `.env` files
   - Redeploy after adding variables

## 📄 License

This project is private and proprietary.

## 👥 Team

- **Developer:** Rifqi Afandi
- **Organization:** Precision Agriculture

## 🤝 Contributing

This is a private project. For contributions, please contact the development team.

## 📞 Support

For support and questions:
- Email: admin@gmail.com
- GitHub Issues: [Create an issue](https://github.com/RifqiAfandi/Precision-Agriculture-Website/issues)

---

**Built with ❤️ for modern agriculture**