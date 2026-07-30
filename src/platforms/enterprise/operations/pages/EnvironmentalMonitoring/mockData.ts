export const MOCK_POLLUTANTS = [
  { id: 'pm25', name: 'PM2.5', value: 42, unit: 'µg/m³', limit: 15, trend: '+12%', status: 'Poor', data: [30,35,40,38,45,42,42] },
  { id: 'pm10', name: 'PM10', value: 58, unit: 'µg/m³', limit: 45, trend: '+5%', status: 'Moderate', data: [45,50,55,50,60,55,58] },
  { id: 'no2', name: 'NO₂', value: 18, unit: 'ppb', limit: 25, trend: '-2%', status: 'Good', data: [22,20,19,18,20,19,18] },
  { id: 'so2', name: 'SO₂', value: 8, unit: 'ppb', limit: 20, trend: '0%', status: 'Good', data: [8,9,8,7,8,8,8] },
  { id: 'co', name: 'CO', value: 0.4, unit: 'ppm', limit: 4.0, trend: '-10%', status: 'Good', data: [0.6,0.5,0.4,0.4,0.3,0.4,0.4] },
  { id: 'o3', name: 'O₃', value: 35, unit: 'ppb', limit: 50, trend: '+8%', status: 'Good', data: [25,28,30,35,32,34,35] },
  { id: 'voc', name: 'VOC', value: 120, unit: 'ppb', limit: 200, trend: '+4%', status: 'Moderate', data: [110,115,112,120,118,119,120] },
  { id: 'nh3', name: 'NH₃', value: 15, unit: 'ppb', limit: 30, trend: '-1%', status: 'Good', data: [16,15,14,15,15,15,15] },
];

export const MOCK_REGIONS = [
  { name: 'North', aqi: 45, pm25: 12, no2: 8, status: 'Good' },
  { name: 'South', aqi: 112, pm25: 42, no2: 35, status: 'Poor' },
  { name: 'East', aqi: 68, pm25: 22, no2: 15, status: 'Moderate' },
  { name: 'West', aqi: 52, pm25: 15, no2: 10, status: 'Moderate' },
  { name: 'Industrial', aqi: 145, pm25: 58, no2: 45, status: 'Unhealthy' },
  { name: 'CBD', aqi: 85, pm25: 28, no2: 25, status: 'Moderate' },
  { name: 'Airport', aqi: 92, pm25: 32, no2: 28, status: 'Moderate' },
  { name: 'Residential', aqi: 42, pm25: 11, no2: 7, status: 'Good' },
];

export const MOCK_TREND_DATA = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  'PM2.5': Math.floor(20 + Math.random() * 30 + (i > 7 && i < 10 ? 20 : 0) + (i > 16 && i < 19 ? 15 : 0)),
  'NO2': Math.floor(10 + Math.random() * 20 + (i > 7 && i < 10 ? 15 : 0) + (i > 16 && i < 19 ? 10 : 0)),
}));

export const MOCK_SOURCES = [
  { name: 'Traffic', value: 45, fill: '#3b82f6' },
  { name: 'Industrial', value: 25, fill: '#ef4444' },
  { name: 'Construction', value: 15, fill: '#f59e0b' },
  { name: 'Natural Dust', value: 10, fill: '#eab308' },
  { name: 'Residential', value: 5, fill: '#10b981' },
];

export const MOCK_WEATHER = {
  aqi: 78,
  windSpeed: 12,
  windDirection: 'NE',
  humidity: 65,
  temp: 24,
  rain: 0,
  pressure: 1012,
  visibility: 8.5
};

export const MOCK_VIOLATIONS = [
  { id: 1, location: 'Industrial Park Alpha', pollutant: 'PM2.5', value: 65, limit: 35, duration: '4h 12m', severity: 'High', population: '12,500', action: 'Issue Health Advisory', authority: 'EPA Region 4' },
  { id: 2, location: 'Downtown Hub', pollutant: 'NO2', value: 42, limit: 25, duration: '1h 45m', severity: 'Medium', population: '45,200', action: 'Reroute Traffic', authority: 'Dept of Transport' },
  { id: 3, location: 'Highway M4', pollutant: 'PM10', value: 85, limit: 50, duration: '2h 30m', severity: 'High', population: '8,300', action: 'Dispatch Water Trucks', authority: 'City Maintenance' },
  { id: 4, location: 'Port Terminal', pollutant: 'SO2', value: 28, limit: 20, duration: '0h 45m', severity: 'Medium', population: '2,100', action: 'Monitor Emissions', authority: 'Port Authority' },
];
