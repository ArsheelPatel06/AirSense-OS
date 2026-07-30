export const forecastSummaryData = {
  predictedAqi: 72,
  aqiDelta: '+18 from now',
  status: 'Moderate',
  confidence: 94,
  forecastWindow: 'Next 24 Hours',
  highestRiskZone: 'Industrial West',
  peakTime: '16:00',
  timeToPeak: '2h 18m remaining'
};

export const aqiForecastData = [
  // Past data up to Now
  { time: '08:00', actual: 45, predicted: null, lower: null, upper: null },
  { time: '09:00', actual: 48, predicted: null, lower: null, upper: null },
  { time: '10:00', actual: 52, predicted: null, lower: null, upper: null },
  { time: '11:00', actual: 55, predicted: null, lower: null, upper: null },
  { time: '12:00', actual: 56, predicted: null, lower: null, upper: null },
  // Now
  { time: '13:00', actual: 57, predicted: 57, lower: 57, upper: 57 },
  // Future
  { time: '14:00', actual: null, predicted: 61, lower: 58, upper: 64 },
  { time: '15:00', actual: null, predicted: 68, lower: 64, upper: 72 },
  { time: '16:00', actual: null, predicted: 72, lower: 67, upper: 78 },
  { time: '17:00', actual: null, predicted: 70, lower: 65, upper: 76 },
  { time: '18:00', actual: null, predicted: 65, lower: 60, upper: 71 },
  { time: '19:00', actual: null, predicted: 58, lower: 53, upper: 64 },
  { time: '20:00', actual: null, predicted: 52, lower: 47, upper: 58 },
  { time: '21:00', actual: null, predicted: 48, lower: 43, upper: 54 },
];

export const pollutantForecasts = [
  { id: 'pm25', name: 'PM2.5', current: 54, forecast: 72, trend: 'up', peak: '16:00' },
  { id: 'pm10', name: 'PM10', current: 62, forecast: 59, trend: 'down', peak: 'N/A' },
  { id: 'no2', name: 'NO₂', current: 28, forecast: 25, trend: 'down', peak: 'N/A' },
  { id: 'so2', name: 'SO₂', current: 12, forecast: 12, trend: 'flat', peak: 'N/A' },
  { id: 'voc', name: 'VOC', current: 45, forecast: 53, trend: 'up', peak: '15:30' },
];

export const weatherForecast = {
  temp: { name: 'Temperature', current: '31°C', expected: '33°C', risk: 'Heat Inversion' },
  wind: { name: 'Wind', current: '12 km/h', expected: '5 km/h', risk: 'Poor Dispersion' },
  humidity: { name: 'Humidity', current: '62%', expected: '75%', risk: 'Traps Particulates' },
  rain: { name: 'Rain', current: '0 mm', expected: '12 mm', risk: 'Washout Expected' },
};

export const predictionTimeline = [
  { time: '12:00', event: 'Heavy Traffic Builds', icon: 'traffic' },
  { time: '14:00', event: 'AQI Starts Rising', icon: 'aqi_up' },
  { time: '16:00', event: 'Predicted Peak (AQI 72)', icon: 'peak' },
  { time: '18:00', event: 'Rain Expected', icon: 'rain' },
  { time: '21:00', event: 'Recovery / Dispersion', icon: 'recovery' },
];

export const riskZones = [
  { name: 'North District', aqi: 45, delta: '-5', trend: 'down', color: '#a3e635' },
  { name: 'East Zone', aqi: 68, delta: '+12', trend: 'up', color: '#fbbf24' },
  { name: 'Industrial West', aqi: 82, delta: '+18', trend: 'up', color: '#f87171' },
  { name: 'Central CBD', aqi: 65, delta: '+8', trend: 'up', color: '#fbbf24' },
  { name: 'Airport Area', aqi: 42, delta: '-2', trend: 'down', color: '#a3e635' },
];

export const scenarioComparisons = [
  { name: 'Normal (Predicted)', aqi: 72, delta: null, color: '#fbbf24', selected: true },
  { name: 'Rain Scenario', aqi: 58, delta: '-14', color: '#a3e635', selected: false },
  { name: 'Industrial Shutdown', aqi: 49, delta: '-23', color: '#4ade80', selected: false },
  { name: 'Heavy Traffic Event', aqi: 88, delta: '+16', color: '#f87171', selected: false },
];

export const aiReasoning = {
  primaryCause: 'Industrial activity',
  secondaryCause: 'Traffic',
  expectedChange: 'Wind drops after 15:00',
  modelImpact: 'AQI peaks at 16:00',
  confidenceValue: 94,
  lastUpdated: '13:42',
  nextRefresh: '14:00',
  factors: [
    { name: 'Traffic', value: 38, color: '#3b82f6' },
    { name: 'Industry', value: 26, color: '#f59e0b' },
    { name: 'Weather', value: 19, color: '#10b981' },
    { name: 'Construction', value: 11, color: '#8b5cf6' },
    { name: 'Dust', value: 6, color: '#64748b' }
  ],
  confidence: {
    overall: 94,
    weatherModel: 98,
    sensorCoverage: 97,
    historicalAccuracy: 92,
    missingSensors: 2
  }
};
