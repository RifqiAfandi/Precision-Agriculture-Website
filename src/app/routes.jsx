import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import { WelcomePage } from '@/pages/dashboard/WelcomePage';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { GHCompaxDashboard } from '@/features/ghcompax/GHCompaxDashboard';
import SkyVeraDashboard from '@/features/skyvera/SkyVeraDashboard';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const PublicRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export const createAppRouter = (isAuthenticated, user, onLogout, darkMode, toggleDarkMode) => {
  return createBrowserRouter([
    {
      path: '/',
      element: (
        <ErrorBoundary>
          <PublicRoute isAuthenticated={isAuthenticated}>
            <LandingPage />
          </PublicRoute>
        </ErrorBoundary>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/login',
      element: (
        <ErrorBoundary>
          <PublicRoute isAuthenticated={isAuthenticated}>
            <LoginPage />
          </PublicRoute>
        </ErrorBoundary>
      ),
    },
    {
      path: '/register',
      element: (
        <ErrorBoundary>
          <PublicRoute isAuthenticated={isAuthenticated}>
            <RegisterPage />
          </PublicRoute>
        </ErrorBoundary>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <ErrorBoundary>
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardLayout
              user={user}
              onLogout={onLogout}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </ProtectedRoute>
        </ErrorBoundary>
      ),
      children: [
        {
          index: true,
          element: <WelcomePage user={user} />,
        },
        {
          path: 'ghcompax',
          element: <GHCompaxDashboard />,
        },
        {
          path: 'skyvera',
          element: <SkyVeraDashboard />,
        },
        {
          path: 'profile',
          element: <ProfilePage user={user} />,
        },
      ],
    },
    {
      path: '*',
      element: (
        <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              404 - Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The page you're looking for doesn't exist.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      ),
    },
  ]);
};
