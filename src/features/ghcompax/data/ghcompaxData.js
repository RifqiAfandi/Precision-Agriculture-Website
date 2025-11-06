// GH Compax Data - Monitoring Data Dummy

// Generate time series data dengan jumlah data point yang bisa diatur
const generateTimeSeriesData = (baseValue, variance, dataPoints = 20) => {
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

// Generate historical data dengan lebih banyak data points (untuk history mode)
export const generateHistoricalData = (baseValue, variance, hours = 24) => {
  const dataPoints = hours * 6; // 6 data points per jam (setiap 10 menit)
  return generateTimeSeriesData(baseValue, variance, dataPoints);
};

// Data time series untuk chart (20 data points untuk real-time, 1 jam terakhir)
export const temperatureData = generateTimeSeriesData(28.5, 3, 60); // 60 data points = 1 jam
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
