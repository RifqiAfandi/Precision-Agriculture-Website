import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function LineChartCard({ data, title, unit, color = '#10b981', icon: Icon, onClick }) {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, value: 0, time: '' });
  const animationFrameRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const hasAnimatedRef = useRef(false);

  const currentValue = (data && data.length > 0) ? data[data.length - 1].value : 0;
  const previousValue = (data && data.length > 1) ? data[data.length - 2].value : currentValue;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? (change / previousValue * 100) : 0;

  useEffect(() => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const padding = { top: 10, right: 10, bottom: 25, left: 35 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    const isDarkMode = document.documentElement.classList.contains('dark');
    const gridColor = isDarkMode ? '#374151' : '#f5f5f5';
    const textColor = isDarkMode ? '#9ca3af' : '#9ca3af';

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (chartHeight / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      const value = maxValue - (valueRange / 3) * i;
      ctx.fillStyle = textColor;
      ctx.font = '600 9px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(0), padding.left - 5, y + 3);
    }

    ctx.strokeStyle = isDarkMode ? '#4b5563' : '#d1d5db';
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();

    const labelInterval = Math.max(1, Math.floor(data.length / 4)); // Show ~5 labels
    ctx.fillStyle = textColor;
    ctx.font = '600 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < data.length; i += labelInterval) {
      const x = padding.left + (chartWidth / (data.length - 1)) * i;
      ctx.fillText(data[i].time, x, padding.top + chartHeight + 15);
    }
    if (data.length > 0) {
      const lastX = padding.left + chartWidth;
      ctx.fillText(data[data.length - 1].time, lastX, padding.top + chartHeight + 15);
    }

    const visibleData = hasAnimatedRef.current ? data : data.slice(0, Math.max(1, Math.floor(data.length * animationProgress)));

    if (visibleData.length > 0) {
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '00');

      ctx.beginPath();
      visibleData.forEach((point, index) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      const lastVisibleIndex = visibleData.length - 1;
      const lastX = padding.left + (chartWidth / (data.length - 1)) * lastVisibleIndex;
      ctx.lineTo(lastX, padding.top + chartHeight);
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      visibleData.forEach((point, index) => {
        const x = padding.left + (chartWidth / (data.length - 1)) * index;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      if (visibleData.length > 0) {
        const lastPoint = visibleData[visibleData.length - 1];
        const lastIndex = visibleData.length - 1;
        const x = padding.left + (chartWidth / (data.length - 1)) * lastIndex;
        const y = padding.top + chartHeight - ((lastPoint.value - minValue) / valueRange) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color + '30';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

  }, [data, color, animationProgress, hasAnimatedRef.current]);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    
    let startTime = null;
    const duration = 1000; // 1 second animation (faster for cards)

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      
      setAnimationProgress(easeOutProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        hasAnimatedRef.current = true;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const padding = { top: 10, right: 10, bottom: 25, left: 35 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    if (mouseX < padding.left || mouseX > padding.left + chartWidth || 
        mouseY < padding.top || mouseY > padding.top + chartHeight) {
      setTooltip({ show: false, x: 0, y: 0, value: 0, time: '' });
      return;
    }

    const relativeX = mouseX - padding.left;
    const dataIndex = Math.round((relativeX / chartWidth) * (data.length - 1));
    
    if (dataIndex >= 0 && dataIndex < data.length) {
      const point = data[dataIndex];
      const values = data.map(d => d.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const valueRange = maxValue - minValue || 1;

      const normalizedValue = (point.value - minValue) / valueRange;
      const pointY = padding.top + chartHeight - (normalizedValue * chartHeight);

      setTooltip({
        show: true,
        x: mouseX,
        y: pointY,
        value: point.value,
        time: point.time
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, value: 0, time: '' });
  };

  if (!data || data.length === 0) {
    return (
      <div className="relative bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border shadow-sm p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick || undefined}
      className={`relative bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border shadow-sm transition-all duration-300 overflow-hidden group ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600' : 'cursor-default'
      }`}
    >
      {/* Gradient background accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 transition-opacity duration-300 ${
        onClick ? 'opacity-0 group-hover:opacity-10' : 'opacity-0'
      }`}>
        <div className="w-full h-full rounded-full blur-3xl" style={{ backgroundColor: color }} />
      </div>
      
      {/* Click indicator - only show if onClick is provided */}
      {onClick && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-1 rounded-md">
            Click for details
          </div>
        </div>
      )}

      <Card className="relative border-0 shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {Icon && (
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300" 
                  style={{ backgroundColor: color + '20' }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">GHCompax Data</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold tracking-tight" style={{ color }}>
                {(currentValue || 0).toFixed(1)}
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
              </div>
              <div className={`text-xs font-semibold flex items-center justify-end ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <span>{change >= 0 ? '↑' : '↓'}</span>
                <span className="ml-0.5">{Math.abs(changePercent || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-3 pb-2 sm:pb-3">
          <div 
            className="relative" 
            style={{ width: '100%', height: '200px' }}
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
                    background: `linear-gradient(to bottom, transparent, ${color}60, transparent)`,
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
                  <div className="bg-gray-900 dark:bg-gray-800 text-white px-2.5 py-1.5 rounded-lg shadow-xl border border-gray-700">
                    <div className="text-xs font-bold mb-0.5" style={{ color }}>
                      {(tooltip.value || 0).toFixed(2)} {unit}
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
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '4px solid rgb(31, 41, 55)',
                      }}
                    />
                  </div>
                </div>
                
                {/* Dot indicator at data point */}
                <div
                  className="absolute w-2.5 h-2.5 rounded-full border-2 border-white pointer-events-none transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
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
    </div>
  );
}
