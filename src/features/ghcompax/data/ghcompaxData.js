// GH Compax Data - Monitoring Data Dummy

// Generate time series data dengan jumlah data point yang bisa diatur
// Data terakhir = waktu sekarang, data sebelumnya mundur 1 menit per data
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

// Generate historical data dengan lebih banyak data points (untuk history mode)
export const generateHistoricalData = (baseValue, variance, hours = 24) => {
  const dataPoints = hours * 6; // 6 data points per jam (setiap 10 menit)
  return generateTimeSeriesData(baseValue, variance, dataPoints);
};

// Fungsi untuk mendapatkan data fresh (regenerate dengan timestamp baru)
export const getFreshData = () => {
  const tempData = generateTimeSeriesData(28.5, 3, 60);
  const humidData = generateTimeSeriesData(75, 10, 60);
  const tvocData = generateTimeSeriesData(0.35, 0.5, 60);
  const eco2Data = generateTimeSeriesData(450, 100, 60);
  const tdsData = generateTimeSeriesData(850, 150, 60);
  const phData = generateTimeSeriesData(6.8, 1, 60);

  return {
    temperatureData: tempData,
    humidityData: humidData,
    tvocData,
    eco2Data,
    tdsData,
    phData,
    temperatureHistoryData: generateHistoricalData(28.5, 3, 24),
    humidityHistoryData: generateHistoricalData(75, 10, 24),
    tvocHistoryData: generateHistoricalData(0.35, 0.5, 24),
    eco2HistoryData: generateHistoricalData(450, 100, 24),
    tdsHistoryData: generateHistoricalData(850, 150, 24),
    phHistoryData: generateHistoricalData(6.8, 1, 24),
    currentData: {
      temperature: tempData[tempData.length - 1].value,
      humidity: humidData[humidData.length - 1].value,
      tvoc: tvocData[tvocData.length - 1].value,
      eco2: eco2Data[eco2Data.length - 1].value,
      tds: tdsData[tdsData.length - 1].value,
      phAir: phData[phData.length - 1].value,
      lastUpdate: new Date().toLocaleString('en-US'),
    },
  };
};

// Data time series untuk chart (60 data points untuk real-time, 1 jam terakhir)
export const temperatureData = generateTimeSeriesData(28.5, 3, 60);
export const humidityData = generateTimeSeriesData(75, 10, 60);

// Historical data (24 jam)
export const temperatureHistoryData = generateHistoricalData(28.5, 3, 24);
export const humidityHistoryData = generateHistoricalData(75, 10, 24);
export const tvocHistoryData = generateHistoricalData(0.35, 0.5, 24);
export const eco2HistoryData = generateHistoricalData(450, 100, 24);
export const tdsHistoryData = generateHistoricalData(850, 150, 24);
export const phHistoryData = generateHistoricalData(6.8, 1, 24);

// Current real-time data untuk monitoring boxes
export const currentGHCompaxData = {
  temperature: temperatureData[temperatureData.length - 1].value,
  humidity: humidityData[humidityData.length - 1].value,
  tvoc: 0.32, // mg/m³
  eco2: 410, // ppm
  tds: 850, // ppm
  phAir: 6.8,
  lastUpdate: new Date().toLocaleString('en-US'),
};

// GH Compax Units Data
export const ghCompaxUnits = [
  {
    id: 'gh1',
    name: 'GH Compax Unit #1',
    location: 'Area Greenhouse A',
    status: 'optimal',
    temperature: currentGHCompaxData.temperature,
    humidity: currentGHCompaxData.humidity,
    tvoc: currentGHCompaxData.tvoc,
    eco2: currentGHCompaxData.eco2,
    tds: currentGHCompaxData.tds,
    phAir: currentGHCompaxData.phAir,
    lastUpdate: currentGHCompaxData.lastUpdate,
    temperatureHistory: temperatureData,
    humidityHistory: humidityData,
  },
];

// Helper function untuk update data (simulasi real-time)
export const updateGHCompaxData = (currentData) => {
  // Shift data ke kiri dan tambah data baru di kanan
  const newTemp = currentData.temperature + (Math.random() - 0.5) * 1;
  const newHumidity = currentData.humidity + (Math.random() - 0.5) * 3;
  const newTvoc = Math.max(0.1, currentData.tvoc + (Math.random() - 0.5) * 0.1);
  const newEco2 = Math.max(350, currentData.eco2 + (Math.random() - 0.5) * 20);
  const newTds = Math.max(500, currentData.tds + (Math.random() - 0.5) * 50);
  const newPhAir = Math.max(5, Math.min(8, currentData.phAir + (Math.random() - 0.5) * 0.3));

  return {
    temperature: parseFloat(newTemp.toFixed(2)),
    humidity: parseFloat(newHumidity.toFixed(2)),
    tvoc: parseFloat(newTvoc.toFixed(2)),
    eco2: Math.round(newEco2),
    tds: Math.round(newTds),
    phAir: parseFloat(newPhAir.toFixed(1)),
    lastUpdate: new Date().toLocaleString('en-US'),
  };
};

