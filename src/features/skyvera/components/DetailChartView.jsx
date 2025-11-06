import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

export function DetailChartView({ data, title, unit, color, icon: Icon, onBack, parameter }) {
  const [timeFilter, setTimeFilter] = useState('1hour'); // Default to '1hour'
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, value: 0, time: '' });
  const animationFrameRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  if (!data || data.length === 0) return null;

  // Fungsi untuk agregasi data per jam
  const aggregateByHour = (dataPoints) => {
    const hourlyData = {};
    
    dataPoints.forEach(point => {
      const date = new Date(point.timestamp);
      const hourKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = {
          values: [],
          timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).getTime()
        };
      }
      hourlyData[hourKey].values.push(point.value);
    });
    
    return Object.values(hourlyData).map(hour => ({
      time: new Date(hour.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat((hour.values.reduce((a, b) => a + b, 0) / hour.values.length).toFixed(2)),
      timestamp: hour.timestamp
    })).sort((a, b) => a.timestamp - b.timestamp);
  };

  // Fungsi untuk agregasi data per hari
  const aggregateByDay = (dataPoints) => {
    const dailyData = {};
    
    dataPoints.forEach(point => {
      const date = new Date(point.timestamp);
      const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          values: [],
          timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
        };
      }
      dailyData[dayKey].values.push(point.value);
    });
    
    return Object.values(dailyData).map(day => ({
      time: new Date(day.timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      value: parseFloat((day.values.reduce((a, b) => a + b, 0) / day.values.length).toFixed(2)),
      timestamp: day.timestamp
    })).sort((a, b) => a.timestamp - b.timestamp);
  };

  // Filter data berdasarkan rentang waktu dengan expected data points
  const getFilteredData = () => {
    const now = Date.now();
    const filterConfig = {
      '1hour': { timeRange: 60 * 60 * 1000, expectedPoints: 60, aggregate: null }, // per menit
      '24hour': { timeRange: 24 * 60 * 60 * 1000, expectedPoints: 24, aggregate: 'hour' }, // rata-rata per jam
      '7days': { timeRange: 7 * 24 * 60 * 60 * 1000, expectedPoints: 7, aggregate: 'day' }, // rata-rata per hari
    };
    
    const config = filterConfig[timeFilter];
    
    // Filter data dalam rentang waktu
    let filtered = data.filter(d => (now - d.timestamp) <= config.timeRange);
    
    // Agregasi data jika diperlukan
    if (config.aggregate === 'hour') {
      filtered = aggregateByHour(filtered);
    } else if (config.aggregate === 'day') {
      filtered = aggregateByDay(filtered);
    }
    
    return {
      data: filtered,
      expectedPoints: config.expectedPoints,
      actualPoints: filtered.length
    };
  };

  const { data: filteredData, expectedPoints, actualPoints } = getFilteredData();
  const currentValue = data[data.length - 1].value;
  const previousValue = data.length > 1 ? data[0].value : currentValue;
  const totalChange = currentValue - previousValue;
  const totalChangePercent = previousValue !== 0 ? (totalChange / previousValue * 100) : 0;
  
  // Calculate statistics
  const values = filteredData.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;

  // Canvas drawing effect
  useEffect(() => {
    if (!filteredData || filteredData.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size with device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Chart dimensions with padding
    const padding = { top: 30, right: 60, bottom: 70, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    // Get value range
    const valueRange = maxValue - minValue || 1;

    // Detect dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    const gridColor = isDarkMode ? '#374151' : '#f5f5f5';
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';
    const axisColor = isDarkMode ? '#4b5563' : '#d1d5db';

    // Draw grid lines (horizontal)
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const y = padding.top + (chartHeight / 6) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      // Draw y-axis labels
      const value = maxValue - (valueRange / 6) * i;
      ctx.fillStyle = textColor;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), padding.left - 8, y + 4);
    }

    // Draw vertical grid lines and x-axis labels
    const labelInterval = Math.max(1, Math.floor(expectedPoints / 10));
    ctx.strokeStyle = gridColor;
    
    // Draw grid lines based on expected points
    for (let i = 0; i <= expectedPoints; i += labelInterval) {
      const x = padding.left + (chartWidth / expectedPoints) * i;
      
      // Vertical grid line
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartHeight);
      ctx.stroke();

      // X-axis labels - only if we have data at this point
      const dataIndex = Math.min(i, filteredData.length - 1);
      if (dataIndex >= 0 && dataIndex < filteredData.length && i % labelInterval === 0) {
        ctx.save();
        ctx.translate(x, padding.top + chartHeight + 15);
        ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = textColor;
        ctx.font = '600 10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(filteredData[dataIndex].time, 0, 0);
        ctx.restore();
      }
    }

    // Draw reference lines (avg, max, min)
    const drawReferenceLine = (value, color, label) => {
      const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = color;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, padding.left + chartWidth + 5, y + 4);
    };

    drawReferenceLine(avgValue, '#10b981', `Avg: ${avgValue.toFixed(2)}`);
    drawReferenceLine(maxValue, '#ef4444', `Max: ${maxValue.toFixed(2)}`);
    drawReferenceLine(minValue, '#3b82f6', `Min: ${minValue.toFixed(2)}`);

    // Draw X and Y axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();

    // Y-axis label
    ctx.save();
    ctx.translate(15, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = textColor;
    ctx.font = '600 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${title} (${unit})`, 0, 0);
    ctx.restore();

    // Only draw up to animationProgress (ensure at least 2 points for drawing a line)
    const visibleDataCount = Math.max(2, Math.floor(filteredData.length * animationProgress));
    const visibleData = filteredData.slice(0, visibleDataCount);

    if (visibleData.length > 0) {
      // Draw area under the line with gradient
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
      gradient.addColorStop(0, color + '50');
      gradient.addColorStop(0.5, color + '20');
      gradient.addColorStop(1, color + '00');

      ctx.beginPath();
      visibleData.forEach((point, index) => {
        // Use expectedPoints for consistent spacing
        const x = padding.left + (chartWidth / expectedPoints) * index;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      // Close the path
      const lastVisibleIndex = visibleData.length - 1;
      const lastX = padding.left + (chartWidth / expectedPoints) * lastVisibleIndex;
      ctx.lineTo(lastX, padding.top + chartHeight);
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw smooth line with shadow
      ctx.shadowColor = color + '40';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      visibleData.forEach((point, index) => {
        // Use expectedPoints for consistent spacing
        const x = padding.left + (chartWidth / expectedPoints) * index;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Draw points
      visibleData.forEach((point, index) => {
        // Use expectedPoints for consistent spacing
        const x = padding.left + (chartWidth / expectedPoints) * index;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;

        if (index === visibleData.length - 1) {
          // Last point - larger
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = color + '30';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else if (index % 3 === 0) {
          // Show every 3rd point
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }
      });
    }

  }, [filteredData, color, animationProgress, maxValue, minValue, avgValue, title, unit, expectedPoints]);

  // Animation effect
  useEffect(() => {
    let startTime = null;
    const duration = 1500; // 1.5 seconds

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      
      setAnimationProgress(easeOutProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Start from 0 and animate to 1
    setAnimationProgress(0);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timeFilter]); // Re-animate when filter changes

  // Handle mouse move for tooltip
  const handleMouseMove = (e) => {
    if (!filteredData || filteredData.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const padding = { top: 30, right: 60, bottom: 70, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    if (mouseX < padding.left || mouseX > padding.left + chartWidth || 
        mouseY < padding.top || mouseY > padding.top + chartHeight) {
      setTooltip({ show: false, x: 0, y: 0, value: 0, time: '' });
      return;
    }

    const relativeX = mouseX - padding.left;
    // Use expectedPoints for consistent spacing calculation
    const dataIndex = Math.round((relativeX / chartWidth) * expectedPoints);
    
    // Calculate visible data count based on animation progress
    const visibleDataCount = Math.max(2, Math.floor(filteredData.length * animationProgress));
    
    // Only show tooltip if:
    // 1. We have data at this index in filteredData
    // 2. The data point has been animated (rendered) already
    if (dataIndex >= 0 && dataIndex < filteredData.length && dataIndex < visibleDataCount) {
      const point = filteredData[dataIndex];
      const valueRange = maxValue - minValue || 1;
      const normalizedValue = (point.value - minValue) / valueRange;
      const pointY = padding.top + chartHeight - (normalizedValue * chartHeight);

      setTooltip({
        show: true,
        x: padding.left + (chartWidth / expectedPoints) * dataIndex,
        y: pointY,
        value: point.value,
        time: point.time
      });
    } else {
      setTooltip({ show: false, x: 0, y: 0, value: 0, time: '' });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, value: 0, time: '' });
  };

  // Custom tooltip - REMOVED (replaced with canvas tooltip)

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-slate-800">
      <div className="min-h-full p-2 sm:p-4">
        <div className="max-w-[1800px] mx-auto space-y-2 sm:space-y-4 pb-4">
      {/* Header with back button - Responsive stack on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 animate-slide-in-right" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 dark:text-gray-300 transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          {Icon && (
            <div 
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0" 
              style={{ backgroundColor: color + '20' }}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
            </div>
          )}
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Detail {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden xs:block">
              Analisis data historikal sensor
            </p>
          </div>
        </div>

        {/* Time Filter - Responsive */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap animate-slide-in-right w-full sm:w-auto" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">Filter:</span>
          {[
            { value: '1hour', label: '1 Hour' },
            { value: '24hour', label: '24 Hours' },
            { value: '7days', label: '7 Days' },
          ].map((filter) => (
            <Button
              key={filter.value}
              onClick={() => setTimeFilter(filter.value)}
              variant={timeFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              className={`text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-3 flex-1 sm:flex-initial ${
                timeFilter === filter.value
                  ? 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white'
                  : 'hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white dark:text-gray-300'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Statistics Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-2 sm:mb-4">
        {/* Current Value */}
        <Card className="border-2 shadow-md animate-fade-in-up" style={{ borderColor: color + '40', animationDelay: '0.3s', animationFillMode: 'backwards' }}>
          <CardContent className="p-2.5 sm:p-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-[9px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Current</span>
              {totalChange >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
              )}
            </div>
            <div className="text-xl sm:text-3xl font-bold tracking-tight" style={{ color }}>
              {currentValue.toFixed(2)}
              <span className="text-xs sm:text-lg font-medium text-gray-500 dark:text-gray-400 ml-0.5 sm:ml-1">{unit}</span>
            </div>
            <div className={`text-[10px] sm:text-sm font-semibold mt-0.5 sm:mt-1 ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalChange >= 0 ? '↑' : '↓'} {Math.abs(totalChangePercent).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        {/* Max Value */}
        <Card className="border border-gray-200 dark:border-border shadow-md hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
          <CardContent className="p-2.5 sm:p-4">
            <span className="text-[9px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-1 sm:mb-2">
              Maximum
            </span>
            <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
              {maxValue.toFixed(2)}
              <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 ml-0.5 sm:ml-1">{unit}</span>
            </div>
            <Badge variant="secondary" className="mt-1 sm:mt-2 text-[8px] sm:text-xs">
              Peak
            </Badge>
          </CardContent>
        </Card>

        {/* Min Value */}
        <Card className="border border-gray-200 dark:border-border shadow-md hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
          <CardContent className="p-2.5 sm:p-4">
            <span className="text-[9px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-1 sm:mb-2">
              Minimum
            </span>
            <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {minValue.toFixed(2)}
              <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 ml-0.5 sm:ml-1">{unit}</span>
            </div>
            <Badge variant="secondary" className="mt-1 sm:mt-2 text-[8px] sm:text-xs">
              Lowest
            </Badge>
          </CardContent>
        </Card>

        {/* Average Value */}
        <Card className="border border-gray-200 dark:border-border shadow-md hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
          <CardContent className="p-2.5 sm:p-4">
            <span className="text-[9px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase block mb-1 sm:mb-2">
              Average
            </span>
            <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {avgValue.toFixed(2)}
              <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 ml-0.5 sm:ml-1">{unit}</span>
            </div>
            <Badge variant="secondary" className="mt-1 sm:mt-2 text-[8px] sm:text-xs">
              Mean
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart - Responsive Height */}
      <Card className="border-2 border-gray-200 dark:border-border shadow-lg animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'backwards' }}>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm sm:text-lg font-bold">{title} Graph</span>
            <Badge className="text-[9px] sm:text-xs" style={{ backgroundColor: color + '20', color }}>
              {filteredData.length} Points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="relative" 
            style={{ width: '100%', height: '300px', minHeight: '280px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            />
            
            {/* Tooltip */}
            {tooltip.show && (
              <>
                {/* Vertical line indicator */}
                <div
                  className="absolute top-0 bottom-0 w-px pointer-events-none"
                  style={{
                    left: `${tooltip.x}px`,
                    background: `linear-gradient(to bottom, transparent, ${color}80, transparent)`,
                  }}
                />
                
                {/* Tooltip box */}
                <div
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 z-10"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`,
                  }}
                >
                  <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700">
                    <div className="text-sm font-bold mb-0.5" style={{ color }}>
                      {tooltip.value.toFixed(2)} {unit}
                    </div>
                    <div className="text-xs text-gray-300">
                      {tooltip.time}
                    </div>
                    {/* Arrow */}
                    <div 
                      className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: '5px solid rgb(31, 41, 55)',
                      }}
                    />
                  </div>
                </div>
                
                {/* Dot indicator at data point */}
                <div
                  className="absolute w-3 h-3 rounded-full border-2 border-white pointer-events-none transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`,
                    backgroundColor: color,
                  }}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info - Responsive Stack */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}>
        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500" />
            <span>Average</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
            <span>Maximum</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500" />
            <span>Minimum</span>
          </div>
        </div>
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-3 w-full sm:w-auto">
          <span className="text-gray-600 dark:text-gray-400">
            {timeFilter === '1hour' && 'Per minute'}
            {timeFilter === '24hour' && 'Per hour'}
            {timeFilter === '7days' && 'Per day'}
          </span>
          <div className="hidden xs:block h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <span className="text-[9px] sm:text-xs">
            {actualPoints}/{expectedPoints} points
            {actualPoints < expectedPoints && (
              <span className="ml-1 sm:ml-2 text-amber-600 dark:text-amber-400">
                ({Math.round((actualPoints / expectedPoints) * 100)}%)
              </span>
            )}
          </span>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
