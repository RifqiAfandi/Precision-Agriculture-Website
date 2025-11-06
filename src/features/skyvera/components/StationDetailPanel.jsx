import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  AlertCircle,
  Eye,
  TrendingUp,
  Download,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getParameterStatus,
  getStatusLabel,
} from "../data/skyveraData";

export function StationDetailPanel({ station, onExport }) {
  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Weather Station
        </h3>
        <p className="text-gray-500 max-w-sm">
          Select a weather station from the list to view detailed weather monitoring
        </p>
      </div>
    );
  }

  const statusConfig = {
    excellent: { color: "bg-green-100 text-green-800", label: "Excellent" },
    optimal: { color: "bg-green-100 text-green-800", label: "Optimal" },
    good: { color: "bg-green-100 text-green-800", label: "Good" },
    normal: { color: "bg-blue-100 text-blue-800", label: "Normal" },
    moderate: { color: "bg-yellow-100 text-yellow-800", label: "Moderate" },
    calm: { color: "bg-green-100 text-green-800", label: "Calm" },
    warning: { color: "bg-orange-100 text-orange-800", label: "Warning" },
    unhealthy: { color: "bg-red-100 text-red-800", label: "Unhealthy" },
  };

  const tempStatus = getParameterStatus(station.currentTemp, "temperature");
  const humidityStatus = getParameterStatus(station.currentHumidity, "humidity");
  const windStatus = getParameterStatus(station.currentWindSpeed, "windSpeed");
  const aqiStatus = getParameterStatus(station.currentAQI, "aqi");
  const co2Status = getParameterStatus(station.currentCO2, "co2");
  const tvocStatus = getParameterStatus(station.currentTVOC, "tvoc");

  const metrics = [
    {
      icon: Thermometer,
      label: "Air Temperature",
      value: `${station.currentTemp}°C`,
      status: tempStatus.status,
      description: `${getStatusLabel(tempStatus.status)} Condition`,
      color: "text-red-500",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${station.currentHumidity}%`,
      status: humidityStatus.status,
      description: `${getStatusLabel(humidityStatus.status)} Level`,
      color: "text-blue-500",
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${station.currentWindSpeed} km/h`,
      status: windStatus.status,
      description: `${getStatusLabel(windStatus.status)} Wind`,
      color: "text-teal-500",
    },
    {
      icon: Cloud,
      label: "CO₂ Level",
      value: `${station.currentCO2} ppm`,
      status: co2Status.status,
      description: `${getStatusLabel(co2Status.status)} Quality`,
      color: "text-green-500",
    },
    {
      icon: Eye,
      label: "AQI (Air Quality)",
      value: station.currentAQI,
      status: aqiStatus.status,
      description: `${getStatusLabel(aqiStatus.status)}`,
      color: "text-purple-500",
    },
    {
      icon: AlertCircle,
      label: "TVOC",
      value: `${station.currentTVOC} mg/m³`,
      status: tvocStatus.status,
      description: `${getStatusLabel(tvocStatus.status)}`,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-2 sm:space-y-4 md:space-y-6">
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusStyle = statusConfig[metric.status] || statusConfig.normal;
          return (
            <div
              key={idx}
              className="flex items-start justify-between p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-3"
            >
              <div className="flex items-start space-x-1.5 sm:space-x-2 md:space-x-3 flex-1 min-w-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 ${metric.color}`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">{metric.label}</p>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    {metric.value}
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1">
                    {metric.description}
                  </p>
                </div>
              </div>
              <Badge className={`${statusStyle.color} flex-shrink-0 text-[10px] sm:text-xs`}>{statusStyle.label}</Badge>
            </div>
          );
        })}
      </div>

      <div className="bg-white border rounded-lg p-2 sm:p-3 md:p-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 flex items-center space-x-1 sm:space-x-2">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" />
            <span>Last 24 Hours Trend</span>
          </h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={station.history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#ef4444"
              name="Temperature (°C)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              name="Humidity (%)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="wind"
              stroke="#14b8a6"
              name="Wind (km/h)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          onClick={() => onExport && onExport(station.id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 h-8 sm:h-10 text-xs sm:text-sm"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Ekspor Data
        </Button>
        <Button variant="outline" className="flex-1 h-8 sm:h-10 text-xs sm:text-sm">
          <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Lihat Analitik
        </Button>
      </div>
    </div>
  );
}