// Parameter status helper
export const getParameterStatus = (value, parameter) => {
  switch (parameter) {
    case 'temperature':
      if (value >= 24 && value <= 30)
        return { status: 'optimal', color: 'text-green-600', bg: 'bg-green-100' };
      if (value >= 20 && value <= 35)
        return { status: 'normal', color: 'text-blue-600', bg: 'bg-blue-100' };
      return { status: 'warning', color: 'text-red-600', bg: 'bg-red-100' };

    case 'humidity':
      if (value >= 60 && value <= 80)
        return { status: 'optimal', color: 'text-green-600', bg: 'bg-green-100' };
      if (value >= 40 && value <= 90)
        return { status: 'normal', color: 'text-blue-600', bg: 'bg-blue-100' };
      return { status: 'warning', color: 'text-orange-600', bg: 'bg-orange-100' };

    case 'tvoc':
      if (value <= 0.4)
        return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-100' };
      if (value <= 1.0)
        return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-100' };
      if (value <= 3.0)
        return { status: 'moderate', color: 'text-orange-600', bg: 'bg-orange-100' };
      return { status: 'poor', color: 'text-red-600', bg: 'bg-red-100' };

    case 'eco2':
      if (value <= 450)
        return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-100' };
      if (value <= 600)
        return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-100' };
      if (value <= 800)
        return { status: 'moderate', color: 'text-orange-600', bg: 'bg-orange-100' };
      return { status: 'poor', color: 'text-red-600', bg: 'bg-red-100' };

    case 'tds':
      if (value >= 700 && value <= 1000)
        return { status: 'optimal', color: 'text-green-600', bg: 'bg-green-100' };
      if (value >= 500 && value <= 1500)
        return { status: 'normal', color: 'text-blue-600', bg: 'bg-blue-100' };
      return { status: 'warning', color: 'text-orange-600', bg: 'bg-orange-100' };

    case 'phAir':
      if (value >= 6.0 && value <= 7.5)
        return { status: 'optimal', color: 'text-green-600', bg: 'bg-green-100' };
      if (value >= 5.5 && value <= 8.0)
        return { status: 'normal', color: 'text-blue-600', bg: 'bg-blue-100' };
      return { status: 'warning', color: 'text-orange-600', bg: 'bg-orange-100' };

    default:
      return { status: 'normal', color: 'text-gray-600', bg: 'bg-gray-100' };
  }
};

export const getStatusLabel = (status) => {
  const labels = {
    excellent: 'Sangat Baik',
    optimal: 'Optimal',
    good: 'Baik',
    normal: 'Normal',
    moderate: 'Sedang',
    warning: 'Peringatan',
    poor: 'Buruk',
  };
  return labels[status] || 'Normal';
};

// Statistics
export const getGHCompaxStats = () => {
  return {
    totalUnits: ghCompaxUnits.length,
    avgTemperature: currentGHCompaxData.temperature,
    avgHumidity: currentGHCompaxData.humidity,
    avgEco2: currentGHCompaxData.eco2,
  };
};

// Real-time data simulation - Subscribe untuk update data baru
let realtimeSubscribers = [];
let realtimeInterval = null;

// Inisialisasi data array untuk subscription
let liveTemperatureData = [...temperatureData];
let liveHumidityData = [...humidityData];
let liveTvocData = generateTimeSeriesData(0.35, 0.5, 60);
let liveEco2Data = generateTimeSeriesData(450, 100, 60);
let liveTdsData = generateTimeSeriesData(850, 150, 60);
let livePhData = generateTimeSeriesData(6.8, 1, 60);

