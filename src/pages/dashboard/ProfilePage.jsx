import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  Mail,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function ProfilePage() {
  const context = useOutletContext();
  const user = context?.user;
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    setPasswordError("");
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Mohon lengkapi semua field");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("Password confirmation does not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordError("");
    setPasswordSuccess(true);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-background">
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">Data pengguna tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 dark:bg-background overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-4xl space-y-3 sm:space-y-4 py-2">
          {/* Profile Header Card */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start space-x-2 mt-2">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">{user.email}</span>
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2.5 sm:px-3 py-1 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Account
                  </Badge>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          {/* Personal Info Card */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-gray-100">Account Information</span>
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Personal data and contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 sm:space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input
                  id="fullName"
                  value={user.name}
                  disabled
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="userId" className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">User ID</Label>
                <Input
                  id="userId"
                  value={user.id}
                  disabled
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>
              <div className="pt-1 bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-300">
                  To change account information, contact the system administrator.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Password Change Card */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-gray-900 dark:text-gray-100">Ganti Password</span>
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Change password for account security</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-2.5 sm:space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword" className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange("currentPassword")}
                      className="pr-10 text-xs sm:text-sm h-10 sm:h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange("newPassword")}
                      className="pr-10 text-xs sm:text-sm h-10 sm:h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Minimum 6 characters"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange("confirmPassword")}
                      className="pr-10 text-xs sm:text-sm h-10 sm:h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Re-enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Error Message */}
                {passwordError && (
                  <div className="flex items-center space-x-2 p-2 sm:p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300">{passwordError}</p>
                  </div>
                )}

                {/* Success Message */}
                {passwordSuccess && (
                  <div className="flex items-center space-x-2 p-2 sm:p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300">Password changed successfully!</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white mt-2 h-10 sm:h-11 text-sm active:scale-95 transition-transform"
                >
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
