import type { Layer, Incident, TimelineEvent, ResponseTeam, SensorNode } from './types';

export const MOCK_LAYERS: Layer[] = [
  // Environmental
  { id: 'aqi', label: 'AQI Heatmap', active: true, color: '#EF4444', category: 'Environmental' },
  { id: 'pm25', label: 'PM2.5', active: false, color: '#F59E0B', category: 'Environmental' },
  { id: 'pm10', label: 'PM10', active: false, color: '#D97706', category: 'Environmental' },
  { id: 'no2', label: 'NO₂', active: false, color: '#6366F1', category: 'Environmental' },
  { id: 'so2', label: 'SO₂', active: false, color: '#A855F7', category: 'Environmental' },
  { id: 'co', label: 'CO', active: false, color: '#64748B', category: 'Environmental' },
  { id: 'o3', label: 'O₃', active: false, color: '#0EA5E9', category: 'Environmental' },

  // Weather
  { id: 'wind', label: 'Wind Simulation', active: true, color: '#3B82F6', category: 'Weather' },
  { id: 'rain', label: 'Rain / Radar', active: false, color: '#0EA5E9', category: 'Weather' },
  { id: 'temperature', label: 'Temperature', active: false, color: '#F43F5E', category: 'Weather' },
  { id: 'humidity', label: 'Humidity', active: false, color: '#06B6D4', category: 'Weather' },

  // Operations
  { id: 'incidents', label: 'Active Incidents', active: true, color: '#EF4444', category: 'Operations' },
  { id: 'teams', label: 'Response Teams', active: true, color: '#6366F1', category: 'Operations' },
  { id: 'sensors', label: 'Sensor Network', active: true, color: '#10B981', category: 'Operations' },
  { id: 'traffic', label: 'Traffic & Detours', active: false, color: '#F59E0B', category: 'Operations' },

  // Infrastructure
  { id: 'industrial', label: 'Industrial Zones', active: true, color: '#64748B', category: 'Infrastructure' },
  { id: 'schools', label: 'Schools', active: false, color: '#FDE047', category: 'Infrastructure' },
  { id: 'hospitals', label: 'Hospitals', active: false, color: '#EF4444', category: 'Infrastructure' },
  { id: 'admin', label: 'Administrative', active: false, color: '#94A3B8', category: 'Infrastructure' },
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'OPS-4821', severity: 'critical', title: 'PM2.5 Spike — Industrial Zone', location: 'Sector 7-W', assigned: 'Alpha Team', duration: '1h 12m', status: 'Investigating', x: 70, y: 35, rootCause: 'Unauthorized venting detected at Factory Block C-19.', actions: ['Dispatch HAZMAT', 'Broadcast Zone Warning'] },
  { id: 'OPS-4820', severity: 'warning', title: 'High AQI — East Market', location: 'Zone EM-04', assigned: 'Bravo Team', duration: '2h 45m', status: 'Monitoring', x: 45, y: 60, rootCause: 'Traffic congestion combined with thermal inversion.', actions: ['Reroute Traffic', 'Notify Public'] },
  { id: 'OPS-4818', severity: 'warning', title: 'Sensor Cluster Offline', location: 'North Campus', assigned: 'Ops-3', duration: '45m', status: 'En Route', x: 30, y: 20, rootCause: 'Power grid failure in sector 9.', actions: ['Send Maintenance'] },
  { id: 'OPS-4815', severity: 'info', title: 'Construction Dust Alert', location: 'CBD Block C', assigned: 'Unassigned', duration: '4h 20m', status: 'Open', x: 55, y: 75, rootCause: 'Heavy excavation without water suppression.', actions: ['Issue Citation'] },
  { id: 'OPS-4814', severity: 'info', title: 'Planned Pipeline Work', location: 'South River', assigned: 'Delta', duration: '5h 00m', status: 'Scheduled', x: 20, y: 80 },
];

export const MOCK_TEAMS: ResponseTeam[] = [
  { id: 'T-Alpha', name: 'Alpha HAZMAT', availability: 'Dispatched', task: 'OPS-4821 Investigation', eta: '6 min', location: 'Sector 7-W', x: 65, y: 40 },
  { id: 'T-Bravo', name: 'Mobile Air Unit', availability: 'Available', task: 'Patrol', eta: '--', location: 'HQ Base', x: 50, y: 50 },
  { id: 'T-Delta', name: 'Ops Maintenance', availability: 'On Scene', task: 'Sensor Reset', eta: 'Arrived', location: 'North Campus', x: 32, y: 22 },
];

export const MOCK_SENSORS: SensorNode[] = [
  { id: 'S-7W-01', status: 'Online', mqtt: 'Connected', gateway: 'GW-01', x: 68, y: 33 },
  { id: 'S-7W-02', status: 'Online', mqtt: 'Connected', gateway: 'GW-01', x: 72, y: 38 },
  { id: 'S-NC-01', status: 'Offline', mqtt: 'Disconnected', gateway: 'GW-02', x: 30, y: 20 },
  { id: 'S-NC-02', status: 'Offline', mqtt: 'Disconnected', gateway: 'GW-02', x: 31, y: 19 },
  { id: 'S-EM-01', status: 'Warning', mqtt: 'Connected', gateway: 'GW-03', x: 44, y: 61 },
];

export const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 'e1', time: '14:32', label: 'PM2.5 exceeded threshold', type: 'critical', x: 70, y: 35 },
  { id: 'e2', time: '14:35', label: 'Wind shifted northeast', type: 'weather', x: 50, y: 50 },
  { id: 'e3', time: '14:37', label: 'AI predicted plume movement', type: 'info', x: 70, y: 35 },
  { id: 'e4', time: '14:39', label: 'Alert broadcast', type: 'warning', x: 60, y: 40 },
  { id: 'e5', time: '14:44', label: 'Alpha Team dispatched', type: 'action', x: 65, y: 40 },
];

export const MOCK_FACTORIES = [
  { id: 'F-01', name: 'North Industrial Plant', industry: 'Chemical Processing', permitStatus: 'Suspended', emissionTrend: 'Spiking', lastInspection: '2026-06-15', x: 70, y: 35 },
  { id: 'F-02', name: 'East Side Manufacturing', industry: 'Automotive Parts', permitStatus: 'Valid', emissionTrend: 'Stable', lastInspection: '2026-07-10', x: 80, y: 65 },
  { id: 'F-03', name: 'South River Refinery', industry: 'Petrochemicals', permitStatus: 'Valid', emissionTrend: 'Rising', lastInspection: '2026-05-22', x: 20, y: 80 }
];

export const MOCK_HOSPITALS = [
  { id: 'H-01', name: 'City General Hospital', capacity: 1200, patients: 950, airQualityStatus: 'Safe', x: 40, y: 40 },
  { id: 'H-02', name: 'Westside Pediatric Care', capacity: 300, patients: 285, airQualityStatus: 'Compromised', x: 25, y: 60 }
];
