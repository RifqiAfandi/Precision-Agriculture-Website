import { useState, useEffect, useCallback, useRef } from 'react';
import { MONITORING_CONFIG } from '@/constants/monitoring';

export function useRealtimeMonitoring(
  updateFunction,
  initialData,
  chartDataSets = {},
  getChartValue = null,
  chartMode = 'detail2'
) {
  const [realtimeData, setRealtimeData] = useState(initialData);
  const [chartData, setChartData] = useState(chartDataSets);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const intervalRef = useRef(null);

  /**
   * Update all chart data sets with new data point
   */
  const updateChartData = useCallback((newRealtimeData) => {
    const now = new Date();
    const newTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    setChartData(prevData => {
      const updatedData = {};
      
      Object.keys(prevData).forEach(key => {
        const currentArray = prevData[key];
        const newValue = getChartValue 
          ? getChartValue(newRealtimeData, key)
          : newRealtimeData[key];

        // Shift left and add new data point
        updatedData[key] = [
          ...currentArray.slice(1),
          {
            time: newTime,
            value: typeof newValue === 'number' 
              ? parseFloat(newValue.toFixed(2))
              : newValue,
            timestamp: now.getTime(),
          }
        ];
      });

      return updatedData;
    });

    setLastUpdate(now);
  }, [getChartValue]);

  const performUpdate = useCallback(() => {
    setIsUpdating(true);
    
    try {
      const newData = updateFunction(realtimeData);
      setRealtimeData(newData);
      updateChartData(newData);
    } catch (error) {
      console.error('Error updating monitoring data:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [realtimeData, updateFunction, updateChartData]);

  const forceUpdate = useCallback(() => {
    performUpdate();
  }, [performUpdate]);

  useEffect(() => {
    if (chartMode === 'history') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start interval
    intervalRef.current = setInterval(() => {
      performUpdate();
    }, MONITORING_CONFIG.UPDATE_INTERVAL_MS);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [chartMode, performUpdate]);

  useEffect(() => {
    setRealtimeData(initialData);
  }, [initialData]);

  return {
    realtimeData,
    chartData,
    isUpdating,
    lastUpdate,
    forceUpdate,
  };
}

export function useChartData(initialDataSets = [], maxDataPoints = MONITORING_CONFIG.REALTIME_DATA_POINTS) {
  const [dataSets, setDataSets] = useState(initialDataSets);

  const addDataPoint = useCallback((datasetIndex, newPoint) => {
    setDataSets(prev => {
      const newDataSets = [...prev];
      const currentSet = newDataSets[datasetIndex] || [];
      
      // Keep only maxDataPoints
      newDataSets[datasetIndex] = [
        ...currentSet.slice(-(maxDataPoints - 1)),
        newPoint
      ];
      
      return newDataSets;
    });
  }, [maxDataPoints]);

  /**
   * Clear all data
   */
  const clearData = useCallback(() => {
    setDataSets(initialDataSets);
  }, [initialDataSets]);

  return {
    dataSets,
    addDataPoint,
    clearData,
    setDataSets,
  };
}

export function useMonitoringView() {
  const [viewMode, setViewMode] = useState('overview');
  const [selectedChart, setSelectedChart] = useState(null);
  const [chartMode, setChartMode] = useState('detail2');

  const showDetail = useCallback((chartConfig) => {
    setSelectedChart(chartConfig);
    setViewMode('detail');
  }, []);

  const showOverview = useCallback(() => {
    setSelectedChart(null);
    setViewMode('overview');
  }, []);

  const toggleChartMode = useCallback((mode) => {
    setChartMode(mode);
    localStorage.setItem('agri-chart-mode', mode);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('agri-chart-mode');
    if (savedMode) {
      setChartMode(savedMode);
    }
  }, []);

  return {
    viewMode,
    selectedChart,
    chartMode,
    showDetail,
    showOverview,
    setChartMode: toggleChartMode,
  };
}