// Fungsi untuk menambahkan data baru (smooth append, tidak regenerate)
const appendNewDataPoint = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });
  const timestamp = now.getTime();

  // Generate nilai baru berdasarkan nilai terakhir (smooth transition)
  const lastTemp = liveTemperatureData[liveTemperatureData.length - 1].value;
  const lastHumid = liveHumidityData[liveHumidityData.length - 1].value;
  const lastTvoc = liveTvocData[liveTvocData.length - 1].value;
  const lastEco2 = liveEco2Data[liveEco2Data.length - 1].value;
  const lastTds = liveTdsData[liveTdsData.length - 1].value;
  const lastPh = livePhData[livePhData.length - 1].value;

  // Tambahkan variasi kecil untuk simulasi perubahan natural
  const newTemp = parseFloat((lastTemp + (Math.random() - 0.5) * 0.5).toFixed(2));
  const newHumid = parseFloat((lastHumid + (Math.random() - 0.5) * 1.5).toFixed(2));
  const newTvoc = parseFloat(Math.max(0.1, lastTvoc + (Math.random() - 0.5) * 0.05).toFixed(2));
  const newEco2 = Math.round(Math.max(350, lastEco2 + (Math.random() - 0.5) * 10));
  const newTds = Math.round(Math.max(500, lastTds + (Math.random() - 0.5) * 25));
  const newPh = parseFloat(Math.max(5, Math.min(8, lastPh + (Math.random() - 0.5) * 0.1)).toFixed(2));

  // Append data baru
  liveTemperatureData.push({ time, value: newTemp, timestamp });
  liveHumidityData.push({ time, value: newHumid, timestamp });
  liveTvocData.push({ time, value: newTvoc, timestamp });
  liveEco2Data.push({ time, value: newEco2, timestamp });
  liveTdsData.push({ time, value: newTds, timestamp });
  livePhData.push({ time, value: newPh, timestamp });

  // Keep only last 60 minutes of data
  if (liveTemperatureData.length > 60) {
    liveTemperatureData.shift();
    liveHumidityData.shift();
    liveTvocData.shift();
    liveEco2Data.shift();
    liveTdsData.shift();
    livePhData.shift();
  }

  // Notify all subscribers
  const newData = {
    temperatureData: [...liveTemperatureData],
    humidityData: [...liveHumidityData],
    tvocData: [...liveTvocData],
    eco2Data: [...liveEco2Data],
    tdsData: [...liveTdsData],
    phData: [...livePhData],
    currentData: {
      temperature: newTemp,
      humidity: newHumid,
      tvoc: newTvoc,
      eco2: newEco2,
      tds: newTds,
      phAir: newPh,
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

// Subscribe untuk real-time updates
export const subscribeGHCompaxRealtime = (callback) => {
  realtimeSubscribers.push(callback);

  // Start interval jika belum ada
  if (!realtimeInterval) {
    realtimeInterval = setInterval(appendNewDataPoint, 60000); // Update setiap 60 detik
  }

  // Kirim data awal
  callback({
    temperatureData: [...liveTemperatureData],
    humidityData: [...liveHumidityData],
    tvocData: [...liveTvocData],
    eco2Data: [...liveEco2Data],
    tdsData: [...liveTdsData],
    phData: [...livePhData],
    currentData: {
      temperature: liveTemperatureData[liveTemperatureData.length - 1].value,
      humidity: liveHumidityData[liveHumidityData.length - 1].value,
      tvoc: liveTvocData[liveTvocData.length - 1].value,
      eco2: liveEco2Data[liveEco2Data.length - 1].value,
      tds: liveTdsData[liveTdsData.length - 1].value,
      phAir: livePhData[livePhData.length - 1].value,
      lastUpdate: new Date().toLocaleString('en-US'),
    },
  });

  // Return unsubscribe function
  return () => {
    realtimeSubscribers = realtimeSubscribers.filter(cb => cb !== callback);
    
    // Stop interval jika tidak ada subscriber
    if (realtimeSubscribers.length === 0 && realtimeInterval) {
      clearInterval(realtimeInterval);
      realtimeInterval = null;
    }
  };
};

// Fetch initial data
export const fetchGHCompaxInitial = async () => {
  return {
    temperatureData: [...liveTemperatureData],
    humidityData: [...liveHumidityData],
    tvocData: [...liveTvocData],
    eco2Data: [...liveEco2Data],
    tdsData: [...liveTdsData],
    phData: [...livePhData],
    temperatureHistoryData: generateHistoricalData(28.5, 3, 24),
    humidityHistoryData: generateHistoricalData(75, 10, 24),
    tvocHistoryData: generateHistoricalData(0.35, 0.5, 24),
    eco2HistoryData: generateHistoricalData(450, 100, 24),
    tdsHistoryData: generateHistoricalData(850, 150, 24),
    phHistoryData: generateHistoricalData(6.8, 1, 24),
    currentData: {
      temperature: liveTemperatureData[liveTemperatureData.length - 1].value,
      humidity: liveHumidityData[liveHumidityData.length - 1].value,
      tvoc: liveTvocData[liveTvocData.length - 1].value,
      eco2: liveEco2Data[liveEco2Data.length - 1].value,
      tds: liveTdsData[liveTdsData.length - 1].value,
      phAir: livePhData[livePhData.length - 1].value,
      lastUpdate: new Date().toLocaleString('en-US'),
    },
    ghCompaxUnits: ghCompaxUnits,
  };
};
