import firebaseService from '@/services/firebase';

const convertFirebaseDataToArray = (firebaseData) => {
  if (!firebaseData) return [];
  
  if (Array.isArray(firebaseData)) return firebaseData;
  
  const entries = Object.entries(firebaseData)
    .sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB));
  
  const now = new Date();
  const totalEntries = entries.length;
  
  return entries.map(([key, value], index) => {
    const minutesAgo = totalEntries - 1 - index;
    const calculatedTime = new Date(now.getTime() - (minutesAgo * 60000));
    
    const time = calculatedTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
    
    return {
      time,
      timestamp: calculatedTime.getTime(),
      value: parseFloat(value.value || value) || 0,
      windSpeed: parseFloat(value.windSpeed) || 0,
      rainfall: parseFloat(value.rainfall) || 0,
      temperature: parseFloat(value.temperature) || 0,
      humidity: parseFloat(value.humidity) || 0,
      eco2: parseFloat(value.eco2) || 0,
      tvoc: parseFloat(value.tvoc) || 0
    };
  });
};

const extractCurrentData = (realtimeData) => {
  if (!realtimeData) return null;
  
  const entries = Object.entries(realtimeData)
    .sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB));
    
  if (entries.length === 0) return null;
  
  const [, latest] = entries[entries.length - 1];
  const now = new Date();
  
  return {
    windSpeed: parseFloat(latest.windSpeed) || 0,
    rainfall: parseFloat(latest.rainfall) || 0,
    temperature: parseFloat(latest.temperature) || 0,
    humidity: parseFloat(latest.humidity) || 0,
    co2: parseFloat(latest.eco2) || 0,
    tvoc: parseFloat(latest.tvoc) || 0,
    lastUpdate: now.toLocaleString('en-US'),
  };
};

export async function fetchSkyveraInitial() {
  try {
    const realtimeData = await firebaseService.fetchPath('/realtime_data');
    
    if (!realtimeData) {
      console.warn('No data found in Firebase path /realtime_data');
      return {
        windSpeedData: [],
        rainfallData: [],
        temperatureHistoryData: [],
        humidityHistoryData: [],
        windSpeedHistoryData: [],
        rainfallHistoryData: [],
        co2HistoryData: [],
        tvocHistoryData: [],
        weatherStations: [],
        currentWeatherData: {
          windSpeed: 0,
          rainfall: 0,
          temperature: 0,
          humidity: 0,
          co2: 0,
          tvoc: 0,
          lastUpdate: new Date().toLocaleString('en-US'),
        },
      };
    }

    const dataArray = convertFirebaseDataToArray(realtimeData);
    
    const windSpeedData = dataArray.map(d => ({
      time: d.time,
      timestamp: d.timestamp,
      value: parseFloat(d.windSpeed) || 0
    }));
    
    const rainfallData = dataArray.map(d => ({
      time: d.time,
      timestamp: d.timestamp,
      value: parseFloat(d.rainfall) || 0
    }));
    
    const temperatureHistoryData = dataArray.map(d => ({
      time: d.time,
      timestamp: d.timestamp,
      value: parseFloat(d.temperature) || 0
    }));
    
    const humidityHistoryData = dataArray.map(d => ({
      time: d.time,
      timestamp: d.timestamp,
      value: parseFloat(d.humidity) || 0
    }));
    
    const co2HistoryData = dataArray.map(d => ({
      time: d.time,
      timestamp: d.timestamp,
      value: parseFloat(d.eco2) || 0
    }));
    
    const tvocHistoryData = dataArray.map(d => ({
      time: d.time,
      timestamp: d.timestamp,
      value: parseFloat(d.tvoc) || 0
    }));

    const currentWeatherData = extractCurrentData(realtimeData) || {
      windSpeed: 0,
      rainfall: 0,
      temperature: 0,
      humidity: 0,
      co2: 0,
      tvoc: 0,
      lastUpdate: new Date().toLocaleString('en-US'),
    };

    const weatherStations = [{
      id: 'ws1',
      name: 'SkyVera Station #1',
      location: 'Area Monitoring',
      altitude: 125,
      stationType: 'Professional',
      currentTemp: currentWeatherData.temperature,
      currentHumidity: currentWeatherData.humidity,
      currentWindSpeed: currentWeatherData.windSpeed,
      currentRainfall: currentWeatherData.rainfall,
      currentCO2: currentWeatherData.co2,
      currentTVOC: currentWeatherData.tvoc,
      lastUpdate: currentWeatherData.lastUpdate,
      status: 'good',
    }];

    return {
      windSpeedData,
      rainfallData,
      temperatureHistoryData,
      humidityHistoryData,
      windSpeedHistoryData: windSpeedData,
      rainfallHistoryData: rainfallData,
      co2HistoryData,
      tvocHistoryData,
      weatherStations,
      currentWeatherData,
    };
  } catch (err) {
    console.error('fetchSkyveraInitial error', err);
    throw err;
  }
}

export function subscribeSkyveraRealtime(callback) {
  try {
    return firebaseService.subscribePath('/realtime_data', (val) => {
      if (!val) return;
      
      const latest = extractCurrentData(val);
      if (latest) {
        callback(latest);
      }
    });
  } catch (err) {
    console.error('subscribeSkyveraRealtime error', err);
    return null;
  }
}

export function subscribeAllSkyveraData(callback) {
  try {
    return firebaseService.subscribePath('/realtime_data', (val) => {
      if (!val) return;
      
      const dataArray = convertFirebaseDataToArray(val);
      
      const windSpeedData = dataArray.map(d => ({
        time: d.time,
        timestamp: d.timestamp,
        value: d.windSpeed
      }));
      
      const rainfallData = dataArray.map(d => ({
        time: d.time,
        timestamp: d.timestamp,
        value: d.rainfall
      }));
      
      const temperatureData = dataArray.map(d => ({
        time: d.time,
        timestamp: d.timestamp,
        value: d.temperature
      }));
      
      const humidityData = dataArray.map(d => ({
        time: d.time,
        timestamp: d.timestamp,
        value: d.humidity
      }));
      
      const co2Data = dataArray.map(d => ({
        time: d.time,
        timestamp: d.timestamp,
        value: d.eco2
      }));
      
      const tvocData = dataArray.map(d => ({
        time: d.time,
        timestamp: d.timestamp,
        value: d.tvoc
      }));
      
      const currentWeatherData = extractCurrentData(val);
      
      callback({
        windSpeedData,
        rainfallData,
        temperatureData,
        humidityData,
        co2Data,
        tvocData,
        currentWeatherData,
      });
    });
  } catch (err) {
    console.error('subscribeAllSkyveraData error', err);
    return null;
  }
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

