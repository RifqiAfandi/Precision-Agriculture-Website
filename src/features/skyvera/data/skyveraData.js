// SkyVera Data - Monitoring Data Dummy (similar to GHCompax)

// Generate time series data
const generateTimeSeriesData = (baseValue, variance, dataPoints = 20) => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < dataPoints; i++) {
    const minutesAgo = dataPoints - 1 - i;
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    const time = timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({
      time,
      value: parseFloat(value.toFixed(2)),
      timestamp: timestamp.getTime(),
    });
  }
  
  return data;
};

// Generate historical data (untuk history mode)
export const generateHistoricalData = (baseValue, variance, hours = 24) => {
  const dataPoints = hours * 6; // 6 data points per jam
  return generateTimeSeriesData(baseValue, variance, dataPoints);
};

// Inisialisasi data array untuk subscription
let liveWindSpeedData = generateTimeSeriesData(12.5, 8, 60);
let liveRainfallData = generateTimeSeriesData(2.3, 3, 60);
let liveTemperatureData = generateTimeSeriesData(28.5, 5, 60);
let liveHumidityData = generateTimeSeriesData(75, 15, 60);
let liveTvocData = generateTimeSeriesData(0.35, 0.5, 60);
let liveCo2Data = generateTimeSeriesData(450, 100, 60);

// Real-time subscription
let realtimeSubscribers = [];
let realtimeInterval = null;

// Fungsi untuk menambahkan data baru (smooth append)
const appendNewDataPoint = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });
  const timestamp = now.getTime();

  // Generate nilai baru berdasarkan nilai terakhir
  const lastWindSpeed = liveWindSpeedData[liveWindSpeedData.length - 1].value;
  const lastRainfall = liveRainfallData[liveRainfallData.length - 1].value;
  const lastTemp = liveTemperatureData[liveTemperatureData.length - 1].value;
  const lastHumid = liveHumidityData[liveHumidityData.length - 1].value;
  const lastTvoc = liveTvocData[liveTvocData.length - 1].value;
  const lastCo2 = liveCo2Data[liveCo2Data.length - 1].value;

  // Tambahkan variasi kecil
  const newWindSpeed = parseFloat(Math.max(0, lastWindSpeed + (Math.random() - 0.5) * 2).toFixed(2));
  const newRainfall = parseFloat(Math.max(0, lastRainfall + (Math.random() - 0.5) * 0.5).toFixed(2));
  const newTemp = parseFloat((lastTemp + (Math.random() - 0.5) * 1).toFixed(2));
  const newHumid = parseFloat((lastHumid + (Math.random() - 0.5) * 2).toFixed(2));
  const newTvoc = parseFloat(Math.max(0.1, lastTvoc + (Math.random() - 0.5) * 0.05).toFixed(2));
  const newCo2 = Math.round(Math.max(350, lastCo2 + (Math.random() - 0.5) * 15));

  // Append data baru
  liveWindSpeedData.push({ time, value: newWindSpeed, timestamp });
  liveRainfallData.push({ time, value: newRainfall, timestamp });
  liveTemperatureData.push({ time, value: newTemp, timestamp });
  liveHumidityData.push({ time, value: newHumid, timestamp });
  liveTvocData.push({ time, value: newTvoc, timestamp });
  liveCo2Data.push({ time, value: newCo2, timestamp });

  // Keep only last 60 minutes
  if (liveWindSpeedData.length > 60) {
    liveWindSpeedData.shift();
    liveRainfallData.shift();
    liveTemperatureData.shift();
    liveHumidityData.shift();
    liveTvocData.shift();
    liveCo2Data.shift();
  }

  // Notify subscribers
  const newData = {
    windSpeedData: [...liveWindSpeedData],
    rainfallData: [...liveRainfallData],
    temperatureData: [...liveTemperatureData],
    humidityData: [...liveHumidityData],
    tvocData: [...liveTvocData],
    co2Data: [...liveCo2Data],
    currentWeatherData: {
      windSpeed: newWindSpeed,
      rainfall: newRainfall,
      temperature: newTemp,
      humidity: newHumid,
      tvoc: newTvoc,
      co2: newCo2,
      lastUpdate: now.toLocaleString('en-US'),
    },
  };

  realtimeSubscribers.forEach(callback => {
    try {
      callback(newData);
    } catch (err) {
      console.error('Error in subscriber callback', err);
    }
  });
};

