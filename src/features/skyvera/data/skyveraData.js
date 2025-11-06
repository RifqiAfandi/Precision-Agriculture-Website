// Generate 20 data points untuk line chart (data per menit)
const generateTimeSeriesData = (baseValue, variance) => {
  const data = [];
  const now = new Date();
  
  for (let i = 19; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // setiap menit
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(value.toFixed(2)),
      timestamp: time.getTime(),
    });
  }
  
  return data;
};

// Generate historical data dengan lebih banyak data points (untuk history mode)
const generateHistoricalData = (baseValue, variance, hours = 24) => {
  const dataPoints = hours * 6; // 6 data points per jam (setiap 10 menit)
  const data = [];
  const now = new Date();
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // setiap menit
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(value.toFixed(2)),
      timestamp: time.getTime(),
    });
  }
  
  return data;
};

// Data time series untuk chart (60 data points untuk real-time, 1 jam terakhir)
export const windSpeedData = generateTimeSeriesData(12.5, 8); // base: 12.5 km/h, variance: ±4 km/h
export const rainfallData = generateTimeSeriesData(4.5, 4); // base: 4.5 mm, variance: ±2 mm

// Historical data (24 jam)
export const temperatureHistoryData = generateHistoricalData(29.1, 3, 24);
export const humidityHistoryData = generateHistoricalData(78, 10, 24);
export const windSpeedHistoryData = generateHistoricalData(12.5, 8, 24);
export const rainfallHistoryData = generateHistoricalData(4.5, 4, 24);
export const co2HistoryData = generateHistoricalData(415, 50, 24);
export const tvocHistoryData = generateHistoricalData(0.36, 0.2, 24);

export const weatherStations = [
  {
    id: "ws1",
    name: "SkyVera Station #1",
    location: "Area Monitoring Utama",
    altitude: 125,
    stationType: "Professional",
    currentTemp: 29.1,
    currentHumidity: 78,
    currentWindSpeed: windSpeedData[windSpeedData.length - 1].value,
    currentRainfall: rainfallData[rainfallData.length - 1].value,
    currentCO2: 415,
    currentTVOC: 0.36,
    lastUpdate: new Date().toLocaleString('en-US'),
    status: "good",
    windSpeedHistory: windSpeedData,
    rainfallHistory: rainfallData,
  },
];

// Current real-time data
export const currentWeatherData = {
  windSpeed: windSpeedData[windSpeedData.length - 1].value,
  rainfall: rainfallData[rainfallData.length - 1].value,
  temperature: 29.1,
  humidity: 78,
  co2: 415,
  tvoc: 0.36,
  lastUpdate: new Date().toLocaleString('en-US'),
};

// Helper function untuk update data (simulasi real-time)
export const updateSkyVeraData = (currentData) => {
  // Shift data ke kiri dan tambah data baru di kanan
  const newTemp = currentData.temperature + (Math.random() - 0.5) * 1;
  const newHumidity = currentData.humidity + (Math.random() - 0.5) * 3;
  const newTvoc = Math.max(0.1, currentData.tvoc + (Math.random() - 0.5) * 0.1);
  const newCo2 = Math.max(350, currentData.co2 + (Math.random() - 0.5) * 20);

  return {
    ...currentData,
    temperature: parseFloat(newTemp.toFixed(2)),
    humidity: parseFloat(newHumidity.toFixed(2)),
    tvoc: parseFloat(newTvoc.toFixed(2)),
    co2: Math.round(newCo2),
    lastUpdate: new Date().toLocaleString('en-US'),
  };
};
export const getParameterStatus = (value, parameter) => {
  switch (parameter) {
    case "temperature":
      if (value >= 25 && value <= 32)
        return { status: "optimal", color: "text-blue-600", bg: "bg-blue-100" };
      if (value >= 20 && value <= 38)
        return { status: "normal", color: "text-blue-600", bg: "bg-blue-100" };
      return { status: "warning", color: "text-red-600", bg: "bg-red-100" };

    case "humidity":
      if (value >= 60 && value <= 80)
        return { status: "optimal", color: "text-blue-600", bg: "bg-blue-100" };
      if (value >= 40 && value <= 90)
        return { status: "normal", color: "text-blue-600", bg: "bg-blue-100" };
      return { status: "warning", color: "text-orange-600", bg: "bg-orange-100" };

    case "co2":
      if (value <= 400)
        return { status: "excellent", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 500)
        return { status: "good", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 600)
        return { status: "moderate", color: "text-orange-600", bg: "bg-orange-100" };
      return { status: "poor", color: "text-red-600", bg: "bg-red-100" };

    case "windSpeed":
      if (value <= 20)
        return { status: "calm", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 40)
        return { status: "moderate", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 60)
        return { status: "strong", color: "text-orange-600", bg: "bg-orange-100" };
      return { status: "severe", color: "text-red-600", bg: "bg-red-100" };

    case "tvoc":
      if (value <= 0.3)
        return { status: "excellent", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 1.0)
        return { status: "good", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 3.0)
        return { status: "moderate", color: "text-orange-600", bg: "bg-orange-100" };
      return { status: "poor", color: "text-red-600", bg: "bg-red-100" };
      
    case "rainfall":
      if (value <= 5)
        return { status: "light", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 10)
        return { status: "moderate", color: "text-blue-600", bg: "bg-blue-100" };
      if (value <= 20)
        return { status: "heavy", color: "text-orange-600", bg: "bg-orange-100" };
      return { status: "extreme", color: "text-red-600", bg: "bg-red-100" };

    default:
      return { status: "normal", color: "text-gray-600", bg: "bg-gray-100" };
  }
};
export const getStatusLabel = (status) => {
  const labels = {
    excellent: "Sangat Baik",
    optimal: "Optimal",
    good: "Baik",
    normal: "Normal",
    moderate: "Sedang",
    calm: "Tenang",
    strong: "Kuat",
    light: "Ringan",
    heavy: "Lebat",
    warning: "Peringatan",
    poor: "Buruk",
    severe: "Berbahaya",
    extreme: "Ekstrem",
  };
  return labels[status] || "Normal";
};
export const getWeatherStats = () => {
  const totalStations = weatherStations.length;
  const avgTemp = (
    weatherStations.reduce((sum, ws) => sum + ws.currentTemp, 0) / totalStations
  ).toFixed(1);
  const avgHumidity = Math.round(
    weatherStations.reduce((sum, ws) => sum + ws.currentHumidity, 0) / totalStations
  );
  const avgWindSpeed = (
    weatherStations.reduce((sum, ws) => sum + ws.currentWindSpeed, 0) / totalStations
  ).toFixed(1);

  return {
    totalStations,
    avgTemp,
    avgHumidity,
    avgWindSpeed,
  };
};

export const getStationById = (id) => {
  return weatherStations.find((ws) => ws.id === id);
};
