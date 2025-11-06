import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Home,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Gauge,
  Thermometer,
  Droplets,
  AlertCircle,
  CheckCircle2,
  Minus,
} from "lucide-react";
import { currentGHCompaxData } from "@/features/ghcompax/data/ghcompaxData";
import { currentWeatherData } from "@/features/skyvera/data/skyveraData";

export function WelcomePage() {
  const navigate = useNavigate();
  const context = useOutletContext();
  const user = context?.user;
  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3.5 h-3.5" />;
      case "down":
        return <TrendingDown className="w-3.5 h-3.5" />;
      default:
        return <Minus className="w-3.5 h-3.5" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-emerald-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  // Mini chart data generator (simple sparkline)
  const generateSparklineData = (baseValue, variance = 2) => {
    return Array.from({ length: 10 }, (_, i) => 
      baseValue + (Math.random() - 0.5) * variance
    );
  };

  // GH Compax - Critical Metrics Only
  const ghCompaxCritical = [
    {
      label: "Temperature",
      value: currentGHCompaxData.temperature?.toFixed(1) || "0.0",
      unit: "°C",
      icon: Thermometer,
      status: "normal",
      trend: "up",
      change: "+0.2",
      priority: "high",
      sparkline: generateSparklineData(currentGHCompaxData.temperature || 0, 1.5),
    },
    {
      label: "Humidity",
      value: Math.round(currentGHCompaxData.humidity || 0),
      unit: "%",
      icon: Droplets,
      status: "normal",
      trend: "stable",
      change: "0.0",
      priority: "high",
      sparkline: generateSparklineData(currentGHCompaxData.humidity || 0, 3),
    },
    {
      label: "eCO₂",
      value: currentGHCompaxData.eco2 || 0,
      unit: "ppm",
      icon: Activity,
      status: "normal",
      trend: "stable",
      change: "0",
      priority: "medium",
      sparkline: generateSparklineData(currentGHCompaxData.eco2 || 0, 15),
    },
    {
      label: "pH Water",
      value: currentGHCompaxData.phAir?.toFixed(1) || "0.0",
      unit: "",
      icon: CheckCircle2,
      status: "normal",
      trend: "stable",
      change: "0.0",
      priority: "medium",
      sparkline: generateSparklineData(currentGHCompaxData.phAir || 0, 0.3),
    },
  ];

  // SkyVera - Critical Metrics Only
  const skyVeraCritical = [
    {
      label: "Temperature",
      value: currentWeatherData.temperature?.toFixed(1) || "0.0",
      unit: "°C",
      icon: Thermometer,
      status: "normal",
      trend: "up",
      change: "+0.4",
      priority: "high",
      sparkline: generateSparklineData(currentWeatherData.temperature || 0, 2),
    },
    {
      label: "Humidity",
      value: Math.round(currentWeatherData.humidity || 0),
      unit: "%",
      icon: Droplets,
      status: "normal",
      trend: "stable",
      change: "0.0",
      priority: "high",
      sparkline: generateSparklineData(currentWeatherData.humidity || 0, 4),
    },
    {
      label: "Kec. Angin",
      value: currentWeatherData.windSpeed?.toFixed(1) || "0.0",
      unit: "km/h",
      icon: Activity,
      status: "normal",
      trend: "up",
      change: "+1.2",
      priority: "medium",
      sparkline: generateSparklineData(parseFloat(currentWeatherData.windSpeed || 0), 2.5),
    },
    {
      label: "eCO₂",
      value: currentWeatherData.co2 || 0,
      unit: "ppm",
      icon: CheckCircle2,
      status: "normal",
      trend: "stable",
      change: "0",
      priority: "medium",
      sparkline: generateSparklineData(currentWeatherData.co2 || 0, 10),
    },
  ];

  // Check for warnings/alerts
  const ghCompaxAlerts = ghCompaxCritical.filter(m => m.status !== "normal");
  const skyVeraAlerts = skyVeraCritical.filter(m => m.status !== "normal");
  const totalAlerts = ghCompaxAlerts.length + skyVeraAlerts.length;

  // Mini Sparkline Component
  const MiniSparkline = ({ data, color = "#10b981" }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={`0,100 ${points} 100,100`}
          fill={color}
          fillOpacity="0.1"
        />
      </svg>
    );
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-background overflow-y-auto">
      {/* Main Content */}
      <div className="h-full flex flex-col px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
        {/* Header Section - Compact */}
        <div className="mb-2 sm:mb-3 md:mb-4 flex-shrink-0 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                  Monitoring
                </h1>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Real-time data from agricultural IoT systems
                </p>
              </div>
            </div>
            
            {/* Alert Summary */}
            {totalAlerts > 0 && (
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-600 dark:text-amber-500" />
                <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-amber-900 dark:text-amber-400">
                  {totalAlerts} Alert{totalAlerts > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards - Responsive Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 min-h-0 overflow-y-auto pb-4 auto-rows-min">
          {/* GH Compax Summary Card */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden animate-fade-in-delay-1">
            <CardHeader className="border-b border-slate-100 dark:border-border pb-2 sm:pb-2.5 md:pb-3 flex-shrink-0">
              <div className="flex items-start justify-between mb-1 sm:mb-1.5 md:mb-2">
                <div>
                  <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 sm:gap-2 mb-0.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    GH Compax
                  </CardTitle>
                  <CardDescription className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
                    Greenhouse Monitoring System
                  </CardDescription>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-full">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    Active
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4">
              {/* Critical Metrics - 2x2 Grid on Desktop, 1 Column on Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3">
                {ghCompaxCritical.map((metric, index) => (
                  <div
                    key={index}
                    className={`p-1.5 sm:p-2 md:p-3 rounded-lg border transition-all duration-200 flex flex-col active:scale-95 ${
                      metric.priority === "high"
                        ? "bg-gradient-to-br from-emerald-50 dark:from-emerald-900/10 to-white dark:to-card border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                        : "bg-slate-50 dark:bg-muted border-slate-200 dark:border-border hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1 sm:mb-1.5 md:mb-2">
                      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
                        <div className={`p-0.5 sm:p-0.5 md:p-1 rounded ${metric.priority === "high" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-slate-200 dark:bg-slate-700"}`}>
                          <metric.icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 ${metric.priority === "high" ? "text-emerald-700 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"}`} />
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-0.5 md:gap-1">
                          <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-wide ${metric.priority === "high" ? "text-emerald-900 dark:text-emerald-300" : "text-gray-700 dark:text-gray-300"}`}>
                            {metric.label}
                          </span>
                          {metric.priority === "high" && (
                            <Badge className="text-[7px] sm:text-[8px] md:text-[9px] px-0.5 sm:px-1 py-0 bg-emerald-600 dark:bg-emerald-700 text-white border-0 h-2.5 sm:h-3 md:h-4 hidden md:inline-flex">
                              Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-1 sm:mb-1.5 md:mb-2">
                      <p className={`font-bold ${metric.priority === "high" ? "text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-gray-100" : "text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200"}`}>
                        {metric.value}
                        <span className="text-[10px] sm:text-xs md:text-sm font-normal text-gray-500 dark:text-gray-400 ml-0.5">
                          {metric.unit}
                        </span>
                      </p>
                      <div className={`flex items-center gap-0.5 text-[8px] sm:text-[9px] md:text-[10px] font-medium mt-0.5 ${getTrendColor(metric.trend)}`}>
                        {getTrendIcon(metric.trend)}
                        <span>{metric.change}</span>
                      </div>
                    </div>

                    {/* Mini Sparkline - Compact */}
                    <div className="h-8 sm:h-10 md:h-12 w-full overflow-hidden">
                      <MiniSparkline 
                        data={metric.sparkline} 
                        color={metric.priority === "high" ? "#10b981" : "#64748b"}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button - Compact */}
              <Button 
                className="w-full bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium py-2 sm:py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm flex-shrink-0 min-h-[40px] sm:min-h-[44px] active:scale-95"
                onClick={() => navigate("/dashboard/ghcompax")}
              >
                <span>View Detailed Dashboard</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Button>
            </CardContent>
          </Card>

          {/* SkyVera Summary Card */}
          <Card className="bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden animate-fade-in-delay-2">
            <CardHeader className="border-b border-slate-100 dark:border-border pb-2 sm:pb-2.5 md:pb-3 flex-shrink-0">
              <div className="flex items-start justify-between mb-1 sm:mb-1.5 md:mb-2">
                <div>
                  <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 sm:gap-2 mb-0.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    SkyVera
                  </CardTitle>
                  <CardDescription className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
                    Weather Monitoring System
                  </CardDescription>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-2.5 md:py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-blue-700 dark:text-blue-400">
                    Active
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4">
              {/* Critical Metrics - 2x2 Grid on Desktop, 1 Column on Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3">
                {skyVeraCritical.map((metric, index) => (
                  <div
                    key={index}
                    className={`p-1.5 sm:p-2 md:p-3 rounded-lg border transition-all duration-200 flex flex-col active:scale-95 ${
                      metric.priority === "high"
                        ? "bg-gradient-to-br from-blue-50 dark:from-blue-900/10 to-white dark:to-card border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                        : "bg-slate-50 dark:bg-muted border-slate-200 dark:border-border hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1 sm:mb-1.5 md:mb-2">
                      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
                        <div className={`p-0.5 sm:p-0.5 md:p-1 rounded ${metric.priority === "high" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-200 dark:bg-slate-700"}`}>
                          <metric.icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 ${metric.priority === "high" ? "text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-0.5 md:gap-1">
                          <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-wide ${metric.priority === "high" ? "text-blue-900 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                            {metric.label}
                          </span>
                          {metric.priority === "high" && (
                            <Badge className="text-[7px] sm:text-[8px] md:text-[9px] px-0.5 sm:px-1 py-0 bg-blue-600 dark:bg-blue-700 text-white border-0 h-2.5 sm:h-3 md:h-4 hidden md:inline-flex">
                              Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-1 sm:mb-1.5 md:mb-2">
                      <p className={`font-bold ${metric.priority === "high" ? "text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-gray-100" : "text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200"}`}>
                        {metric.value}
                        <span className="text-[10px] sm:text-xs md:text-sm font-normal text-gray-500 dark:text-gray-400 ml-0.5">
                          {metric.unit}
                        </span>
                      </p>
                      <div className={`flex items-center gap-0.5 text-[8px] sm:text-[9px] md:text-[10px] font-medium mt-0.5 ${getTrendColor(metric.trend)}`}>
                        {getTrendIcon(metric.trend)}
                        <span>{metric.change}</span>
                      </div>
                    </div>

                    {/* Mini Sparkline - Compact */}
                    <div className="h-8 sm:h-10 md:h-12 w-full overflow-hidden">
                      <MiniSparkline 
                        data={metric.sparkline} 
                        color={metric.priority === "high" ? "#3b82f6" : "#64748b"}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button - Compact */}
              <Button 
                className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 sm:py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm flex-shrink-0 min-h-[40px] sm:min-h-[44px] active:scale-95"
                onClick={() => navigate("/dashboard/skyvera")}
              >
                <span>View Detailed Dashboard</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
