import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  LogOut,
  Home,
  Bell,
  Moon,
  Sun,
  Activity,
  Calendar,
  Gauge,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function DashboardLayout({ user, onLogout, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [shortDate, setShortDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));
    setShortDate(new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    }));
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Get current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'welcome';
    if (path.includes('/ghcompax')) return 'ghcompax';
    if (path.includes('/skyvera')) return 'skyvera';
    if (path.includes('/profile')) return 'profile';
    return 'welcome';
  };

  const currentPage = getCurrentPage();

  const handlePageChange = (pageId) => {
    if (pageId === currentPage) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      // Navigate using React Router
      if (pageId === 'welcome') {
        navigate('/dashboard');
      } else {
        navigate(`/dashboard/${pageId}`);
      }
      setPageKey(prev => prev + 1);
      setIsAnimating(false);
      setSidebarOpen(false);
    }, 150);
  };

  const menuItems = [
    {
      id: "welcome",
      label: "Dashboard",
      icon: Activity,
      description: "Monitoring Overview",
      always: true,
    },
    {
      id: "ghcompax",
      label: "GH Compax",
      icon: Home,
      description: "Greenhouse Monitoring",
      status: "active",
    },
    {
      id: "skyvera",
      label: "SkyVera",
      icon: Gauge,
      description: "Weather Station Professional",
      status: "active",
    },
  ];

  return (
    <div className="h-screen bg-slate-50 dark:bg-background flex overflow-hidden">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`${
          sidebarCollapsed ? "lg:w-20" : "lg:w-72"
        } w-72 transition-all duration-300 bg-white dark:bg-card border-r border-gray-200 dark:border-border flex flex-col fixed inset-y-0 left-0 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-lg lg:shadow-none animate-slide-in-left`}
      >
        <div className="px-4 py-4 lg:px-6 lg:py-5 border-b border-gray-200 dark:border-border bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 animate-fade-in flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {sidebarCollapsed ? (
                <Logo size="lg" showText={false} className="hidden lg:flex" />
              ) : (
                <Logo size="lg" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white dark:hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <div className="space-y-1.5">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 text-left group relative overflow-hidden animate-fade-in-delay-${Math.min(index + 1, 3)} ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                    : "hover:bg-gray-50 dark:hover:bg-muted text-gray-700 dark:text-gray-300"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Active indicator bar */}
                {currentPage === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
                
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-white/20"
                    : "bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600"
                }`}>
                  <item.icon
                    className={`w-5 h-5 ${
                      currentPage === item.id
                        ? "text-white"
                        : "text-gray-600 dark:text-emerald-400 group-hover:text-green-600 dark:group-hover:text-emerald-300"
                    }`}
                  />
                </div>
                
                <div className={`flex-1 min-w-0 ${sidebarCollapsed ? "hidden lg:block" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate text-sm lg:text-base">{item.label}</span>
                    {item.status === "active" && (
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold ${
                          currentPage === item.id
                            ? "bg-white/20 text-white hover:bg-white/20"
                            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}
                      >
                        <span className="inline-block w-1.5 h-1.5 bg-current rounded-full mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-xs truncate mt-0.5 ${
                      currentPage === item.id
                        ? "text-white/80"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-border space-y-2 bg-gray-50/50 dark:bg-muted/30 animate-fade-in-delay-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange("profile")}
              className={`flex-1 flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 ${
                currentPage === "profile"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : "hover:bg-white dark:hover:bg-muted text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <User className="w-5 h-5 text-white dark:text-emerald-400" />
              </div>
              <div className={`flex-1 min-w-0 ${sidebarCollapsed ? "hidden lg:block" : ""}`}>
                <p className="font-semibold truncate text-sm lg:text-base">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className={`p-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl ${sidebarCollapsed ? "hidden lg:flex" : ""}`}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col transition-[margin] duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        } ml-0`}
      >
        <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-3.5 lg:py-4 sticky top-0 z-30 shadow-sm animate-slide-in-right flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 sm:p-2 lg:hidden hover:bg-gray-100 dark:hover:bg-muted flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 dark:text-gray-100 truncate flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const currentItem = menuItems.find((item) => item.id === currentPage);
                      const IconComponent = currentItem?.icon || Activity;
                      return <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-emerald-400" />;
                    })()}
                  </div>
                  <span>
                    {menuItems.find((item) => item.id === currentPage)?.label ||
                      "Dashboard"}
                  </span>
                </h2>
                <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1 lg:space-x-2 mt-0.5 sm:mt-1">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-gray-600 dark:text-emerald-400" />
                  </div>
                  {currentDate && (
                    <>
                      <span className="truncate hidden sm:inline">{currentDate}</span>
                      <span className="truncate sm:hidden">{shortDate}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-muted"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                  {darkMode ? (
                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-emerald-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-emerald-400" />
                  )}
                </div>
              </Button>

              <div className="flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg sm:rounded-xl border border-green-100 dark:border-green-800">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-green-700 dark:text-green-400">
                  Online
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background">
          <div 
            key={pageKey}
            className={`h-full transition-all duration-300 ${
              isAnimating 
                ? 'opacity-0 scale-[0.98]' 
                : 'opacity-100 scale-100 animate-fade-in'
            }`}
          >
            <Outlet context={{ user, onNavigate: handlePageChange }} />
          </div>
        </main>
      </div>
    </div>
  );
}

DashboardLayout.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};
