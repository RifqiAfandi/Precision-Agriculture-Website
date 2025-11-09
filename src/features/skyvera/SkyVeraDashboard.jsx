import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Cloud, Thermometer, Droplets, Wind, CloudRain, Activity, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart } from "@/features/ghcompax/components/LineChart";
import { LineChartCard } from "./components/LineChartCard";
import { DetailChartView } from "./components/DetailChartView";
import {
  fetchSkyveraInitial,
  subscribeSkyveraRealtime,
  subscribeAllSkyveraData,
  getParameterStatus,
  getStatusLabel,
  getWeatherStats,
} from "./data/skyveraData";

const SkyVeraDashboard = () => {
  const [realtimeData, setRealtimeData] = useState({ lastUpdate: new Date().toLocaleString('en-US') });
  const [windData, setWindData] = useState([]);
  const [rainData, setRainData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [humidData, setHumidData] = useState([]);
  const [tvocData, setTvocData] = useState([]);
  const [co2Data, setCo2Data] = useState([]);
  const [weatherStations, setWeatherStations] = useState([]);
  const [temperatureHistoryData, setTemperatureHistoryData] = useState([]);
  const [humidityHistoryData, setHumidityHistoryData] = useState([]);
  const [windSpeedHistoryData, setWindSpeedHistoryData] = useState([]);
  const [rainfallHistoryData, setRainfallHistoryData] = useState([]);
  const [co2HistoryData, setCo2HistoryData] = useState([]);
  const [tvocHistoryData, setTvocHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [chartMode, setChartMode] = useState('detail2');
  const [lastHistoryUpdate, setLastHistoryUpdate] = useState(new Date());
  
  const [viewMode, setViewMode] = useState('overview'); 
  const [selectedChart, setSelectedChart] = useState(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  const stats = getWeatherStats(weatherStations);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const initial = await fetchSkyveraInitial();
        if (!mounted) return;

        setWindData(initial.windSpeedData || []);
        setRainData(initial.rainfallData || []);
        setTempData((initial.temperatureHistoryData || []).slice(-20).map(d => ({ ...d })));
        setHumidData((initial.humidityHistoryData || []).slice(-20).map(d => ({ ...d })));
        setTvocData((initial.tvocHistoryData || []).slice(-20).map(d => ({ ...d })));
        setCo2Data((initial.co2HistoryData || []).slice(-20).map(d => ({ ...d })));

        setTemperatureHistoryData(initial.temperatureHistoryData || []);
        setHumidityHistoryData(initial.humidityHistoryData || []);
        setWindSpeedHistoryData(initial.windSpeedHistoryData || []);
        setRainfallHistoryData(initial.rainfallHistoryData || []);
        setCo2HistoryData(initial.co2HistoryData || []);
        setTvocHistoryData(initial.tvocHistoryData || []);

        setWeatherStations(initial.weatherStations || []);
        setRealtimeData(initial.currentWeatherData || { lastUpdate: new Date().toLocaleString('en-US') });
      } catch (err) {
        console.error('Error loading initial SkyVera data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let unsubscribe = null;
    try {
      unsubscribe = subscribeAllSkyveraData((data) => {
        if (!data) return;
        
        setWindData(data.windSpeedData || []);
        setRainData(data.rainfallData || []);
        setTempData((data.temperatureData || []).slice(-20));
        setHumidData((data.humidityData || []).slice(-20));
        setTvocData((data.tvocData || []).slice(-20));
        setCo2Data((data.co2Data || []).slice(-20));
        
        setTemperatureHistoryData(data.temperatureData || []);
        setHumidityHistoryData(data.humidityData || []);
        setWindSpeedHistoryData(data.windSpeedData || []);
        setRainfallHistoryData(data.rainfallData || []);
        setCo2HistoryData(data.co2Data || []);
        setTvocHistoryData(data.tvocData || []);
        
        if (data.currentWeatherData) {
          setRealtimeData(data.currentWeatherData);
          
          setWeatherStations([{
            id: 'ws1',
            name: 'SkyVera Station #1',
            location: 'Area Monitoring',
            altitude: 125,
            stationType: 'Professional',
            currentTemp: data.currentWeatherData.temperature,
            currentHumidity: data.currentWeatherData.humidity,
            currentWindSpeed: data.currentWeatherData.windSpeed,
            currentRainfall: data.currentWeatherData.rainfall,
            currentCO2: data.currentWeatherData.co2,
            currentTVOC: data.currentWeatherData.tvoc,
            lastUpdate: data.currentWeatherData.lastUpdate,
            status: 'good',
          }]);
        }
      });
    } catch (err) {
      console.error('subscribeAllSkyveraData failed', err);
    }

    return () => {
      try {
        if (typeof unsubscribe === 'function') unsubscribe();
      } catch (e) {
        console.error('Error unsubscribing', e);
      }
    };
  }, []);



  const handleHistoryRefresh = () => {
    setLastHistoryUpdate(new Date());
  };

  const calculateAverage = (data) => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return sum / data.length;
  };

  const getBoxValue = (parameter, normalValue) => {
    if (chartMode !== 'history') {
      return normalValue;
    }

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
    if (parameter === 'humidity' || parameter === 'co2') {
      return Math.round(avg);
    } else {
      return avg.toFixed(1);
    }
  };

  const monitoringBoxes = [
    {
      title: 'Wind Speed',
      value: getBoxValue('windSpeed', ((realtimeData.windSpeed || 0) || 12.5).toFixed(1)),
      unit: 'km/h',
      icon: Wind,
      parameter: 'windSpeed',
      description: 'Wind Speed',
      color: '#8b5cf6',
    },
    {
      title: 'Rainfall',
      value: getBoxValue('rainfall', ((realtimeData.rainfall || 0) || 2.3).toFixed(1)),
      unit: 'mm',
      icon: CloudRain,
      parameter: 'rainfall',
      description: 'Rainfall',
      color: '#06b6d4',
    },
    {
      title: 'Temperature',
      value: getBoxValue('temperature', (realtimeData.temperature || 0).toFixed(1)),
      unit: '°C',
      icon: Thermometer,
      parameter: 'temperature',
      description: 'Temperature',
      color: '#ef4444',
    },
    {
      title: 'Humidity',
      value: getBoxValue('humidity', Math.round(realtimeData.humidity || 0)),
      unit: '%',
      icon: Droplets,
      parameter: 'humidity',
      description: 'Humidity',
      color: '#3b82f6',
    },
    {
      title: 'TVOC',
      value: getBoxValue('tvoc', (realtimeData.tvoc || 0).toFixed(2)),
      unit: 'mg/m³',
      icon: Wind,
      parameter: 'tvoc',
      description: 'Total Volatile Organic Compounds',
      color: '#f59e0b',
    },
    {
      title: 'eCO₂',
      value: getBoxValue('co2', realtimeData.co2 || 0),
      unit: 'ppm',
      icon: Activity,
      parameter: 'co2',
      description: 'Equivalent CO2',
      color: '#10b981',
    },
  ];

  const getChartsToDisplay = () => {
    const getLastNData = (data, n) => {
      return data.slice(-n);
    };
    
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
      return allCharts.slice(0, 2);
    } else if (chartMode === 'detail4') {
      return allCharts.slice(2); 
    } else {
      return allCharts;
    }
  };

  const handleChartClick = (chart) => {
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
