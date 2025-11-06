export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};
export const kmhToMs = (kmh) => {
  return kmh / 3.6;
};
export const calculateHeatIndex = (temp, humidity) => {
  const tempF = celsiusToFahrenheit(temp);
  const hi =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    6.83783e-3 * tempF ** 2 -
    5.481717e-2 * humidity ** 2 +
    1.22874e-3 * tempF ** 2 * humidity +
    8.5282e-4 * tempF * humidity ** 2 -
    1.99e-6 * tempF ** 2 * humidity ** 2;

  return ((hi - 32) * 5) / 9;
};
export const calculateDewPoint = (temp, humidity) => {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
};
export const getWindDirection = (degrees) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
};
export const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: "Good", color: "green", description: "Air quality is good" };
  if (aqi <= 100) return { level: "Moderate", color: "yellow", description: "Air quality is acceptable" };
  if (aqi <= 150) return { level: "Unhealthy (Sensitive)", color: "orange", description: "Sensitive groups may be affected" };
  if (aqi <= 200) return { level: "Unhealthy", color: "red", description: "Everyone may begin to experience effects" };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "purple", description: "Health alert: serious health effects" };
  return { level: "Hazardous", color: "maroon", description: "Health emergency" };
};
export const getUVLevel = (uvIndex) => {
  if (uvIndex <= 2) return { level: "Low", color: "green", protection: "No protection needed" };
  if (uvIndex <= 5) return { level: "Moderate", color: "yellow", protection: "Use sunscreen" };
  if (uvIndex <= 7) return { level: "High", color: "orange", protection: "Avoid direct sunlight" };
  if (uvIndex <= 10) return { level: "Very High", color: "red", protection: "Extra protection required" };
  return { level: "Extreme", color: "purple", protection: "Avoid outdoor activities" };
};
export const calculateTrend = (data) => {
  if (!data || data.length < 2) return { direction: "stable", percentage: 0 };

  const recent = data.slice(-3);
  const older = data.slice(-6, -3);

  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;

  const change = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (Math.abs(change) < 2) return { direction: "stable", percentage: 0 };
  if (change > 0) return { direction: "up", percentage: Math.abs(change).toFixed(1) };
  return { direction: "down", percentage: Math.abs(change).toFixed(1) };
};
export const formatTimestamp = (timestamp, includeTime = true) => {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (!includeTime) return dateStr;

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateStr} ${timeStr}`;
};
export const exportToCSV = (data, filename = "skyvera_weather_data.csv") => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
export const exportToJSON = (data, filename = "skyvera_weather_data.json") => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
export const generateWeatherReport = (currentData, historicalData) => {
  const stats = {
    current: currentData,
    averages: {
      temperature: (historicalData.reduce((sum, d) => sum + d.temp, 0) / historicalData.length).toFixed(1),
      humidity: (historicalData.reduce((sum, d) => sum + d.humidity, 0) / historicalData.length).toFixed(0),
      aqi: (historicalData.reduce((sum, d) => sum + d.aqi, 0) / historicalData.length).toFixed(0),
      windSpeed: (historicalData.reduce((sum, d) => sum + d.wind, 0) / historicalData.length).toFixed(1),
    },
    extremes: {
      maxTemp: Math.max(...historicalData.map(d => d.temp)),
      minTemp: Math.min(...historicalData.map(d => d.temp)),
      maxWind: Math.max(...historicalData.map(d => d.wind)),
      totalRainfall: historicalData.reduce((sum, d) => sum + d.rainfall, 0).toFixed(1),
    },
    reportDate: new Date().toISOString(),
  };

  return stats;
};
export const validateWeatherParameter = (parameter, value) => {
  const ranges = {
    temperature: { min: -50, max: 60, unit: "°C" },
    humidity: { min: 0, max: 100, unit: "%" },
    co2: { min: 300, max: 5000, unit: "ppm" },
    aqi: { min: 0, max: 500, unit: "" },
    windSpeed: { min: 0, max: 200, unit: "km/h" },
    tvoc: { min: 0, max: 10, unit: "mg/m³" },
    pressure: { min: 900, max: 1100, unit: "hPa" },
    uvIndex: { min: 0, max: 15, unit: "" },
  };

  const range = ranges[parameter];
  if (!range) return { valid: false, message: "Parameter not recognized" };

  const valid = value >= range.min && value <= range.max;
  const message = valid
    ? "Valid"
    : `Value must be between ${range.min}-${range.max} ${range.unit}`;

  return { valid, message, range };
};
