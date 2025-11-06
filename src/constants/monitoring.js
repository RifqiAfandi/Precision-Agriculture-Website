// Monitoring Configuration Constants

export const MONITORING_CONFIG = {
  UPDATE_INTERVAL_MS: 60 * 1000,
  CHART_UPDATE_INTERVAL_MS: 60 * 1000,
  
  DATA_RETENTION_HOURS: 24,
  DATA_POINTS_PER_HOUR: 6,
  REALTIME_DATA_POINTS: 60,
  
  CHART_ANIMATION_DURATION: 750,
  CHART_TRANSITION_DURATION: 300,
};

export const SENSOR_TYPES = {
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    unit: '°C',
    decimalPlaces: 1,
    range: { min: 0, max: 50 },
    optimal: { min: 20, max: 30 },
    warning: { min: 15, max: 35 },
    critical: { min: 10, max: 40 },
    chartColor: '#10b981',
    iconName: 'Thermometer',
  },
  humidity: {
    id: 'humidity',
    label: 'Humidity',
    unit: '%',
    decimalPlaces: 1,
    range: { min: 0, max: 100 },
    optimal: { min: 60, max: 80 },
    warning: { min: 50, max: 90 },
    critical: { min: 40, max: 95 },
    chartColor: '#3b82f6',
    iconName: 'Droplets',
  },
  tvoc: {
    id: 'tvoc',
    label: 'TVOC',
    unit: 'mg/m³',
    decimalPlaces: 2,
    range: { min: 0, max: 2 },
    optimal: { min: 0, max: 0.5 },
    warning: { min: 0.5, max: 1 },
    critical: { min: 1, max: 2 },
    chartColor: '#f59e0b',
    iconName: 'Wind',
  },
  eco2: {
    id: 'eco2',
    label: 'eCO₂',
    unit: 'ppm',
    decimalPlaces: 0,
    range: { min: 300, max: 1000 },
    optimal: { min: 300, max: 500 },
    warning: { min: 500, max: 800 },
    critical: { min: 800, max: 1000 },
    chartColor: '#8b5cf6',
    iconName: 'Activity',
  },
  tds: {
    id: 'tds',
    label: 'TDS',
    unit: 'ppm',
    decimalPlaces: 0,
    range: { min: 500, max: 1500 },
    optimal: { min: 700, max: 1000 },
    warning: { min: 600, max: 1200 },
    critical: { min: 500, max: 1500 },
    chartColor: '#06b6d4',
    iconName: 'Beaker',
  },
  phAir: {
    id: 'phAir',
    label: 'pH Water',
    unit: '',
    decimalPlaces: 1,
    range: { min: 5, max: 9 },
    optimal: { min: 6.5, max: 7.5 },
    warning: { min: 6, max: 8 },
    critical: { min: 5, max: 9 },
    chartColor: '#ec4899',
    iconName: 'CheckCircle2',
  },
  windSpeed: {
    id: 'windSpeed',
    label: 'Wind Speed',
    unit: 'km/h',
    decimalPlaces: 1,
    range: { min: 0, max: 50 },
    optimal: { min: 0, max: 15 },
    warning: { min: 15, max: 30 },
    critical: { min: 30, max: 50 },
    chartColor: '#14b8a6',
    iconName: 'Wind',
  },
  rainfall: {
    id: 'rainfall',
    label: 'Rainfall',
    unit: 'mm',
    decimalPlaces: 2,
    range: { min: 0, max: 100 },
    optimal: { min: 0, max: 10 },
    warning: { min: 10, max: 50 },
    critical: { min: 50, max: 100 },
    chartColor: '#0ea5e9',
    iconName: 'CloudRain',
  },
  co2: {
    id: 'co2',
    label: 'CO₂',
    unit: 'ppm',
    decimalPlaces: 0,
    range: { min: 300, max: 1000 },
    optimal: { min: 300, max: 500 },
    warning: { min: 500, max: 800 },
    critical: { min: 800, max: 1000 },
    chartColor: '#8b5cf6',
    iconName: 'Activity',
  },
};

export const STATUS_LEVELS = {
  OPTIMAL: 'optimal',
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

export const STATUS_COLORS = {
  [STATUS_LEVELS.OPTIMAL]: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  [STATUS_LEVELS.NORMAL]: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  [STATUS_LEVELS.WARNING]: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  [STATUS_LEVELS.CRITICAL]: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
  },
};

export const CHART_MODES = {
  DETAIL_2: 'detail2',
  DETAIL_4: 'detail4',
  HISTORY: 'history',
};

export const VIEW_MODES = {
  OVERVIEW: 'overview',
  DETAIL: 'detail',
};

export const TIME_FILTERS = {
  '1H': { label: '1 Hour', hours: 1 },
  '6H': { label: '6 Hours', hours: 6 },
  '12H': { label: '12 Hours', hours: 12 },
  '24H': { label: '24 Hours', hours: 24 },
  '7D': { label: '7 Days', hours: 168 },
  '30D': { label: '30 Days', hours: 720 },
};

export const ANIMATION_DELAYS = {
  1: 'animate-fade-in-delay-1',
  2: 'animate-fade-in-delay-2',
  3: 'animate-fade-in-delay-3',
  4: 'animate-fade-in-delay-4',
};

export const STORAGE_KEYS = {
  USER: 'agri-user',
  AUTH: 'agri-authenticated',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  DARK_MODE: 'agri-dark-mode',
  CHART_MODE: 'agri-chart-mode',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
    UPDATE_PROFILE: '/auth/profile/update/',
    CHANGE_PASSWORD: '/auth/change-password/',
    REFRESH_TOKEN: '/token/refresh/',
  },
  MONITORING: {
    GHCOMPAX: '/monitoring/ghcompax/',
    SKYVERA: '/monitoring/skyvera/',
  },
};

export const getSensorStatus = (sensorType, value) => {
  const sensor = SENSOR_TYPES[sensorType];
  if (!sensor) return STATUS_LEVELS.NORMAL;

  if (value >= sensor.optimal.min && value <= sensor.optimal.max) {
    return STATUS_LEVELS.OPTIMAL;
  }
  if (value >= sensor.warning.min && value <= sensor.warning.max) {
    return STATUS_LEVELS.WARNING;
  }
  if (value >= sensor.critical.min && value <= sensor.critical.max) {
    return STATUS_LEVELS.CRITICAL;
  }
  return STATUS_LEVELS.NORMAL;
};

export const formatSensorValue = (sensorType, value) => {
  const sensor = SENSOR_TYPES[sensorType];
  if (!sensor) return value;

  return value.toFixed(sensor.decimalPlaces);
};
