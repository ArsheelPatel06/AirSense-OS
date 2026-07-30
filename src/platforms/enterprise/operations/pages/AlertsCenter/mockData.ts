export type AlertCategory = 'Active' | 'Acknowledged' | 'Escalated' | 'Closed';
export type AlertSource = 'AQI' | 'Weather' | 'Sensors' | 'Traffic' | 'Industrial';
export type AlertPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: AlertCategory;
  source: AlertSource;
  priority: AlertPriority;
  location: string;
  metric?: {
    name: string;
    value: string;
    threshold: string;
  };
  actionsTaken?: string[];
}

export const MOCK_ALERTS: SystemAlert[] = [
  {
    id: 'ALT-1042',
    title: 'PM2.5 Threshold Exceeded',
    description: 'PM2.5 levels have exceeded 150 µg/m³ for 3 consecutive 15-minute polling cycles. This requires an immediate operational review.',
    timestamp: 'Just now',
    category: 'Active',
    source: 'AQI',
    priority: 'Critical',
    location: 'Sector 4',
    metric: {
      name: 'PM2.5',
      value: '168 µg/m³',
      threshold: '150 µg/m³'
    }
  },
  {
    id: 'ALT-1041',
    title: 'Sensor Cluster Offline',
    description: 'Gateway node 482 is failing to report telemetry. Last ping was 14 minutes ago. Local battery may be exhausted.',
    timestamp: '14 min ago',
    category: 'Active',
    source: 'Sensors',
    priority: 'High',
    location: 'North Avenue',
  },
  {
    id: 'ALT-1040',
    title: 'High Wind Warning',
    description: 'Wind speeds exceeding 35 km/h detected in the industrial zone. Dispersion models indicate potential widespread particulate drift over residential areas.',
    timestamp: '42 min ago',
    category: 'Acknowledged',
    source: 'Weather',
    priority: 'Medium',
    location: 'Industrial West',
    metric: {
      name: 'Wind Speed',
      value: '38 km/h',
      threshold: '35 km/h'
    },
    actionsTaken: ['Operator JD acknowledged', 'Added to watch list']
  },
  {
    id: 'ALT-1039',
    title: 'Abnormal VOC Emission',
    description: 'VOC sensors detected a sharp spike in volatile compounds. Correlates with shift-change at Plant B.',
    timestamp: '2 hours ago',
    category: 'Escalated',
    source: 'Industrial',
    priority: 'Critical',
    location: 'Plant B',
    metric: {
      name: 'VOC',
      value: '420 ppb',
      threshold: '250 ppb'
    },
    actionsTaken: ['Escalated to Incident OPS-4822']
  },
  {
    id: 'ALT-1038',
    title: 'Severe Traffic Congestion',
    description: 'Traffic speeds have dropped below 15 km/h on main arterial route. Emergency response times may be impacted by 200%.',
    timestamp: '3 hours ago',
    category: 'Closed',
    source: 'Traffic',
    priority: 'Medium',
    location: 'Highway 4',
    actionsTaken: ['Congestion cleared', 'Auto-resolved']
  }
];