// Fetch initial data
export async function fetchSkyveraInitial() {
  return {
    windSpeedData: [...liveWindSpeedData],
    rainfallData: [...liveRainfallData],
    temperatureHistoryData: [...liveTemperatureData],
    humidityHistoryData: [...liveHumidityData],
    windSpeedHistoryData: [...liveWindSpeedData],
    rainfallHistoryData: [...liveRainfallData],
    co2HistoryData: [...liveCo2Data],
    tvocHistoryData: [...liveTvocData],
    weatherStations: [{
      id: 'ws1',
      name: 'SkyVera Station #1',
      location: 'Area Monitoring',
      altitude: 125,
      stationType: 'Professional',
      currentTemp: liveTemperatureData[liveTemperatureData.length - 1].value,
      currentHumidity: liveHumidityData[liveHumidityData.length - 1].value,
      currentWindSpeed: liveWindSpeedData[liveWindSpeedData.length - 1].value,
      currentRainfall: liveRainfallData[liveRainfallData.length - 1].value,
      currentCO2: liveCo2Data[liveCo2Data.length - 1].value,
      currentTVOC: liveTvocData[liveTvocData.length - 1].value,
      lastUpdate: new Date().toLocaleString('en-US'),
      status: 'good',
    }],
    currentWeatherData: {
      windSpeed: liveWindSpeedData[liveWindSpeedData.length - 1].value,
      rainfall: liveRainfallData[liveRainfallData.length - 1].value,
      temperature: liveTemperatureData[liveTemperatureData.length - 1].value,
      humidity: liveHumidityData[liveHumidityData.length - 1].value,
      co2: liveCo2Data[liveCo2Data.length - 1].value,
      tvoc: liveTvocData[liveTvocData.length - 1].value,
      lastUpdate: new Date().toLocaleString('en-US'),
    },
  };
}

// Subscribe untuk real-time updates (dummy - not using Firebase)
export function subscribeSkyveraRealtime(callback) {
  // Deprecated - use subscribeAllSkyveraData instead
  return () => {};
}

export function subscribeAllSkyveraData(callback) {
  realtimeSubscribers.push(callback);

  // Start interval
  if (!realtimeInterval) {
    realtimeInterval = setInterval(appendNewDataPoint, 60000); // Update setiap 60 detik
  }

  // Kirim data awal
  callback({
    windSpeedData: [...liveWindSpeedData],
    rainfallData: [...liveRainfallData],
    temperatureData: [...liveTemperatureData],
    humidityData: [...liveHumidityData],
    tvocData: [...liveTvocData],
    co2Data: [...liveCo2Data],
    currentWeatherData: {
      windSpeed: liveWindSpeedData[liveWindSpeedData.length - 1].value,
      rainfall: liveRainfallData[liveRainfallData.length - 1].value,
      temperature: liveTemperatureData[liveTemperatureData.length - 1].value,
      humidity: liveHumidityData[liveHumidityData.length - 1].value,
      tvoc: liveTvocData[liveTvocData.length - 1].value,
      co2: liveCo2Data[liveCo2Data.length - 1].value,
      lastUpdate: new Date().toLocaleString('en-US'),
    },
  });

  // Return unsubscribe function
  return () => {
    realtimeSubscribers = realtimeSubscribers.filter(cb => cb !== callback);
    
    if (realtimeSubscribers.length === 0 && realtimeInterval) {
      clearInterval(realtimeInterval);
      realtimeInterval = null;
    }
  };
}

// ============ Utility Functions ============

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

export const getWeatherStats = (weatherStations) => {
  const totalStations = (weatherStations || []).length;
  if (totalStations === 0) return { totalStations: 0, avgTemp: 0, avgHumidity: 0, avgWindSpeed: 0 };
  const avgTemp = (
    (weatherStations.reduce((sum, ws) => sum + (ws.currentTemp || 0), 0) / totalStations) || 0
  ).toFixed(1);
  const avgHumidity = Math.round(
    (weatherStations.reduce((sum, ws) => sum + (ws.currentHumidity || 0), 0) / totalStations) || 0
  );
  const avgWindSpeed = (
    (weatherStations.reduce((sum, ws) => sum + (ws.currentWindSpeed || 0), 0) / totalStations) || 0
  ).toFixed(1);

  return {
    totalStations,
    avgTemp,
    avgHumidity,
    avgWindSpeed,
  };
};

export const getStationById = (id, weatherStations) => {
  return (weatherStations || []).find((ws) => ws.id === id);
};

