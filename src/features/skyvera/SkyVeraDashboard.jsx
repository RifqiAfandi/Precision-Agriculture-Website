import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Cloud, Thermometer, Droplets, Wind, CloudRain, Activity, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart } from "@/features/ghcompax/components/LineChart";
import { LineChartCard } from "./components/LineChartCard";
import { DetailChartView } from "./components/DetailChartView";
import {
  weatherStations,
  currentWeatherData,
  windSpeedData,
  rainfallData,
  temperatureHistoryData,
  humidityHistoryData,
  windSpeedHistoryData,
  rainfallHistoryData,
  co2HistoryData,
  tvocHistoryData,
  updateSkyVeraData,
  getParameterStatus,
  getStatusLabel,
  getWeatherStats,
} from "./data/skyveraData";

const SkyVeraDashboard = () => {
  const [realtimeData, setRealtimeData] = useState(currentWeatherData);
  const [windData, setWindData] = useState(windSpeedData);
  const [rainData, setRainData] = useState(rainfallData);
  const [tempData, setTempData] = useState(windSpeedData.map(d => ({ ...d, value: Math.random() * 5 + 28 })));
  const [humidData, setHumidData] = useState(windSpeedData.map(d => ({ ...d, value: Math.random() * 10 + 70 })));
  const [tvocData, setTvocData] = useState(windSpeedData.map(d => ({ ...d, value: Math.random() * 0.3 + 0.2 })));
  const [co2Data, setCo2Data] = useState(windSpeedData.map(d => ({ ...d, value: Math.random() * 50 + 400 })));
  
  // Chart mode: 'detail2', 'detail4', 'history'
  const [chartMode, setChartMode] = useState('detail2');
  const [lastHistoryUpdate, setLastHistoryUpdate] = useState(new Date());
  
  // New state for detail view
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'detail'
  const [selectedChart, setSelectedChart] = useState(null); // null or chart object
  
  // Animation state
  const [isLoaded, setIsLoaded] = useState(false);
  
  const stats = getWeatherStats();

  // Initial load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Update data setiap 60 detik (1 menit) - hanya untuk mode detail2 dan detail4
  useEffect(() => {
    if (chartMode === 'history') return; // Skip real-time update in history mode
    
    const interval = setInterval(() => {
      const newData = updateSkyVeraData(realtimeData);
      setRealtimeData(newData);

      // Update chart data - shift left and add new data
      const now = new Date();
      const newTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      setWindData(prev => {
        const newWindSpeed = newData.windSpeed || (prev[prev.length - 1].value + (Math.random() - 0.5) * 2);
        const newArr = [...prev.slice(1), {
          time: newTime,
          value: parseFloat(newWindSpeed.toFixed(2)),
          timestamp: now.getTime(),
        }];
        return newArr;
      });

      setRainData(prev => {
        const newRainfall = newData.rainfall || (prev[prev.length - 1].value + (Math.random() - 0.5) * 1);
        const newArr = [...prev.slice(1), {
          time: newTime,
          value: Math.max(0, parseFloat(newRainfall.toFixed(2))),
          timestamp: now.getTime(),
        }];
        return newArr;
      });

      setTempData(prev => {
        const newArr = [...prev.slice(1), {
          time: newTime,
          value: newData.temperature,
          timestamp: now.getTime(),
        }];
        return newArr;
      });

      setHumidData(prev => {
        const newArr = [...prev.slice(1), {
          time: newTime,
          value: newData.humidity,
          timestamp: now.getTime(),
        }];
        return newArr;
      });

      setTvocData(prev => {
        const newArr = [...prev.slice(1), {
          time: newTime,
          value: newData.tvoc,
          timestamp: now.getTime(),
        }];
        return newArr;
      });

      setCo2Data(prev => {
        const newArr = [...prev.slice(1), {
          time: newTime,
          value: newData.co2,
          timestamp: now.getTime(),
        }];
        return newArr;
      });
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [realtimeData, chartMode]);

  // Handle history mode refresh
  const handleHistoryRefresh = () => {
    setLastHistoryUpdate(new Date());
    // In real app, fetch historical data from API here
  };

  // Calculate average for history mode
  const calculateAverage = (data) => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return sum / data.length;
  };

  // Get monitoring box value based on mode
  const getBoxValue = (parameter, normalValue) => {
    if (chartMode !== 'history') {
      return normalValue;
    }

    // In history mode, show average
    let dataToUse;
    switch (parameter) {
      case 'windSpeed':
        dataToUse = windData;
        break;
      case 'rainfall':
        dataToUse = rainData;
        break;
      case 'temperature':
        dataToUse = tempData;
        break;
      case 'humidity':
        dataToUse = humidData;
        break;
      case 'tvoc':
        dataToUse = tvocData;
        break;
      case 'co2':
        dataToUse = co2Data;
        break;
      default:
        return normalValue;
    }

    const avg = calculateAverage(dataToUse);
    // Format based on parameter type
    if (parameter === 'humidity' || parameter === 'co2') {
      return Math.round(avg);
    } else {
      return avg.toFixed(1);
    }
  };

  const monitoringBoxes = [
    {
      title: 'Wind Speed',
      value: getBoxValue('windSpeed', (realtimeData.windSpeed || 12.5).toFixed(1)),
      unit: 'km/h',
      icon: Wind,
      parameter: 'windSpeed',
      description: 'Wind Speed',
      color: '#8b5cf6',
    },
    {
      title: 'Rainfall',
      value: getBoxValue('rainfall', (realtimeData.rainfall || 2.3).toFixed(1)),
      unit: 'mm',
      icon: CloudRain,
      parameter: 'rainfall',
      description: 'Rainfall',
      color: '#06b6d4',
    },
    {
      title: 'Temperature',
      value: getBoxValue('temperature', realtimeData.temperature.toFixed(1)),
      unit: '°C',
      icon: Thermometer,
      parameter: 'temperature',
      description: 'Temperature',
      color: '#ef4444',
    },
    {
      title: 'Humidity',
      value: getBoxValue('humidity', Math.round(realtimeData.humidity)),
      unit: '%',
      icon: Droplets,
      parameter: 'humidity',
      description: 'Humidity',
      color: '#3b82f6',
    },
    {
      title: 'TVOC',
      value: getBoxValue('tvoc', realtimeData.tvoc.toFixed(2)),
      unit: 'mg/m³',
      icon: Wind,
      parameter: 'tvoc',
      description: 'Total Volatile Organic Compounds',
      color: '#f59e0b',
    },
    {
      title: 'eCO₂',
      value: getBoxValue('co2', realtimeData.co2),
      unit: 'ppm',
      icon: Activity,
      parameter: 'co2',
      description: 'Equivalent CO2',
      color: '#10b981',
    },
  ];

  // Get charts to display based on mode
  const getChartsToDisplay = () => {
    // Helper function to get last N data points
    const getLastNData = (data, n) => {
      return data.slice(-n);
    };
    
    // Detail 2 & Detail 4: Use last 20 data points (20 minutes) from real-time data
    // History: Use last 60 data points (1 hour) from historical data
    const allCharts = [
      { 
        data: chartMode === 'history' ? getLastNData(windSpeedHistoryData, 60) : getLastNData(windData, 20), 
        title: 'Wind Speed', 
        unit: 'km/h', 
        color: '#8b5cf6', 
        icon: Wind,
        parameter: 'windSpeed'
      },
      { 
        data: chartMode === 'history' ? getLastNData(rainfallHistoryData, 60) : getLastNData(rainData, 20), 
        title: 'Rainfall', 
        unit: 'mm', 
        color: '#06b6d4', 
        icon: CloudRain,
        parameter: 'rainfall'
      },
      { 
        data: chartMode === 'history' ? getLastNData(temperatureHistoryData, 60) : getLastNData(tempData, 20), 
        title: 'Temperature', 
        unit: '°C', 
        color: '#ef4444', 
        icon: Thermometer,
        parameter: 'temperature'
      },
      { 
        data: chartMode === 'history' ? getLastNData(humidityHistoryData, 60) : getLastNData(humidData, 20), 
        title: 'Humidity', 
        unit: '%', 
        color: '#3b82f6', 
        icon: Droplets,
        parameter: 'humidity'
      },
      { 
        data: chartMode === 'history' ? getLastNData(tvocHistoryData, 60) : getLastNData(tvocData, 20), 
        title: 'TVOC', 
        unit: 'mg/m³', 
        color: '#f59e0b', 
        icon: Wind,
        parameter: 'tvoc'
      },
      { 
        data: chartMode === 'history' ? getLastNData(co2HistoryData, 60) : getLastNData(co2Data, 20), 
        title: 'eCO₂', 
        unit: 'ppm', 
        color: '#10b981', 
        icon: Activity,
        parameter: 'co2'
      },
    ];

    if (chartMode === 'detail2') {
      return allCharts.slice(0, 2); // Wind Speed & Rainfall
    } else if (chartMode === 'detail4') {
      // Show 4 charts at once: Temperature, Humidity, TVOC, eCO₂
      return allCharts.slice(2); // Temperature, Humidity, TVOC, eCO₂
    } else {
      // History mode - show all 6 in grid
      return allCharts;
    }
  };

  // Handler untuk membuka detail view
  const handleChartClick = (chart) => {
    // Get full historical data for detail view (not just 60 points)
    const fullDataMap = {
      'windSpeed': windSpeedHistoryData,
      'rainfall': rainfallHistoryData,
      'temperature': temperatureHistoryData,
      'humidity': humidityHistoryData,
      'tvoc': tvocHistoryData,
      'co2': co2HistoryData,
    };
    
    setSelectedChart({
      ...chart,
      data: fullDataMap[chart.parameter] || chart.data
    });
    setViewMode('detail');
  };

  // Handler untuk kembali ke overview
  const handleBackToOverview = () => {
    setViewMode('overview');
    setSelectedChart(null);
  };

  return (
    <div className={`h-full overflow-hidden flex flex-col p-2 sm:p-3 bg-slate-50 dark:bg-background transition-all duration-300 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Show Detail View if in detail mode - Full overlay */}
      {viewMode === 'detail' && selectedChart && (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-background animate-fade-in">
          <DetailChartView
            data={selectedChart.data}
            title={selectedChart.title}
            unit={selectedChart.unit}
            color={selectedChart.color}
            icon={selectedChart.icon}
            parameter={selectedChart.parameter}
            onBack={handleBackToOverview}
          />
        </div>
      )}

      {/* Show Overview if in overview mode */}
      {viewMode === 'overview' && (
        <>
      {/* Real-time Monitoring Boxes - Responsive grid: Enhanced width and content size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 flex-shrink-0">
        {monitoringBoxes.map((box, index) => {
          const status = getParameterStatus(parseFloat(box.value), box.parameter);
          return (
            <div
              key={index}
              className={`group relative bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in active:scale-95`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 dark:from-gray-900/50 to-white dark:to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <Card className="relative border-0 shadow-none bg-transparent">
                <CardContent className="p-2 sm:p-3 lg:p-5">
                  <div className="flex items-start justify-between mb-1.5 sm:mb-2 lg:mb-3">
                    <div className={`relative w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 ${status.bg} dark:bg-blue-500/20 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <box.icon className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 ${status.color} dark:text-blue-400`} />
                      <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 ${status.color.replace('text-', 'bg-')} dark:bg-blue-400 rounded-full animate-pulse`} />
                    </div>
                    <div className={`px-1.5 sm:px-2 lg:px-2.5 py-0.5 sm:py-1 rounded-md text-[8px] sm:text-[9px] lg:text-xs font-semibold ${
                      chartMode === 'history' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : `${status.bg} ${status.color} dark:bg-blue-500/20 dark:text-blue-400`
                    } shadow-sm`}>
                      {chartMode === 'history' ? 'Avg' : getStatusLabel(status.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] lg:text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1 lg:mb-1.5">
                      {box.title}
                    </p>
                    <div className="flex items-baseline space-x-0.5 sm:space-x-1 mb-0.5 sm:mb-1 lg:mb-1.5">
                      <span className="text-base sm:text-xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        {box.value}
                      </span>
                      <span className="text-[10px] sm:text-xs lg:text-base text-gray-500 dark:text-gray-400 font-medium">{box.unit}</span>
                    </div>
                    <p className="text-[7px] sm:text-[8px] lg:text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1">
                      {chartMode === 'history' 
                        ? 'Average 1 Hour'
                        : box.description
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Chart Mode Selector */}
      <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border p-1.5 sm:p-2 mb-2 flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <Button
              onClick={() => setChartMode('detail2')}
              variant={chartMode === 'detail2' ? 'default' : 'outline'}
              size="sm"
              className={`text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-3 ${
                chartMode === 'detail2' 
                  ? 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white' 
                  : 'hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white dark:text-gray-300'
              }`}
            >
              Detail 2
            </Button>
            <Button
              onClick={() => setChartMode('detail4')}
              variant={chartMode === 'detail4' ? 'default' : 'outline'}
              size="sm"
              className={`text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-3 ${
                chartMode === 'detail4' 
                  ? 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white' 
                  : 'hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white dark:text-gray-300'
              }`}
            >
              Detail 4
            </Button>
            <Button
              onClick={() => setChartMode('history')}
              variant={chartMode === 'history' ? 'default' : 'outline'}
              size="sm"
              className={`text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-3 ${
                chartMode === 'history' 
                  ? 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white' 
                  : 'hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white dark:text-gray-300'
              }`}
            >
              History
            </Button>
          </div>

          {/* History Controls */}
          {chartMode === 'history' && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Button
                onClick={handleHistoryRefresh}
                variant="outline"
                size="sm"
                className="h-6 sm:h-7 w-6 sm:w-7 p-0 dark:border-border dark:hover:bg-muted"
              >
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 dark:text-gray-300" />
              </Button>
              <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 hidden sm:inline">
                Updated: {lastHistoryUpdate.toLocaleTimeString('en-US')}
              </span>
            </div>
          )}

          {/* Real-time Indicator for non-history modes */}
          {chartMode !== 'history' && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400 font-medium">Real-time</span>
            </div>
          )}
        </div>
      </div>

      {/* Line Charts */}
      <div className="flex-1 min-h-0 mb-2 overflow-y-auto">
        <div className={
          chartMode === 'history' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3' 
            : 'grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'
        }>
        {chartMode === 'history' ? (
          // Use LineChartCard for history mode (clickable)
          getChartsToDisplay().map((chart, index) => (
            <LineChartCard
              key={`history-${chart.title}-${index}`}
              data={chart.data}
              title={chart.title}
              unit={chart.unit}
              color={chart.color}
              icon={chart.icon}
              onClick={() => handleChartClick(chart)}
            />
          ))
        ) : (
          // Use LineChartCard for detail2 and detail4 mode (NOT clickable - only display)
          getChartsToDisplay().map((chart, index) => (
            <LineChartCard
              key={`${chartMode}-${chart.title}-${index}`}
              data={chart.data}
              title={chart.title}
              unit={chart.unit}
              color={chart.color}
              icon={chart.icon}
              onClick={null}
            />
          ))
        )}
        </div>
      </div>

      {/* Last Update Info - Compact */}
      <div className="bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-cyan-50 dark:to-cyan-900/20 rounded-lg p-1.5 sm:p-2.5 border border-blue-100/50 dark:border-blue-800/50 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="relative flex items-center justify-center">
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full opacity-20 animate-ping absolute" />
              <div className="w-1 h-1 sm:w-2 sm:h-2 bg-blue-500 rounded-full relative" />
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium hidden xs:inline">Last Update</span>
            <span className="text-gray-600 dark:text-gray-400 font-medium xs:hidden">Update</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-muted px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
            {realtimeData.lastUpdate}
          </span>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default SkyVeraDashboard;
