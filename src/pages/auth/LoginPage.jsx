import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { ArrowLeft, Mail, Lock, AlertCircle, Moon, Sun } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { STORAGE_KEYS } from "@/constants/monitoring";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (savedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    setIsPageLoaded(true);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Logo size="xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Sign in to Your Account
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Access IoT agriculture monitoring dashboard
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 animate-fade-in-delay-1">
          <CardHeader className="space-y-1 pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl dark:text-gray-100">Login</CardTitle>
            <CardDescription className="text-xs sm:text-sm dark:text-gray-400">
              Enter your email and password to access dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm dark:text-gray-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-gray-100 dark:placeholder-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm dark:text-gray-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 sm:top-3.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-gray-100 dark:placeholder-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-in py-2 sm:py-3">
                  <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-emerald-600 dark:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 active:scale-95 transition-transform"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Login"}
              </Button>
            </form>

            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs sm:text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              <p className="font-medium mb-1">Info:</p>
              <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400">
                Please login with your registered email and password
              </p>
            </div>

            <div className="mt-4 sm:mt-6 text-center space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-green-600 dark:text-emerald-400 hover:text-green-700 dark:hover:text-emerald-300 font-medium"
                >
                  Register now
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4 sm:mt-6 animate-fade-in-delay-2">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-2 border-green-500 dark:border-emerald-600 text-green-700 dark:text-emerald-400 hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-emerald-600 dark:hover:text-white dark:hover:border-emerald-600 transition-all duration-300 h-10 sm:h-11 px-4 sm:px-6 text-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`fixed bottom-8 right-8 z-50 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isPageLoaded ? 'animate-fade-in' : 'opacity-0'}`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  );
}
